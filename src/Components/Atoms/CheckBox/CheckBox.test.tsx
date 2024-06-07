import { fireEvent, render, screen } from "@testing-library/react";
import CheckBox from ".";

describe("#CheckBox", () => {
  test("render correct checkbox", () => {
    const handleChange = jest.fn();

    render(<CheckBox checked onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeVisible();
  });

  test("change status correctly", () => {
    const handleChange = jest.fn();

    render(<CheckBox checked onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledWith(false);

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
