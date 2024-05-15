import { useEffect } from "react";
import styles from "./OrderModal.module.scss";
import { ItemInOrder, Order } from "../../../Types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faCircleExclamation,
  faImages,
  faLeftLong,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Text from "../../Atoms/Text";
import Caption from "../../Molecules/Caption";
import Button from "../../Atoms/Button";
import OrderRepositories from "../../../Services/repositories/OrderRepositories";
import { useNavigate } from "react-router-dom";

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

type ItemToRemove = {
  observation: string;
  name: string;
  additional: string;
  additional_sauce: string;
  additional_drink: string;
  additional_sweet: string;
};

type OrderModalType = {
  order: Order | null;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  isOpen: boolean;
  onClose: VoidFunction;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showAlert: (message: string, type: string) => void;
};

export default function OrderModal({
  order,
  setOrder,
  onClose,
  isOpen,
  setIsLoading,
  showAlert,
}: OrderModalType) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      window.history.pushState({ modalOpen: true }, "");
    } else {
      document.body.classList.remove("modal-open");
    }

    const handlePopstate = (event: PopStateEvent) => {
      if (event.state) {
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => window.removeEventListener("popstate", handlePopstate);
  }, [isOpen, onClose]);

  const openWhatsApp = () => {
    const phoneNumber = "5561999619114";
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

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

  function removeItemFromOrder(
    order: Order | null,
    itemToRemove: ItemToRemove
  ) {
    if (order) {
      let itemRemoved = false;

      const updatedItems = order.items.filter((item) => {
        if (
          !itemRemoved &&
          item.observation === itemToRemove.observation &&
          item.item.name === itemToRemove.name &&
          item.additional === itemToRemove.additional &&
          item.additional_sauce === itemToRemove.additional_sauce &&
          item.additional_drink === itemToRemove.additional_drink &&
          item.additional_sweet === itemToRemove.additional_sweet
        ) {
          itemRemoved = true;
          return false;
        }
        return true;
      });

      setOrder({ ...order, items: updatedItems });
    }
  }

  const handleFinishOrderClick = async () => {
    if (order) {
      if (order.items.length === 0) {
        return;
      }
      setIsLoading(true);
      try {
        await OrderRepositories.createOrder(order);
        console.log("Pedido criado com sucesso");
        setOrder({
          username: "",
          phone: "",
          spot: 0,
          status: "active",
          money_payment: 0,
          credit_payment: 0,
          debit_payment: 0,
          service_fee: 0,
          total_value: 0,
          items: [],
        });
        localStorage.removeItem("order");
        setIsLoading(false);
        navigate("/", { state: { from: "201:OrderCreated" } });
      } catch (error) {
        console.error("Erro ao criar pedido:", error);
        setIsLoading(false);
        showAlert &&
          showAlert("Não foi possível finalizar o pedido.", "danger");
      }
    }
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
                fontSize="medium"
                fontColor="background-secondary-color"
                fontAlign="left"
              >
                {groupedOrderItem.quantity}x {groupedOrderItem.item.name}
              </Text>
              <FontAwesomeIcon
                className={styles.deleteItemIco}
                size="lg"
                icon={faTrashCan}
                color="black"
                onClick={() => {
                  removeItemFromOrder(order, {
                    observation: groupedOrderItem.observations[0]
                      ? groupedOrderItem.observations[0]
                      : "",
                    name: groupedOrderItem.item.name,
                    additional: groupedOrderItem.additional,
                    additional_drink: groupedOrderItem.additional_drink,
                    additional_sauce: groupedOrderItem.additional_sauce,
                    additional_sweet: groupedOrderItem.additional_sweet,
                  });
                }}
              />
            </div>
            <div className={styles.itemInfo}>
              {groupedOrderItem.observations.map((observation, index) => (
                <Text
                  key={index}
                  fontWeight="medium"
                  fontSize="medium"
                  fontColor="background-secondary-color"
                  fontAlign="left"
                >
                  <strong>Observação:</strong> {observation}
                </Text>
              ))}
              {groupedOrderItem.additional && (
                <Text
                  fontWeight="medium"
                  fontSize="medium"
                  fontColor="background-secondary-color"
                >
                  <strong>Adicional:</strong> {groupedOrderItem.additional}
                </Text>
              )}
              {groupedOrderItem.additional_sauce && (
                <Text
                  fontWeight="medium"
                  fontSize="medium"
                  fontColor="background-secondary-color"
                >
                  <strong>Molho:</strong> {groupedOrderItem.additional_sauce}
                </Text>
              )}
              {groupedOrderItem.additional_drink && (
                <Text
                  fontWeight="medium"
                  fontSize="medium"
                  fontColor="background-secondary-color"
                >
                  <strong>Bebida:</strong> {groupedOrderItem.additional_drink}
                </Text>
              )}
              {groupedOrderItem.additional_sweet && (
                <Text
                  fontWeight="medium"
                  fontSize="medium"
                  fontColor="background-secondary-color"
                >
                  <strong>Doce:</strong> {groupedOrderItem.additional_sweet}
                </Text>
              )}
              <Text
                fontWeight="medium"
                fontSize="medium"
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
    <>
      {isOpen && order && (
        <div className={`${styles.container}`}>
          <Text marginTop="32px" fontSize="extraLarge" fontWeight="semibold">
            Meu Pedido
          </Text>
          <div className={styles.closeModal} onClick={onClose}>
            <FontAwesomeIcon size="2x" icon={faLeftLong} color="white" />
          </div>
          <div className={styles.orderContent}>
            <div className={styles.orderInfo}>
              <Text
                fontSize="large"
                fontWeight="semibold"
                fontColor="background-secondary-color"
              >
                Vaga {order.spot}
              </Text>
              <Text
                fontSize="mediumLarge"
                fontColor="background-secondary-color"
              >
                <strong>Nome:</strong> {order.username}
              </Text>
              <Text
                fontSize="mediumLarge"
                fontColor="background-secondary-color"
              >
                <strong>Telefone:</strong> {order.phone}
              </Text>
            </div>
            <div className={styles.line} />
            {order.items.length === 0 && (
              <Text
                fontColor="background-secondary-color"
                fontSize="mediumLarge"
              >
                Nenhum item adicionado ao carrinho
              </Text>
            )}
            {order.items && renderOrderItems(groupOrderItems(order.items))}
            <div className={styles.line} />
            <div className={styles.orderValue}>
              <Text
                fontSize="mediumLarge"
                fontColor="background-secondary-color"
              >
                <strong>Valor:</strong> R$ {order.total_value.toFixed(2)}
              </Text>
              <Text
                fontSize="mediumLarge"
                fontColor="background-secondary-color"
              >
                <strong>Taxa de serviço:</strong> R${" "}
                {order.service_fee.toFixed(2)}
              </Text>
              <Text
                fontSize="mediumLarge"
                fontColor="background-secondary-color"
              >
                <strong>Valor total:</strong> R${" "}
                {(order.total_value + order.service_fee).toFixed(2)}
              </Text>
              <Text
                fontAlign="left"
                fontSize="mediumSmall"
                fontColor="background-secondary-color"
              >
                <FontAwesomeIcon color="#0088c2" icon={faCircleExclamation} />{" "}
                Pagamento será efetuado <strong>apenas</strong> na entrega do
                pedido.
              </Text>
            </div>
            <div className={styles.buttons}>
              <Button
                onClick={() => onClose()}
                label="Voltar ao cardápio"
                backGroundColor="invalid-color"
                marginTop="0"
              />
              <Button
                onClick={() => handleFinishOrderClick()}
                label="Finalizar pedido"
                marginTop="0"
              />
            </div>
          </div>
          <Caption
            onClick={openWhatsApp}
            isLink
            icon={<FontAwesomeIcon color="#268f3ff5" icon={faWhatsapp} />}
            label={"Precisa de ajuda?"}
          />
          <div className={styles.line} />
          <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      )}
    </>
  );
}
