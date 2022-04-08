import { Child, Infants, People } from '@navikt/ds-icons';
import React, { ReactElement } from 'react';
import { PersonType } from '../../types/person';

interface PersonIkonProps {
    type: PersonType;
}

interface FargeOgIkon {
    farge: string;
    ikon: ReactElement;
}

export const PersonIkon = (props: PersonIkonProps) => {
    const fargepalette = ['#EFECF4', '#E6F1F8', '#F9FCCC'];

    const kalkuler = (type: PersonType): FargeOgIkon => {
        switch (type) {
            case PersonType.BARN:
                return { farge: fargepalette[1], ikon: <Child /> };
            case PersonType.BABY:
                return { farge: fargepalette[2], ikon: <Infants /> };
            default:
                return { farge: fargepalette[0], ikon: <People /> };
        }
    };

    const { farge, ikon } = kalkuler(props.type);

    return (
        <span
            className="ikon"
            style={{
                backgroundColor: farge,
            }}
        >
            {ikon}
        </span>
    );
};
