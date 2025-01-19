export function ProgressSteps({ currentStep, steps }) {
    return (
      <div className="relative mb-8">
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  index <= currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted bg-background'
                }`}
              >
                {index + 1}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  