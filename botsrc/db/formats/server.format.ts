import { Document } from "mongoose";
import { IApplicationModel } from "./application.format";

export interface IServer {
    applications: IApplicationModel[] | string[]
};

export interface IServerModel extends IServer, Document { };