"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrapBot = (client) => {
    client.user.setActivity(`applications | ${client.commandPrefix}help`, { type: 'PLAYING' });
    console.log(`${client.user.tag} is now online!`);
};
exports.readyEvents = (client) => {
    client.on('ready', () => {
        bootstrapBot(client);
    });
};

//# sourceMappingURL=read.event.js.map
