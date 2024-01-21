import { useEffect, useState } from 'react';
import style from './Home.module.scss'
import ScheduleRepositories from '../../Services/repositories/ScheduleRepositories';
import LogoImage from '../../Components/Atoms/LogoImage';
import ButtonPattern from '../../Components/Atoms/ButtonPattern';
import TextPattern from '../../Components/Atoms/TextPattern';

export default function Home() {
    const [isServiceOpen, setIsServiceOpen] = useState<boolean>();
    const [closingTime, setClosingTime] = useState("");
    const [openingTime, setOpeningTime] = useState("");
    const [randomImage, setRandomImage] = useState("Harley");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ScheduleRepositories.getSchedule();

                setIsServiceOpen(data.isOpen);
                setClosingTime(data.closingTime);
                setOpeningTime(data.openingTime);
            } catch (error) {
                console.error(
                    "Erro ao obter dados do horário de funcionamento:",
                    error,
                );
            }
        };
        fetchData();
    }, []);

    const generateRandomName = () => {
        const length = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomName = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomName += characters.charAt(randomIndex);
        }

        return randomName;
    };

    if (isServiceOpen) {
        return (
            <section className={style.homeContainer}>
                <LogoImage />
                <TextPattern>Para fazer seu pedido, preencha os campos abaixo</TextPattern>
                <ButtonPattern mainText='Ir para o cardápio' type='button' />
                <TextPattern isLink >Precisa de Ajuda?</TextPattern>
            </section>
        )
    } else {
        return (
            <section className={style.homeContainer}>
                <div className={style.serviceClose}>
                    <LogoImage />
                    <div className={style.infoSchedule}>
                        <h3>Estamos Fechados</h3>
                        <p>Horário de Funcionamento da Lanchonete:</p>
                        <p>
                            de <strong>{openingTime}</strong> até{" "}
                            <strong>{closingTime}</strong>
                        </p>
                    </div>
                    <img
                        onClick={() => setRandomImage(generateRandomName())}
                        src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${randomImage}`}
                        alt="avatar"
                        className={style.randomImage}
                    />
                </div>
            </section>
        )
    }


}
