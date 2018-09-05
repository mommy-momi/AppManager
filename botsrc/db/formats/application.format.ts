import { Document } from "mongoose";
import { IServerModel } from "./server.format";
import { IQuestion } from "./question.format";

export interface ApplicationContent {
    START: IQuestion;
    [question: string]: IQuestion
}

export interface IApplication {
    isActivated: boolean;
    application: ApplicationContent
    server: IServerModel | string;
    title: string;
    description: string;

    // will be forced to be no longer than 20 minutes
    questionTimeout: number;

    // regular statistics
    applicationsRecieved: number;
}

export interface IApplicationModel extends IApplication, Document { };