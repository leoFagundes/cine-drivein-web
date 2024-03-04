import ScrollUp from '../../Components/Atoms/ScrollUp'
import OrderTemplate from '../../Components/Templates/OrderTemplate'
import styles from './Order.module.scss'

export default function Order() {
    return (
        <section className={styles.container}>
            <OrderTemplate
                label='Cardápio'
            />
            <ScrollUp />
        </section>
    )
}
