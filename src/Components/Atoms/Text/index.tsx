import style from './Text.module.scss'

type Props = {
    children: string
    isLink?: boolean
}

export default function Text({ children, isLink = false }: Props) {
    return (
        <p className={`${style.mainText} ${isLink ? style.isLink : ''}`}>
            {children}
        </p>
    )
}
