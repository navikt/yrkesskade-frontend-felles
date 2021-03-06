// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import { Person } from './types/person';
import { LinkPanel } from '@navikt/ds-react';
import '@navikt/ds-css';
import './Personvelger.less';
import { PersonIkon } from './components/PersonIkon/PersonIkon';

interface Props {
    personer: Person[];
    onPersonChange: (person: Person) => void;
}
export const Personvelger = (props: Props) => {
    const { personer, onPersonChange } = props;
    const [valgtPerson, setValgtPerson] = useState<Person | undefined>();

    useEffect(() => {
        if (valgtPerson) {
            onPersonChange(valgtPerson);
        }
    }, [valgtPerson]);

    const handleClick = (person: Person) => {
        setValgtPerson(person);
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handleKeyPress = () => {};

    return (
        <div>
            {personer &&
                personer.map((person, index) => (
                    <LinkPanel
                        className="person-link-panel"
                        onClick={_e => handleClick(person)}
                        onKeyPress={handleKeyPress}
                        key={index}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridAutoFlow: 'column',
                                gap: 'var(--navds-spacing-8)',
                                alignItems: 'center',
                            }}
                        >
                            <PersonIkon type={person.type} />
                            <div>
                                <LinkPanel.Title className="navn">{person.navn}</LinkPanel.Title>
                                <LinkPanel.Description className="beskrivelse">
                                    {person.beskrivelse}
                                </LinkPanel.Description>
                            </div>
                        </div>
                    </LinkPanel>
                ))}
        </div>
    );
};
