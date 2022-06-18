import React, { createContext, useContext, useState } from 'react';
import { ISteps } from './types/step';

type Props = {
    stepsDefinition: ISteps;
    children: React.ReactNode;
};

interface StepsContextInterface {
    steps: ISteps;
    setSteps: (step: ISteps) => void;
}

export const StepsContext = createContext<StepsContextInterface>({
    steps: { totalSteps: 0, currentStep: 0, details: [] },
    setSteps: () => void 0,
});

export const StepsProvider: React.FC<Props> = ({ stepsDefinition, children }: Props) => {
    const [steps, setSteps] = useState<ISteps>(stepsDefinition);
    return <StepsContext.Provider value={{ steps, setSteps }}>{children}</StepsContext.Provider>;
};

export const useSteps = () => useContext(StepsContext);
