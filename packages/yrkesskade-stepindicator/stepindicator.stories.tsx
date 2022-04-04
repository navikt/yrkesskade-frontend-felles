import React from 'react';
import { MemoryRouter, Link, Route, Routes } from 'react-router-dom';
import { StepIndicator, StepsProvider } from './src';

export default {
    title: 'Komponenter/StepIndicator',
    component: StepIndicator,
};

export const YrkesskadeStepIndicator: React.FC = () => {
    const steps = {
        totalSteps: 2,
        currentStep: 1,
        details: [
            {
                text: 'Side A',
                done: false,
                active: true,
                pathmatch: '/pageA',
            },
            {
                text: 'Side B',
                done: false,
                active: false,
                pathmatch: '/pageB',
            },
        ],
    };
    return (
        <MemoryRouter initialEntries={['/pageA']}>
            <StepsProvider stepsDefinition={steps}>
                <Routes>
                    <Route path="pageA" element={<PageA />} />
                    <Route path="pageB" element={<PageB />} />
                </Routes>
            </StepsProvider>
        </MemoryRouter>
    );
};

const PageA = () => {
    return (
        <div>
            <h3>Page A</h3>
            <div>
                <Link to="/pageB">Forward to Page B</Link>
            </div>
            <div>
                <StepIndicator />
            </div>
        </div>
    );
};

const PageB = () => {
    return (
        <div>
            <h3>Page B</h3>
            <div>
                <Link to="/pageA">Back to Page A</Link>
            </div>
            <div>
                <StepIndicator />
            </div>
        </div>
    );
};
