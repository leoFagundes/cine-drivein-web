import { fireEvent, render, screen } from "@testing-library/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import FloatingButton from ".";

const mockFunction = jest.fn();
const scrollToMock = jest.fn();
const originalScrollTo = window.scrollTo;

beforeAll(() => {
  // Substitui a função window.scrollTo pelo mock
  window.scrollTo = scrollToMock;
});

afterAll(() => {
  // Restaura a função window.scrollTo original após os testes
  window.scrollTo = originalScrollTo;
});

describe("#FloatinButton", () => {
  test("render correct FloatinButton", () => {
    render(
      <FloatingButton
        onClick={mockFunction}
        icon={<FontAwesomeIcon size="lg" icon={faArrowUp} color="white" />}
        label="Teste"
      />
    );

    const element = screen.getByTestId("floatingButtonElement");

    expect(element).toBeInTheDocument();
  });

  test("Is invisible when scroll is less than 100 and visible when scroll is bigger then", () => {
    render(
      <FloatingButton
        onClick={mockFunction}
        icon={<FontAwesomeIcon size="lg" icon={faArrowUp} color="white" />}
        label="Teste"
      />
    );

    const element = screen.getByTestId("floatingButtonElement");

    expect(element).toHaveClass("isInvisible");

    fireEvent.scroll(window, { target: { scrollY: 101 } });

    expect(element).not.toHaveClass("isInvisible");
  });

  test("onClick is called correctly", () => {
    render(
      <FloatingButton
        onClick={mockFunction}
        icon={<FontAwesomeIcon size="lg" icon={faArrowUp} color="white" />}
        label="Teste"
      />
    );

    const element = screen.getByTestId("floatingMainContent");

    fireEvent.click(element);

    expect(mockFunction).toHaveBeenCalled();
  });

  test("scroll up when scrollUp content is clicked", () => {
    render(
      <FloatingButton
        onClick={mockFunction}
        icon={<FontAwesomeIcon size="lg" icon={faArrowUp} color="white" />}
        label="Teste"
        scrollUp
      />
    );

    fireEvent.scroll(window, { target: { scrollY: 101 } });

    const scrollUpElement = screen.getByTestId("floatingScrollUpContent");
    fireEvent.click(scrollUpElement);

    setTimeout(() => {
      const invisibleElement = screen.getByTestId("floatingButtonElement");
      expect(invisibleElement).toHaveClass("isInvisible");
    }, 500);
  });
});
