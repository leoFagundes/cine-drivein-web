import { useEffect, useState } from "react";
import style from "./Home.module.scss";
import ScheduleRepositories from "../../Services/repositories/ScheduleRepositories";
import { FormTemplate } from "../../Components/Templates/FormTemplate/FormTemplate";
import { CloseTemplate } from "../../Components/Templates/CloseTemplate/CloseTemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import Caption from "../../Components/Molecules/Caption";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import { Modal } from "../../Components/Organism/Modal";
import styles from "../../Components/Organism/Modal/Modal.module.scss";
import Text from "../../Components/Atoms/Text";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "../../Components/Molecules/Alert";
import { Schedule } from "../../Types/types";
import FeedbackModal from "../../Components/Organism/FeedbackModal";

const ERROR_NAME_MESSAGE = "Nome de usuário inválido.";
const ERROR_PHONE_MESSAGE = "Número de telefone inválido.";
const ERROR_PHONE_FORMAT_MESSAGE = "Deve estar no formato (DD) 9XXXX-XXXX";
const ERROR_SPOT_MESSAGE = "Vaga inválida.";
const ERROR_SPOT_MESSAGE2 = "Sua vaga são 3 ou 4 dígitos";
const ORDER_CREATED_SUCCESSFULLY = "Pedido enviado com sucesso";

export default function Home() {
  const [scheduleInformation, setScheduleInformation] = useState<Schedule>({
    openingTime: "",
    closingTime: "",
    isOpen: false,
  });
  const [nameError, setNameError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [spotError, setSpotError] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [spot, setSpot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isParkingModalOpen, setIsParkinModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    isOpen: boolean;
    message: string;
    type: string;
  }>({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const showAlert = (message: string, type: string) => {
    setAlertInfo({
      isOpen: true,
      message: message,
      type: type,
    });
  };

  const closeAlert = () => {
    setAlertInfo({
      isOpen: false,
      message: "",
      type: "",
    });
  };

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedPhone = localStorage.getItem("phone");

    if (storedName) {
      setName(storedName);
    }

    if (storedPhone) {
      setPhone(storedPhone);
    }
  }, []);

  useEffect(() => {
    if (from === "201:OrderCreated") {
      showAlert(ORDER_CREATED_SUCCESSFULLY, "success");
      setIsFeedbackModalOpen(true);
      navigate("/", { replace: true });
    }
  }, [from, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await ScheduleRepositories.getSchedule();
        setScheduleInformation({
          isOpen: data.isOpen,
          closingTime: data.closingTime,
          openingTime: data.openingTime,
        });
        setIsLoading(false);
      } catch (error) {
        console.error(
          "Erro ao obter dados do horário de funcionamento:",
          error
        );
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Buscando status de abertura...");
        const data = await ScheduleRepositories.getSchedule();
        if (scheduleInformation.isOpen !== data.isOpen) {
          console.log(scheduleInformation.isOpen, data.isOpen);
          window.location.reload();
        }
      } catch (error) {
        console.error(
          "Erro ao obter dados do horário de funcionamento:",
          error
        );
      }
    };

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [scheduleInformation]);

  const handleNameWith = (value: string) => {
    setName(value);
    setNameError("");
    localStorage.setItem("name", value);
  };

  const handlePhoneWith = (value: string, isBackspace: boolean) => {
    const phoneDigits = value.replace(/\D/g, "");

    let formattedNumber = "";
    if (phoneDigits.length === 1) {
      formattedNumber = `(${value}`;
    } else if (phoneDigits.length >= 2) {
      formattedNumber = `(${phoneDigits.slice(0, 2)}`;
    }
    if (phoneDigits.length >= 3) {
      formattedNumber += `) ${phoneDigits.slice(2, 7)}`;
    }
    if (phoneDigits.length >= 7) {
      formattedNumber += `-${phoneDigits.slice(7, 11)}`;
    }

    setPhone(formattedNumber);
    setPhoneError("");
    localStorage.setItem("phone", formattedNumber);

    if (value.length > 15) {
      setPhone(value.slice(0, 15));
    }

    if (isBackspace && value.endsWith("-")) {
      setPhone(value.slice(0, -1));
    }
  };

  const handleSpotWith = (value: string) => {
    setSpot(value);
    setSpotError("");
  };

  const isValidPhoneNumber = (phoneNumber: string) => {
    const phoneDigits = phoneNumber.replace(/\D/g, "");
    return phoneDigits.length === 11 && /^\d+$/.test(phoneDigits);
  };

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError(ERROR_NAME_MESSAGE);
      isValid = false;
    } else {
      setNameError("");
    }

    if (!phone.trim()) {
      setPhoneError(ERROR_PHONE_MESSAGE);
      isValid = false;
    } else if (!isValidPhoneNumber(phone)) {
      setPhoneError(ERROR_PHONE_FORMAT_MESSAGE);
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!spot.trim()) {
      setSpotError(ERROR_SPOT_MESSAGE);
      isValid = false;
    } else if (!(spot.length === 3 || spot.length === 4)) {
      setSpotError(ERROR_SPOT_MESSAGE2);
      isValid = false;
    } else {
      setSpotError("");
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!scheduleInformation.isOpen) {
      return window.location.reload;
    }

    if (!validateForm()) {
      console.log("Formulário Inválido.");
      return;
    }

    const orderUrl = `/order?name=${name}&phone=${phone}&spot=${spot}`;
    navigate(orderUrl);
  };

  const openWhatsApp = () => {
    const formattedNumber = "+55 (61) 99961-9114";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  if (isLoading) return <LoadingFullScreenTemplate />;

  if (scheduleInformation.isOpen) {
    const PARKING_CAPTION_COMPONENT = (
      <Caption
        onClick={() => setIsParkinModalOpen(true)}
        isLink
        icon={<FontAwesomeIcon color="#0088c2" icon={faCircleInfo} />}
        label="Como encontrar minha vaga?"
      />
    );
    const renderModalInfo = () => (
      <>
        <img
          className={styles.modalImg}
          src="https://i.ytimg.com/vi/J-ZKsCpTNPc/maxresdefault.jpg"
          alt="Imagem da vaga"
        />
        <Text
          marginTop="16px"
          fontColor="placeholder-color"
          fontWeight="semibold"
        >
          Para encontrar sua vaga consulte os{" "}
          <Text fontColor="primary-color" fontWeight="bold">
            dígitos
          </Text>{" "}
          que se encontram na{" "}
          <Text fontColor="primary-color" fontWeight="bold">
            lateral esquerda
          </Text>
          . Como mostra na imagem acima.
        </Text>
      </>
    );

    return (
      <>
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          linkWhatsapp={openWhatsApp}
        />
        <FormTemplate
          label="Para fazer seu pedido, preencha os campos abaixo"
          inputs={[
            {
              value: name,
              placeholder: "Nome",
              onChange: (e) => handleNameWith(e.target.value),
              type: "text",
              errorLabel: nameError,
            },
            {
              value: phone,
              placeholder: "Telefone",
              onChange: (e) =>
                handlePhoneWith(
                  e.target.value,
                  e.target.value.length < phone.length
                ),
              type: "text",
              errorLabel: phoneError,
            },
            {
              value: spot,
              placeholder: "Vaga",
              onChange: (e) => handleSpotWith(e.target.value),
              type: "number",
              errorLabel: spotError,
              caption: PARKING_CAPTION_COMPONENT,
            },
          ]}
          buttonLabel="Ir para o cardápio"
          buttonOnClick={handleSubmit}
          linkLabel="Precisa de Ajuda?"
          linkIcon={<FontAwesomeIcon color="#268f3ff5" icon={faWhatsapp} />}
          linkOnClick={openWhatsApp}
          alert={
            <Alert
              isAlertOpen={alertInfo.isOpen}
              setIsAlertOpen={closeAlert}
              message={alertInfo.message}
              alertDisplayTime={3000}
              onClose={closeAlert}
              type={alertInfo.type}
            />
          }
        />

        <Modal
          isOpen={isParkingModalOpen}
          onClose={() => setIsParkinModalOpen(false)}
        >
          {renderModalInfo()}
        </Modal>
      </>
    );
  }

  return (
    <CloseTemplate linkWhatsapp={openWhatsApp}>
      <div className={style.infoSchedule}>
        <h3>Estamos Fechados</h3>
        <p>Horário de Funcionamento da Lanchonete:</p>
        <p>
          de <strong>{scheduleInformation.openingTime}</strong> até{" "}
          <strong>{scheduleInformation.closingTime}</strong>
        </p>
      </div>
    </CloseTemplate>
  );
}
