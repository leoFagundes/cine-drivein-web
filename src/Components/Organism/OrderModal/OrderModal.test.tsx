import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OrderModal from ".";
import { Item, ItemInOrder, Order } from "../../../Types/types";
import { MemoryRouter } from "react-router-dom";
import OrderRepositories from "../../../Services/repositories/OrderRepositories";

jest.mock("../../../Services/repositories/OrderRepositories", () => ({
  createOrder: jest.fn(),
}));

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
        quantity: 1,
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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("#OrderModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the OrderModal correctly", () => {
    render(
      <MemoryRouter>
        <OrderModal
          order={mockOrder}
          setOrder={mockSetOrder}
          onClose={mockOnClose}
          isOpen={true}
          setIsLoading={mockSetIsLoading}
          showAlert={mockShowAlert}
        />
      </MemoryRouter>
    );

    const element = screen.getByText("john_doe");
    const itemElement = screen.getByText("Sem cebola");

    expect(element).toBeVisible();
    expect(itemElement).toBeVisible();
  });

  test("go back to menu when 'back to menu' button is clicked", () => {
    render(
      <MemoryRouter>
        <OrderModal
          order={mockOrder}
          setOrder={mockSetOrder}
          onClose={mockOnClose}
          isOpen={true}
          setIsLoading={mockSetIsLoading}
          showAlert={mockShowAlert}
        />
      </MemoryRouter>
    );

    const buttonElement = screen.getByText("Voltar ao cardápio");

    fireEvent.click(buttonElement);

    expect(mockOnClose).toBeCalled();
  });

  test("finish order when 'finish order' button is clicked", async () => {
    render(
      <MemoryRouter>
        <OrderModal
          order={mockOrder}
          setOrder={mockSetOrder}
          onClose={mockOnClose}
          isOpen={true}
          setIsLoading={mockSetIsLoading}
          showAlert={mockShowAlert}
        />
      </MemoryRouter>
    );

    const buttonElement = screen.getByText("Finalizar pedido");
    console.log(buttonElement);

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(OrderRepositories.createOrder).toBeCalledWith(mockOrder);
      expect(mockSetOrder).toBeCalledWith({
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
      expect(mockSetIsLoading).toBeCalledWith(false);
    });
  });

  test("remove item when trash icon is clicked", () => {
    render(
      <MemoryRouter>
        <OrderModal
          order={mockOrder}
          setOrder={mockSetOrder}
          onClose={mockOnClose}
          isOpen={true}
          setIsLoading={mockSetIsLoading}
          showAlert={mockShowAlert}
        />
      </MemoryRouter>
    );

    const icon = screen.getByTestId("trash-icon");

    fireEvent.click(icon);

    expect(mockSetOrder).toBeCalled();
  });
});
