import styles from './Modal.module.scss';
import {MouseEvent, ReactNode} from "react";

type ModalType = {
    isOpen: boolean;
    onClose: VoidFunction;
    children: ReactNode;
}

export const Modal = ({ children, onClose, isOpen }: ModalType) => {
    const handleCloseModalWith = (event: MouseEvent)  => {
        event.preventDefault();
        event.target === event.currentTarget && onClose();
    }
    return (
        <>
            {
                isOpen && <div onClick={handleCloseModalWith} className={styles.container}>
                    <div className={styles.modalContainer}>
                        { children }
                    </div>
                </div>
            }
        </>
    )

}