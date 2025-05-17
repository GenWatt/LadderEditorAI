import useParser from '@/features/shared/hooks/useParser'
import { useMemo } from 'react'
import { useVariableStore } from '../../stores/variableStore'
import type { IVariable } from '../../types/variableTypes'

export interface VariableDetailsPropsHook {
    variableDetails: IVariable
}

function useVariableDetails({ variableDetails }: VariableDetailsPropsHook) {
    const { setEditingVariable, setSelectedVariable } = useVariableStore()
    const { getValueString } = useParser()

    const initialValue = useMemo(() => {
        return getValueString(variableDetails.initial)
    }, [variableDetails.initial, getValueString])

    const value = useMemo(() => {
        return getValueString(variableDetails.value)
    }, [variableDetails.value, getValueString])


    return {
        initialValue,
        value,
        setEditingVariable,
        setSelectedVariable,
    }
}

export default useVariableDetails