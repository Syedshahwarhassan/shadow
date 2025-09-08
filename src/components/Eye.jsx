// app/Eyes.tsx
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";


const Eyes = ({ isListening = false }) => {
  const blinkControls = useAnimation();
  const glowControls = useAnimation();
  const pulseControls = useAnimation();
  const pupilControls = useAnimation();

  const blinkRef = useRef(null);

  useEffect(() => {
    // Blinking animation
    const blinkDuration = isListening ? 0.3 : 0.2;
    const blinkDelay = isListening ? 4000 : 3000;

    const blinkSequence = async () => {
      await blinkControls.start({
        scaleY: 0.1,
        transition: { duration: blinkDuration },
      });
      await blinkControls.start({
        scaleY: 1,
        transition: { duration: blinkDuration },
      });
      blinkRef.current = setTimeout(blinkSequence, blinkDelay);
    };

    blinkSequence();

    return () => {
      if (blinkRef.current) clearTimeout(blinkRef.current);
    };
  }, [isListening, blinkControls]);

  useEffect(() => {
    if (isListening) {
      // Glow effect
      glowControls.start({
        opacity: [0.3, 1, 0.3],
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
      });

      // Pulse effect
      pulseControls.start({
        scale: [1, 1.1, 1],
        transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
      });

      // Pupil dilation
      pupilControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });
    } else {
      // Reset animations
      glowControls.stop();
      pulseControls.stop();
      glowControls.start({ opacity: 0, transition: { duration: 0.5 } });
      pulseControls.start({ scale: 1, transition: { duration: 0.5 } });
      pupilControls.start({ scale: 0, opacity: 0, transition: { duration: 0.5 } });
    }
  }, [isListening, glowControls, pulseControls, pupilControls]);

  const eyeColor = isListening ? "#04d9d9" : "#04d9ff";
  const shadowColor = isListening ? "#04d9d9" : "#04d9ff";

  return (
    <div className="flex items-center justify-center gap-10 mb-8">
      {/* Left Eye */}
      <div className="relative">
        {/* Glow effect */}
        <motion.div
          animate={glowControls}
          className="absolute inset-0 w-32 h-32 rounded-full"
          style={{
            backgroundColor: shadowColor,
            boxShadow: `0 0 20px ${shadowColor}`,
          }}
        />
        {/* Main Eye */}
        <motion.div
          animate={{ ...blinkControls, ...pulseControls }}
          className="w-28 h-28 rounded-full shadow-lg relative overflow-hidden"
          style={{ backgroundColor: eyeColor }}
        >
          {/* Pupil */}
          <motion.div
            animate={pupilControls}
            className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-black"
            style={{ transform: "translate(-50%, -50%)" }}
          />
          {/* Reflection/Highlight */}
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white opacity-30" />
        </motion.div>
      </div>

      {/* Right Eye */}
      <div className="relative">
        {/* Glow effect */}
        <motion.div
          animate={glowControls}
          className="absolute inset-0 w-32 h-32 rounded-full"
          style={{
            backgroundColor: shadowColor,
            boxShadow: `0 0 20px ${shadowColor}`,
          }}
        />
        {/* Main Eye */}
        <motion.div
          animate={{ ...blinkControls, ...pulseControls }}
          className="w-28 h-28 rounded-full shadow-lg relative overflow-hidden"
          style={{ backgroundColor: eyeColor }}
        >
          {/* Pupil */}
          <motion.div
            animate={pupilControls}
            className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-black"
            style={{ transform: "translate(-50%, -50%)" }}
          />
          {/* Reflection/Highlight */}
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white opacity-30" />
        </motion.div>
      </div>
    </div>
  );
};

export default Eyes;