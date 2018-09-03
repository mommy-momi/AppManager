import { Command, CommandoClient, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";

class NewCommand extends Command {
    constructor(client: CommandoClient) {
        const commandName = 'new';
        super(client, {
            name: commandName,
            group: 'applicant-management',
            memberName: 'applicant-management:new',
            description: 'Create a new application form to for users to fill out.',
            examples: [
                `${client.commandPrefix}${commandName}`
            ]
        });
    }

    async run(message: CommandMessage): Promise<Message | Message[]> {
        message.channel.send('Test');
        return;
    }
}

module.exports = NewCommand;