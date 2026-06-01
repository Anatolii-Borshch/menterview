import { REGISTER_STEPS } from './RegisterConstants';
import { getStepDotClassName } from './RegisterHelpers';
import type { RegisterStep } from './RegisterHelpers';

interface RegisterHeaderProps {
  step: RegisterStep;
  title: string;
  subtitle: string;
}

export const RegisterHeader = ({ step, title, subtitle }: RegisterHeaderProps) => {
  const currentStepIndex = REGISTER_STEPS.indexOf(step);

  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
        {title}
      </h1>
      <p className="mt-2 text-sm text-navy/50">{subtitle}</p>
      <div className="mt-4 flex items-center justify-center gap-2">
        {REGISTER_STEPS.map((currentStep, index) => {
          const dotClassName = getStepDotClassName(currentStep === step, index < currentStepIndex);
          return <div key={currentStep} className={`h-1.5 rounded-full transition-all ${dotClassName}`} />;
        })}
      </div>
    </div>
  );
};
