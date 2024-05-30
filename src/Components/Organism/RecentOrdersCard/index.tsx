import { useEffect, useState } from "react";
import { OrderWithTime } from "../../../Types/types";
import Text from "../../Atoms/Text";
import style from "./RecentOrdersCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import RecentOrderModalView from "../RecentOrderModalView";

export default function RecentOrdersCard() {
  const [recentOrders, setRecentOrders] = useState<OrderWithTime[]>(() => {
    const storedOrders = localStorage.getItem("StoredOrderList");
    return storedOrders ? JSON.parse(storedOrders) : [];
  });
  const [isUpdated, setIsUpdated] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(true);
  const [currentClickedItem, setCurrentClickedItem] = useState<OrderWithTime>();

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
          <Text fontWeight="semibold" fontSize="mediumLarge">
            Últimos Pedidos
          </Text>
          <div className={style.content}>
            {recentOrders.reverse().map((order, index) => (
              <div key={index} className={style.recentOrderCards}>
                <Text
                  fontSize="mediumSmall"
                  fontAlign="left"
                  fontColor="background-secondary-color"
                >
                  <strong>Vaga:</strong> {order.spot}
                </Text>
                <Text
                  fontSize="mediumSmall"
                  fontAlign="left"
                  fontColor="background-secondary-color"
                >
                  <strong>Valor Final:</strong> R${" "}
                  {(order.total_value + order.service_fee).toFixed(2)}
                </Text>
                <Text
                  fontSize="small"
                  fontAlign="left"
                  fontColor="placeholder-color"
                >
                  <i>{order.createdAt}</i>
                </Text>
                <div className={style.icons}>
                  <FontAwesomeIcon
                    onClick={() => {
                      setIsOrderModalOpen(true);
                      setCurrentClickedItem(recentOrders[index]);
                    }}
                    className={style.openOrderIcon}
                    size="sm"
                    color="black"
                    icon={faArrowUpRightFromSquare}
                  />
                  <FontAwesomeIcon
                    onClick={() => removeRecentOrderCard(index)}
                    className={style.closeIcon}
                    size="lg"
                    color="black"
                    icon={faClose}
                  />
                </div>
              </div>
            ))}
          </div>
          <br />
          <br />
          <br />
        </>
      )}
      <RecentOrderModalView
        isOpen={isOrderModalOpen}
        order={currentClickedItem}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </section>
  );
}
