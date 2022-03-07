/* eslint-disable @typescript-eslint/no-explicit-any */
import fuzzysort from 'fuzzysort';

import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../types/organisasjon';
import { hentUnderenheter } from './utils';

const fuzzysortConfigUnderenheter = {
    keys: ['Name', 'OrganizationNumber'],
    allowTypo: false,
    threshold: -1000,
};

const fuzzysortConfigJuridiskEnhet = {
    keys: ['JuridiskEnhet.Name', 'JuridiskEnhet.OrganizationNumber'],
    allowTypo: false,
    threshold: -1000,
};

export function byggSokeresultat(
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[] = [],
    inputTekst: string,
): JuridiskEnhetMedUnderEnheterArray[] {
    if (inputTekst === '') {
        return organisasjonstre;
    }
    const sokeresultatUnderenheter = finnUnderEnheterMedSok(organisasjonstre, inputTekst);
    const sokeresultatEnheter = finnEnheterMedSok(organisasjonstre, inputTekst);
    return matchResultatMedJuridiskEnhet(
        organisasjonstre,
        sokeresultatUnderenheter,
        sokeresultatEnheter,
    );
}

const finnEnheterMedSok = (
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[],
    inputTekst: string,
) =>
    fuzzysort
        .go(inputTekst, organisasjonstre, fuzzysortConfigJuridiskEnhet)
        .map((juridiskEnhetMedUnderenheter: any) => juridiskEnhetMedUnderenheter.obj);

const finnUnderEnheterMedSok = (
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[],
    inputTekst: string,
) =>
    fuzzysort
        .go(inputTekst, hentUnderenheter(organisasjonstre), fuzzysortConfigUnderenheter)
        .map((underenhet: any) => underenhet.obj);

const matchResultatMedJuridiskEnhet = (
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[],
    sokeresultatUnderenheter: Organisasjon[],
    sokeresultatEnheterMedUnderenhetArray: JuridiskEnhetMedUnderEnheterArray[],
): JuridiskEnhetMedUnderEnheterArray[] => {
    const sokeResultatListe: JuridiskEnhetMedUnderEnheterArray[] =
        sokeresultatEnheterMedUnderenhetArray;
    organisasjonstre.forEach(juridiskEnhet => {
        const juridiskEnhetInkludertISokeResultat = sokeResultatListe.find(
            enhet =>
                enhet.JuridiskEnhet.OrganizationNumber ===
                juridiskEnhet.JuridiskEnhet.OrganizationNumber,
        );

        const listeMedUnderEnheterFraSokeResultat = juridiskEnhet.Underenheter.filter(underenhet =>
            sokeresultatUnderenheter.includes(underenhet),
        );

        if (
            listeMedUnderEnheterFraSokeResultat.length > 0 &&
            !juridiskEnhetInkludertISokeResultat
        ) {
            sokeResultatListe.push({
                JuridiskEnhet: juridiskEnhet.JuridiskEnhet,
                Underenheter: listeMedUnderEnheterFraSokeResultat,
                SokeresultatKunUnderenhet: true,
            });
        }
    });
    return sokeResultatListe.sort((a, b) =>
        a.JuridiskEnhet.Name.localeCompare(b.JuridiskEnhet.Name),
    );
};
