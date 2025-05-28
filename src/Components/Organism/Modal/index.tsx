import styles from "./Modal.module.scss";
import { MouseEvent, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type ModalType = {
  isOpen: boolean;
  onClose: VoidFunction;
  children: ReactNode;
  patternCloseMethods?: boolean;
};

export const Modal = ({
  children,
  onClose,
  isOpen,
  patternCloseMethods = false,
}: ModalType) => {
  const handleCloseModalWith = (event: MouseEvent) => {
    if (patternCloseMethods) return;

    event.preventDefault();
    event.target === event.currentTarget && onClose();
  };
  return (
    <>
      {isOpen && (
        <div
          data-testid="container"
          onClick={handleCloseModalWith}
          className={styles.container}
        >
          <div className={styles.modalContainer}>
            {!patternCloseMethods && (
              <FontAwesomeIcon
                onClick={onClose}
                className={styles.closeModalIcon}
                size="lg"
                icon={faXmark}
              />
            )}
            {children}
          </div>
        </div>
      )}
    </>
  );
};
