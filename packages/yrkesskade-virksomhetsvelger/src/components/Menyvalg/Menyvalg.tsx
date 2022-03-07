import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { Organisasjon } from '../../types/organisasjon';
import Underenhetsvelger from './Underenhetsvelger/Underenhetsvelger';
import { endreTabIndexAlleOrganisasjonerOgSokefelt } from '../../utils/pilnavigeringsfunksjoner';
import { VirksomhetsvelgerContext } from '../../VirksomhetsvelgerProvider';

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    organisasjonIFokus: Organisasjon;
    forrigeOrganisasjonIFokus: Organisasjon;
    setOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
    setForrigeOrganisasjonIFokus: (organisasjon: Organisasjon) => void;
}

const Menyvalg: FunctionComponent<Props> = props => {
    const {
        setErApen,
        erApen,
        organisasjonIFokus,
        setOrganisasjonIFokus,
        forrigeOrganisasjonIFokus,
        setForrigeOrganisasjonIFokus,
    } = props;
    const [hover, setHover] = useState(false);
    const { aktivtOrganisasjonstre: menyKomponenter } = useContext(VirksomhetsvelgerContext);

    useEffect(() => {
        const navarendeTabIndex = erApen ? 0 : -1;
        endreTabIndexAlleOrganisasjonerOgSokefelt(menyKomponenter, navarendeTabIndex);
    }, [erApen, menyKomponenter]);

    const lukkMenyOnTabPaNedersteElement = (
        organisasjonsnummer: string,
        erJuridiskEnhetSomViserUnderenheter: boolean,
    ) => {
        const nedersteElement = menyKomponenter[menyKomponenter.length - 1];
        const erNedersteJuridiskeEnhet =
            nedersteElement.JuridiskEnhet.OrganizationNumber === organisasjonsnummer;
        const nedersteUnderenhet =
            nedersteElement.Underenheter[nedersteElement.Underenheter.length - 1];
        const erNedersteUnderenhet = nedersteUnderenhet.OrganizationNumber === organisasjonsnummer;
        if (
            (erNedersteJuridiskeEnhet && !erJuridiskEnhetSomViserUnderenheter) ||
            erNedersteUnderenhet
        ) {
            setErApen(false);
        }
    };

    return (
        <div id={'virksomhetsvelger-id'}>
            {menyKomponenter.map(organisasjon => (
                <Underenhetsvelger
                    setOrganisasjonIFokus={setOrganisasjonIFokus}
                    setForrigeOrganisasjonIFokus={setForrigeOrganisasjonIFokus}
                    setErApen={setErApen}
                    organisasjonIFokus={organisasjonIFokus}
                    forrigeOrganisasjonIFokus={forrigeOrganisasjonIFokus}
                    lukkMenyOnTabPaNedersteElement={lukkMenyOnTabPaNedersteElement}
                    key={organisasjon.JuridiskEnhet.OrganizationNumber}
                    juridiskEnhetMedUnderenheter={organisasjon}
                    erApen={erApen}
                    hover={hover}
                    setHover={setHover}
                />
            ))}
        </div>
    );
};

export default Menyvalg;
