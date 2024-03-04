import styles from './CloseTemplate.module.scss';
import LogoImage from "../../Atoms/LogoImage";
import { ReactElement, useState } from "react";

type CloseTemplateType = {
    children: ReactElement;
}

export const CloseTemplate = ({ children }: CloseTemplateType) => {
    const [randomImage, setRandomImage] = useState("Harley");

    const getRandomDiceImageString = () => {
        const length = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomString = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }

        return randomString;
    };

    return (
        <section className={styles.container}>
            <div className={styles.serviceClose}>
                <LogoImage marginTop='32px' />
                {children}
                <img
                    onClick={() => setRandomImage(getRandomDiceImageString())}
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${randomImage}`}
                    alt="avatar"
                    className={styles.randomImage}
                />
            </div>
        </section>
    );
}