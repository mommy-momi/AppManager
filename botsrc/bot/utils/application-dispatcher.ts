import { AppHandler } from "./application-handler";
import { GuildMember, User, Message, MessageReaction, ClientUser, DMChannel, Guild } from "discord.js";
import { IApplication } from "../../db/formats/application.format";
import { IQuestion, IReaction } from "../../db/formats/question.format";
import { BotEmbedResponse } from "./bot-response.util";
import { CommandoClient } from "discord.js-commando";

export class AppDispatcher {
    private app: AppHandler;
    private member: GuildMember | User;
    private client: CommandoClient;
    private guild?: Guild;
    /**
     * this is the dispatcher that will be responsible for giving the user
     * the questions and rightfully taking the answers and figuring out what to do next in the application
     * 
     * @param application application form that can be pulled from the DB
     * @param member the member that this application will be dispatched to
     * @param client the client that is dispatching this application
     */
    constructor(application: IApplication, member: GuildMember | User, client: CommandoClient) {
        this.app = new AppHandler(application);
        this.member = member;
        this.client = client;
    }

    public useGuild(guild: Guild) {
        this.guild = guild;
    }

    sendIntroductoryEmbed() {
        const intro = new BotEmbedResponse(this.client);
        if (this.guild) intro.setThumbnailToGuild(this.guild);
        intro.setDescription(this.app.application.description);
        intro.setTitle(this.app.application.title);
        this.member.send(intro);
    }

    /**
     * this is the main dispatcher and will send all the answers that need be to the user
     */
    public async dispatchQuestions() {

        // send this message to notify them on what they are actually applying for
        // this is to stop confusion bascially for the end user
        this.sendIntroductoryEmbed();

        // instantiate the variables we will be using to track the current answer
        // and question
        let question: IQuestion = null, answer: string = null;
        do {

            // get the next question. If this is first question, it is the only time
            // allowed where the answer can be null. If it comes in as null after the
            // first question (which it should not), it will throw an error
            question = this.app.getNextQuestion(answer);

            // if the question exists, this is a wrapper for logical reasons
            if (question) {

                // do this if its a reaction
                if (question.type === 'REACTION')
                    answer = await this.dispatchReactionQuestion(question);

                // do this if its a freetext
                if (question.type === 'FREETEXT')
                    answer = await this.dispatchFreetextQuestion(question);

                // add more types here later if need be
            }
        } while (question)
        return { status: 'COMPLETED' };
    }

    /**
     * dispatches to discord a freetext question to be filled out
     * 
     * @param question the question to build
     * 
     * @returns the users answer
     */
    private async dispatchFreetextQuestion(question: IQuestion) {

        // get and send the embed
        const formattedQuestion = this.buildFreetextQuestion(question);
        const message = await this.member.send(formattedQuestion) as Message;

        // get the DMCHannel the message got sent to
        const channel = message.channel as DMChannel;

        // filter to make sure the collection is only recieving the applicants answer
        const filter = (incomingMessage: Message) => incomingMessage.author.id === this.member.id;

        // wait for 1 message to come through with the timeout set from the application
        const answerInCollection = await channel.awaitMessages(filter, {
            time: this.app.application.questionTimeout * 60000,
            max: 1
        });

        // if the size returned zero the applicant failed to file their answer,
        // therefore send a `TIMED OUT` error
        if (answerInCollection.size === 0) {
            this.sendTimedOutMessage();
            throw new Error('TIMED OUT');
        }

        // if the applicant did file their answer, return the content of their answer
        return answerInCollection.first().content;
    }

    /**
     * dispatches to discord a reaction question to be filled out
     * by the end user 
     * 
     * @param question the question to build
     * 
     * @returns the users emoji answer
     */
    private async dispatchReactionQuestion(question: IQuestion) {

        // get and send the embed
        const formattedQuestion = this.buildReactionQuestion(question);
        const message = await this.member.send(formattedQuestion) as Message;

        // add all the reactions under the embed to make it easy for the user
        // to finish the question on mobile
        await this.addReactionsToMessage(message, question.reactions);


        // filter to be used on the reaction to make sure that the reaction
        // added is valid and predefined
        const reactionFilters = (reaction: MessageReaction, user: ClientUser) => {

            // make sure that we are looking if they are a user
            if (user.id === this.member.id)

                // go through all the reactions of the question
                for (let questionReaction of question.reactions)

                    // if the reaction that was recieved matches one of the reactions
                    // in the questions reaction list, then it is a valid reaction
                    if (questionReaction.reaction === reaction.emoji.name)
                        return true;

            return false;
        };

        // collect 1 reaction and wait for the amount of time set by the timeout of the application
        const reactions = await message.awaitReactions(reactionFilters, { time: this.app.application.questionTimeout * 60000, max: 1 })

        // if the size returned zero the applicant failed to file their answer,
        // therefore send a `TIMED OUT` error
        if (reactions.size === 0) {
            this.sendTimedOutMessage();
            throw new Error('TIMED OUT');
        }

        // if the applicant did file their answer, return the content of their answer
        return reactions.first().emoji.name;
    }

    /**
     * reacts to a specific message given an array of reactions to use
     * 
     * @param message the message to react to
     * @param reactions the reactions to add to a message
     */
    private addReactionsToMessage(message: Message, reactions: IReaction[]) {
        reactions.forEach((reaction) => message.react(reaction.reaction));
    }

    /**
     * a time out templated message is sent to the end user
     * notifying them that they ran out of time
     */
    private sendTimedOutMessage() {
        this.member.send(`You have timed out of your ${this.app.application.title} application. If you still wish to submit your application, please start a new one.`);
    }

    /**
     * an embed builder that will build the basics of a freetext question
     * 
     * @param question question to build embed with
     */
    private buildReactionQuestion(question: IQuestion) {
        const reactionQuestionEmbed = new BotEmbedResponse(this.client);
        if (this.guild) reactionQuestionEmbed.setThumbnailToGuild(this.guild);
        let availableReactions = '';
        question.reactions.forEach((reaction) => {
            availableReactions += `${reaction.reaction} - ${reaction.prompt}\n`;
        });
        reactionQuestionEmbed.addField('Choose an option below', availableReactions);
        reactionQuestionEmbed.addField('Time remaining', `${this.app.application.questionTimeout} minutes left for this question`);
        return reactionQuestionEmbed;
    }

    /**
     * an embed builder that will build the basics of a freetext question
     * 
     * @param question question to build embed with
     */
    private buildFreetextQuestion(question: IQuestion) {
        const freetextQuestionEmbed = new BotEmbedResponse(this.client);
        if (this.guild) freetextQuestionEmbed.setThumbnailToGuild(this.guild);
        freetextQuestionEmbed.addField('Answer the following question with your next message', question.prompt);
        freetextQuestionEmbed.addField('Time remaining', `${this.app.application.questionTimeout} minutes left for this question`);
        return freetextQuestionEmbed;
    }
}