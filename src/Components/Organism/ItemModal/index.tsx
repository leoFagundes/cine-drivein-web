import styles from './ItemModal.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { Fragment, useEffect, useState } from "react";
import { Item, Order } from '../../../Types/types';
import Text from '../../Atoms/Text';
import { Input } from '../../Atoms/Input/Input';
import { Dropdown } from '../../Atoms/Dropdown';
import Button from '../../Atoms/Button';

type ItemModalType = {
    item: Item | null;
    isOpen: boolean;
    onClose: VoidFunction;
    setOrder: React.Dispatch<React.SetStateAction<Order>>
    order: Order
    showAlert: (message: string, type: string) => void
}

type KeyType = 'additional' | 'additionalSauce' | 'additionalDrink' | 'additionalSweet';

const ERROR_INVALID_VALUE = 'Escolha um valor para o acompanhamento.'

export default function ItemModal({ item, onClose, isOpen, setOrder, order, showAlert }: ItemModalType) {
    const [valueError, setValueError] = useState({
        additionalError: '',
        additionalSauceError: '',
        additionalDrinkError: '',
        additionalSweetError: '',
    });
    const [itemToAdd, setItemToAdd] = useState({
        observation: '',
        quantity: 0,
        additional: [],
        additionalSauce: [],
        additionalDrink: [],
        additionalSweet: [],
    })


    const validateSubitemForm = () => {
        let isValid = true;
        const newValueError = { ...valueError };

        if (itemToAdd.additional.length !== 0 && item?.additionals?.length !== undefined && item.additionals.length > 0) {
            newValueError.additionalError = ERROR_INVALID_VALUE;
            isValid = false;
        } else {
            newValueError.additionalError = '';
        }

        if (itemToAdd.additionalSauce.length === 0 && item?.additionals_sauces?.length !== undefined && item.additionals_sauces.length > 0) {
            newValueError.additionalSauceError = ERROR_INVALID_VALUE;
            isValid = false;
        } else {
            newValueError.additionalSauceError = '';
        }

        if (itemToAdd.additionalDrink.length !== 0 && item?.additionals_drinks?.length !== undefined && item.additionals_drinks.length > 0) {
            newValueError.additionalDrinkError = ERROR_INVALID_VALUE;
            isValid = false;
        } else {
            newValueError.additionalDrinkError = '';
        }

        if (itemToAdd.additionalSweet.length !== 0 && item?.additionals_sweets?.length !== undefined && item.additionals_sweets.length > 0) {
            newValueError.additionalSweetError = ERROR_INVALID_VALUE;
            isValid = false;
        } else {
            newValueError.additionalSweetError = '';
        }

        setValueError(newValueError);
        return isValid;
    };

    const updateItem = (key: KeyType, value: string | string[]) => {
        setItemToAdd(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [isOpen]);

    const handleConfirmClick = () => {
        if (!validateSubitemForm()) {
            console.log('Formulário Inválido.')
            return
        }

        if (item) {
            if (isNaN(itemToAdd.quantity) || item.quantity < 1) {
                setItemToAdd({
                    ...itemToAdd,
                    quantity: 1
                })
            }
        }

        const updatedItems = [...order.items];

        if (item) {
            var quantity = itemToAdd.quantity
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1
            }
            for (let i = 0; i < quantity; i++) {
                updatedItems.push({
                    item: item,
                    observation: itemToAdd.observation,
                    additional: itemToAdd.additional[i],
                    additional_sauce: itemToAdd.additionalSauce[i],
                    additional_drink: itemToAdd.additionalDrink[i],
                    additional_sweet: itemToAdd.additionalSweet[i],
                });
            }
        }

        setOrder({
            ...order,
            items: updatedItems,
        });

        setItemToAdd({
            observation: '',
            quantity: 0,
            additional: [],
            additionalSauce: [],
            additionalDrink: [],
            additionalSweet: [],
        });

        setValueError({
            additionalError: '',
            additionalSauceError: '',
            additionalDrinkError: '',
            additionalSweetError: '',
        })

        onClose();
        showAlert('Item adicionado ao carrinho!', "success");
    };

    const handleCloseClick = () => {
        setItemToAdd({
            observation: '',
            quantity: 0,
            additional: [],
            additionalSauce: [],
            additionalDrink: [],
            additionalSweet: [],
        })

        setValueError({
            additionalError: '',
            additionalSauceError: '',
            additionalDrinkError: '',
            additionalSweetError: '',
        })

        onClose()
    }

    return (
        <>
            {
                isOpen && item &&
                <div className={styles.container}>
                    <div className={styles.itemImage}>
                        <div>
                            {item.photo ?
                                <div className={styles.image} style={{ backgroundImage: `url("${item.photo}")` }} />
                                :
                                <FontAwesomeIcon size='3x' icon={faImages} color='white' />
                            }
                        </div>
                    </div>
                    <div className={styles.itemInfo}>
                        <Text fontSize='extraLarge' fontWeight='bold'>{item.name}</Text>
                        <Text fontSize='mediumSmall'>{item.description}</Text>
                    </div>
                    <div className={styles.inputs}>

                        <Input
                            value={itemToAdd.observation}
                            placeholder='Observação (ex: sem salada)'
                            onChange={(e) => setItemToAdd({ ...itemToAdd, observation: e.target.value })}
                        />

                        <Input
                            type='number'
                            value={itemToAdd.quantity !== 0 ? itemToAdd.quantity.toString() : ''}
                            placeholder='Quantidade'
                            onChange={(e) => setItemToAdd({ ...itemToAdd, quantity: parseInt(e.target.value) })}
                            marginTop='22px'
                            marginBottom='14px'
                        />

                        {[...Array(Math.max(isNaN(itemToAdd.quantity) ? 1 : itemToAdd.quantity, 1))].map((_, index) => (
                            <Fragment key={index}>
                                {index > 0 && <br></br>}
                                {item.additionals && item.additionals.length > 0 && (
                                    <Dropdown
                                        options={item.additionals.map((option: any) => option.additionalItem.name)}
                                        value={itemToAdd.additional[index] || ''}
                                        placeholder={itemToAdd.quantity <= 1 || isNaN(itemToAdd.quantity) ? 'Escolha um acompanhamento' : `Escolha o ${index + 1}º acompanhamento`}
                                        onChange={(value) => updateItem('additional', { ...itemToAdd.additional, [index]: value })}
                                        marginTop='8px'
                                        errorLabel={valueError.additionalError}
                                    />
                                )}
                                {item.additionals_sauces && item.additionals_sauces.length > 0 && (
                                    <Dropdown
                                        options={item.additionals_sauces.map((option: any) => option.additionalItem.name)}
                                        value={itemToAdd.additionalSauce[index] || ''}
                                        placeholder={itemToAdd.quantity <= 1 || isNaN(itemToAdd.quantity) ? 'Escolha um molho' : `Escolha o ${index + 1}º molho`}
                                        onChange={(value) => updateItem('additionalSauce', { ...itemToAdd.additionalSauce, [index]: value })}
                                        marginTop='8px'
                                        errorLabel={valueError.additionalSauceError}
                                    />
                                )}
                                {item.additionals_drinks && item.additionals_drinks.length > 0 && (
                                    <Dropdown
                                        options={item.additionals_drinks.map((option: any) => option.additionalItem.name)}
                                        value={itemToAdd.additionalDrink[index] || ''}
                                        placeholder={itemToAdd.quantity <= 1 || isNaN(itemToAdd.quantity) ? 'Escolha uma bebida' : `Escolha a ${index + 1}ª bebida`}
                                        onChange={(value) => updateItem('additionalDrink', { ...itemToAdd.additionalDrink, [index]: value })}
                                        marginTop='8px'
                                        errorLabel={valueError.additionalDrinkError}
                                    />
                                )}
                                {item.additionals_sweets && item.additionals_sweets.length > 0 && (
                                    <Dropdown
                                        options={item.additionals_sweets.map((option: any) => option.additionalItem.name)}
                                        value={itemToAdd.additionalSweet[index] || ''}
                                        placeholder={itemToAdd.quantity <= 1 || isNaN(itemToAdd.quantity) ? 'Escolha um doce' : `Escolha a ${index + 1}ª sobremesa`}
                                        onChange={(value) => updateItem('additionalSweet', { ...itemToAdd.additionalSweet, [index]: value })}
                                        marginTop='8px'
                                        errorLabel={valueError.additionalSweetError}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </div>
                    <div className={styles.itemValue}>
                        <Text fontSize='mediumLarge' fontWeight='semibold'>
                            Valor: R$ {itemToAdd.quantity > 1 ? (item.value * itemToAdd.quantity).toFixed(2) : item.value.toFixed(2)}
                        </Text>
                    </div>
                    <div className={styles.buttons}>
                        <Button
                            onClick={() => handleCloseClick()} label='Voltar ao cardápio'
                            backGroundColor='invalid-color'
                        />
                        <Button
                            onClick={() => handleConfirmClick()}
                            label='Adicionar item ao pedido'
                        />
                    </div>
                </div>
            }
        </>

    )
}
