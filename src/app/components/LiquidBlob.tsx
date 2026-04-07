import { motion } from 'motion/react';

interface LiquidBlobProps {
  color: string;
  size?: number;
  delay?: number;
}

export function LiquidBlob({ color, size = 400, delay = 0 }: LiquidBlobProps) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}40 0%, ${color}10 50%, transparent 100%)`,
      }}
      animate={{
        x: [0, 100, -100, 50, 0],
        y: [0, -80, 50, -50, 0],
        scale: [1, 1.2, 0.8, 1.1, 1],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  );
}
