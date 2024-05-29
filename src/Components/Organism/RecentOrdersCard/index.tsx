import { useEffect, useState } from "react";
import { Order } from "../../../Types/types";
import Text from "../../Atoms/Text";
import style from "./RecentOrdersCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function RecentOrdersCard() {
  const [recentOrders, setRecentOrders] = useState<Order[]>(() => {
    const storedOrders = localStorage.getItem("StoredOrderList");
    return storedOrders ? JSON.parse(storedOrders) : [];
  });
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    setRecentOrders(() => {
      const storedOrders = localStorage.getItem("StoredOrderList");
      return storedOrders ? JSON.parse(storedOrders) : [];
    });
  }, [isUpdated]);

  const removeRecentOrderCard = (index: number) => {
    const storedOrderList = localStorage.getItem("StoredOrderList");

    if (storedOrderList) {
      const orderList: string[] = JSON.parse(storedOrderList);

      if (index >= 0 && index < orderList.length) {
        orderList.splice(index, 1);

        localStorage.setItem("StoredOrderList", JSON.stringify(orderList));
      }
    }

    setIsUpdated(!isUpdated);
  };

  return (
    <section className={style.container}>
      {recentOrders.length > 0 && (
        <>
          <Text fontWeight="semibold">Últimos Pedidos</Text>
          <div className={style.content}>
            {recentOrders.map((order, index) => (
              <div key={index} className={style.recentOrderCards}>
                <Text fontAlign="left" fontColor="background-secondary-color">
                  <strong>Vaga:</strong> {order.spot}
                </Text>
                <Text fontAlign="left" fontColor="background-secondary-color">
                  <strong>Valor Final:</strong> R${" "}
                  {(order.total_value + order.service_fee).toFixed(2)}
                </Text>
                <FontAwesomeIcon
                  onClick={() => removeRecentOrderCard(index)}
                  className={style.closeIcon}
                  size="lg"
                  color="black"
                  icon={faClose}
                />
              </div>
            ))}
          </div>
          <br />
          <br />
          <br />
        </>
      )}
    </section>
  );
}
