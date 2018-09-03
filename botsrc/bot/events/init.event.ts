import { CommandoClient } from "discord.js-commando";
import { readyEvents } from "./read.event";

/**
 * adds all events to this bot
 * 
 * @param client the bot
 */
export const bindAllEventsTo = (client: CommandoClient) => {
    
    // add all events to bind here
    readyEvents(client);
};