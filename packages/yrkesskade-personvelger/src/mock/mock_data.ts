import { Person, PersonType } from '../types/person';

export const MOCK_PERSON: Person[] = [
    {
        navn: 'Randi Olsen',
        beskrivelse: 'Deg selv',
        identifikator: '01234567891',
        type: PersonType.VOKSEN,
    },
    {
        navn: 'Erik Olsen',
        beskrivelse: 'Barnet ditt',
        identifikator: '01234567892',
        type: PersonType.BARN,
    },
    {
        navn: 'Randi Olsen',
        beskrivelse: 'Barnet ditt',
        identifikator: '01234567893',
        type: PersonType.BABY,
    },
];
