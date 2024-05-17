import styles from "./CloseTemplate.module.scss";
import LogoImage from "../../Atoms/LogoImage";
import { ReactElement, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Caption from "../../Molecules/Caption";
import Text from "../../Atoms/Text";

type CloseTemplateType = {
  children: ReactElement;
  linkWhatsapp: VoidFunction;
};

export const CloseTemplate = ({
  children,
  linkWhatsapp,
}: CloseTemplateType) => {
  const [randomImage, setRandomImage] = useState("Harley");
  const [isTextImageVisible, setIsTextImageVisible] = useState(true);

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
    <section className={styles.container}>
      <div className={styles.serviceClose}>
        <LogoImage marginTop="32px" />
        {children}
        <div className={styles.imageContent}>
          <img
            onClick={() => {
              setRandomImage(getRandomDiceImageString());
              setIsTextImageVisible(false);
            }}
            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${randomImage}`}
            alt="avatar"
            className={styles.randomImage}
          />
          {isTextImageVisible && (
            <Text fontSize="extraSmall" fontWeight="medium">
              Clique em mim!
            </Text>
          )}
        </div>
        <Caption
          onClick={linkWhatsapp}
          isLink
          icon={<FontAwesomeIcon color="#268f3ff5" icon={faWhatsapp} />}
          label={"Precisa de Ajuda?"}
        />
      </div>
    </section>
  );
};
