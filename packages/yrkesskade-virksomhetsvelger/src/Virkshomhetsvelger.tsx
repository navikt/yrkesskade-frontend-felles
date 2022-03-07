/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';

import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon,
} from './types/organisasjon';
import Menyvalg from './components/Menyvalg/Menyvalg';
import Sokefelt from './components/Menyvalg/Sokefelt/Sokefelt';
import Menyknapp from './components/Menyknapp/Menyknapp';
import { setfokusPaMenyKnapp, setfokusPaSokefelt } from './utils/pilnavigeringsfunksjoner';
import './Virksomhetsvelger.less';
import { useHandleOutsideEvent } from './utils/useHandleOutsideEvent';
import { VirksomhetsvelgerContext } from './VirksomhetsvelgerProvider';

export interface VirksomhetsvelgerProps {
    onOrganisasjonChange: (organisasjon: Organisasjon) => void;
}

const finnForsteJuridiskEnhet = (
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[],
    soketekst: string,
    orgNrValgtJuridiskEnhet: string,
): Organisasjon => {
    if (organisasjonstre.length === 0) {
        return tomAltinnOrganisasjon;
    }

    if (soketekst.length > 0) {
        return organisasjonstre[0].JuridiskEnhet;
    }

    const juridiskeEnheter = organisasjonstre.map(({ JuridiskEnhet }) => JuridiskEnhet);
    return (
        juridiskeEnheter.find(
            ({ OrganizationNumber }) => OrganizationNumber === orgNrValgtJuridiskEnhet,
        ) ?? tomAltinnOrganisasjon
    );
};

export const Virksomhetsvelger: FunctionComponent<VirksomhetsvelgerProps> = props => {
    const bedriftvelgernode = useRef<HTMLDivElement>(null);
    const { onOrganisasjonChange } = props;
    const {
        valgtOrganisasjon,
        aktivtOrganisasjonstre,
        velgUnderenhet,
        søketekst: soketekst,
    } = useContext(VirksomhetsvelgerContext);
    const [erApen, setErApen] = useState(false);

    const [organisasjonIFokus, setOrganisasjonIFokus] = useState(tomAltinnOrganisasjon);
    const [forrigeOrganisasjonIFokus, setForrigeOrganisasjonIFokus] =
        useState(tomAltinnOrganisasjon);

    useEffect(() => {
        setErApen(false);
        onOrganisasjonChange(valgtOrganisasjon);
    }, [valgtOrganisasjon]);

    useEffect(() => {
        if (!erApen) {
            setfokusPaMenyKnapp();
            setOrganisasjonIFokus(tomAltinnOrganisasjon);
        } else {
            setfokusPaSokefelt();
        }
    }, [erApen]);

    useHandleOutsideEvent(bedriftvelgernode, () => {
        setErApen(false);
    });

    const onEnterSearchbox = () => {
        if (soketekst.length > 0 && aktivtOrganisasjonstre.length > 0) {
            const kunTreffPåEnUnderenhet =
                aktivtOrganisasjonstre.length === 1 &&
                aktivtOrganisasjonstre[0].Underenheter.length === 1;
            if (kunTreffPåEnUnderenhet) {
                const underenhet = aktivtOrganisasjonstre[0].Underenheter[0];
                if (underenhet.OrganizationNumber !== valgtOrganisasjon.OrganizationNumber) {
                    velgUnderenhet(aktivtOrganisasjonstre[0].Underenheter[0].OrganizationNumber);
                } else {
                    setErApen(false);
                }
            } else {
                setOrganisasjonIFokus(aktivtOrganisasjonstre[0].JuridiskEnhet);
            }
        }
    };

    const setFocusOnForsteVirksomhet = () => {
        if (aktivtOrganisasjonstre.length > 0 || soketekst.length === 0) {
            const forsteJuridiskEnhetILista = finnForsteJuridiskEnhet(
                aktivtOrganisasjonstre,
                soketekst,
                valgtOrganisasjon.ParentOrganizationNumber,
            );
            const blarOppTilSøkefeltOgNedTilMeny =
                forrigeOrganisasjonIFokus.OrganizationNumber ===
                aktivtOrganisasjonstre[0].JuridiskEnhet.OrganizationNumber;
            const valgtJuridiskEnhetErFørsteILista =
                forsteJuridiskEnhetILista.OrganizationNumber ===
                aktivtOrganisasjonstre[0].JuridiskEnhet.OrganizationNumber;
            const skalBlaTilFørsteElementIMenyKomponenter =
                (blarOppTilSøkefeltOgNedTilMeny && !valgtJuridiskEnhetErFørsteILista) ||
                soketekst.length > 0;

            if (skalBlaTilFørsteElementIMenyKomponenter) {
                setOrganisasjonIFokus(aktivtOrganisasjonstre[0].JuridiskEnhet);
            } else {
                setOrganisasjonIFokus(forsteJuridiskEnhetILista);
            }
        }
    };

    const antallTreff = aktivtOrganisasjonstre
        .map(({ Underenheter }) => Underenheter.length)
        .reduce((x, y) => x + y, 0);

    return (
        <nav
            className="virksomhetsvelger"
            aria-label="Velg virksomhet"
            onKeyDown={event => {
                if (event.key === 'Escape' || event.key === 'Esc') {
                    setErApen(false);
                }
            }}
        >
            <div ref={bedriftvelgernode} className="virksomhetsvelger__wrapper">
                <Menyknapp erApen={erApen} setErApen={setErApen} />
                <div
                    role="toolbar"
                    className={`virksomhetsvelger__dropdown--${erApen ? 'apen' : 'lukket'}`}
                    aria-hidden={!erApen}
                    id="virksomhetsvelger__dropdown"
                >
                    <Sokefelt
                        onArrowUp={() => setfokusPaMenyKnapp()}
                        onArrowDown={() => setFocusOnForsteVirksomhet()}
                        onEnter={() => onEnterSearchbox()}
                        antallTreff={antallTreff}
                    />

                    <div className="dropdownmeny-elementer-wrapper">
                        <div
                            className={`dropdownmeny-elementer ${soketekst ? 'medSokeTekst' : ''}`}
                        >
                            {aktivtOrganisasjonstre.length > 0 && (
                                <Menyvalg
                                    organisasjonIFokus={organisasjonIFokus}
                                    setOrganisasjonIFokus={setOrganisasjonIFokus}
                                    forrigeOrganisasjonIFokus={forrigeOrganisasjonIFokus}
                                    setForrigeOrganisasjonIFokus={setForrigeOrganisasjonIFokus}
                                    erApen={erApen}
                                    setErApen={setErApen}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
