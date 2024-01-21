import style from './TextPattern.module.scss'

type Props = {
    children: string
    isLink?: boolean
}

export default function TextPattern({ children, isLink = false }: Props) {
    return (
        <p className={`${style.mainText} ${isLink ? style.isLink : ''}`}>{children}</p>
    )
}
