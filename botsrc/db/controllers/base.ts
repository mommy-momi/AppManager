
/**
 * generic class containing generic methods that can modify any object from
 * either mongo or discord
 */
export class Controller {
    public static extractDiscordId(genericObject: { [key: string]: any } | string): string {
        return (typeof genericObject === 'object') ? genericObject.id : genericObject;
    }
}