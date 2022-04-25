import { BodyLong, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import { Dagvelger } from './src';

export default {
    title: 'Komponenter/Dagvelger',
    component: Dagvelger,
};

export const YrkesskadeStepIndicator: React.FC = () => {
    const [dato, setDato] = useState<Date>();
    const handleChange = (dato: Date) => {
        setDato(dato);
    };
    return (
        <div>
            <Dagvelger
                label="Velg dag"
                onDatoChange={handleChange}
                toDate={new Date()}
                data-test-id="test"
            />
            <BodyLong>
                Dette er en lang tekst under TextField komponent som viser at dagvelger komponent
                legger seg over innhold på siden
            </BodyLong>
            {dato && <BodyLong>Valgt dato objekt som ISO string: {dato.toISOString()}</BodyLong>}
        </div>
    );
};
