import { Document } from "mongoose";

export interface IFreeformQuestion {
    text: string;
}

export interface IFreeformQuestionModel extends IFreeformQuestion, Document { };