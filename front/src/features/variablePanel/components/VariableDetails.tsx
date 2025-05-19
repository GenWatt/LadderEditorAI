import type { IVariable } from '../../../shared/editor/types'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import useVariableDetails from '../viewModels/useVariableDetails.hook'

export interface VariableDetailsProps {
    variableDetails: IVariable
}

function VariableDetails({ variableDetails }: VariableDetailsProps) {
    const { initialValue, setEditingVariable, setSelectedVariable, value } = useVariableDetails({ variableDetails })

    return (
        <div className="border-t p-3 bg-muted/30">
            <div className='flex items-center justify-between'>
                <h3 className="font-medium mb-2">Variable Details</h3>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedVariable(null)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
                <div className="text-muted-foreground">Name:</div>
                <div>{variableDetails.name}</div>

                <div className="text-muted-foreground">Type:</div>
                <div>{variableDetails.type}</div>

                <div className="text-muted-foreground">Address:</div>
                <div>{variableDetails.address}</div>

                <div className="text-muted-foreground">Initial Value:</div>
                <div>{initialValue}</div>

                <div className="text-muted-foreground">Value:</div>
                <div>{value}</div>

                {variableDetails.description && (
                    <>
                        <div className="text-muted-foreground">Description:</div>
                        <div>{variableDetails.description}</div>
                    </>
                )}
            </div>
            <div className="mt-2 flex justify-end">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingVariable(variableDetails.id)}
                >
                    Edit
                </Button>
            </div>
        </div>
    )
}

export default VariableDetails