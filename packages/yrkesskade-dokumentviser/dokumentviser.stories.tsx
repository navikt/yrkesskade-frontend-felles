import React, { useState } from 'react';
import { Dokumentviser } from './src';

export default {
    title: 'Komponenter/Dokumentviser',
    component: Dokumentviser,
};

const URL = 'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf';

export const YrkesskadeDokumentviser: React.FC = () => {
    return (
        <div className="container">
            <Dokumentviser url={URL} tittel="Dette er ett test dokument" />
        </div>
    );
};
