import styles from './FormTemplate.module.scss';
import LogoImage from "../../Atoms/LogoImage";
import Text from "../../Atoms/Text";
import {Input} from "../../Atoms/Input/Input";
import Button from "../../Atoms/Button";

type FormTemplateType = {
    label: string,
    inputs: [{
        placeholder: string;
        onChange: VoidFunction;
        type?: string;
    }]
    buttonLabel: string;
    onClick: VoidFunction;
    linkLabel: string;
}

export const FormTemplate = ({ label, inputs, buttonLabel, onClick, linkLabel }: FormTemplateType) => {
    return (
        <section className={styles.container}>
            <LogoImage/>
            <Text fontSize='extraLarge'>{label}</Text>
            {
                inputs.map((item) => {
                    return <Input placeholder={item.placeholder} onChange={item.onChange} type={item.type} />
                })
            }
            <Button label={buttonLabel} onClick={onClick}/>
            { linkLabel && <Text isLink>{linkLabel}</Text> }
        </section>
    )
}