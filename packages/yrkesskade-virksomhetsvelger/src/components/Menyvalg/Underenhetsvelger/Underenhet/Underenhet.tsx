/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import Organisasjonsbeskrivelse from '../Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';

import './Underenhet.less';
import { AmplitudeLoggerContext } from '../../../../amplitudeProvider';
import { Organisasjon } from '../../../../types/organisasjon';
import { erPilNavigasjon } from '../../../../utils/pilnavigeringsfunksjoner';
import { VirksomhetsvelgerContext } from '../../../../VirksomhetsvelgerProvider';

interface Props {
    underEnhet: Organisasjon;
    organisasjonIFokus: Organisasjon;
    hover: boolean;
    setHover: (bool: boolean) => void;
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    setNyOrganisasjonIFokus: (
        KeypressKey: string,
        erJuridiskEnhetSomViserUnderenheter: boolean,
    ) => void;
    lukkMenyOnTabPaNedersteElement: (
        organisasjonsnummer: string,
        erJuridiskEnhetSomViserUnderenheter: boolean,
    ) => void;
    lukkUnderenhetsvelgerOgFokuserPåEnhet: (underenhet: Organisasjon) => void;
}

const Underenhet: FunctionComponent<Props> = ({
    underEnhet,
    organisasjonIFokus,
    hover,
    setHover,
    setErApen,
    erApen,
    setNyOrganisasjonIFokus,
    lukkUnderenhetsvelgerOgFokuserPåEnhet,
    lukkMenyOnTabPaNedersteElement,
}) => {
    const { valgtOrganisasjon, velgUnderenhet } = useContext(VirksomhetsvelgerContext);
    const [erValgtEnhet, setErValgtEnhet] = useState(false);

    const { loggBedriftValgt } = useContext(AmplitudeLoggerContext);

    const onUnderenhetSelect = (value: string) => {
        setErApen(false);
        loggBedriftValgt();
        velgUnderenhet(value);
        setHover(false);
    };

    useEffect(() => {
        setErValgtEnhet(false);
        if (valgtOrganisasjon.OrganizationNumber === underEnhet.OrganizationNumber) {
            setErValgtEnhet(true);
        }
    }, [valgtOrganisasjon, underEnhet]);

    useEffect(() => {
        if (organisasjonIFokus.OrganizationNumber === underEnhet.OrganizationNumber) {
            const idTilUnderEnhet =
                underEnhet.OrganizationNumber === valgtOrganisasjon.OrganizationNumber
                    ? 'valgtunderenhet'
                    : 'organisasjons-id-' + underEnhet.OrganizationNumber;
            const element = document.getElementById(idTilUnderEnhet);
            element?.focus();
        }
    }, [valgtOrganisasjon, underEnhet, organisasjonIFokus]);

    const onKeyDown = (key: string) => {
        if (key === 'Enter') {
            onUnderenhetSelect(underEnhet.OrganizationNumber);
            return;
        }
        if (key === 'Tab') {
            lukkMenyOnTabPaNedersteElement(underEnhet.OrganizationNumber, false);
        }
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Up' || key === 'Down') {
            setNyOrganisasjonIFokus(key, false);
        }
        if (key === 'ArrowLeft' || key === 'Left') {
            lukkUnderenhetsvelgerOgFokuserPåEnhet(underEnhet);
        }
    };

    return (
        <li
            onClick={() => {
                onUnderenhetSelect(underEnhet.OrganizationNumber);
            }}
            onKeyDown={e => {
                if (erPilNavigasjon(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                onKeyDown(e.key);
            }}
            onMouseOver={() => {
                if (!erValgtEnhet) {
                    setHover(true);
                }
            }}
            onMouseLeave={() => {
                if (!erValgtEnhet) {
                    setHover(false);
                }
            }}
            role="menuitem"
            className={`underenhet ${
                hover && erValgtEnhet
                    ? 'valgtunderenhet-grey-on-hover'
                    : erValgtEnhet && !hover
                    ? 'valgtunderenhet'
                    : ''
            }`}
            id={
                erValgtEnhet
                    ? 'valgtunderenhet'
                    : 'organisasjons-id-' + underEnhet.OrganizationNumber
            }
            // key={underEnhet.OrganizationNumber}
            tabIndex={erApen ? 0 : -1}
        >
            <Organisasjonsbeskrivelse
                navn={underEnhet.Name}
                orgnummer={underEnhet.OrganizationNumber}
            />
        </li>
    );
};

export default Underenhet;
