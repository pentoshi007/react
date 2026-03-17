import { useState } from 'react';
export function useInput(defaultValue, validationFunction) {
    const [enteredValue, setEnteredValue] = useState(defaultValue);
    const [didEdit, setDidEdit] = useState(false);
    const valueIsValid = validationFunction(enteredValue);
    const hasError = !valueIsValid && didEdit;
    function handleInputChange(event) {
        setEnteredValue(event.target.value);
        setDidEdit(false);
    }

    function handleInputBlur() {
        setDidEdit(true);
    }

    return {
        value: enteredValue,
        handleInputChange,
        handleInputBlur,
        hasError
    }
}