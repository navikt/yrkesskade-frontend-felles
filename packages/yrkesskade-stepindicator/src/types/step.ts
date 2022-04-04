export interface ISteps {
    totalSteps: number;
    currentStep: number;
    details: { text: string; done: boolean; active: boolean; pathmatch: string }[];
}
