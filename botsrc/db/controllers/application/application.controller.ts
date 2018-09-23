import { ApplicationPostController } from "./application.post";
import { ApplicationGetController } from "./application.get";

export const ApplicationController = {
    Post: ApplicationPostController,
    Get: ApplicationGetController
};