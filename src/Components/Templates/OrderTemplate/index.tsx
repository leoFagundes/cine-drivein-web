import { useEffect, useRef, useState } from 'react';
import Text from '../../Atoms/Text'
import styles from './OrderTemplate.module.scss'
import ItemRepositories from '../../../Services/repositories/ItemRepositories';
import { Item, Order } from '../../../Types/types';
import ItemCard from '../../Organism/ItemCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { LoadingFullScreenTemplate } from '../LoadingFullScreenTemplate';
import ItemModal from '../../Organism/ItemModal';
import OrderModal from '../../Organism/OrderModal';
import Alert from '../../Molecules/Alert';

type OrderTemplateType = {
    label: string
}

const ALL_TYPES_LABEL = 'Tudo'

export default function OrderTemplate({ label }: OrderTemplateType) {
    const [items, setItems] = useState<Item[]>()
    const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
    const [currentMenuType, setCurrentMenuType] = useState(ALL_TYPES_LABEL)
    const [isLoading, setIsLoading] = useState(false)
    const [isItemModalOpen, setIsItemModalOpen] = useState(false)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [itemClicked, setItemClicked] = useState<Item | null>(null)
    const [alertInfo, setAlertInfo] = useState<{ isOpen: boolean, message: string, type: string }>({
        isOpen: false,
        message: "",
        type: ""
    });
    const [order, setOrder] = useState<Order>(() => {
        const storedOrder = localStorage.getItem('order');
        return storedOrder ? JSON.parse(storedOrder) : {
            username: "",
            phone: "",
            spot: 0,
            money_payment: 0,
            credit_payment: 0,
            debit_payment: 0,
            service_fee: 0,
            total_value: 0,
            items: []
        };
    });
    const location = useLocation();
    const navigate = useNavigate();
    const menuTypesRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     setOrder({
    //         username: "",
    //         phone: "",
    //         spot: 0,
    //         money_payment: 0,
    //         credit_payment: 0,
    //         debit_payment: 0,
    //         service_fee: 0,
    //         total_value: 0,
    //         items: []
    //     })
    // }, [])

    const showAlert = (message: string, type: string) => {
        setAlertInfo({
            isOpen: true,
            message: message,
            type: type
        });
    };

    const closeAlert = () => {
        setAlertInfo({
            isOpen: false,
            message: "",
            type: ""
        });
    };

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

    useEffect(() => {
        localStorage.setItem('order', JSON.stringify(order));
        console.log(order)
    }, [order])


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

    useEffect(() => {
        if (currentMenuType && menuTypesRef.current) {
            const currentTypeElement = menuTypesRef.current.querySelector(`.${styles.currentType}`) as HTMLElement | null;
            const menuContainer = menuTypesRef.current;

            if (currentTypeElement) {
                const scrollLeft = currentTypeElement.offsetLeft - (menuContainer.offsetWidth - currentTypeElement.offsetWidth) / 2;
                menuContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentMenuType]);

    const openItemModalWith = (item: Item) => {
        setItemClicked(item)
        setIsItemModalOpen(true)
    }

    const renderItemsByType = (type: string) => {
        return (
            <div className={styles.menuItemsByType} key={type}>
                <Text fontWeight='semibold' fontSize='large'>{type}</Text>
                {items?.filter(item => item.type === type).map((item, index) => (
                    <div key={index} className={styles.item}>
                        <ItemCard onClick={() => openItemModalWith(item)} item={item} />
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
            <div className={styles.menuOrder} onClick={() => setIsOrderModalOpen(true)}>
                <FontAwesomeIcon size='xl' icon={faCartShopping} color='white' />
                <Text fontSize='mediumSmall'>Pedido</Text>
                <div className={`${styles.quantityNotification} ${order.items.length > 0 && styles.isVisible}`}>
                    <Text fontWeight='semibold' fontSize='small'>{order.items.length}</Text>
                </div>
            </div>
            <div className={styles.menuTypes} ref={menuTypesRef}>
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
            <ItemModal setOrder={setOrder} order={order} item={itemClicked ? itemClicked : null} isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} showAlert={showAlert} />
            <OrderModal order={order} isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
            <Alert
                isAlertOpen={alertInfo.isOpen}
                setIsAlertOpen={closeAlert}
                message={alertInfo.message}
                alertDisplayTime={2000}
                onClose={closeAlert}
                type={alertInfo.type}
            />
        </section>
    )
}
