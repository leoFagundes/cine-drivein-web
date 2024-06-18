import { render, screen, fireEvent } from "@testing-library/react";
import { OrderWithTime } from "../../../Types/types";
import RecentOrderModalView from ".";

const mockOrder: OrderWithTime = {
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
        quantity: 1,
        photo: "https://example.com/itemA.jpg",
        isVisible: true,
        additionals: [{ additionalItem: "Adicional 1" }],
      },
      observation: "Sem cebola",
      additional: "Adicional 1",
    },
  ],
  createdAt: "18/06/2024 08:47:27",
};

const mockOnClose = jest.fn();

describe("#RecentOrderModalView", () => {
  test("renders the RecentOrderModalView correctly", () => {
    render(
      <RecentOrderModalView
        order={mockOrder}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    const element = screen.getByText("john_doe");
    const itemElement = screen.getByText("Sem cebola");

    expect(element).toBeVisible();
    expect(itemElement).toBeVisible();
  });

  test("close modal when 'close icon' is clicked", () => {
    render(
      <RecentOrderModalView
        order={mockOrder}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    const iconElement = screen.getByTestId("close-icon");

    fireEvent.click(iconElement);

    expect(mockOnClose).toBeCalled();
  });
});
