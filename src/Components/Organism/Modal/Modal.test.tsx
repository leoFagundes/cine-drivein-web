import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "./index";

const mockFunction = jest.fn();

describe("#Modal", () => {
  test("renders the Modal correctly", () => {
    render(
      <Modal isOpen={true} onClose={mockFunction}>
        <div>
          <h2>Título do Modal</h2>
          <p>Conteúdo do Modal</p>
        </div>
      </Modal>
    );

    const modalContent = screen.getByText("Conteúdo do Modal");

    expect(modalContent).toBeInTheDocument();
  });

  test("close modal when onClick is called", () => {
    render(
      <Modal isOpen={true} onClose={mockFunction}>
        <div>
          <h2>Título do Modal</h2>
          <p>Conteúdo do Modal</p>
        </div>
      </Modal>
    );

    const modalContent = screen.getByTestId("container");

    fireEvent.click(modalContent);

    expect(mockFunction).toBeCalled();
  });
});
