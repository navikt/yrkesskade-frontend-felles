import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon,
} from '../../../types/organisasjon';
import Underenhet from './Underenhet/Underenhet';
import UnderenhetsVelgerMenyButton from './UnderenhetsVelgerMenyButton/UnderenhetsVelgerMenyButton';
import {
    finnIndeksIMenyKomponenter,
    finnOrganisasjonsSomskalHaFokus,
} from '../../../utils/pilnavigeringsfunksjoner';
import './Underenhetsvelger.less';
import { VirksomhetsvelgerContext } from '../../../VirksomhetsvelgerProvider';

interface Props {
    juridiskEnhetMedUnderenheter: JuridiskEnhetMedUnderEnheterArray;
    hover: boolean;
    setHover: (bool: boolean) => void;
    setErApen: (bool: boolean) => void;
    erApen: boolean;
    lukkMenyOnTabPaNedersteElement: (
        organisasjonsnummer: string,
        erJuridiskEnhetSomViserUnderenheter: boolean,
    ) => void;
    setOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
    setForrigeOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
    organisasjonIFokus: Organisasjon;
    forrigeOrganisasjonIFokus: Organisasjon;
}

const Underenhetsvelger: FunctionComponent<Props> = ({
    juridiskEnhetMedUnderenheter,
    hover,
    setHover,
    setErApen,
    erApen,
    setForrigeOrganisasjonIFokus,
    setOrganisasjonIFokus,
    organisasjonIFokus,
    forrigeOrganisasjonIFokus,
    lukkMenyOnTabPaNedersteElement,
}) => {
    const [visUnderenheter, setVisUnderenheter] = useState(false);
    const {
        valgtOrganisasjon,
        søketekst,
        aktivtOrganisasjonstre: menyKomponenter,
    } = useContext(VirksomhetsvelgerContext);
    const juridiskEnhet = juridiskEnhetMedUnderenheter.JuridiskEnhet;

    const setNyOrganisasjonIFokus = (
        keypressKey: string,
        erJuridiskEnhetSomViserUnderenheter: boolean,
    ) => {
        const organisasjonsSomSkalFåFokus = finnOrganisasjonsSomskalHaFokus(
            organisasjonIFokus,
            keypressKey,
            erJuridiskEnhetSomViserUnderenheter,
            menyKomponenter,
        );
        if (organisasjonsSomSkalFåFokus) {
            setOrganisasjonIFokus(organisasjonsSomSkalFåFokus);
        } else {
            setOrganisasjonIFokus(tomAltinnOrganisasjon);
        }
        setForrigeOrganisasjonIFokus(organisasjonIFokus);
    };

    useEffect(() => {
        setVisUnderenheter(false);
        const erSok = søketekst !== '';
        const erValgt: boolean =
            valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber;
        if (erValgt || (erSok && juridiskEnhetMedUnderenheter.SokeresultatKunUnderenhet)) {
            setVisUnderenheter(true);
            const scrollcontainer = document.querySelector('.dropdownmeny-elementer');
            const valgtenhet = document.getElementById('underenhet-apen');
            const topPos = valgtenhet ? valgtenhet.offsetTop : 0;

            setTimeout(() => {
                if (valgtenhet && scrollcontainer && !erSok) {
                    scrollcontainer.scrollTop = topPos;
                }
            }, 100);
        }
    }, [juridiskEnhetMedUnderenheter, valgtOrganisasjon, erApen, søketekst]);

    useEffect(() => {
        const skalSettesIFokus =
            organisasjonIFokus.OrganizationNumber === juridiskEnhet.OrganizationNumber;
        const indeksIOrganisasjonstre = finnIndeksIMenyKomponenter(
            juridiskEnhet.OrganizationNumber,
            menyKomponenter,
        );
        if (skalSettesIFokus) {
            const idTilJuridiskEnhet =
                valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
                    ? 'valgtjuridiskenhet'
                    : 'organisasjons-id-' + juridiskEnhet.OrganizationNumber;
            const erSisteElement = indeksIOrganisasjonstre === menyKomponenter.length - 1;
            if (!erSisteElement) {
                const forrigeOrganisasjonErJuridiskEnhetUnder =
                    forrigeOrganisasjonIFokus.OrganizationNumber ===
                    menyKomponenter[indeksIOrganisasjonstre + 1].JuridiskEnhet.OrganizationNumber;
                if (forrigeOrganisasjonErJuridiskEnhetUnder && visUnderenheter) {
                    const sisteUnderenhet =
                        juridiskEnhetMedUnderenheter.Underenheter[
                            juridiskEnhetMedUnderenheter.Underenheter.length - 1
                        ];
                    setOrganisasjonIFokus(sisteUnderenhet);
                    return;
                }
            }
            const element = document.getElementById(idTilJuridiskEnhet);
            element?.focus();
        }
    }, [forrigeOrganisasjonIFokus, organisasjonIFokus]);

    const lukkUnderenhetsvelgerOgFokuserPåEnhet = (underenhet: Organisasjon) => {
        const erUnderenhetAvValgtEnhet =
            underenhet.ParentOrganizationNumber === valgtOrganisasjon.ParentOrganizationNumber;
        const juridiskEnhetElementId = erUnderenhetAvValgtEnhet
            ? 'valgtjuridiskenhet'
            : 'organisasjons-id-' + underenhet.ParentOrganizationNumber;
        const juridiskEnhetElement = document.getElementById(juridiskEnhetElementId);
        if (juridiskEnhetElement) {
            juridiskEnhetElement?.click();
            juridiskEnhetElement?.focus();
            setOrganisasjonIFokus(juridiskEnhet);
        }
    };

    return (
        <div className="underenhetsvelger" id={visUnderenheter ? 'underenhet-apen' : ''}>
            <UnderenhetsVelgerMenyButton
                visUnderenheter={visUnderenheter}
                juridiskEnhetMedUnderenheter={juridiskEnhetMedUnderenheter}
                setVisUnderenheter={setVisUnderenheter}
                setHover={setHover}
                erApen={erApen}
                setNyOrganisasjonIFokus={setNyOrganisasjonIFokus}
                lukkMenyOnTabPaNedersteElement={lukkMenyOnTabPaNedersteElement}
            />
            <ul
                className={`underenhetsvelger__menyvalg-wrapper--${
                    visUnderenheter ? 'apen' : 'lukket'
                }`}
                id={`underenhetvelger${juridiskEnhet.OrganizationNumber}`}
                role="menu"
                aria-label={`Underenheter til ${juridiskEnhet.Name}`}
            >
                {juridiskEnhetMedUnderenheter.Underenheter.map((organisasjon: Organisasjon) => (
                    <Underenhet
                        setErApen={setErApen}
                        lukkUnderenhetsvelgerOgFokuserPåEnhet={
                            lukkUnderenhetsvelgerOgFokuserPåEnhet
                        }
                        key={organisasjon.OrganizationNumber}
                        underEnhet={organisasjon}
                        hover={hover}
                        setHover={setHover}
                        erApen={erApen}
                        organisasjonIFokus={organisasjonIFokus}
                        setNyOrganisasjonIFokus={setNyOrganisasjonIFokus}
                        lukkMenyOnTabPaNedersteElement={lukkMenyOnTabPaNedersteElement}
                    />
                ))}
            </ul>
        </div>
    );
};

export default Underenhetsvelger;
