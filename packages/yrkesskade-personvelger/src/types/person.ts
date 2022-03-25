export interface Person {
    navn: string;
    beskrivelse: string;
    identifikator: string;
    type: PersonType;
}

export enum PersonType {
    VOKSEN,
    BARN,
    BABY,
}
