import React from 'react';

interface StatusProps {
    step: string;
    status: string;
    message: string;
}

export const StatusIndicator: React.FC<StatusProps> = ({ step, status, message }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'start': return 'text-blue-500';
            case 'success': return 'text-green-500';
            case 'error': return 'text-red-500';
            case 'info': return 'text-yellow-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${getStatusColor()}`}>
                {step.charAt(0).toUpperCase() + step.slice(1)}:
            </span>
            <span>{message}</span>
        </div>
    );
};
