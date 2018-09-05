import { Document } from "mongoose";

export interface IServer {
    applications: []
};

export interface IServerModel extends IServer, Document { };