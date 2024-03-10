import { ReactNode, useEffect, useState } from "react";
import styles from "./FloatingButton.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Text from "../Text";

type FloatinButtonType = {
  scrollUp?: boolean;
  icon?: ReactNode;
  label?: string;
  onClick?: VoidFunction;
};

export default function FloatingButton({
  scrollUp = false,
  icon,
  label,
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
        <div onClick={onClick}>
          <div className={styles.icon}>{icon}</div>
          <Text>{label}</Text>
        </div>
      )}
      {scrollUp && (
        <div onClick={scrollToTop}>
          <div className={styles.icon}>
            <FontAwesomeIcon size="xl" icon={faArrowUp} color="white" />
          </div>
          <Text>Voltar ao topo</Text>
        </div>
      )}
    </div>
  );
}
