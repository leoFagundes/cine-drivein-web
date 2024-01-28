import styles from './FormTemplate.module.scss';
import LogoImage from "../../Atoms/LogoImage";
import Text from "../../Atoms/Text";
import { Input } from "../../Atoms/Input/Input";
import Button from "../../Atoms/Button";
import { ChangeEvent } from 'react';

type FormTemplateType = {
    label: string,
    inputs: Array<{
        value: string;
        placeholder: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        type?: string;
        errorLabel: string;
    }>;
    buttonLabel: string;
    buttonOnClick: VoidFunction;
    linkLabel: string;
    linkIcon: React.ReactNode;
    linkOnClick: VoidFunction;

}

export const FormTemplate = ({ label, inputs, buttonLabel, buttonOnClick, linkLabel, linkIcon, linkOnClick }: FormTemplateType) => {
    const getInputMargin = (index: number, errorLabel: string) => {
        if(index === 0) return ''
        if(errorLabel) return '12px'
        return '24px'
    }
    return (
        <section className={styles.container}>
            <LogoImage />
            <Text fontSize='extraLarge'>{label}</Text>
            <div className={styles.inputs}>
                {
                    inputs.map((item, index) => {
                        return <Input
                            key={item.placeholder}
                            value={item.value}
                            placeholder={item.placeholder}
                            onChange={item.onChange}
                            type={item.type}
                            errorLabel={item.errorLabel}
                            marginTop={getInputMargin(index, item.errorLabel)}
                        />
                    })
                }
            </div>
            <Button label={buttonLabel} onClick={buttonOnClick} />
            <div className={styles.linkContainer} onClick={linkOnClick}>
                {linkIcon && linkIcon}
                {linkLabel && <Text isLink>{linkLabel}</Text>}
            </div>
        </section>
    )
}