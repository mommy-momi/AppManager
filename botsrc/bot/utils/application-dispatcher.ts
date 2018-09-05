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
    constructor(application: IApplication, member: GuildMember | User, client: CommandoClient) {
        this.app = new AppHandler(application);
        this.member = member;
        this.client = client;
    }

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