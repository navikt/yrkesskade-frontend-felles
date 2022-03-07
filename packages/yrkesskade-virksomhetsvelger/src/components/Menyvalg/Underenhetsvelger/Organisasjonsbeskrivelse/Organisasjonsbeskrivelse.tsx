import React from 'react';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import JuridiskEnhetIkon from './JuridiskEnhetIkon';
import UnderenhetIkon from './UnderenhetIkon';
import './Organisasjonsbeskrivelse.less';

interface Props {
    navn: string;
    orgnummer: string;
    erJuridiskEnhet?: boolean;
}

const Organisasjonsbeskrivelse = ({ navn, orgnummer, erJuridiskEnhet }: Props) => {
    const Ikon = erJuridiskEnhet ? JuridiskEnhetIkon : UnderenhetIkon;
    const tekst = erJuridiskEnhet ? `org.nr. ${orgnummer}` : `virksomhetsnr. ${orgnummer}`;

    return (
        <div className="organisasjonsbeskrivelse">
            <Ikon classname="organisasjonsbeskrivelse__ikon" />
            <div className="organisasjonsbeskrivelse__beskrivelse">
                <Element
                    className="organisasjonsbeskrivelse__navn"
                    title={navn.length > 26 ? navn : ''}
                >
                    {navn}
                </Element>
                <Normaltekst aria-label={tekst}>{tekst}</Normaltekst>
            </div>
        </div>
    );
};

export default Organisasjonsbeskrivelse;
