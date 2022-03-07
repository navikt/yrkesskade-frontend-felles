import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from '../types/organisasjon';
import { hentAlleJuridiskeEnheter } from './hentAlleJuridiskeEnheter';

const erHovedenhet = (organisasjon: Organisasjon): boolean =>
    !!organisasjon.OrganizationNumber &&
    (organisasjon.Type === 'Enterprise' || organisasjon.OrganizationForm === 'FLI');

const erUnderenhet = (organisasjon: Organisasjon): boolean =>
    !!organisasjon.OrganizationNumber && ['BEDR', 'AAFY'].includes(organisasjon.OrganizationForm);

const sorted = <T extends unknown>(array: T[], on: (e: T) => string): T[] =>
    [...array].sort((a, b) => on(a).localeCompare(on(b)));

export async function byggOrganisasjonstre(
    organisasjoner: Organisasjon[],
): Promise<JuridiskEnhetMedUnderEnheterArray[]> {
    organisasjoner = sorted(organisasjoner, org => org.Name);

    const hovedenheter = organisasjoner.filter(erHovedenhet);
    const underenheter = organisasjoner.filter(erUnderenhet);

    const hovedenhetersOrgnr = new Set(hovedenheter.map(enhet => enhet.OrganizationNumber));
    const manglendeHovedenheterOrgnr = underenheter
        .filter(org => !hovedenhetersOrgnr.has(org.ParentOrganizationNumber))
        .map(org => org.ParentOrganizationNumber);

    hovedenheter.push(...(await hentAlleJuridiskeEnheter(manglendeHovedenheterOrgnr)));

    const resultat = hovedenheter
        .map(hovedenhet => ({
            JuridiskEnhet: hovedenhet,
            Underenheter: underenheter.filter(
                underenhet => underenhet.ParentOrganizationNumber === hovedenhet.OrganizationNumber,
            ),
            SokeresultatKunUnderenhet: false,
        }))
        .filter(orgtre => orgtre.Underenheter.length > 0);
    return sorted(resultat, a => a.JuridiskEnhet.Name);
}
