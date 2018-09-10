import { Command, CommandoClient, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { AppDispatcher } from "../../utils/application-dispatcher";

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
        const myApp = new AppDispatcher({
            isActivated: true,
            server: '',
            title: 'Test Application',
            description: 'Welcome to the test application!',
            questionTimeout: .1,
            applicationsRecieved: 0,
            application: {
                START: {
                    type: 'FREETEXT',
                    prompt: 'Enter your name',
                    next: 'REACTIONTEST'
                },
                REACTIONTEST: {
                    type: 'REACTION',
                    prompt: 'enter some reactions boi',
                    reactions: [
                        {
                            reaction: '🏠',
                            prompt: 'house emoji'
                        },
                        {
                            reaction: '👀',
                            prompt: 'eye emoji'
                        }
                    ]
                }
            }
        }, message.member, this.client);

        message.channel.send(`Sending application... ${message.author.username}, please check your DM\'s.`);
        myApp.useGuild(message.guild);
        myApp.dispatchQuestions().then((response) => {
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