import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSteps } from './StepsProvider';
import { BodyShort } from '@navikt/ds-react';
import './StepIndicator.less';
import { ISteps } from './types/step';
import check from './assets/icons/check.svg';

export const StepIndicator = () => {
    const { pathname } = useLocation();
    const { steps, setSteps } = useSteps();

    useEffect(() => {
        const updateSteps = (newCurrentStep: number, currentSteps: ISteps) => {
            if (newCurrentStep === currentSteps.currentStep) {
                return;
            }
            const newSteps = { ...currentSteps, currentStep: newCurrentStep };
            if (newCurrentStep > currentSteps.currentStep) {
                for (let i = 0; i < newSteps.currentStep - 1; i++) {
                    newSteps.details[i].done = true;
                    newSteps.details[i].active = false;
                }
                newSteps.details[newSteps.currentStep - 1].active = true;
            } else {
                const newSteps = { ...currentSteps, currentStep: newCurrentStep };
                for (let i = newSteps.details.length; i >= newSteps.currentStep; i--) {
                    // newSteps.details[i - 1].done = false;
                    newSteps.details[i - 1].active = false;
                }
                newSteps.details[newSteps.currentStep - 1].active = true;
            }
            setSteps(newSteps);
        };

        if (steps?.details) {
            const index = steps.details.findIndex(page => page.pathmatch === pathname);
            updateSteps(index + 1, steps);
        }
    }, [pathname]);

    return (
        <div className="Stepcontainer no-print">
            <section className="step-indicator">
                {steps?.details.map((step, index) => (
                    <div key={index + 1}>
                        <div
                            key={index + 1}
                            className={`step step${index + 1} ${step.active ? 'active' : ''} ${
                                step.done ? 'done' : ''
                            }`}
                        >
                            <div
                                className={`step-icon ${step.active ? 'active' : ''} ${
                                    step.done ? 'done' : ''
                                }`}
                            >
                                {step.done ? <img alt="sjekkmerke" src={check} /> : index + 1}
                            </div>
                            <BodyShort
                                className={`${step.active ? 'active' : ''} ${
                                    step.done ? 'done' : ''
                                }`}
                            >
                                {step.text}
                            </BodyShort>
                        </div>
                        {steps.details.length > index + 1 && (
                            <div
                                className={`indicator-line ${step.active ? 'active' : ''} ${
                                    step.done ? 'done' : ''
                                }`}
                            />
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};
