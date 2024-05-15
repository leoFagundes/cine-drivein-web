import { ReactNode, useEffect, useState } from "react";
import styles from "./FloatingButton.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Text from "../Text";

type FloatinButtonType = {
  scrollUp?: boolean;
  icon?: ReactNode;
  label?: string;
  quantity?: number;
  onClick?: VoidFunction;
};

export default function FloatingButton({
  scrollUp = false,
  icon,
  label,
  quantity,
  onClick,
}: FloatinButtonType) {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;

    if (scrollTop > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className={`${styles.container} ${!isVisible ? styles.isInvisible : ""}`}
    >
      {label && icon && onClick && (
        <div className={styles.boxContent} onClick={onClick}>
          <div className={styles.icon}>
            {icon}
            {quantity !== undefined && (
              <div
                className={`${styles.quantityNotification} ${
                  quantity > 0 && styles.isVisible
                }`}
              >
                <Text fontWeight="semibold" fontSize="extraSmall">
                  {quantity}
                </Text>
              </div>
            )}
          </div>
          <Text>{label}</Text>
        </div>
      )}
      {scrollUp && (
        <div className={styles.boxContent} onClick={scrollToTop}>
          <div className={styles.icon}>
            <FontAwesomeIcon size="lg" icon={faArrowUp} color="white" />
          </div>
          <Text>Voltar ao topo</Text>
        </div>
      )}
    </div>
  );
}
