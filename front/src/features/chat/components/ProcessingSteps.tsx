import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Step from './steps/Step';
import useProcessingSteps from "../viewModels/useProcessingSteps.hook";

interface ProcessingStepsProps {
    content: string;
}

export function ProcessingSteps({ content }: ProcessingStepsProps) {
    const { steps, latestStep, stepClassName, stepTitle } = useProcessingSteps({ content });

    if (steps.length === 0) return null;

    return (
        <div className="mb-4 border rounded-md p-3 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Processing Status</h3>

                <span className={`text-xs px-2 py-0.5 rounded-full ${stepClassName}`}>
                    {stepTitle}
                </span>
            </div>

            <div className="pb-2">
                <Step step={latestStep} />
            </div>

            {steps.length > 1 && (
                <Accordion type="single" collapsible className="border-t pt-2">
                    <AccordionItem value="steps" className="border-none">
                        <AccordionTrigger className="py-1 text-xs">
                            Show all processing steps
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-3">
                            {steps.map((step, index) => (
                                <div key={index}>
                                    <Step step={step} />
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    );
}