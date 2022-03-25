import { People } from '@navikt/ds-icons';
import React from 'react';
import { PersonType } from '../../types/person';

interface PersonIkonProps {
    type: PersonType;
}
export const PersonIkon = (props: PersonIkonProps) => {
    const fargepalette = ['#EFECF4', '#634689', '#EFF1F8', '#005B82', '#F9FCCC', '#666E00'];

    const kalkulerFarge = (type: PersonType) => {
        switch (type) {
            case PersonType.BARN:
                return fargepalette[2];
            case PersonType.BABY:
                return fargepalette[4];
            default:
                return fargepalette[0];
        }
    };
    const farge = kalkulerFarge(props.type);

    return (
        <span
            className="ikon"
            style={{
                backgroundColor: farge,
            }}
        >
            <People />
        </span>
    );
};
