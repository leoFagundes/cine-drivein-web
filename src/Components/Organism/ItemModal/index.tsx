import styles from './ItemModal.module.scss'
import { MouseEvent } from "react";

type ItemModalType = {
    isOpen: boolean;
    onClose: VoidFunction;
}

export default function ItemModal({ onClose, isOpen }: ItemModalType) {
    const handleCloseModalWith = (event: MouseEvent) => {
        event.preventDefault();
        event.target === event.currentTarget && onClose();
    }
    return (
        <>
            {
                isOpen && <div onClick={handleCloseModalWith} className={styles.container}>
                    teste
                </div>
            }
        </>

    )
}
