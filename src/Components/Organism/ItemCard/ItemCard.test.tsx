import { render, screen, fireEvent } from "@testing-library/react";
import ItemCard from ".";
import { Item } from "../../../Types/types";

const mockFunction = jest.fn();

const mockItem: Item = {
  cod_item: "12345",
  name: "Mock Item",
  type: "Mock Type",
  description: "This is a mock item for testing.",
  value: 100,
  quantity: 10,
  photo: "https://via.placeholder.com/150",
};

describe("#ItemCard", () => {
  test("renders the card correctly", () => {
    render(<ItemCard item={mockItem} onClick={mockFunction} />);

    expect(screen.getByText("Mock Item")).toBeInTheDocument();
    expect(
      screen.getByText("This is a mock item for testing.")
    ).toBeInTheDocument();
  });

  test("called a function when click on the photo", () => {
    render(<ItemCard item={mockItem} onClick={mockFunction} />);

    const card = screen.getByTestId("container");

    fireEvent.click(card);

    expect(mockFunction).toBeCalled();
  });
});
