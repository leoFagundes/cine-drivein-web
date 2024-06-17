import { render, screen, fireEvent } from "@testing-library/react";
import FeedbackModal from ".";

const mockFunction = jest.fn();

describe("#FeedbackModal", () => {
  test("renders the FeedbackModal correctly", () => {
    render(
      <FeedbackModal isOpen onClose={mockFunction} linkWhatsapp={() => {}} />
    );

    const element = screen.getByText("Clique em mim!");

    expect(element).toBeVisible();
  });

  test("close modal when button is clicked", () => {
    render(
      <FeedbackModal isOpen onClose={mockFunction} linkWhatsapp={() => {}} />
    );

    const button = screen.getByText("Voltar ao início");

    fireEvent.click(button);

    expect(mockFunction).toBeCalled();
  });

  test("click on the image and change it", () => {
    render(
      <FeedbackModal isOpen onClose={mockFunction} linkWhatsapp={() => {}} />
    );

    const img = screen.getByAltText("avatar");
    const initialSrc = img.getAttribute("src");

    fireEvent.click(img);

    expect(initialSrc).not.toBe(img.getAttribute("src"));
  });
});
