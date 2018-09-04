import { RichEmbed } from "discord.js";
import { CommandoClient } from "discord.js-commando";

export class BotEmbedResponse extends RichEmbed {
    constructor(client: CommandoClient) {
        super();
        const avatarUrl = client.user.avatarURL;
        this.setThumbnail(avatarUrl);
        this.setAuthor(client.user.username, avatarUrl, 'https://www.google.com');
        this.setFooter(client.user.username, avatarUrl);
        this.setTimestamp(new Date(Date.now()));
    }
}