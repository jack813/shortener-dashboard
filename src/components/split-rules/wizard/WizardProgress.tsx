"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const t = useTranslations("Links.wizard");

  const allSteps = [
    { key: "step1Title", label: t("step1Title") },
    { key: "step2Title", label: t("step2Title") },
    { key: "step3Title", label: t("step3Title") },
  ];

  const steps = allSteps.slice(0, totalSteps);

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                ${isActive ? "bg-blue-600 text-white" : ""}
                ${isCompleted ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""}
                ${!isActive && !isCompleted ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" : ""}
              `}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{stepNum}</span>
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}