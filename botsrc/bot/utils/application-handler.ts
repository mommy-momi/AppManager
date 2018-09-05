import { CommandoClient } from "discord.js-commando";
import { GuildMember, User } from "discord.js";
import { IApplication } from "../../db/formats/application.format";

// this is the handler that will create and manage applications done by a user
export class AppHandler {
    client: CommandoClient;
    applicant: GuildMember | User;
    application: IApplication;
    constructor(client: CommandoClient, member: GuildMember | User) {
        this.client = client;
        this.applicant = member;
    }
}