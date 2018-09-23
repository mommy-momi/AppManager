import { IApplication } from "../../db/formats/application.format";
import { IQuestion, IReaction } from "../../db/formats/question.format";

// this is the handler that will create and manage applications done by a user
// REALLY FOR INTERNAL UTIL MANAGEMENT ONLY
export class AppHandler {
    application: IApplication;
    private currentQuestion: IQuestion;
    private answers: IAnswer[];

    /**
     * This is the handler that will create and manage applications done by a user
     * 
     * @param application the application form that can be pulled from the DB
     */
    constructor(application: IApplication) {
        this.application = application;
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

        // if the current answer is null, that means we have not
        // started the application yet
        if (this.currentQuestion === undefined) {
            this.currentQuestion = this.application.application.START;
            return this.currentQuestion;
        }

        // if the current question is not null and the answer is null
        // this means that the user never gave us any info which means we cannot finish
        // this form until that happens
        if (!answer) throw new Error('APPHANDLER: `answer` is not declared after first question');

        // when the type is freetext, do this to commit the answers to the question
        if (this.currentQuestion.type === 'FREETEXT') {
            this.commitFreeTextAnswer(answer, this.currentQuestion);
            if (this.nextQuestionExists()) {
                this.currentQuestion = this.application.application[this.currentQuestion.next];
                return this.currentQuestion;
            }
        }

        // when the type is reaction, do this to commit the answers to the question
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

    /**
     * after everything is complete, use this method
     * to return all the answers given by the user
     */
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