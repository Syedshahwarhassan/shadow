"use client"

import { useEffect, useState } from "react"

const Mouth = ({ open }) => {
  const [waveAnimation, setWaveAnimation] = useState(0)

  useEffect(() => {
    let interval
    if (open) {
      interval = setInterval(() => {
        setWaveAnimation((prev) => (prev + 1) % 4)
      }, 150)
    } else {
      setWaveAnimation(0)
    }
    return () => clearInterval(interval)
  }, [open])

  if (!open) {
    return (
        <div className="w-32 h-24 bg-black rounded-full"></div>
    )
  }

  return (
    <div className="relative w-32 h-24 flex items-center justify-center">
      <div className="flex items-center justify-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`bg-[#04d9ff] rounded-full transition-all duration-150 ease-in-out ${
              waveAnimation === 0
                ? "w-1 h-2"
                : waveAnimation === 1
                  ? i % 2 === 0
                    ? "w-1 h-6"
                    : "w-1 h-3"
                  : waveAnimation === 2
                    ? i === 2
                      ? "w-1 h-8"
                      : i % 2 === 1
                        ? "w-1 h-5"
                        : "w-1 h-2"
                    : i % 3 === 0
                      ? "w-1 h-7"
                      : i % 2 === 0
                        ? "w-1 h-4"
                        : "w-1 h-6"
            }`}
            style={{
              opacity: waveAnimation === 0 ? 0.3 : 0.8 + i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Mouth
