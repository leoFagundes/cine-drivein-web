import { useEffect, useState } from "react";
import Button from "../../Atoms/Button";
import LogoImage from "../../Atoms/LogoImage";
import Text from "../../Atoms/Text";
import styles from "./FeedbackModal.module.scss";
import Caption from "../../Molecules/Caption";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

type FeedbackModalType = {
  isOpen: boolean;
  onClose: VoidFunction;
  linkWhatsapp: VoidFunction;
};

export default function FeedbackModal({
  isOpen,
  onClose,
  linkWhatsapp,
}: FeedbackModalType) {
  const [randomImage, setRandomImage] = useState("Harley");
  const [name, setName] = useState("");

  useEffect(() => {
    if (localStorage.getItem("name")) {
      var localStorageName = localStorage.getItem("name");
      setName(localStorageName ? localStorageName : "");
      console.log("Nome recuperado do localStorage:", name);
    } else {
      console.log('A variável "name" não está armazenada no localStorage.');
    }
  }, [isOpen, setName, name]);

  const getRandomDiceImageString = () => {
    const length = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomString = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  };

  return (
    <>
      {isOpen && (
        <div className={styles.container}>
          <div className={styles.content}>
            <LogoImage marginTop="32px" />
            <Text fontSize="mediumLarge" fontWeight="medium" marginTop="22px">
              Recebemos seu pedido{name && `, ${name},`} e já estamos nos
              preparando para colocar as mãos na massa!
            </Text>
            <img
              onClick={() => setRandomImage(getRandomDiceImageString())}
              src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${randomImage}`}
              alt="avatar"
              className={styles.randomImage}
            />
            <Text fontSize="small" fontWeight="regular" marginTop="6px">
              Aguarde no carro que em breve um garçom irá entregar o seu pedido.
            </Text>
            <Button label="Voltar ao início" onClick={() => onClose()} />
            <Caption
              onClick={linkWhatsapp}
              isLink
              icon={<FontAwesomeIcon color="#268f3ff5" icon={faWhatsapp} />}
              label={"Precisa de Ajuda?"}
            />
          </div>
        </div>
      )}
    </>
  );
}
