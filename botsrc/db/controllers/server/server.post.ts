import { Guild } from "discord.js";
import { IServerModel } from "../../formats/server.format";
import { model } from "mongoose";
import { Controller } from "../base";


export class ServerPostController extends Controller {

    private static models = {
        Server: model<IServerModel>('server')
    };

    static async server(guild: Guild | string) {
        const mongoServer = new this.models.Server();

        // set properties required
        mongoServer.applications = [];
        mongoServer._id = this.extractDiscordId(guild);
        return await mongoServer.save();
    }
};