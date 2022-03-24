import React, { useState } from 'react';
import { AmplitudeProvider, Personvelger } from './src';
import { MOCK_PERSON as personer } from './src/mock/mock_data';
import { createBrowserHistory, History } from 'history';
import amplitude from './src/mock/ys-amplitude';
import { Person } from './src/types/person';

export default {
    title: 'Komponenter/Personvelger',
    component: Personvelger,
};

export const YrkesskadePersonvelger: React.FC = () => {
    const history: History = createBrowserHistory();
    const [person, setPerson] = useState<Person>({
        navn: '',
        beskrivelse: '',
        identifikator: '',
    } as Person);

    const onPersonvalg = (person?: Person) => {
        setPerson(person);
    };

    return (
        <>
            <AmplitudeProvider amplitudeClient={amplitude}>
                <Personvelger personer={personer} onPersonChange={onPersonvalg} />
            </AmplitudeProvider>
            <hr />
            {person && (
                <div>
                    <div>Valgt Person</div>
                    <div>
                        {person.navn} {person.beskrivelse} {person.identifikator}
                    </div>
                </div>
            )}
        </>
    );
};
