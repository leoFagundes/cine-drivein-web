import { useEffect, useState } from 'react';
import style from './Home.module.scss'
import ScheduleRepositories from '../../Services/repositories/ScheduleRepositories';
import { FormTemplate } from "../../Components/Templates/FormTemplate/FormTemplate";
import { CloseTemplate } from "../../Components/Templates/CloseTemplate/CloseTemplate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Caption from '../../Components/Molecules/Caption';
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import { Modal } from "../../Components/Organism/Modal";
import styles from "../../Components/Organism/Modal/Modal.module.scss";
import Text from "../../Components/Atoms/Text";
import { useNavigate } from 'react-router-dom';

const ERROR_NAME_MESSAGE = 'Nome de usuário inválido.'
const ERROR_PHONE_MESSAGE = 'Número de telefone inválido.'
const ERROR_SPOT_MESSAGE = 'Vaga inválida.'

export default function Home() {
    const [scheduleInformation, setScheduleInformation] = useState({
        openingTime: '',
        closingTime: '',
        isServiceOpen: false
    })
    const [nameError, setNameError] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [spotError, setSpotError] = useState<string>('');
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [spot, setSpot] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isParkingModalOpen, setIsParkinModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await ScheduleRepositories.getSchedule();

                setScheduleInformation({
                    isServiceOpen: data.isOpen,
                    closingTime: data.closingTime,
                    openingTime: data.openingTime
                });
                setIsLoading(false);
            } catch (error) {
                console.error(
                    "Erro ao obter dados do horário de funcionamento:",
                    error,
                );
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleNameWith = (value: string) => {
        setName(value);
        setNameError('');
    }

    const handlePhoneWith = (value: string) => {
        setPhone(value);
        setPhoneError('');
    }

    const handleSpotWith = (value: string) => {
        setSpot(value);
        setSpotError('');
    }


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

        const orderUrl = `/order?name=${name}&phone=${phone}&spot=${spot}`;
        navigate(orderUrl);
    }

    const openWhatsApp = () => {
        const formattedNumber = "+55 (61) 99961-9114";
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}`;
        window.open(whatsappUrl, "_blank");
    };


    if (isLoading) return <LoadingFullScreenTemplate />

    if (scheduleInformation.isServiceOpen) {
        const PARKING_CAPTION_COMPONENT = <Caption onClick={() => setIsParkinModalOpen(true)} isLink icon={<FontAwesomeIcon color='#0088c2' icon={faCircleInfo} />} label='Como encontrar minha vaga?' />
        const renderModalInfo = () => (
            <>
                <img className={styles.modalImg} src="https://i.ytimg.com/vi/J-ZKsCpTNPc/maxresdefault.jpg"
                    alt="Imagem da vaga" />
                <Text marginTop="16px" fontColor='placeholder-color' fontWeight='semibold'>
                    Para encontrar sua vaga consulte os <Text fontColor='primary-color' fontWeight='bold'>dígitos</Text> que se
                    encontram na <Text fontColor='primary-color' fontWeight='bold'>lateral esquerda</Text>. Como mostra na
                    imagem acima.
                </Text>
            </>
        )

        return (
            <>
                <FormTemplate
                    label="Para fazer seu pedido, preencha os campos abaixo"
                    inputs={[
                        {
                            value: name,
                            placeholder: 'Nome',
                            onChange: (e) => handleNameWith(e.target.value),
                            type: 'text',
                            errorLabel: nameError
                        },
                        {
                            value: phone,
                            placeholder: 'Telefone',
                            onChange: (e) => handlePhoneWith(e.target.value),
                            type: 'text',
                            errorLabel: phoneError
                        },
                        {
                            value: spot,
                            placeholder: 'Vaga',
                            onChange: (e) => handleSpotWith(e.target.value),
                            type: 'number',
                            errorLabel: spotError,
                            caption: PARKING_CAPTION_COMPONENT
                        }
                    ]}
                    buttonLabel='Ir para o cardápio'
                    buttonOnClick={handleSubmit}
                    linkLabel='Precisa de Ajuda?'
                    linkIcon={<FontAwesomeIcon color='#268f3ff5' icon={faWhatsapp} />}
                    linkOnClick={openWhatsApp}
                />

                <Modal isOpen={isParkingModalOpen} onClose={() => setIsParkinModalOpen(false)}>
                    {renderModalInfo()}
                </Modal>
            </>
        )
    }

    return (
        <CloseTemplate>
            <div className={style.infoSchedule}>
                <h3>Estamos Fechados</h3>
                <p>Horário de Funcionamento da Lanchonete:</p>
                <p>
                    de <strong>{scheduleInformation.openingTime}</strong> até{" "}
                    <strong>{scheduleInformation.closingTime}</strong>
                </p>
            </div>
        </CloseTemplate>
    )

}
