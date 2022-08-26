import React from 'react';
import { Breveditor } from './src';

export default {
    title: 'Komponenter/Breveditor',
    component: Breveditor,
};

export const YrkesskadeBreveditor: React.FC = () => {
    const outsideboxStyle = {
        padding: '10px',
        height: '90vh',
        width: '90vw',
    };
    return (
        <div style={outsideboxStyle}>
            <Breveditor />
        </div>
    );
};
