import { People } from '@navikt/ds-icons';
import React from 'react';

interface PersonIkonProps {
    farge: string;
}
export const PersonIkon = (props: PersonIkonProps) => {
    return (
        <span
            className="ikon"
            style={{
                backgroundColor: props.farge,
            }}
        >
            <People />
        </span>
    );
};
