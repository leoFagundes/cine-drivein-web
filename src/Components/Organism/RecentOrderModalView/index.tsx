import { MouseEvent } from "react";
import styles from "./RecentOrderModalView.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { OrderWithTime } from "../../../Types/types";
import OrderCard from "../ViewOrderCard";

type ModalType = {
  isOpen: boolean;
  order: OrderWithTime | undefined;
  onClose: VoidFunction;
};

export default function RecentOrderModalView({
  onClose,
  isOpen,
  order,
}: ModalType) {
  const handleCloseModalWith = (event: MouseEvent) => {
    event.preventDefault();
    event.target === event.currentTarget && onClose();
  };

  return (
    <>
      {isOpen && order && (
        <div onClick={handleCloseModalWith} className={styles.container}>
          <div className={styles.modalContainer}>
            <OrderCard order={order} />
          </div>
          <FontAwesomeIcon
            data-testid="close-icon"
            onClick={onClose}
            className={styles.closeModalIcon}
            size="lg"
            icon={faXmark}
          />
        </div>
      )}
    </>
  );
}
