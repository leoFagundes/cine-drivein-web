import styles from "./ItemModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import { AdditionalItem, Item, Order } from "../../../Types/types";
import Text from "../../Atoms/Text";
import { Input } from "../../Atoms/Input/Input";
import { Dropdown } from "../../Atoms/Dropdown";
import Button from "../../Atoms/Button";
import AdditionalItemRepositories from "../../../Services/repositories/AdditionalItemRepositories";

type ItemModalType = {
  item: Item | null;
  isOpen: boolean;
  onClose: VoidFunction;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  order: Order;
  showAlert: (message: string, type: string) => void;
};

type KeyType =
  | "additional"
  | "additionalSauce"
  | "additionalDrink"
  | "additionalSweet";

const ERROR_INVALID_VALUE = "Escolha um item de acompanhamento.";
const ERROR_INVALID_VALUE_ALERT = "Existem acompanhamentos vazios.";

export default function ItemModal({
  item,
  onClose,
  isOpen,
  setOrder,
  order,
  showAlert,
}: ItemModalType) {
  const [valueError, setValueError] = useState({
    additionalError: [""],
    additionalSauceError: [""],
    additionalDrinkError: [""],
    additionalSweetError: [""],
  });
  const [itemToAdd, setItemToAdd] = useState({
    observation: "",
    quantity: 0,
    additional: [""],
    additionalSauce: [""],
    additionalDrink: [""],
    additionalSweet: [""],
  });
  const [additionalItemByDB, setAdditionalItemByDB] = useState<
    AdditionalItem[]
  >([]);

  useEffect(() => {
    async function fetchAdditionalItems() {
      try {
        const additionalItemsFetched =
          await AdditionalItemRepositories.getAdditionalItems();

        if (additionalItemsFetched)
          setAdditionalItemByDB(additionalItemsFetched);
      } catch (error) {
        console.error("Erro ao carregar itens adicionais: ", error);
      }
    }

    fetchAdditionalItems();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      window.history.pushState({ modalOpen: true }, "");
    } else {
      document.body.classList.remove("modal-open");
    }

    const handlePopstate = (event: PopStateEvent) => {
      if (event.state) {
        handleCloseClick();
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => window.removeEventListener("popstate", handlePopstate);
  }, [isOpen]);

  useEffect(() => {
    const adjustedQuantity =
      isNaN(itemToAdd.quantity) || itemToAdd.quantity === 0
        ? 1
        : itemToAdd.quantity;

    setValueError((prevValueError) => ({
      additionalError: Array.from({ length: adjustedQuantity }, () => ""),
      additionalSauceError: Array.from({ length: adjustedQuantity }, () => ""),
      additionalDrinkError: Array.from({ length: adjustedQuantity }, () => ""),
      additionalSweetError: Array.from({ length: adjustedQuantity }, () => ""),
    }));

    setItemToAdd((prevItemToAdd) => ({
      ...prevItemToAdd,
      additional: Array.from({ length: adjustedQuantity }, () => ""),
      additionalSauce: Array.from({ length: adjustedQuantity }, () => ""),
      additionalDrink: Array.from({ length: adjustedQuantity }, () => ""),
      additionalSweet: Array.from({ length: adjustedQuantity }, () => ""),
    }));
  }, [itemToAdd.quantity]);

  const validateSubitemForm = () => {
    let isValid: boolean[] = [];
    const newValueError = { ...valueError };

    [
      ...Array(Math.max(isNaN(itemToAdd.quantity) ? 1 : itemToAdd.quantity, 1)),
    ].forEach((_, index) => {
      if (
        itemToAdd.additional[index] === "" &&
        item?.additionals?.length !== undefined &&
        item.additionals.length > 0
      ) {
        newValueError.additionalError[index] = ERROR_INVALID_VALUE;
        isValid.push(false);
      } else {
        newValueError.additionalError[index] = "";
        isValid.push(true);
      }
    });

    [
      ...Array(Math.max(isNaN(itemToAdd.quantity) ? 1 : itemToAdd.quantity, 1)),
    ].forEach((_, index) => {
      if (
        itemToAdd.additionalSauce[index] === "" &&
        item?.additionals_sauces?.length !== undefined &&
        item.additionals_sauces.length > 0
      ) {
        newValueError.additionalSauceError[index] = ERROR_INVALID_VALUE;
        isValid.push(false);
      } else {
        newValueError.additionalSauceError[index] = "";
        isValid.push(true);
      }
    });

    [
      ...Array(Math.max(isNaN(itemToAdd.quantity) ? 1 : itemToAdd.quantity, 1)),
    ].forEach((_, index) => {
      if (
        itemToAdd.additionalDrink[index] === "" &&
        item?.additionals_drinks?.length !== undefined &&
        item.additionals_drinks.length > 0
      ) {
        newValueError.additionalDrinkError[index] = ERROR_INVALID_VALUE;
        isValid.push(false);
      } else {
        newValueError.additionalDrinkError[index] = "";
        isValid.push(true);
      }
    });

    [
      ...Array(Math.max(isNaN(itemToAdd.quantity) ? 1 : itemToAdd.quantity, 1)),
    ].forEach((_, index) => {
      if (
        itemToAdd.additionalSweet[index] === "" &&
        item?.additionals_sweets?.length !== undefined &&
        item.additionals_sweets.length > 0
      ) {
        newValueError.additionalSweetError[index] = ERROR_INVALID_VALUE;
        isValid.push(false);
      } else {
        newValueError.additionalSweetError[index] = "";
        isValid.push(true);
      }
    });

    setValueError(newValueError);
    return !isValid.includes(false);
  };

  const updateItem = (key: KeyType, value: string | string[]) => {
    setItemToAdd((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleConfirmClick = () => {
    if (!validateSubitemForm()) {
      showAlert(ERROR_INVALID_VALUE_ALERT, "danger");
      console.log("Formulário Inválido.");
      return;
    }

    const updatedItems = [...order.items];

    if (item) {
      var quantity = itemToAdd.quantity;
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
      }
      for (let i = 0; i < quantity; i++) {
        updatedItems.push({
          item: item,
          observation: itemToAdd.observation,
          additional: itemToAdd.additional[i],
          additional_sauce: itemToAdd.additionalSauce[i],
          additional_drink: itemToAdd.additionalDrink[i],
          additional_sweet: itemToAdd.additionalSweet[i],
        });
      }
    }

    setOrder({
      ...order,
      items: updatedItems,
    });

    setItemToAdd({
      observation: "",
      quantity: 0,
      additional: [""],
      additionalSauce: [""],
      additionalDrink: [""],
      additionalSweet: [""],
    });

    setValueError({
      additionalError: [""],
      additionalSauceError: [""],
      additionalDrinkError: [""],
      additionalSweetError: [""],
    });

    onClose();
    showAlert("Item adicionado ao carrinho!", "success");
  };

  const handleCloseClick = () => {
    setItemToAdd({
      observation: "",
      quantity: 0,
      additional: [""],
      additionalSauce: [""],
      additionalDrink: [""],
      additionalSweet: [""],
    });

    setValueError({
      additionalError: [""],
      additionalSauceError: [""],
      additionalDrinkError: [""],
      additionalSweetError: [""],
    });

    onClose();
  };

  return (
    <>
      {isOpen && item && (
        <div className={`${styles.container}`}>
          <div className={styles.itemImage}>
            <div>
              {item.photo ? (
                <div
                  data-testid="Item Photo"
                  className={styles.image}
                  style={{ backgroundImage: `url("${item.photo}")` }}
                />
              ) : (
                <FontAwesomeIcon
                  data-testid="Item Photo"
                  size="3x"
                  icon={faImages}
                  color="white"
                />
              )}
            </div>
          </div>
          <div className={styles.itemInfo}>
            <Text fontSize="extraLarge" fontWeight="bold">
              {item.name}
            </Text>
            <Text fontSize="mediumSmall" fontAlign="left">
              {item.description}
            </Text>
          </div>
          <div className={styles.inputs}>
            <Input
              value={itemToAdd.observation}
              placeholder="Observação (ex: sem salada)"
              onChange={(e) =>
                setItemToAdd({ ...itemToAdd, observation: e.target.value })
              }
            />

            <Input
              type="number"
              value={
                itemToAdd.quantity !== 0 ? itemToAdd.quantity.toString() : ""
              }
              placeholder="Quantidade deste item (padrão: 1)"
              onChange={(e) => {
                setItemToAdd({
                  ...itemToAdd,
                  quantity:
                    parseInt(e.target.value) > 10
                      ? 10
                      : parseInt(e.target.value),
                });
              }}
              marginTop="22px"
              marginBottom="14px"
            />

            {[
              ...Array(
                Math.max(isNaN(itemToAdd.quantity) ? 1 : itemToAdd.quantity, 1)
              ),
            ].map((_, index) => (
              <Fragment key={index}>
                {index > 0 &&
                  ((item && item.additionals && item.additionals.length > 0) ||
                    (item &&
                      item.additionals_sauces &&
                      item.additionals_sauces.length > 0) ||
                    (item &&
                      item.additionals_drinks &&
                      item.additionals_drinks.length > 0) ||
                    (item &&
                      item.additionals_sweets &&
                      item.additionals_sweets.length > 0)) && <br></br>}
                {item.additionals && item.additionals.length > 0 && (
                  <Dropdown
                    options={item.additionals
                      .filter((option: any) => {
                        const currentItem = additionalItemByDB.find(
                          (item) => item.name === option.additionalItem.name
                        );
                        return currentItem?.isVisible;
                      })
                      .map((option: any) => option.additionalItem.name)}
                    value={itemToAdd.additional[index] || ""}
                    placeholder={
                      itemToAdd.quantity <= 1 || isNaN(itemToAdd.quantity)
                        ? "Escolha um acompanhamento"
                        : `Escolha o ${index + 1}º acompanhamento`
                    }
                    onChange={(value) => {
                      updateItem("additional", {
                        ...itemToAdd.additional,
                        [index]: value,
                      });
                      setValueError((prevValueError) => ({
                        ...prevValueError,
                        additionalError: {
                          ...prevValueError.additionalError,
                          [index]: "",
                        },
                      }));
                    }}
                    marginTop="8px"
                    errorLabel={valueError.additionalError[index]}
                    removePlaceholderOption
                  />
                )}
                {item.additionals_sauces &&
                  item.additionals_sauces.length > 0 && (
                    <Dropdown
                      options={item.additionals_sauces
                        .filter((option: any) => {
                          const currentItem = additionalItemByDB.find(
                            (item) => item.name === option.additionalItem.name
                          );
                          return currentItem?.isVisible;
                        })
                        .map((option: any) => option.additionalItem.name)}
                      value={itemToAdd.additionalSauce[index] || ""}
                      placeholder={
                        itemToAdd.quantity <= 1 || isNaN(itemToAdd.quantity)
                          ? "Escolha um molho"
                          : `Escolha o ${index + 1}º molho`
                      }
                      onChange={(value) => {
                        updateItem("additionalSauce", {
                          ...itemToAdd.additionalSauce,
                          [index]: value,
                        });
                        setValueError((prevValueError) => ({
                          ...prevValueError,
                          additionalSauceError: {
                            ...prevValueError.additionalSauceError,
                            [index]: "",
                          },
                        }));
                      }}
                      marginTop="8px"
                      errorLabel={valueError.additionalSauceError[index]}
                      removePlaceholderOption
                    />
                  )}
                {item.additionals_drinks &&
                  item.additionals_drinks.length > 0 && (
                    <Dropdown
                      options={item.additionals_drinks
                        .filter((option: any) => {
                          const currentItem = additionalItemByDB.find(
                            (item) => item.name === option.additionalItem.name
                          );
                          return currentItem?.isVisible;
                        })
                        .map((option: any) => option.additionalItem.name)}
                      value={itemToAdd.additionalDrink[index] || ""}
                      placeholder={
                        itemToAdd.quantity <= 1 || isNaN(itemToAdd.quantity)
                          ? "Escolha uma bebida"
                          : `Escolha a ${index + 1}ª bebida`
                      }
                      onChange={(value) => {
                        updateItem("additionalDrink", {
                          ...itemToAdd.additionalDrink,
                          [index]: value,
                        });
                        setValueError((prevValueError) => ({
                          ...prevValueError,
                          additionalDrinkError: {
                            ...prevValueError.additionalDrinkError,
                            [index]: "",
                          },
                        }));
                      }}
                      marginTop="8px"
                      errorLabel={valueError.additionalDrinkError[index]}
                      removePlaceholderOption
                    />
                  )}
                {item.additionals_sweets &&
                  item.additionals_sweets.length > 0 && (
                    <Dropdown
                      options={item.additionals_sweets
                        .filter((option: any) => {
                          const currentItem = additionalItemByDB.find(
                            (item) => item.name === option.additionalItem.name
                          );
                          return currentItem?.isVisible;
                        })
                        .map((option: any) => option.additionalItem.name)}
                      value={itemToAdd.additionalSweet[index] || ""}
                      placeholder={
                        itemToAdd.quantity <= 1 || isNaN(itemToAdd.quantity)
                          ? "Escolha um doce"
                          : `Escolha a ${index + 1}ª sobremesa`
                      }
                      onChange={(value) => {
                        updateItem("additionalSweet", {
                          ...itemToAdd.additionalSweet,
                          [index]: value,
                        });
                        setValueError((prevValueError) => ({
                          ...prevValueError,
                          additionalSweetError: {
                            ...prevValueError.additionalSweetError,
                            [index]: "",
                          },
                        }));
                      }}
                      marginTop="8px"
                      errorLabel={valueError.additionalSweetError[index]}
                      removePlaceholderOption
                    />
                  )}
              </Fragment>
            ))}
          </div>
          <div className={styles.itemValue}>
            <Text fontSize="mediumLarge" fontWeight="semibold">
              Valor: R${" "}
              {itemToAdd.quantity > 1
                ? (item.value * itemToAdd.quantity).toFixed(2)
                : item.value.toFixed(2)}
            </Text>
          </div>
          <div className={styles.buttons}>
            <Button
              onClick={() => handleCloseClick()}
              label="Voltar ao cardápio"
              backGroundColor="invalid-color"
            />
            <Button
              onClick={() => handleConfirmClick()}
              label="Adicionar este item ao pedido"
            />
          </div>
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
