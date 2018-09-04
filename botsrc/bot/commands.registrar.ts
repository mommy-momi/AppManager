import { CommandoClient } from "discord.js-commando";
import { join } from "path";

/**
 * will register all the groups used in the commando framework.
 * 
 * be careful adding groups and update all commands accordingly if you update
 * the id in a group (which you shouldnt do often thats why theres a label)
 * 
 * @param client the bot client
 */
export const setBotCommandGroupsFor = (client: CommandoClient) => {
    client.registry
        .registerDefaultTypes()
        .registerTypesIn(join(__dirname, './types'))
        .registerGroups([
            ['applicant-management', 'Manage Your Server Applications'],
            ['util', 'Helpful Commands'],
        ])
        .registerDefaultCommands({
            prefix: false,
            ping: true,

            // set this to false during production to aviod
            // getting hella hacked
            // eval_: true,
            commandState: false,
            help: true
        })
        .registerCommandsIn(join(__dirname, './commands'));
};