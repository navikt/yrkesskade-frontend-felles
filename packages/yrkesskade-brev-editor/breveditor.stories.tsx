import React from 'react';
import { Breveditor } from './src';

import { tannlegeerklæring } from './brev-tester/tannlegeerklæring';

const meldingEnum = {
    tannlegeerklæring: tannlegeerklæring,
};

const onBrevChanged = brev => {
    console.log(brev);
};

export default {
    title: 'Komponenter/Breveditor',
    component: Breveditor,
    decorators: [
        Story => (
            <div style={{ padding: '10px', height: '90vh', width: '90vw' }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        mal: {
            options: meldingEnum,
            control: { type: 'select' },
            defaultValue: tannlegeerklæring,
        },
    },
};

const Template = ({ mal, onBrevChanged }) => {
    return <Breveditor mal={mal} onBrevChanged={onBrevChanged} />;
};

export const YrkesskadeBreveditor = Template.bind({});
YrkesskadeBreveditor.args = {
    onBrevChanged: onBrevChanged,
};
