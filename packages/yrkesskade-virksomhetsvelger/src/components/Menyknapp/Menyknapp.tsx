import React, { useContext } from 'react';

import { Element, Normaltekst } from 'nav-frontend-typografi';
import { NedChevron } from 'nav-frontend-chevron';

import UnderenhetIkon from '../Menyvalg/Underenhetsvelger/Organisasjonsbeskrivelse/UnderenhetIkon';
import './Menyknapp.less';
import { setfokusPaSokefelt, erPilNavigasjon } from '../../utils/pilnavigeringsfunksjoner';
import { VirksomhetsvelgerContext } from '../../VirksomhetsvelgerProvider';

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
}

const Menyknapp = ({ erApen, setErApen }: Props) => {
    const {
        valgtOrganisasjon: { Name, OrganizationNumber },
        setSøketekst,
    } = useContext(VirksomhetsvelgerContext);
    const onKeyPress = (key: string, skift: boolean) => {
        if (key === 'ArrowDown' || key === 'Down') {
            if (erApen) {
                setfokusPaSokefelt();
                setSøketekst('');
            }
        }
        if (key === 'Tab' && skift) {
            setErApen(false);
        }
    };

    return (
        <button
            onClick={() => {
                setSøketekst('');
                setErApen(!erApen);
            }}
            onKeyDown={e => {
                if (erPilNavigasjon(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                onKeyPress(e.key, e.shiftKey);
            }}
            className="menyknapp"
            id="virksomhetsvelger__button"
            aria-label={`Virksomhetsvelger. Valgt virksomhet er ${Name}, Trykk enter for å ${
                erApen ? 'lukke' : 'åpne'
            } denne menyen`}
            aria-pressed={erApen}
            aria-haspopup="true"
            aria-controls="virksomhetsvelger__dropdown"
            aria-expanded={erApen}
        >
            <div className="menyknapp__innhold">
                <UnderenhetIkon classname="menyknapp-ikon" />
                <div className="menyknapp-beskrivelse">
                    <Element className="menyknapp-navn">{Name}</Element>
                    <Normaltekst>virksomhetsnr. {OrganizationNumber}</Normaltekst>
                </div>
                <NedChevron className={`menyknapp__chevron${erApen ? '--ned' : '--opp'}`} />
            </div>
        </button>
    );
};

export default Menyknapp;
