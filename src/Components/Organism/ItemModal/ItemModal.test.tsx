import { render, screen, fireEvent } from "@testing-library/react";
import ItemModal from ".";
import { Item, Order } from "../../../Types/types";

const mockShowAlert = jest.fn();
const mockOnClose = jest.fn();

const mockItem: Item = {
  cod_item: "12345",
  name: "Mock Item",
  type: "Mock Type",
  description: "This is a mock item for testing.",
  value: 100,
  quantity: 10,
  photo: "https://via.placeholder.com/150",
  additionals: [
    { additionalItem: "Molho extra" },
    { additionalItem: "Bebida adicional" },
  ],
};

const mockOrder: Order = {
  username: "mockuser",
  phone: "123456789",
  spot: 1,
  status: "active",
  money_payment: 0,
  credit_payment: 0,
  debit_payment: 0,
  service_fee: 0,
  total_value: 0,
  items: [],
};

describe("#ItemModal", () => {
  test("renders the itemModal correctly", () => {
    render(
      <ItemModal
        item={mockItem}
        isOpen={true}
        onClose={mockOnClose}
        setOrder={jest.fn()}
        order={mockOrder}
        showAlert={mockShowAlert}
      />
    );

    const photoElement = screen.getByTestId("Item Photo");

    expect(photoElement).toBeVisible();
  });

  test("onClose is called when 'Back to menu' button is clicked", () => {
    render(
      <ItemModal
        item={mockItem}
        isOpen={true}
        onClose={mockOnClose}
        setOrder={jest.fn()}
        order={mockOrder}
        showAlert={mockShowAlert}
      />
    );

    const button = screen.getByText("Voltar ao cardápio");

    fireEvent.click(button);

    expect(mockOnClose).toBeCalled();
  });

  test("showAlert is called when 'Add item to order' button is clicked", () => {
    render(
      <ItemModal
        item={mockItem}
        isOpen={true}
        onClose={mockOnClose}
        setOrder={jest.fn()}
        order={mockOrder}
        showAlert={mockShowAlert}
      />
    );

    const button = screen.getByText("Adicionar este item ao pedido");

    fireEvent.click(button);

    expect(mockOnClose).not.toBeCalled();
    expect(mockShowAlert).toBeCalled();
  });
});
