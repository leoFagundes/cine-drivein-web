import { useEffect, useRef, useState } from "react";
import Text from "../../Atoms/Text";
import styles from "./OrderTemplate.module.scss";
import ItemRepositories from "../../../Services/repositories/ItemRepositories";
import { Item, Order, SiteConfig } from "../../../Types/types";
import ItemCard from "../../Organism/ItemCard";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { LoadingFullScreenTemplate } from "../LoadingFullScreenTemplate";
import ItemModal from "../../Organism/ItemModal";
import OrderModal from "../../Organism/OrderModal";
import Alert from "../../Molecules/Alert";
import FloatingButton from "../../Molecules/FloatingButton";
import ScheduleRepositories from "../../../Services/repositories/ScheduleRepositories";
import SiteConfigsRepository from "../../../Services/repositories/SiteConfigsRepositorie";

type OrderTemplateType = {
  label: string;
};

const ALL_TYPES_LABEL = "Tudo";

export default function OrderTemplate({ label }: OrderTemplateType) {
  const [items, setItems] = useState<Item[]>();
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const [currentMenuType, setCurrentMenuType] = useState(ALL_TYPES_LABEL);
  const [isLoading, setIsLoading] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [itemClicked, setItemClicked] = useState<Item | null>(null);
  const [reloadRequired, setReloadRequired] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    isOpen: boolean;
    message: string;
    type: string;
  }>({
    isOpen: false,
    message: "",
    type: "",
  });
  const [order, setOrder] = useState<Order>(() => {
    const storedOrder = localStorage.getItem("order");
    return storedOrder
      ? JSON.parse(storedOrder)
      : {
          username: "",
          phone: "",
          spot: 0,
          money_payment: 0,
          status: "active",
          credit_payment: 0,
          debit_payment: 0,
          service_fee: 0,
          total_value: 0,
          items: [],
        };
  });
  const location = useLocation();
  const navigate = useNavigate();
  const menuTypesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Buscando status de abertura...");
        const data = await ScheduleRepositories.getSchedule();
        if (!data.isOpen) {
          setReloadRequired(true);
        }
      } catch (error) {
        console.error(
          "Erro ao obter dados do horário de funcionamento:",
          error
        );
      }
    };

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (reloadRequired) {
      navigate("/");
    }
  }, [reloadRequired, navigate]);

  useEffect(() => {
    if (order && order.items) {
      let totalValue = 0;
      order.items.forEach((orderItem) => {
        totalValue += orderItem.item.visibleValueToClient
          ? orderItem.item.visibleValueToClient
          : orderItem.item.value;
      });
      setOrder((prevOrder) => ({
        ...prevOrder,
        service_fee: totalValue / 10,
        total_value: totalValue,
      }));
    }
  }, [order.items]);

  const showAlert = (message: string, type: string) => {
    setAlertInfo({
      isOpen: true,
      message: message,
      type: type,
    });
  };

  const closeAlert = () => {
    setAlertInfo({
      isOpen: false,
      message: "",
      type: "",
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name");
    const phone = queryParams.get("phone");
    const spot = queryParams.get("spot");

    if (!name || !phone || !spot) {
      navigate("/", { replace: true });
    } else {
      setOrder((prevOrder) => ({
        ...prevOrder,
        username: name,
        phone: phone,
        spot: parseInt(spot),
      }));
    }
  }, [navigate, location.search]);

  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(order));
  }, [order]);

  useEffect(() => {
    const fetchUniqueTypes = async () => {
      setIsLoading(true);
      try {
        const types = await ItemRepositories.getUniqueTypes();
        const items = await ItemRepositories.getItems();
        const currentConfig: SiteConfig =
          await SiteConfigsRepository.getConfigById("66e399ad3b867fd49fe79d0b");

        // const preferredOrder = ["Porções", "Lanches", "Vegetarianos", "Combos"];
        const preferredOrder = currentConfig.orderTypes || [
          "Porções",
          "Pipocas",
          "Lanches",
          "Vegetarianos",
          "Combos",
        ];

        const orderedTypes = preferredOrder.filter((type) =>
          types.includes(type)
        );

        const remainingTypes = types.filter(
          (type) => !preferredOrder.includes(type)
        );

        const sortedTypes = [
          ALL_TYPES_LABEL,
          ...orderedTypes,
          ...remainingTypes,
        ];

        setUniqueTypes(sortedTypes);
        setItems(items);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter itens:", error);
        setIsLoading(false);
      }
    };

    fetchUniqueTypes();
  }, []);

  useEffect(() => {
    if (currentMenuType && menuTypesRef.current) {
      const currentTypeElement = menuTypesRef.current.querySelector(
        `.${styles.currentType}`
      ) as HTMLElement | null;
      const menuContainer = menuTypesRef.current;

      if (currentTypeElement) {
        const scrollLeft =
          currentTypeElement.offsetLeft -
          (menuContainer.offsetWidth - currentTypeElement.offsetWidth) / 2;
        menuContainer.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [currentMenuType]);

  const openItemModalWith = (item: Item) => {
    console.log(item);
    setItemClicked(item);
    setIsItemModalOpen(true);
  };

  const renderItemsByType = (type: string) => {
    const filteredItems = items?.filter(
      (item) => item.type === type && item.isVisible
    );

    if (!filteredItems || filteredItems.length === 0) {
      return (
        <div
          className={`${styles.menuItemsByType} ${styles.menuItemByTypeEmpty}`}
          key={type}
        >
          <Text fontWeight="semibold" fontSize="large">
            {type}
          </Text>
          <Text fontSize="mediumSmall">
            Itens estão temporariamente desativados!
          </Text>
        </div>
      );
    }

    return (
      <div className={styles.menuItemsByType} key={type}>
        <Text fontWeight="semibold" fontSize="large">
          {type}
        </Text>
        {filteredItems.map((item, index) => (
          <div key={index} className={styles.item}>
            <ItemCard onClick={() => openItemModalWith(item)} item={item} />
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) return <LoadingFullScreenTemplate />;

  return (
    <section className={styles.container}>
      <Text marginTop="32px" fontSize="extraLarge" fontWeight="semibold">
        {label}
      </Text>
      <div
        className={`${styles.menuOrder}`}
        onClick={() => setIsOrderModalOpen(true)}
      >
        <FontAwesomeIcon
          className={styles.icon}
          size="xl"
          icon={faCartShopping}
          color="white"
        />
        <Text fontSize="mediumSmall">Pedido</Text>
        <div
          className={`${styles.quantityNotification} ${
            order.items.length > 0 && styles.isVisible
          }`}
        >
          <Text fontWeight="semibold" fontSize="small">
            {order.items.length}
          </Text>
        </div>
      </div>
      <div className={styles.menuTypes} ref={menuTypesRef}>
        {uniqueTypes.map((type) => (
          <div
            key={type}
            className={`${styles.type} ${
              type === currentMenuType && styles.currentType
            }`}
            onClick={() => setCurrentMenuType(type)}
          >
            <Text>{type}</Text>
          </div>
        ))}
      </div>
      <div className={styles.menuItems}>
        {currentMenuType === ALL_TYPES_LABEL &&
          uniqueTypes.map((type, index) => {
            if (index === 0) return null;
            return renderItemsByType(type);
          })}
        {currentMenuType !== ALL_TYPES_LABEL &&
          renderItemsByType(currentMenuType)}
      </div>
      <ItemModal
        setOrder={setOrder}
        order={order}
        item={itemClicked ? itemClicked : null}
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        showAlert={showAlert}
      />
      <OrderModal
        order={order}
        setOrder={setOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        setIsLoading={setIsLoading}
        showAlert={showAlert}
      />
      <Alert
        isAlertOpen={alertInfo.isOpen}
        setIsAlertOpen={closeAlert}
        message={alertInfo.message}
        alertDisplayTime={2000}
        onClose={closeAlert}
        type={alertInfo.type}
      />
      <FloatingButton
        scrollUp
        icon={
          <FontAwesomeIcon
            className={styles.icon}
            size="sm"
            icon={faCartShopping}
            color="white"
          />
        }
        label="Finalizar pedido"
        quantity={order.items.length}
        onClick={() => setIsOrderModalOpen(true)}
      />
      <div className={styles.closeModal} onClick={() => navigate("/")}>
        <FontAwesomeIcon size="xl" icon={faLeftLong} color="white" />
      </div>
      <br />
      <br />
      <br />
      <br />
    </section>
  );
}
