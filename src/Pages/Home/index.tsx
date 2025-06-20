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
import { Item, Schedule } from "../../Types/types";
import FeedbackModal from "../../Components/Organism/FeedbackModal";
import ItemRepositories from "../../Services/repositories/ItemRepositories";
import RecentOrdersCard from "../../Components/Organism/RecentOrdersCard";
import Button from "../../Components/Atoms/Button";

const ERROR_NAME_MESSAGE = "Nome de usuário inválido.";
const ERROR_PHONE_MESSAGE = "Número de telefone inválido.";
const ERROR_PHONE_FORMAT_MESSAGE = "Deve estar no formato (DD) 9XXXX-XXXX";
const ERROR_SPOT_MESSAGE = "Vaga inválida.";
const ERROR_SPOT_MESSAGE2 = "Sua vaga contém 3 ou 4 dígitos";
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
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(() => {
    const LOCATION_KEY = "user_location";
    const TIME_LIMIT = 45 * 60 * 1000; // 30 minutos em milissegundos
    const now = new Date().getTime();

    // Tenta pegar dados do localStorage
    const savedDataString = localStorage.getItem(LOCATION_KEY);

    if (savedDataString) {
      const savedData = JSON.parse(savedDataString);
      if (savedData.timestamp && now - savedData.timestamp < TIME_LIMIT) {
        return false;
      }
    }
    return true;
  });
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

  function preloadImages(urls: string[]) {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }

  function getUserLocation() {
    const LOCATION_KEY = "user_location";
    const TIME_LIMIT = 45 * 60 * 1000; // 30 minutos em milissegundos
    const now = new Date().getTime();

    // Tenta pegar dados do localStorage
    const savedDataString = localStorage.getItem(LOCATION_KEY);

    if (savedDataString) {
      try {
        const savedData = JSON.parse(savedDataString);
        if (savedData.timestamp && now - savedData.timestamp < TIME_LIMIT) {
          // Dados recentes, usa eles
          console.log(
            "Usando localização salva:",
            savedData.latitude,
            savedData.longitude
          );
          setIsLocationModalOpen(false);
          return; // Sai da função, não precisa pedir localização
        }
      } catch (err) {
        // Se der erro no parse, continua para pedir nova localização
        console.error("Erro ao ler dados de localização do localStorage", err);
      }
    }

    // Se chegou aqui, precisa pedir a localização nova
    if (!("geolocation" in navigator)) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      setIsLocationModalOpen(false);
      return;
    }

    setIsLocationModalOpen(true); // abre modal

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Nova localização obtida:", latitude, longitude);
        // Salva no localStorage com timestamp
        localStorage.setItem(
          LOCATION_KEY,
          JSON.stringify({
            latitude,
            longitude,
            timestamp: new Date().getTime(),
          })
        );
        setIsLocationModalOpen(false);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        alert(
          "Não foi possível obter sua localização. Verifique as permissões do navegador."
        );
        setIsLocationModalOpen(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedPhone = localStorage.getItem("phone");
    const ilustrativeSpotImage =
      "https://cine-drive-in.s3.amazonaws.com/ilustrative-spot-photo3.png";

    const preloadItemImages = async () => {
      try {
        const items = await ItemRepositories.getItems();
        const imagePhotos = items.map((item: Item) => item.photo);
        imagePhotos.push(ilustrativeSpotImage);
        preloadImages(imagePhotos);
      } catch (error) {
        console.error("Não foi possível pré-carregar as imagens!");
      }
    };

    preloadItemImages();

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

    if (spot.startsWith("0")) {
      setIsParkinModalOpen(true);
      setSpotError(ERROR_SPOT_MESSAGE);
      return;
    }

    const orderUrl = `/order?name=${name}&phone=${phone}&spot=${spot}`;
    navigate(orderUrl);
  };

  const openWhatsApp = () => {
    // const phoneNumber = "5561999619114";
    const phoneNumber = "556185119092";
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
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
          src="https://cine-drive-in.s3.amazonaws.com/ilustrative-spot-photo3.png"
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
          onClose={() => {
            // setIsFeedbackModalOpen(false);
            document.location.reload();
          }}
          linkWhatsapp={openWhatsApp}
        />

        <FormTemplate
          label="Para fazer seu pedido, preencha os campos abaixo"
          inputs={[
            {
              value: name,
              placeholder: "Nome ou Apelido",
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
        <RecentOrdersCard />

        <Modal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          patternCloseMethods
        >
          <div className={style.userLocationModal}>
            <h2>Precisamos da sua localização</h2>
            <p>
              Para garantir que você está dentro da área de cobertura e evitar
              pedidos inválidos, solicitamos sua localização.
            </p>
            <p>
              Realizar pedidos online com o objetivo deliberado de prejudicar um
              estabelecimento, gerando prejuízo financeiro sem a intenção real
              de consumir o produto ou serviço, pode ser enquadrado como crime
              previsto na legislação brasileira, como estelionato ou dano, além
              de configurar ato ilícito passível de responsabilização civil.
            </p>
            <p>
              (Art. 171 e 163 do Código Penal, Art. 186 e 927 do Código Civil,
              Lei 12.965/2014 - Marco Civil da Internet)
            </p>

            <Button label="Permitir localização" onClick={getUserLocation} />
            <span onClick={openWhatsApp}>Precisa de ajuda?</span>
          </div>
        </Modal>

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
