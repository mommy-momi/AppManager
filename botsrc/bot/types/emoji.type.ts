import { ArgumentType, CommandoClient, CommandMessage, Argument } from "discord.js-commando";


class EmojiType extends ArgumentType {
    constructor(client: CommandoClient) {
        super(client, 'emoji');
    }

    validate(value: string, msg: CommandMessage, arg: Argument): string | boolean | Promise<string | boolean> {
        return  /<[^:]*:[^>]*>/.test(value);
    }

    parse(value: string, message: CommandMessage, arg: Argument): string | boolean | Promise<string | boolean> {
        return value;
    }
}

module.exports = EmojiType;