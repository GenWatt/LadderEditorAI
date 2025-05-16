import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

export interface StepStatusIconProps {
    status: 'loading' | 'complete' | 'error' | 'info';
}

function StepStatusIcon({ status }: StepStatusIconProps) {
    return (
        <>
            {
                status === 'complete' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : status === 'error' ? (
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                ) : status === 'info' ? (
                    <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                ) : (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin flex-shrink-0" />
                )
            }
        </>
    )
}

export default StepStatusIcon