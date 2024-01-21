import style from './ButtonPattern.module.scss'

type Props = {
    type: "button" | "submit" | "reset" | undefined;
    onClick?: () => void;
    mainText?: string;
};

export default function ButtonPattern({ type, onClick, mainText }: Props) {
    return (
        <button type={type} className={style.button} onClick={onClick}>
            {mainText}
        </button>
    )
}
