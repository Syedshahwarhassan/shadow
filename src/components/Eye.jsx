import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const Eyes = ({ isListening = false, isThinking = false }) => {
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

  // 🎧 Listening animation
  useEffect(() => {
    if (isListening && !isThinking) {
      glowControls.start({
        opacity: [0.3, 1, 0.3],
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
      });

      pulseControls.start({
        scale: [1, 1.1, 1],
        transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
      });

      pupilControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });
    }
  }, [isListening, isThinking, glowControls, pulseControls, pupilControls]);

  // 🤔 Thinking animation
  useEffect(() => {
    if (isThinking) {
      glowControls.start({
        opacity: [0.4, 1, 0.4],
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
      });

      pulseControls.start({
        scale: [1, 1.05, 1],
        transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
      });

      pupilControls.start({
        x: [-10, 10, -10], // 👀 dart left-right
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
      });
    } else {
      pupilControls.start({ x: 0, transition: { duration: 0.5 } });
    }
  }, [isThinking, glowControls, pulseControls, pupilControls]);

  // 🎨 Colors depending on mode
  const eyeColor = isThinking
    ? "#04d9d9" // yellow for thinking
    : isListening
    ? "#04d9d9" // cyan for listening
    : "#04d9ff"; // blue default

  const shadowColor = eyeColor;

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
          {/* Reflection */}
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
          {/* Reflection */}
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white opacity-30" />
        </motion.div>
      </div>
    </div>
  );
};

export default Eyes;
