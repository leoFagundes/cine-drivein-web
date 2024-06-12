import { fireEvent, render, screen } from "@testing-library/react";
import Caption from ".";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons";

const mockFunction = jest.fn();

describe("#Caption", () => {
  test("render the caption correctly", () => {
    render(
      <Caption
        icon={<FontAwesomeIcon icon={faPizzaSlice} />}
        label="Clique aqui"
        onClick={mockFunction}
      />
    );

    const caption = screen.getByText("Clique aqui");

    expect(caption).toBeVisible();
  });

  test("mockFunction is called with click", () => {
    render(
      <Caption
        icon={<FontAwesomeIcon icon={faPizzaSlice} />}
        label="Clique aqui"
        onClick={mockFunction}
      />
    );

    const caption = screen.getByText("Clique aqui");

    fireEvent.click(caption);

    expect(mockFunction).toBeCalled();
  });
});
