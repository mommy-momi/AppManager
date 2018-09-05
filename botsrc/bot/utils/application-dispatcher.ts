import { AppHandler } from "./application-handler";
import { GuildMember, User, Message } from "discord.js";
import { IApplication } from "../../db/formats/application.format";
import { IQuestion } from "../../db/formats/question.format";
import { BotEmbedResponse } from "./bot-response.util";
import { CommandoClient } from "discord.js-commando";

export class AppDispatcher {
    app: AppHandler;
    member: GuildMember | User;
    client: CommandoClient;

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

    /**
     * this is the main dispatcher and will send all the answers that need be to the user
     */
    async dispatchQuestions() {
        let question: IQuestion = null, answer: string = null;
        do {
            question = this.app.getNextQuestion(answer);
            if (question) {
                if (question.type === 'REACTION') {
                    const formattedQuestion = this.buildReactionQuestion(question);
                    const message = await this.member.send(formattedQuestion) as Message;
                }
            }
        } while (question)
    }

    private buildReactionQuestion(question: IQuestion) {
        const reactionQuestionEmbed = new BotEmbedResponse(this.client);
        let availableReactions = '';
        question.reactions.forEach((reaction) => {
            availableReactions += `${reaction.reaction} - ${reaction.prompt}\n`;
        });
        reactionQuestionEmbed.addField('Choose an option below', availableReactions);
        return reactionQuestionEmbed;
    }
}