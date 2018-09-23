import { Guild } from "discord.js";
import { IServerModel } from "../../formats/server.format";
import { model } from "mongoose";
import { ServerController } from "./server.controller";
import { IApplicationModel } from "../../formats/application.format";
import { Controller } from "../base";



export class ServerPutController extends Controller{

    /**
     * ensures that a server exists before performing an action
     */
    static async ensureServerExists(guild: Guild | string) {
        const mongoServer = await ServerController.Get.server(guild);

        // if it exists, return the doc, if not make one
        if (mongoServer) return mongoServer;
        return await ServerController.Post.server(guild);
    }

    static async addApplication(server: Guild | string, application: IApplicationModel) {
        const mongoServer = await ServerController.Get.server(server);

        // add the id of the app to the list
        (mongoServer.applications as string[]).push(application._id);
        return await mongoServer.save();
    }
}