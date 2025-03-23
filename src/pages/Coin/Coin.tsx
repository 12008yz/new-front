import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

import headsImg from '/assets/coinHeads.webp';
import tailsImg from '/assets/coinTails.webp';

interface CoinProps {
    result: number | null;
    spinning: boolean;
}

const Coin: React.FC<CoinProps> = ({ result, spinning }) => {
    const controls = useAnimation();

    useEffect(() => {
        const spinCoin = () => {
            controls.start({ 
                rotateY: 3600, 
            });
        };

        const slowSpin = () => {
            const finalRotation = result === 0 ? 3600 + 180 : 3600 + 360; // Heads is red, Tails is green
            controls.start({ 
                rotateY: finalRotation,
                transition: { 
                    duration: 1.2, // Время вращения
                    ease: [0.33, 1, 0.68, 1] 
                } 
            });
        };

        if (spinning) {
            spinCoin();
        } else if (result !== null) {
            slowSpin();
        } else {
            controls.stop();
        }
    }, [spinning, result, controls]);

    return (
        <motion.div 
            className="coin" 
            animate={controls}
            style={{
                width: '200px',
                height: '200px',
                position: 'relative',
                transformStyle: 'preserve-3d'
            }}
        >
            <div 
                className="face front" 
                style={{ 
                    backgroundImage: `url(${headsImg})` 
                }} 
            />
            <div 
                className="face back" 
                style={{ 
                    backgroundImage: `url(${tailsImg})` 
                }} 
            />
        </motion.div>
    );
};

export default Coin;