import { Guild } from "discord.js";
import { IServerModel } from "../../formats/server.format";
import { model } from "mongoose";
import { Controller } from "../base";

export class ServerGetController extends Controller {

    private static models = {
        Server: model<IServerModel>('server')
    }

    static async server(guild: Guild | string) {
        const guildId = this.extractDiscordId(guild);
        const mongoGuild = await this.models.Server.findById(guildId);
        return mongoGuild;
    }
};