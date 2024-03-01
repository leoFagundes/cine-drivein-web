import { useEffect, useState } from 'react';
import Text from '../../Atoms/Text'
import styles from './OrderTemplate.module.scss'
import ItemRepositories from '../../../Services/repositories/ItemRepositories';
import { Item, Order } from '../../../Types/types';
import ItemCard from '../../Organism/ItemCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { LoadingFullScreenTemplate } from '../LoadingFullScreenTemplate';

type OrderTemplateType = {
    label: string
}

const ALL_TYPES_LABEL = 'Tudo'

export default function OrderTemplate({ label }: OrderTemplateType) {
    const [items, setItems] = useState<Item[]>()
    const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
    const [currentMenuType, setCurrentMenuType] = useState(ALL_TYPES_LABEL)
    const [isLoading, setIsLoading] = useState(false)
    const [order, setOrder] = useState<Order>({
        username: "",
        phone: "",
        spot: 0,
        money_payment: 0,
        credit_payment: 0,
        debit_payment: 0,
        service_fee: 0,
        total_value: 0,
        items:
            [
                // {
                //     item: {
                //         cod_item: "teste",
                //         name: "teste",
                //         type: "teste",
                //         description: "Delicious Hot Dog with special sauce",
                //         value: 15.0,
                //         quantity: 1,
                //         photo: "https://example.com/hamburguer.jpg",
                //         additionals_sauces: [{ additionalItem: "65a04ba4b6611f7ff12f5393" }]
                //     },
                //     observation: 'Teste'
                // },
            ]
    });
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const name = queryParams.get("name");
        const phone = queryParams.get("phone");
        const spot = queryParams.get("spot");

        if (!name || !phone || !spot) {
            navigate("/", { replace: true });
        } else {
            setOrder(prevOrder => ({
                ...prevOrder,
                username: name,
                phone: phone,
                spot: parseInt(spot)
            }));
        }

    }, [navigate, location.search]);

    console.log(order)

    useEffect(() => {
        const fetchUniqueTypes = async () => {
            setIsLoading(true)
            try {
                const types = await ItemRepositories.getUniqueTypes();
                const items = await ItemRepositories.getItems()
                setUniqueTypes([ALL_TYPES_LABEL, ...types]);
                setItems(items)
                setIsLoading(false)
            } catch (error) {
                console.error("Erro ao obter itens:", error);
                setIsLoading(false)
            }
        };

        fetchUniqueTypes();
    }, []);

    const renderItemsByType = (type: string) => {
        return (
            <div className={styles.menuItemsByType} key={type}>
                <Text fontWeight='semibold' fontSize='large'>{type}</Text>
                {items?.filter(item => item.type === type).map((item, index) => (
                    <div key={index} className={styles.item}>
                        <ItemCard onClick={() => console.log(item.name)} item={item} />
                    </div>
                ))}
            </div>
        );
    };

    if (isLoading) return <LoadingFullScreenTemplate />

    return (
        <section className={styles.container}>
            <Text
                marginTop='32px'
                fontSize='extraLarge'
                fontWeight='semibold'
            >
                {label}
            </Text>
            <div className={styles.menuOrder}>
                <FontAwesomeIcon size='xl' icon={faCartShopping} color='white' />
                <Text fontSize='mediumSmall'>Pedido</Text>
                <div className={`${styles.quantityNotification} ${order.items.length > 0 && styles.isVisible}`}>
                    <Text fontWeight='semibold' fontSize='small'>{order.items.length}</Text>
                </div>
            </div>
            <div className={styles.menuTypes}>
                {uniqueTypes.map(type => (
                    <div
                        key={type}
                        className={`${styles.type} ${type === currentMenuType && styles.currentType}`}
                        onClick={() => setCurrentMenuType(type)}
                    >
                        <Text>{type}</Text>
                    </div>
                ))}
            </div>
            <div className={styles.menuItems}>
                {currentMenuType === ALL_TYPES_LABEL && uniqueTypes.map((type, index) => {
                    if (index === 0) return null;
                    return renderItemsByType(type);
                })}
                {currentMenuType !== ALL_TYPES_LABEL && renderItemsByType(currentMenuType)}
            </div>
        </section>
    )
}
