/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { FunctionComponent, useContext } from 'react';

import { NedChevron } from 'nav-frontend-chevron';
import { Normaltekst } from 'nav-frontend-typografi';

import Organisasjonsbeskrivelse from '../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { JuridiskEnhetMedUnderEnheterArray } from '../../../../types/organisasjon';
import { erPilNavigasjon } from '../../../../utils/pilnavigeringsfunksjoner';
import { VirksomhetsvelgerContext } from '../../../../VirksomhetsvelgerProvider';

interface Props {
    juridiskEnhetMedUnderenheter: JuridiskEnhetMedUnderEnheterArray;
    visUnderenheter: boolean;
    setVisUnderenheter: (bool: boolean) => void;
    setHover: (bool: boolean) => void;
    erApen: boolean;
    setNyOrganisasjonIFokus: (
        KeypressKey: string,
        erJuridiskEnhetSomViserUnderenheter: boolean,
    ) => void;
    lukkMenyOnTabPaNedersteElement: (
        organisasjonsnummer: string,
        erJuridiskEnhetSomViserUnderenheter: boolean,
    ) => void;
}

const UnderenhetsVelgerMenyButton: FunctionComponent<Props> = props => {
    const {
        juridiskEnhetMedUnderenheter,
        visUnderenheter,
        setVisUnderenheter,
        setHover,
        erApen,
        setNyOrganisasjonIFokus,
        lukkMenyOnTabPaNedersteElement,
    } = props;
    const { valgtOrganisasjon, søketekst } = useContext(VirksomhetsvelgerContext);
    const juridiskEnhet = juridiskEnhetMedUnderenheter.JuridiskEnhet;
    const underenheter = juridiskEnhetMedUnderenheter.Underenheter;
    const erValgtOrganisasjon =
        valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber;
    const erSok = søketekst !== '';

    const valgtunderenhet =
        valgtOrganisasjon.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
            ? ' - 1 valgt'
            : '';

    const tekstDefault = underenheter.length === 1 ? 'virksomhet' : 'virksomheter';
    const labelDefault = `${visUnderenheter ? 'Skjul' : 'Vis'} ${
        underenheter.length
    } ${tekstDefault}${valgtunderenhet}`;

    const tekstSok = juridiskEnhetMedUnderenheter.SokeresultatKunUnderenhet
        ? 'treff'
        : tekstDefault;
    const labelSok = `${underenheter.length} ${tekstSok}`;
    const label = erSok ? labelSok : labelDefault;

    const OnKeyDown = (key: string) => {
        if (key === 'ArrowRight' || key === 'Right') {
            setVisUnderenheter(true);
        }
        if (key === 'ArrowLeft' || key === 'Left') {
            setVisUnderenheter(false);
        }
        if (key === 'Tab') {
            lukkMenyOnTabPaNedersteElement(juridiskEnhet.OrganizationNumber, visUnderenheter);
        }
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Up' || key === 'Down') {
            setNyOrganisasjonIFokus(key, visUnderenheter);
        }
    };

    return (
        <button
            tabIndex={erApen ? 0 : -1}
            onClick={() => {
                setVisUnderenheter(!props.visUnderenheter);
            }}
            onMouseOver={() => {
                setHover(true);
            }}
            onKeyDown={e => {
                if (erPilNavigasjon(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                OnKeyDown(e.key);
            }}
            onMouseLeave={() => setHover(false)}
            className={`underenhetsvelger__button ${
                visUnderenheter ? 'juridiskenhet--apen' : 'juridiskenhet--lukket'
            }`}
            id={
                erValgtOrganisasjon
                    ? 'valgtjuridiskenhet'
                    : 'organisasjons-id-' +
                      juridiskEnhetMedUnderenheter.JuridiskEnhet.OrganizationNumber
            }
            aria-label={`Velg underenheter for ${juridiskEnhet.Name} ${label}`}
            aria-pressed={visUnderenheter}
            aria-haspopup="true"
            aria-controls={
                erValgtOrganisasjon
                    ? 'valgtjuridiskenhet'
                    : 'organisasjons-id-' +
                      juridiskEnhetMedUnderenheter.JuridiskEnhet.OrganizationNumber
            }
            aria-expanded={visUnderenheter}
        >
            <Organisasjonsbeskrivelse
                erJuridiskEnhet
                navn={juridiskEnhet.Name}
                orgnummer={juridiskEnhet.OrganizationNumber}
            />
            <Normaltekst className="underenhetsvelger__button__label">{label}</Normaltekst>
            <div
                className={`underenhetsvelger__button__chevron${
                    visUnderenheter ? '--apen' : '--lukket'
                }`}
            >
                <NedChevron />
            </div>
        </button>
    );
};

export default UnderenhetsVelgerMenyButton;
