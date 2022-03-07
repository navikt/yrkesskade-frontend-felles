import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
    tomAltinnOrganisasjon,
} from '../types/organisasjon';

export const finnOrganisasjonsSomskalHaFokus = (
    organisasjonIFokus: Organisasjon,
    keyPressKey: string,
    erApen: boolean,
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[],
): Organisasjon | null => {
    const flatOrganisasjonsliste = pakkUtOrganisasjonstre(menyKomponenter);
    const erJuridiskEnhet =
        organisasjonIFokus.Type === 'Enterprise' || organisasjonIFokus.OrganizationForm === 'FLI';
    let nesteOrganisasjon = tomAltinnOrganisasjon;
    if (
        sjekkOmNederstPåLista(
            erApen,
            erJuridiskEnhet,
            organisasjonIFokus,
            menyKomponenter,
            flatOrganisasjonsliste,
        ) &&
        arrowDown(keyPressKey)
    ) {
        nesteOrganisasjon = flatOrganisasjonsliste[0];
        return nesteOrganisasjon;
    }
    if (sjekkOmOverstPaLista(organisasjonIFokus, flatOrganisasjonsliste) && arrowUp(keyPressKey)) {
        setfokusPaSokefelt();
        return null;
    }
    const indeksTilOrganisasjonIFlatListe = finnIndeksIUtpakketListe(
        organisasjonIFokus.OrganizationNumber,
        flatOrganisasjonsliste,
    );
    if (!erJuridiskEnhet) {
        if (arrowDown(keyPressKey)) {
            nesteOrganisasjon = flatOrganisasjonsliste[indeksTilOrganisasjonIFlatListe + 1];
        }
        if (arrowUp(keyPressKey)) {
            nesteOrganisasjon = flatOrganisasjonsliste[indeksTilOrganisasjonIFlatListe - 1];
        }
    } else {
        const indeksTilOrganisasjonOrganisasjonstre = finnIndeksIMenyKomponenter(
            organisasjonIFokus.OrganizationNumber,
            menyKomponenter,
        );
        if (arrowDown(keyPressKey)) {
            if (erApen) {
                nesteOrganisasjon = flatOrganisasjonsliste[indeksTilOrganisasjonIFlatListe + 1];
            } else {
                nesteOrganisasjon =
                    menyKomponenter[indeksTilOrganisasjonOrganisasjonstre + 1].JuridiskEnhet;
            }
        }
        if (arrowUp(keyPressKey)) {
            nesteOrganisasjon =
                menyKomponenter[indeksTilOrganisasjonOrganisasjonstre - 1].JuridiskEnhet;
        }
    }
    return nesteOrganisasjon;
};

const pakkUtOrganisasjonstre = (organisasjonstre: JuridiskEnhetMedUnderEnheterArray[]) => {
    const alleEnheter = [];
    for (const { JuridiskEnhet, Underenheter } of organisasjonstre) {
        alleEnheter.push(JuridiskEnhet, ...Underenheter);
    }
    return alleEnheter;
};

export const finnIndeksIMenyKomponenter = (
    enhetsOrganisasjonsnummer: string,
    array: JuridiskEnhetMedUnderEnheterArray[],
) => {
    return array
        .map(organisasjon => organisasjon.JuridiskEnhet.OrganizationNumber)
        .indexOf(enhetsOrganisasjonsnummer);
};

export const finnIndeksIUtpakketListe = (organisasjonsnummer: string, array: Organisasjon[]) => {
    return array.map(organisasjon => organisasjon.OrganizationNumber).indexOf(organisasjonsnummer);
};

export const sjekkOmNederstPåLista = (
    erApenJuridiskEnhet: boolean,
    erJuridiskEnhet: boolean,
    organisasjon: Organisasjon,
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[],
    utpakketMenyKomponenter: Organisasjon[],
) => {
    if (!erJuridiskEnhet) {
        const indeksTilOrganisasjon = finnIndeksIUtpakketListe(
            organisasjon.OrganizationNumber,
            utpakketMenyKomponenter,
        );
        return indeksTilOrganisasjon === utpakketMenyKomponenter.length - 1;
    }
    if (!erApenJuridiskEnhet) {
        const indeksTilOrganisasjon = finnIndeksIMenyKomponenter(
            organisasjon.OrganizationNumber,
            menyKomponenter,
        );
        return indeksTilOrganisasjon === menyKomponenter.length - 1;
    }
};

const sjekkOmOverstPaLista = (organisasjon: Organisasjon, organisasjoner: Organisasjon[]) => {
    return organisasjon.OrganizationNumber === organisasjoner[0].OrganizationNumber;
};

export const endreTabIndexAlleOrganisasjonerOgSokefelt = (
    menyKomponenter: JuridiskEnhetMedUnderEnheterArray[],
    tabIndex: number,
) => {
    endreTabIndeksGittId('bedriftsmeny-sokefelt', tabIndex);
    endreTabIndeksGittId('valgtjuridiskenhet', tabIndex);
    endreTabIndeksGittId('valgtunderenhet', tabIndex);
    menyKomponenter.forEach(juridiskEnhetMedUnderenheter => {
        endreTabIndeksGittId(
            'organisasjons-id-' + juridiskEnhetMedUnderenheter.JuridiskEnhet.OrganizationNumber,
            tabIndex,
        );
        juridiskEnhetMedUnderenheter.Underenheter.forEach(underenhet =>
            endreTabIndeksGittId('organisasjons-id-' + underenhet.OrganizationNumber, tabIndex),
        );
    });
};

export const endreTabIndeksGittId = (idString: string, tabIndex: number) => {
    const element = document.getElementById(idString);
    if (element) {
        element.tabIndex = tabIndex;
    }
};

export const setfokusPaSokefelt = () => {
    document.getElementById('bedriftsmeny-sokefelt')?.focus();
};

export const setfokusPaMenyKnapp = () => {
    document.getElementById('virksomhetsvelger__button')?.focus();
};

const erPilNavigasjonRegex = /^(Arrow)?(Up|Down|Left|Right)$/;
export const erPilNavigasjon = (key: string) => erPilNavigasjonRegex.test(key);

const arrowDown = (key: string) => key === 'ArrowDown' || key === 'Down';
const arrowUp = (key: string) => key === 'ArrowUp' || key === 'Up';
