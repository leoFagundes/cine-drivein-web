import { render, screen } from "@testing-library/react";
import LogoImage from ".";

describe("#LogoImage", () => {
  test("render the logo correctly", () => {
    render(<LogoImage size="30px" />);

    const image = screen.getByRole("img");

    expect(image).toBeVisible();
  });
});
