import { render, screen, fireEvent } from "@testing-library/react";
import { OrderWithTime } from "../../../Types/types";
import RecentOrdersCard from ".";

const mockOrders: OrderWithTime[] = [
  {
    _id: "order123",
    username: "john_doe",
    phone: "123-456-7890",
    spot: 215,
    status: "active",
    money_payment: 20.0,
    credit_payment: 0.0,
    debit_payment: 0.0,
    service_fee: 1.0,
    total_value: 21.0,
    items: [
      {
        item: {
          _id: "item123",
          cod_item: "ITEM001",
          name: "Cheeseburger",
          type: "food",
          description: "A tasty cheeseburger with all the trimmings.",
          value: 10.99,
          quantity: 1,
          photo: "https://example.com/cheeseburger.jpg",
          isVisible: true,
          additionals: [{ additionalItem: "additional123" }],
          additionals_sauces: [{ additionalItem: "sauce123" }],
          additionals_drinks: [{ additionalItem: "drink123" }],
          additionals_sweets: [{ additionalItem: "sweet123" }],
        },
        observation: "No onions, please.",
        additional: "extra cheese",
        additional_sauce: "ketchup",
        additional_drink: "cola",
        additional_sweet: "chocolate",
      },
    ],
    createdAt: "2023-06-18T10:00:00Z",
  },
];

describe("#RecentOrdersCards", () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {
      StoredOrderList: JSON.stringify(mockOrders),
    };

    Storage.prototype.getItem = jest.fn((key) => {
      return localStorageMock[key] || null;
    });

    Storage.prototype.setItem = jest.fn((key, value) => {
      localStorageMock[key] = value;
    });

    Storage.prototype.removeItem = jest.fn((key) => {
      delete localStorageMock[key];
    });
  });

  test("renders cards correctly", () => {
    render(<RecentOrdersCard />);

    const orderSpot = screen.getByText(/215/i);

    expect(orderSpot).toBeInTheDocument();
  });

  test("removes card correctly and verifies localStorage is empty", () => {
    render(<RecentOrdersCard />);

    const orderSpot = screen.getByText(/215/i);
    expect(orderSpot).toBeInTheDocument();

    const removeIcon = screen.getByTestId("close-icon");

    fireEvent.click(removeIcon);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "StoredOrderList",
      JSON.stringify([])
    );

    const storedOrders = localStorage.getItem("StoredOrderList");
    expect(storedOrders).toBe(JSON.stringify([]));
  });
});
