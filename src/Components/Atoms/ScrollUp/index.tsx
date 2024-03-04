import { useEffect, useState } from 'react';
import styles from './ScrollUp.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Text from '../Text';

export default function ScrollUp() {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        const scrollTop = window.scrollY;

        if (scrollTop > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <div className={`${styles.container} ${!isVisible ? styles.isInvisible : ''}`} onClick={scrollToTop}>
            <div>
                <FontAwesomeIcon size='xl' icon={faArrowUp} color='white' />
            </div>
            <Text>Voltar ao topo</Text>
        </div>
    )
}
