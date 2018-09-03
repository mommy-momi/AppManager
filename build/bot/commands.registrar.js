"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.setBotCommandGroupsFor = (client) => {
    client.registry
        .registerDefaultTypes()
        .registerGroups([
        ['applicant-management', 'Manage Your Server Applications'],
        ['util', 'Helpful Commands'],
    ])
        .registerDefaultCommands({
        prefix: false,
        ping: true,
        eval_: false,
        commandState: false,
        help: true
    })
        .registerCommandsIn(path_1.join(__dirname, './commands'));
};

//# sourceMappingURL=commands.registrar.js.map
