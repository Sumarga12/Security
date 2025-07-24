
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ConfettiPiece: React.FC<{ initialX: number, initialY: number, rotate: number, color: string }> = ({ initialX, initialY, rotate, color }) => {
    const y = 200 + Math.random() * 200;
    const duration = 1.5 + Math.random() * 1.5;

    return (
        <motion.div
            style={{
                position: 'absolute',
                left: `${initialX}vw`,
                top: `${initialY}vh`,
                backgroundColor: color,
                width: '8px',
                height: '16px',
                borderRadius: '4px',
                rotate: `${rotate}deg`,
            }}
            animate={{
                y: y,
                opacity: 0,
                x: Math.random() * 100 - 50,
                rotate: rotate + 360,
            }}
            transition={{ duration: duration, ease: "easeOut" }}
        />
    );
};


const Confetti: React.FC = () => {
    const colors = ["#22C55E", "#16A34A", "#15803D", "#FFFFFF", "#F0FDF4"];
    
    const confettiPieces = useMemo(() => {
        return Array.from({ length: 100 }).map((_, index) => {
            return {
                id: index,
                initialX: Math.random() * 100,
                initialY: -10 - Math.random() * 20,
                rotate: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
            };
        });
    }, [colors]);

    return (
        <div className="absolute inset-0 pointer-events-none z-50">
            {confettiPieces.map(piece => (
                <ConfettiPiece 
                    key={piece.id}
                    initialX={piece.initialX}
                    initialY={piece.initialY}
                    rotate={piece.rotate}
                    color={piece.color}
                />
            ))}
        </div>
    );
};

export default Confetti;
