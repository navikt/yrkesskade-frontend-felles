import React, { useState } from 'react';
import { AmplitudeProvider, Virksomhetsvelger, VirksomhetsvelgerProvider } from './src';
import { Organisasjon, tomAltinnOrganisasjon } from './src/types/organisasjon';
import { MOCK_ORGANISASJONER as organisasjoner } from './src/mock/organisasjoner';
import { createBrowserHistory, History } from 'history';
import amplitude from './src/mock/ys-amplitude';

export default {
    title: 'Komponenter/Virksomhetsvelger',
    component: Virksomhetsvelger,
};

export const YrkesskadeVirksomhetsvelger: React.FC = () => {
    const history: History = createBrowserHistory();
    const [organisasjon, setOrganisasjon] = useState<Organisasjon>(tomAltinnOrganisasjon);

    const onOrganisasjonChange = (organisasjon?: Organisasjon) => {
        setOrganisasjon(organisasjon);
    };

    return (
        <>
            <AmplitudeProvider amplitudeClient={amplitude}>
                <VirksomhetsvelgerProvider history={history} organisasjoner={organisasjoner ?? []}>
                    <Virksomhetsvelger onOrganisasjonChange={onOrganisasjonChange} />
                </VirksomhetsvelgerProvider>
            </AmplitudeProvider>
            <hr />
            {organisasjon && (
                <div>
                    <div>Valgt Organisasjon</div>
                    <div>
                        {organisasjon.Name} {organisasjon.OrganizationForm}
                    </div>
                </div>
            )}
        </>
    );
};
