import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { Input } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import Forstorrelsesglass from './Forstorrelsesglass';
import './Sokefelt.less';
import { erPilNavigasjon } from '../../../utils/pilnavigeringsfunksjoner';
import { VirksomhetsvelgerContext } from '../../../VirksomhetsvelgerProvider';

interface Props {
    onEnter: () => void;
    onArrowDown: () => void;
    onArrowUp: () => void;
    antallTreff: number | null;
}

const Sokefelt: FunctionComponent<Props> = ({ onEnter, onArrowDown, onArrowUp, antallTreff }) => {
    const { søketekst, setSøketekst } = useContext(VirksomhetsvelgerContext);
    const [ariaTekst, setTekst] = useState('Søk etter virksomhet');

    useEffect(() => {
        if (søketekst.length === 0 || antallTreff === null) {
            setTekst('');
        } else {
            const treff = antallTreff === 0 ? 'Ingen' : antallTreff;
            setTekst(`${treff} treff for "${søketekst}"`);
        }
    }, [søketekst, antallTreff]);

    const onKeyDown = (key: string) => {
        if (key === 'Enter') {
            onEnter();
        }
        if (key === 'ArrowUp' || key === 'Up') {
            onArrowUp();
        }
        if (key === 'ArrowDown' || key === 'Down') {
            onArrowDown();
        }
    };

    return (
        <div className="bedriftsmeny-sokefelt">
            <Input
                autoComplete="off"
                id="bedriftsmeny-sokefelt"
                className="bedriftsmeny-sokefelt__felt"
                type="search"
                label=""
                aria-label={'Søk'}
                aria-haspopup={false}
                value={søketekst}
                onChange={e => setSøketekst(e.target.value)}
                placeholder="Søk"
                role="searchbox"
                onKeyDown={e => {
                    if (erPilNavigasjon(e.key) || e.key === 'Enter') {
                        onKeyDown(e.key);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}
            />
            <Normaltekst
                className={'bedriftsmeny-sokefelt__skjult-aria-live-sokeresultat'}
                aria-live="assertive"
            >
                {ariaTekst}
            </Normaltekst>
            <div className="bedriftsmeny-sokefelt__ikon">
                {søketekst.length === 0 ? <Forstorrelsesglass /> : null}
            </div>
        </div>
    );
};

export default Sokefelt;
