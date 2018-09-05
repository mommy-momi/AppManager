interface IReaction {
    reaction: string;

    // this prompt would represent what this specific
    // reaction represents
    prompt: string;
    next: string;
};

export interface IQuestion {

    // depending on if the type is `FREETEXT` or `REACTION`, those two
    // optional fields will exist.

    // if `FREETEXT`, next exists and reactions is null
    // if `REACTION`, reactions exists and next is null
    type: 'FREETEXT' | 'REACTION';

    // this prompt would be the description of what this question
    // is about
    prompt: string;
    reactions?: IReaction[];
    next?: string;
};