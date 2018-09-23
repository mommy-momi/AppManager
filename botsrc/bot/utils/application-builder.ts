import { IApplication, ApplicationContent } from "../../db/formats/application.format";
import { IReaction, IQuestion } from "../../db/formats/question.format";

/**
 * class used to manipulate or create applications
 * 
 * example of creating an application from scratch:
 * 
 ```
 const myApp = 
    new AppBuilder()
        .setTitle('Test Application')
        .setDescription('Welcome to test application!')
        .setQuestionTimeout(0.1)
        .createFreetextQuestion('', 'Enter name', 'qs2')
        .createReactQuestion(
            'qs2',
            'enter some reactions',
            [
                AppBuilder.createReaction('🏠', 'first'),
                AppBuilder.createReaction('👀', 'second')
            ]
    );
 ```
 * The first time you create a question does **NOT** require a key, it will default to 
 * *START* even if you give one. The order in which question are created is **NOT** guarenteed
 */
export class AppBuilder {

    /**
     * is the form currently active
     */
    private activated: boolean;

    /**
     * the server this belongs to
     */
    private server: string;

    /**
     * the title of this form
     */
    private title: string;

    /**
     * the description of this form
     */
    private description: string;

    /**
     * calculated in minutes
     */
    private questionTimeout: number;

    /**
     * how many of this form have been completed
     */
    private applicationsRecieved: number;

    /**
     * the content of the application
     */
    private application: ApplicationContent;

    /**
     * class used to manipulate or create applications
     * 
     * example of creating an application from scratch:
     * 
     ```
    const myApp = 
        new AppBuilder()
            .setTitle('Test Application')
            .setDescription('Welcome to test application!')
            .setQuestionTimeout(0.1)
            .createFreetextQuestion('', 'Enter name', 'qs2')
            .createReactQuestion(
                'qs2',
                'enter some reactions',
                [
                    AppBuilder.createReaction('🏠', 'first'),
                    AppBuilder.createReaction('👀', 'second')
                ]
        );
    ```
    * The first time you create a question does **NOT** require a key, it will default to 
    * *START* even if you give one. The order in which question are created is **NOT** guarenteed
    */
    constructor() {
        this.activated = true;
        this.server = '';
        this.title = '';
        this.description = '';
        this.questionTimeout = 0;
        this.applicationsRecieved = 0;
        this.application = {
            START: null
        }
        return this;
    }

    /**
     * sets the state of the activation of the param
     * 
     * @param newState the next state of the activation of the form
     * 
     * @returns chainable
     */
    setActivation(newState: boolean) {
        this.activated = newState;
        return this;
    }

    /**
     * sets the server
     * 
     * @param newServer this id of the server this application is linked to
     */
    setServer(newServer: string) {
        this.server = newServer;
        return this;
    }

    /**
     * sets the title
     * 
     * @param newTitle the next state of the title
     */
    setTitle(newTitle: string) {
        this.title = newTitle;
        return this;
    }

    /**
     * sets the description of the application
     * 
     * @param newDescription the next description
     */
    setDescription(newDescription: string) {
        this.description = newDescription;
        return this;
    }

    /**
     * sets the timeout of the application, in minutes
     * 
     * @param newTimeout the next timeout in minutes
     */
    setQuestionTimeout(newTimeout: number) {
        if (newTimeout < 0) throw new Error(`set timeout cannot be less than 0: \`${newTimeout}\``);
        this.questionTimeout = newTimeout;
        return this;
    }

    /**
     * increments the total applications completed by 1
     */
    newAppCompleted() {
        this.applicationsRecieved++;
        return this;
    }

    /**
     * creates a reaction object for the application to use
     * 
     * @param emoji unicode compatible emojis
     * @param prompt description to show with the emoji
     */
    static createReaction(emoji: string, prompt: string): IReaction {
        return {
            reaction: emoji,
            prompt: prompt
        };
    }

    /**
     * checks if there is a start for this application
     */
    private hasStart() {
        return !!this.application.START;
    }

    /**
     * generates a reaction question
     * 
     * @param questionName the name of the key that will be used to get to this question
     * @param prompt what this question means
     * @param reactions an array of reactions to give to the application
     * @param next the name of the next questions key to be used
     * 
     * @returns chainable
     */
    createReactQuestion(questionName: string, prompt: string, reactions: IReaction[], next: string = null): AppBuilder {
        const reactionQuestion: IQuestion = {
            type: 'REACTION',
            prompt: prompt,
            reactions: reactions,
            next: next
        };

        // if there is no start yet, set it. if not just use the given question name
        if (!this.hasStart()) {
            this.application.START = reactionQuestion;
        } else {
            this.application[questionName] = reactionQuestion;
        }

        return this;
    }

    /**
     * generates a freetext question
     * 
     * @param questionName the name of the key that will be used to get this question
     * @param prompt what this questions means
     * @param next the name of the next questions key to be used
     * 
     * @returns chainable
     */
    createFreetextQuestion(questionName: string, prompt: string, next: string = null): AppBuilder {
        const freetextQuestion: IQuestion = {
            type: 'FREETEXT',
            prompt: prompt,
            next: next
        };

        // if there is no start yet, set it. if not just use the given question name
        if (!this.hasStart()) {
            this.application.START = freetextQuestion;
        } else {
            this.application[questionName] = freetextQuestion;
        }

        return this;
    }

    generateApplication(): IApplication {
        return {
            isActivated: this.activated,
            server: this.server,
            title: this.title,
            description: this.description,
            questionTimeout: this.questionTimeout,
            applicationsRecieved: this.applicationsRecieved,
            application: this.application
        };
    }

    /**
     * use an existing application and use this object to make changes
     * 
     * NOTE: this object **must** be shallow, do not perform any joins
     * 
     * @param application the application to be used as a base
     */
    useApplication(application: IApplication) {
        this.activated = application.isActivated;

        // if the server given is a type object, that means its not 
        // shallow and CANNOT be used
        if (typeof this.server === 'object') throw new Error('`useApplication()` called with an object that is not shallow: server');

        this.server = application.server as string;
        this.title = application.title;
        this.description = this.description;
        this.questionTimeout = application.questionTimeout;
        this.application = application.application;
        return this;
    }
}