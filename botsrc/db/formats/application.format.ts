import { Document } from "mongoose";
import { IServerModel } from "./server.format";
import { IQuestion } from "./question.format";

interface ApplicationContent {
    START: IQuestion;
    [question: string]: IQuestion
}

export interface IApplication {
    isActivated: boolean;
    application: ApplicationContent
    server: IServerModel | string;
    title: string;
    description: string;
}

export interface IApplicationModel extends IApplication, Document { };