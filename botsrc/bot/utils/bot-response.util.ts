import { RichEmbed, Guild } from "discord.js";
import { CommandoClient } from "discord.js-commando";

export class BotEmbedResponse extends RichEmbed {
    constructor(client: CommandoClient) {
        super();
        const avatarUrl = client.user.avatarURL;
        this.setColor(0xaa37ba);
        this.setThumbnail(avatarUrl);
        this.setAuthor(client.user.username, avatarUrl, 'https://www.google.com');
        this.setFooter(client.user.username, avatarUrl);
        this.setTimestamp(new Date(Date.now()));
    }

    /**
     * sets the thumbnail to a servers guild
     * 
     * @param server guild to use
     */
    public setThumbnailToGuild(server: Guild) {
        this.setThumbnail(server.iconURL);
    }
}