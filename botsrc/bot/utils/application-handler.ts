import { GuildMember, User } from "discord.js";
import { IApplication } from "../../db/formats/application.format";
import { IQuestion, IReaction } from "../../db/formats/question.format";

// this is the handler that will create and manage applications done by a user
export class AppHandler {
    private application: IApplication;
    private member: GuildMember | User;
    private currentQuestion: IQuestion;
    private answers: IAnswer[];
    constructor(application: IApplication, member: GuildMember | User) {
        this.application = application;
        this.member = member;
        this.answers = [];
    }

    /**
     * gets the next question in line for the user to fill out
     * 
     * @param answer the answer given by the user, this can either be a reaction or freetext. However
     * their input does not influence wether it is freetext or a reaction. This is to make sure that
     * they can have an emoji also set inside the freetext.
     * 
     * @returns the next question. if this returns null, that was the last question
     */
    getNextQuestion(answer: string = null) {
        if (this.currentQuestion === null) {
            this.currentQuestion = this.application.application.START;
            return this.currentQuestion;
        }

        if (!answer) throw new Error('APPHANDLER: `answer` is not declared after first question');

        if (this.currentQuestion.type === 'FREETEXT') {
            this.commitFreeTextAnswer(answer, this.currentQuestion);
            if (this.nextQuestionExists()) {
                this.currentQuestion = this.application.application[this.currentQuestion.next];
                return this.currentQuestion;
            }
        }

        if (this.currentQuestion.type === 'REACTION') {
            const reactionCommitedTo = this.commitReactionAnswer(answer, this.currentQuestion);
            if (this.nextFromReactionExists(reactionCommitedTo)) {
                this.currentQuestion = this.application.application[reactionCommitedTo.next];
                return this.currentQuestion;
            }
        }

        // null is returned if there is no next question
        return null;
    }

    getAggregatedAnswers() {
        return this.answers;
    }

    private nextQuestionExists() {
        return !!this.currentQuestion.next;
    }

    private nextFromReactionExists(reaction: IReaction) {
        return !!reaction.next;
    }

    private getReactionFromAnswer(answer: string, question: IQuestion) {
        return question.reactions.find((reaction) => reaction.reaction === answer);
    }

    private commitReactionAnswer(answer: string, question: IQuestion) {
        const reaction = this.getReactionFromAnswer(answer, question);
        const reactionAnswer = `${answer} - ${reaction.prompt}`;
        this.answers.push({
            prompt: question.prompt,
            answer: reactionAnswer
        });

        return reaction;
    }

    private commitFreeTextAnswer(answer: string, question: IQuestion) {
        this.answers.push({
            prompt: question.prompt,
            answer: answer
        });
    };

}

interface IAnswer {
    prompt: string;
    answer: string;
};