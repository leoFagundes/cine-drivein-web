import { ChangeEvent, useEffect, useState } from 'react';
import style from './Home.module.scss'
import ScheduleRepositories from '../../Services/repositories/ScheduleRepositories';
import { FormTemplate } from "../../Components/Templates/FormTemplate/FormTemplate";
import { CloseTemplate } from "../../Components/Templates/CloseTemplate/CloseTemplate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const ERROR_NAME_MESSAGE = 'Nome de usuário inválido.'
const ERROR_PHONE_MESSAGE = 'Número de telefone inválido.'
const ERROR_SPOT_MESSAGE = 'Vaga inválida.'

export default function Home() {
    const [isServiceOpen, setIsServiceOpen] = useState<boolean>();
    const [closingTime, setClosingTime] = useState("");
    const [openingTime, setOpeningTime] = useState("");
    const [nameError, setNameError] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [spotError, setSpotError] = useState<string>('');
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [spot, setSpot] = useState("");

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

    const handleInputChange = (field: string, value: string | number | boolean) => {
        switch (field) {
            case "name":
                setName(value as string);
                setNameError('');
                break;
            case "phone":
                setPhone(value as string);
                setPhoneError('');
                break;
            case "spot":
                setSpot(value as string);
                setSpotError('');
                break;
            default:
                break;
        }
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
        } else {
            setPhoneError("");
        }

        if (!spot.trim() || !(spot.length === 3 || spot.length === 4)) {
            setSpotError(ERROR_SPOT_MESSAGE);
            isValid = false;
        } else {
            setSpotError("");
        }

        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            console.log('Formulário Inválido.')
            return
        }

        console.log('>Ir para o cardápio<')
    }

    const openWhatsApp = () => {
        const formattedNumber = "+55 (61) 99961-9114";
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}`;
        window.open(whatsappUrl, "_blank");
    };

    if (isServiceOpen) {
        return (
            <FormTemplate
                label="Para fazer seu pedido, preencha os campos abaixo"
                inputs={[
                    {
                        value: name,
                        placeholder: 'Nome',
                        onChange: (e) => handleInputChange("name", e.target.value),
                        type: 'text',
                        errorLabel: nameError
                    },
                    {
                        value: phone,
                        placeholder: 'Telefone',
                        onChange: (e) => handleInputChange("phone", e.target.value),
                        type: 'text',
                        errorLabel: phoneError
                    },
                    {
                        value: spot,
                        placeholder: 'Vaga',
                        onChange: (e) => handleInputChange("spot", e.target.value),
                        type: 'number',
                        errorLabel: spotError
                    }
                ]}
                buttonLabel='Ir para o cardápio'
                buttonOnClick={handleSubmit}
                linkLabel='Precisa de Ajuda?'
                linkIcon={<FontAwesomeIcon color='#268f3ff5' icon={faWhatsapp} />}
                linkOnClick={openWhatsApp}
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
