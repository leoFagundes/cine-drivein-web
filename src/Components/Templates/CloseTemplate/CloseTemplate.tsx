import styles from "./CloseTemplate.module.scss";
import LogoImage from "../../Atoms/LogoImage";
import { ReactElement, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import ScheduleRepositories from "../../../Services/repositories/ScheduleRepositories";
import Caption from "../../Molecules/Caption";

type CloseTemplateType = {
  children: ReactElement;
  linkWhatsapp: VoidFunction;
};

export const CloseTemplate = ({
  children,
  linkWhatsapp,
}: CloseTemplateType) => {
  const [randomImage, setRandomImage] = useState("Harley");
  const [reloadRequired, setReloadRequired] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Buscando status de abertura...");
        const data = await ScheduleRepositories.getSchedule();
        if (data.isOpen) {
          setReloadRequired(true);
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
  }, []);

  useEffect(() => {
    if (reloadRequired) {
      window.location.reload();
    }
  }, [reloadRequired]);

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
        <img
          onClick={() => setRandomImage(getRandomDiceImageString())}
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${randomImage}`}
          alt="avatar"
          className={styles.randomImage}
        />
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
