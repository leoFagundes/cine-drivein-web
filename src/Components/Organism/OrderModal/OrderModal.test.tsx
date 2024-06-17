import { render, screen, fireEvent } from "@testing-library/react";
import OrderModal from ".";
import { Order } from "../../../Types/types";

const mockOrder: Order = {
  _id: "1",
  username: "john_doe",
  phone: "123456789",
  spot: 1,
  status: "active",
  money_payment: 50,
  credit_payment: 0,
  debit_payment: 0,
  service_fee: 5,
  total_value: 55,
  items: [
    {
      item: {
        _id: "1",
        cod_item: "001",
        name: "Item A",
        type: "food",
        description: "Descrição do item A",
        value: 10,
        quantity: 2,
        photo: "https://example.com/itemA.jpg",
        isVisible: true,
        additionals: [{ additionalItem: "Adicional 1" }],
      },
      observation: "Sem cebola",
      additional: "Adicional 1",
    },
  ],
};

const mockSetOrder = jest.fn();
const mockOnClose = jest.fn();
const mockSetIsLoading = jest.fn();
const mockShowAlert = jest.fn();

describe("#OrderModal", () => {
  test("renders the OrderModal correctly", () => {
    render(
      <OrderModal
        order={mockOrder}
        setOrder={mockSetOrder}
        onClose={mockOnClose}
        isOpen={true}
        setIsLoading={mockSetIsLoading}
        showAlert={mockShowAlert}
      />
    );
  });
});
