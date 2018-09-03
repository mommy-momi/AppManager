"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const discord_js_commando_1 = require("discord.js-commando");
const commands_registrar_1 = require("./commands.registrar");
const init_event_1 = require("./events/init.event");
const configuration = JSON.parse(fs_1.readFileSync(path_1.join(__dirname, './config.bot.json')).toString());
const bot = new discord_js_commando_1.CommandoClient({
    unknownCommandResponse: false,
    commandPrefix: '!'
});
commands_registrar_1.setBotCommandGroupsFor(bot);
init_event_1.bindAllEventsTo(bot);
bot.login(configuration.loginToken);

//# sourceMappingURL=init.bot.js.map
