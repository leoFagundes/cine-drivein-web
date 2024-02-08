import style from './Button.module.scss'

type Props = {
    onClick: () => void;
    label: string;
    marginTop?: string;
};

export default function Button({ onClick, label, marginTop }: Props) {
    return (
        <button style={{marginTop}} className={style.button} onClick={onClick}>
            {label}
        </button>
    )
}
