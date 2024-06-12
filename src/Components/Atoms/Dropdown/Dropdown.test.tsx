import { fireEvent, render, screen } from "@testing-library/react";
import { Dropdown } from ".";

const mockFunction = jest.fn();

describe("#Dropdown", () => {
  test("render correct dropdown", () => {
    render(
      <Dropdown
        options={[]}
        value=""
        onChange={mockFunction}
        placeholder="Categoria"
      />
    );

    const dropdown = screen.getByText("Categoria");
    expect(dropdown).toBeVisible();
  });

  test("render correct label component if error label exist", () => {
    render(
      <Dropdown
        options={[]}
        value=""
        onChange={mockFunction}
        placeholder="Categoria"
        errorLabel="error test"
      />
    );

    const errorLabel = screen.getByText("error test");
    expect(errorLabel).toBeVisible();
  });

  test("renders and handles option clicks correctly", () => {
    render(
      <Dropdown
        options={["option1", "option2"]}
        value=""
        onChange={mockFunction}
        placeholder="Categoria"
      />
    );

    const dropdown = screen.getByRole("combobox");
    fireEvent.change(dropdown, { target: { value: "option1" } });

    expect(mockFunction).toHaveBeenCalledWith("option1");

    expect((dropdown as HTMLSelectElement).value).toBe("option1");
  });
});
