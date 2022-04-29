import { BodyLong, Switch } from '@navikt/ds-react';
import React, { useState } from 'react';
import { Dagvelger } from './src';

export default {
    title: 'Komponenter/Dagvelger',
    component: Dagvelger,
};

export const YrkesskadeDagvelger: React.FC = () => {
    const [dato, setDato] = useState<Date>();
    const [hideLabel, setHideLabel] = useState<boolean>(false);
    const handleChange = (dato: Date) => {
        setDato(dato);
    };

    const handleLabelVisibilityChange = e => {
        setHideLabel(e.currentTarget.checked);
    };

    return (
        <div>
            <div>
                <Switch size="medium" position="left" onChange={handleLabelVisibilityChange}>
                    Gjem label
                </Switch>
            </div>
            {dato && <BodyLong>Valgt dato objekt som ISO string: {dato.toISOString()}</BodyLong>}
            <hr />
            <div>
                <Dagvelger
                    label="Velg dag"
                    onDatoChange={handleChange}
                    toDate={new Date()}
                    data-test-id="test"
                    hideLabel={hideLabel}
                />
                <BodyLong>
                    Dette er en lang tekst under TextField komponent som viser at dagvelger
                    komponent legger seg over innhold på siden
                </BodyLong>
            </div>
        </div>
    );
};
