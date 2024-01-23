import { useEffect, useState } from 'react';
import style from './Home.module.scss'
import ScheduleRepositories from '../../Services/repositories/ScheduleRepositories';
import LogoImage from '../../Components/Atoms/LogoImage';
import Button from '../../Components/Atoms/Button';
import Text from '../../Components/Atoms/Text';
import { Input } from '../../Components/Atoms/Input/Input';

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

    if (isServiceOpen) {
        return (
            <section className={style.homeContainer}>
                <LogoImage />
                <Text fontSize='extraLarge'>Para fazer seu pedido, preencha os campos abaixo</Text>
                <Input placeholder='teste' onChange={() => console.log('teste')} type='password' />
                <Button label='Ir para o cardápio' onClick={() => console.log('')} />
                <Text isLink >Precisa de Ajuda?</Text>
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
                        onClick={() => setRandomImage(getRandomDiceImageString())}
                        src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${randomImage}`}
                        alt="avatar"
                        className={style.randomImage}
                    />
                </div>
            </section>
        )
    }


}
