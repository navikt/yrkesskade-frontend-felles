/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, FunctionComponent, useEffect, useState } from 'react';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon,
} from './types/organisasjon';
import { History } from 'history';
import useOrganisasjon from './utils/useOrganisasjon';
import { setLocalStorageOrgnr, settOrgnummerIUrl } from './utils/utils';
import { byggSokeresultat } from './utils/bygSokeresultat';
import { byggOrganisasjonstre } from './utils/byggOrganisasjonstre';

interface Props {
    organisasjoner: Organisasjon[];
    history: History;
}

interface Context {
    aktivtOrganisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    velgUnderenhet: (orgnr: string) => void;
    valgtOrganisasjon: Organisasjon;

    setSøketekst: (søketekst: string) => void;
    søketekst: string;
}

export const VirksomhetsvelgerContext = createContext<Context>({} as any);

export const VirksomhetsvelgerProvider: FunctionComponent<Props> = props => {
    const [søketekst, setSøketekst] = useState('');
    const [aktivtOrganisasjonstre, setAktivtOrganisasjonstre] = useState<
        JuridiskEnhetMedUnderEnheterArray[]
    >([]);
    const { valgtOrganisasjon } = useOrganisasjon(aktivtOrganisasjonstre, props.history);

    const [organisasjonstre, setOrganisasjonstre] = useState<
        JuridiskEnhetMedUnderEnheterArray[] | undefined
    >(undefined);

    useEffect(() => {
        if (props.organisasjoner && props.organisasjoner.length > 0) {
            byggOrganisasjonstre(props.organisasjoner).then(nyttOrganisasjonstre => {
                if (nyttOrganisasjonstre.length > 0) {
                    setOrganisasjonstre(nyttOrganisasjonstre);
                }
            });
        }
    }, [props.organisasjoner]);

    useEffect(() => {
        setAktivtOrganisasjonstre(byggSokeresultat(organisasjonstre, søketekst));
    }, [organisasjonstre, søketekst]);

    if (valgtOrganisasjon === undefined || valgtOrganisasjon === tomAltinnOrganisasjon) {
        return null;
    }

    const context: Context = {
        velgUnderenhet: orgnr => {
            settOrgnummerIUrl(orgnr, props.history);
            setLocalStorageOrgnr(orgnr);
        },
        aktivtOrganisasjonstre,
        valgtOrganisasjon,
        søketekst,
        setSøketekst,
    };

    return (
        <VirksomhetsvelgerContext.Provider value={context}>
            {props.children}
        </VirksomhetsvelgerContext.Provider>
    );
};
