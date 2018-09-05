import { Document } from "mongoose";

interface Reaction {
    reaction: string;
    prompt: string;
}

export interface IReactionQuestion {
    reactions: Reaction[];
}

export interface IReactionQuestionModel extends IReactionQuestion, Document { };