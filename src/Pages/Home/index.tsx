import { useEffect, useState } from 'react';
import style from './Home.module.scss'
import ScheduleRepositories from '../../Services/repositories/ScheduleRepositories';
import {FormTemplate} from "../../Components/Templates/FormTemplate/FormTemplate";
import {CloseTemplate} from "../../Components/Templates/CloseTemplate/CloseTemplate";

export default function Home() {
    const [isServiceOpen, setIsServiceOpen] = useState<boolean>();
    const [closingTime, setClosingTime] = useState("");
    const [openingTime, setOpeningTime] = useState("");

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

    if (isServiceOpen) {
        return (
            <FormTemplate
                label="Para fazer seu pedido, preencha os campos abaixo"
                inputs={[{
                    placeholder: 'teste',
                    onChange: () => console.log('test'),
                    type: 'password'
                }]}
                buttonLabel='Ir para o cardápio'
                onClick={() => console.log('test')}
                linkLabel='Precisa de Ajuda?'
            />
        )
    }

    return (
        <CloseTemplate>
            <div className={style.infoSchedule}>
                <h3>Estamos Fechados</h3>
                <p>Horário de Funcionamento da Lanchonete:</p>
                <p>
                    de <strong>{openingTime}</strong> até{" "}
                    <strong>{closingTime}</strong>
                </p>
            </div>
        </CloseTemplate>
    )

}
