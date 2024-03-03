import { useEffect } from 'react';
import styles from './OrderModal.module.scss'
import { Order } from '../../../Types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

type OrderModalType = {
    order: Order | null;
    isOpen: boolean;
    onClose: VoidFunction;
}

export default function OrderModal({ order, onClose, isOpen }: OrderModalType) {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [isOpen]);

    return (
        <>
            {
                isOpen && order &&
                <div className={styles.container}>
                    <FontAwesomeIcon onClick={onClose} size='2xl' className={styles.closeModal} icon={faArrowLeft} />
                    {order.username}
                </div>
            }
        </>

    )
}
