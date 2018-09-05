import { IFreeformQuestionModel } from "./freeform-question.format";
import { IReactionQuestionModel } from "./reaction-question.format";
import { Document } from "mongoose";

export interface IQuestion {
    type: 'FREEFORM' | 'REACTION';
    question: IFreeformQuestionModel | IReactionQuestionModel | string;
};

export interface IQuestionModel extends IQuestion, Document { };