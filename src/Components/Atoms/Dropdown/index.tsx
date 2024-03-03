import styles from './Dropdown.module.scss';
import { ChangeEvent, ReactNode } from "react";

type DropdownProps = {
    options: string[];
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    marginTop?: string;
    caption?: ReactNode;
    errorLabel?: string;
}

export const Dropdown = ({ options, value, placeholder, onChange, marginTop, caption, errorLabel }: DropdownProps) => {
    const IS_ERROR_INPUT_STYLE = errorLabel ? styles.select__isNegative : styles.select;
    return (
        <div style={{ marginTop }} className={styles.container}>
            <select value={value} onChange={(e) => onChange(e.target.value)} className={`${IS_ERROR_INPUT_STYLE}`}>
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            {errorLabel && <label className={styles.labelError}>{errorLabel}</label>}
            {caption && <label className={styles.caption}>{caption}</label>}
        </div>
    );
}