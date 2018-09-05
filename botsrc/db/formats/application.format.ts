import { IQuestionModel } from "./question.format";
import { Document } from "mongoose";

export interface IApplication {
    isActivated: boolean;
    questions: IQuestionModel[] | string[];
}

export interface IApplicationModel extends IApplication, Document { };