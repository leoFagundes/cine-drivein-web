import styles from './Dropdown.module.scss';
import { ChangeEvent, ReactNode, useState, useEffect } from "react";

type DropdownProps = {
    options: string[];
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    marginTop?: string;
    caption?: ReactNode;
    errorLabel?: string;
    removePlaceholderOption?: boolean;
}

export const Dropdown = ({ options, value, placeholder, onChange, marginTop, caption, errorLabel, removePlaceholderOption }: DropdownProps) => {
    const [currentValue, setCurrentValue] = useState(value);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setCurrentValue(selectedValue);
        onChange(selectedValue);
    };

    const filteredOptions = removePlaceholderOption && currentValue === placeholder ? options : options.filter(option => option !== placeholder);

    const IS_ERROR_INPUT_STYLE = errorLabel ? styles.select__isNegative : styles.select;
    return (
        <div style={{ marginTop }} className={styles.container}>
            <select value={currentValue} onChange={handleChange} className={`${IS_ERROR_INPUT_STYLE}`}>
                {placeholder && <option disabled value="">{placeholder}</option>}
                {filteredOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            {errorLabel && <label className={styles.labelError}>{errorLabel}</label>}
            {caption && <label className={styles.caption}>{caption}</label>}
        </div>
    );
}
