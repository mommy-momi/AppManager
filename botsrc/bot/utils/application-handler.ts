import { CommandoClient } from "discord.js-commando";
import { GuildMember, User } from "discord.js";

export class AppHandler {
    client: CommandoClient;
    applicant: GuildMember | User;
    constructor(client: CommandoClient, member: GuildMember | User) {
        this.client = client;
        this.applicant = member;
    }
}