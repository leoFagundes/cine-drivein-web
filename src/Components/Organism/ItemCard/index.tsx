import { Item } from "../../../Types/types";
import styles from "./ItemCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import Text from "../../Atoms/Text";

type ItemCardType = {
  item: Item;
  onClick: VoidFunction;
};

export default function ItemCard({ item, onClick }: ItemCardType) {
  const truncateDescription = (description: string) => {
    const charLimitDescription = 20;
    if (description.length > charLimitDescription) {
      return `${description.substring(0, charLimitDescription)}...`;
    }
    return description;
  };

  return (
    <div onClick={onClick} className={styles.container}>
      <div className={styles.itemImage}>
        {item.photo ? (
          <div style={{ backgroundImage: `url("${item.photo}")` }} />
        ) : (
          <FontAwesomeIcon size="2x" icon={faImages} color="black" />
        )}
      </div>
      <div className={styles.itemInfo}>
        <Text fontWeight="semibold" fontSize="medium">
          {item.name}
        </Text>
        <Text fontWeight="regular" fontSize="mediumSmall">
          {truncateDescription(item.description)}
        </Text>
        <span>
          <Text fontWeight="semibold" fontSize="medium">
            Valor:
          </Text>
          <Text fontWeight="regular" fontSize="medium">
            R$ {item.value.toFixed(2)}
          </Text>
        </span>
      </div>
    </div>
  );
}
