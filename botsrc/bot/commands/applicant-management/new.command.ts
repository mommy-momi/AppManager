import { Command, CommandoClient, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { AppDispatcher } from "../../utils/application-dispatcher";
import { AppBuilder } from "../../utils/application-builder";

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
        const myApp = new AppBuilder()
            .setTitle('Test Application')
            .setDescription('Welcome to test application!')
            .setQuestionTimeout(0.1)
            .createFreetextQuestion('', 'Enter your name', 'REACTIONTEST')
            .createReactQuestion(
                'REACTIONTEST',
                'enter some reactions',
                [
                    AppBuilder.createReaction('🏠', 'house emoji'),
                    AppBuilder.createReaction('👀', 'eye emoji')
                ]
            );

        const myDispatcher = new AppDispatcher(myApp.generateApplication(), message.member, this.client);
        message.channel.send(`Sending application... ${message.author.username}, please check your DM\'s.`);

        myDispatcher.useGuild(message.guild).dispatchQuestions().then((response) => {
            if (response && response.status !== 'TIMEOUT') {
                message.member.send('All done!');
            }
        }).catch((error) => {
            if (error.message !== 'TIMED OUT')
                message.channel.send('Please allow me to send you DM\'s to continue the application');
        });
        return;
    }
}

module.exports = NewCommand;