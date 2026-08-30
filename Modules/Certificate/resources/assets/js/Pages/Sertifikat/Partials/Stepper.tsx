import React from 'react';
import { DEFAULT_STEPS, StepItem } from '../../../sertificate';

interface StepperProps {
    currentStep: number;
    onStepClick?: (stepId: number) => void;
    steps?: StepItem[];
}

export function Stepper({ currentStep, onStepClick, steps = DEFAULT_STEPS }: StepperProps) {
    return (
        <div className="stepper">
            {steps.map((step, index) => {
                const isDone = step.id < currentStep;
                const isCurrent = step.id === currentStep;

                return (
                    <React.Fragment key={step.id}>
                        <div
                            className={`step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                            onClick={() => onStepClick && onStepClick(step.id)}
                            style={{ cursor: onStepClick ? 'pointer' : 'default' }}
                        >
                            <span className="num">
                                {isDone ? <i className="bi bi-check-lg"></i> : step.id}
                            </span>
                            <span className="txt">{step.title}</span>
                        </div>

                        {index < steps.length - 1 && <div className="step-line"></div>}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
