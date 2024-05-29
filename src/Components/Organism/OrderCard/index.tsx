import { ItemInOrder, Order } from "../../../Types/types";
import Text from "../../Atoms/Text";
import styles from "./OrderCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

type OrderCardType = {
  order: Order;
};

type GroupedOrderItem = {
  item: ItemInOrder["item"];
  quantity: number;
  totalValue: number;
  observations: string[];
  additional: string;
  additional_sauce: string;
  additional_drink: string;
  additional_sweet: string;
};

type GroupedItems = {
  [key: string]: {
    quantity: number;
    totalValue: number;
    observations: string[];
    additional: string;
    additional_sauce: string;
    additional_drink: string;
    additional_sweet: string;
  };
};

export default function OrderCard({ order }: OrderCardType) {
  const groupOrderItems = (orderItems: ItemInOrder[]): GroupedOrderItem[] => {
    const groupedItems: GroupedItems = {};

    orderItems.forEach((orderItem) => {
      const key = JSON.stringify({
        ...orderItem.item,
        observation: orderItem.observation,
        additional: orderItem.additional,
        additional_sauce: orderItem.additional_sauce,
        additional_drink: orderItem.additional_drink,
        additional_sweet: orderItem.additional_sweet,
      });
      if (groupedItems[key]) {
        groupedItems[key].quantity++;
        groupedItems[key].totalValue += orderItem.item.value;
        if (
          orderItem.observation &&
          !groupedItems[key].observations.includes(orderItem.observation)
        ) {
          groupedItems[key].observations.push(orderItem.observation);
        }
      } else {
        groupedItems[key] = {
          quantity: 1,
          totalValue: orderItem.item.value,
          observations: orderItem.observation ? [orderItem.observation] : [],
          additional: orderItem.additional ? orderItem.additional : "",
          additional_sauce: orderItem.additional_sauce
            ? orderItem.additional_sauce
            : "",
          additional_drink: orderItem.additional_drink
            ? orderItem.additional_drink
            : "",
          additional_sweet: orderItem.additional_sweet
            ? orderItem.additional_sweet
            : "",
        };
      }
    });

    return Object.entries(groupedItems).map(([key, value]) => ({
      item: JSON.parse(key),
      quantity: value.quantity,
      totalValue: value.totalValue,
      observations: value.observations,
      additional: value.additional,
      additional_sauce: value.additional_sauce,
      additional_drink: value.additional_drink,
      additional_sweet: value.additional_sweet,
    }));
  };

  const renderOrderItems = (groupedOrderItems: GroupedOrderItem[]) => {
    return (
      <div className={styles.orderItems}>
        {groupedOrderItems.map((groupedOrderItem, index) => (
          <div key={index} className={styles.orderItem}>
            <div className={styles.itemHeader}>
              <div className={styles.itemImage}>
                {groupedOrderItem.item.photo ? (
                  <div
                    style={{
                      backgroundImage: `url("${groupedOrderItem.item.photo}")`,
                    }}
                  />
                ) : (
                  <FontAwesomeIcon size="xl" icon={faImages} color="black" />
                )}
              </div>
              <Text
                fontWeight="semibold"
                fontSize="mediumSmall"
                fontColor="background-secondary-color"
                fontAlign="left"
              >
                {groupedOrderItem.quantity}x {groupedOrderItem.item.name}
              </Text>
            </div>
            <div className={styles.itemInfo}>
              {groupedOrderItem.observations.map((observation, index) => (
                <Text
                  key={index}
                  fontWeight="medium"
                  fontSize="mediumSmall"
                  fontColor="background-secondary-color"
                  fontAlign="left"
                >
                  <strong>Observação:</strong> {observation}
                </Text>
              ))}
              {groupedOrderItem.additional && (
                <Text
                  fontWeight="medium"
                  fontSize="mediumSmall"
                  fontColor="background-secondary-color"
                >
                  <strong>Adicional:</strong> {groupedOrderItem.additional}
                </Text>
              )}
              {groupedOrderItem.additional_sauce && (
                <Text
                  fontWeight="medium"
                  fontSize="mediumSmall"
                  fontColor="background-secondary-color"
                >
                  <strong>Molho:</strong> {groupedOrderItem.additional_sauce}
                </Text>
              )}
              {groupedOrderItem.additional_drink && (
                <Text
                  fontWeight="medium"
                  fontSize="mediumSmall"
                  fontColor="background-secondary-color"
                >
                  <strong>Bebida:</strong> {groupedOrderItem.additional_drink}
                </Text>
              )}
              {groupedOrderItem.additional_sweet && (
                <Text
                  fontWeight="medium"
                  fontSize="mediumSmall"
                  fontColor="background-secondary-color"
                >
                  <strong>Doce:</strong> {groupedOrderItem.additional_sweet}
                </Text>
              )}
              <Text
                fontWeight="medium"
                fontSize="mediumSmall"
                fontColor="background-secondary-color"
              >
                <strong>Valor:</strong> R${" "}
                {groupedOrderItem.totalValue.toFixed(2)}
              </Text>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.orderContent}`}>
        <div className={styles.orderInfo}>
          <Text
            fontSize="mediumLarge"
            fontWeight="semibold"
            fontColor="background-secondary-color"
          >
            Vaga {order.spot}
          </Text>
          <Text fontSize="mediumSmall" fontColor="background-secondary-color">
            <strong>Nome:</strong> {order.username}
          </Text>
          <Text fontSize="mediumSmall" fontColor="background-secondary-color">
            <strong>Telefone:</strong> {order.phone}
          </Text>
        </div>
        <div className={styles.line} />
        {order.items && renderOrderItems(groupOrderItems(order.items))}
        <div className={styles.line} />
        <div className={styles.orderValue}>
          <Text fontSize="mediumSmall" fontColor="background-secondary-color">
            <strong>Valor:</strong> R$ {order.total_value.toFixed(2)}
          </Text>
          <Text fontSize="mediumSmall" fontColor="background-secondary-color">
            <strong>Taxa de serviço:</strong> R$ {order.service_fee.toFixed(2)}
          </Text>
          <Text fontSize="mediumSmall" fontColor="background-secondary-color">
            <strong>Valor total:</strong> R${" "}
            {(order.total_value + order.service_fee).toFixed(2)}
          </Text>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}
