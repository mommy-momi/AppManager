import { readFileSync } from "fs";
import { join } from "path";
import { CommandoClient } from "discord.js-commando";
import { setBotCommandGroupsFor } from "./commands.registrar";
import { bindAllEventsTo } from "./events/init.event";


// gets the current bots configuration data
// you'll first need to create a bot.config.json
// file in this current directly to start the bot
const configuration: ConfigBot = JSON.parse(
    readFileSync(
        join(__dirname, './config.bot.json')
    ).toString()
);

const bot = new CommandoClient({
    unknownCommandResponse: false,

    // this is the default command prefix,
    // can be changes by commando later
    commandPrefix: '!'
});



setBotCommandGroupsFor(bot);

bindAllEventsTo(bot);

bot.login(configuration.loginToken);