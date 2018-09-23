import { IApplicationModel } from "../../formats/application.format";
import { model } from "mongoose";
import { Guild } from "discord.js";
import { Controller } from "../base";
import { IServerModel } from "../../formats/server.format";

export class ApplicationGetController extends Controller {
    private static models = {
        Server: model<IServerModel>('server')
    }

    static async serverApplications(guild: Guild | string) {
        const guildId = this.extractDiscordId(guild);
        return await this.models.Server
                        .findById(guildId)
                        .populate('applications')
                        .exec();
    }
}