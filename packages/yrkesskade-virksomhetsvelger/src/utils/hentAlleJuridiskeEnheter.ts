import {
    ListeMedJuridiskeEnheter,
    Organisasjon,
    tomAltinnOrganisasjon,
} from '../types/organisasjon';

export async function hentAlleJuridiskeEnheter(
    listeMedJuridiskeOrgnr: string[],
): Promise<Organisasjon[]> {
    if (window.location.hostname.includes('localhost')) {
        return lagListeMedMockedeJuridiskeEnheter(listeMedJuridiskeOrgnr);
    }

    const orgnr = listeMedJuridiskeOrgnr
        .filter(orgnr => orgnr !== null)
        .filter((juridiskEnhet, index) => listeMedJuridiskeOrgnr.indexOf(juridiskEnhet) === index);

    if (orgnr.length <= 0) {
        return [];
    }

    const respons = await fetch(
        `https://data.brreg.no/enhetsregisteret/api/enheter/?organisasjonsnummer=${orgnr.join(
            ',',
        )}`,
    ).catch(_ => undefined);

    if (respons === undefined || !respons.ok) {
        return orgnr.map(orgnr => lagOrganisasjon(orgnr, '—'));
    }

    const responsBody: ListeMedJuridiskeEnheter = await respons.json();
    const enheter = responsBody._embedded?.enheter ?? [];
    return enheter.map(eeregEnhet =>
        lagOrganisasjon(eeregEnhet.organisasjonsnummer, eeregEnhet.navn),
    );
}

const lagOrganisasjon = (orgnr: string, navn: string): Organisasjon => ({
    ...tomAltinnOrganisasjon,
    Name: navn,
    OrganizationNumber: orgnr,
    Type: 'Business',
});

const lagListeMedMockedeJuridiskeEnheter = (listeMedJuridiskeOrgnr: string[]) =>
    listeMedJuridiskeOrgnr.map(orgnr => lagOrganisasjon(orgnr, 'MOCK ORGANISASjON'));
