// App.js
import { useState, useEffect, useRef } from "react";
import { Settings, Mic, Volume2 } from "lucide-react";
import Eyes from "./components/Eye";
import Mouth from "./components/Mouth";

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [transcript, setTranscript] = useState(""); // spoken words
  const [dateTime, setDateTime] = useState(new Date());
  const [blush, setBlush] = useState({ left: false, right: false }); // cheeks state
  const recognitionRef = useRef(null);

  // Owner name
  const ownerName = "Syed Shahwar Hassan";

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript.trim();
      console.log("Heard:", text);
      setTranscript(text);

     if (text.toLowerCase().includes("time")) {
        speak(`The time is ${dateTime.toLocaleTimeString()}`);
      } else if (text.toLowerCase().includes("date")) {
        speak(`Today's date is ${dateTime.toLocaleDateString()}`);
      } else  if (text.toLowerCase().includes("owner")) {
        speak(`My owner is ${ownerName}`);
      } else {
        // If not recognized, send to backend
        await handleApiRequest(text);
      }
    };

    recognitionRef.current = recognition;
  }, [dateTime]);

  // Mic button → stop speaking + listen again
  const startListening = () => {
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setMouthOpen(false);
    }

    // Restart recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setTimeout(() => {
        recognitionRef.current.start();
      }, 200); // delay prevents crash
    }
  };

  const speak = (text) => {
    // Stop listening while speaking
    if (recognitionRef.current) recognitionRef.current.stop();

    const utterance = new SpeechSynthesisUtterance(text);

    // Use female cute voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find((v) =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("woman") ||
      v.name.toLowerCase().includes("samantha")
    );
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onstart = () => setMouthOpen(true);
    utterance.onend = () => {
      setMouthOpen(false);
      // After speaking, auto start listening again
      if (recognitionRef.current) recognitionRef.current.start();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Function to trigger blush + cute reaction
  const handleBlush = (side) => {
    setBlush((prev) => ({ ...prev, [side]: true }));

    const cuteReplies = [
      "Hehe, I'm shy 😳",
      "Stop it, you're making me blush! 😊",
      "Oww, that tickles 💕",
      "Hehe, don't tease me! 🥰",
    ];
    const randomReply =
      cuteReplies[Math.floor(Math.random() * cuteReplies.length)];
    speak(randomReply);

    setTimeout(() => {
      setBlush((prev) => ({ ...prev, [side]: false }));
    }, 1500);
  };

  // Function to call API when Shadow doesn't understand
  const handleApiRequest = async (query) => {
    try {
      const res = await fetch("http://192.168.100.124:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (data.success && data.response) {
        speak(data.response);
      } else {
        speak("Sorry, I couldn't understand that.");
      }
    } catch (error) {
      console.error("API Error:", error);
      speak("There was an error reaching my brain server.");
    }
  };

  return (
    <div className="flex items-center flex-col gap-8 relative bg-black min-h-screen justify-center p-4 text-white">
      <Eyes isListening={isListening} />
      <div className="relative">
        <Mouth open={mouthOpen} />

        {/* Left Cheek */}
        <div
          onClick={() => handleBlush("left")}
          className="absolute -left-16 top-6 w-12 h-12 rounded-full cursor-pointer"
        >
          {blush.left && (
            <div className="w-full h-full rounded-full bg-pink-500 opacity-70 animate-pulse"></div>
          )}
        </div>

        {/* Right Cheek */}
        <div
          onClick={() => handleBlush("right")}
          className="absolute -right-16 top-6 w-12 h-12 rounded-full cursor-pointer"
        >
          {blush.right && (
            <div className="w-full h-full rounded-full bg-pink-500 opacity-70 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Show transcript */}
      <div className="mt-6 text-lg font-mono text-green-400 bg-gray-900 px-4 py-2 rounded-lg shadow-lg max-w-xl text-center">
        {transcript || "Click the mic and speak..."}
      </div>

      <div className="absolute bottom-4 flex gap-6">
        {/* Mic button to start listening */}
        <button onClick={startListening}>
          <Mic
            className={`w-8 h-8 ${
              isListening ? "text-green-400" : "text-gray-400"
            }`}
          />
        </button>

        <Volume2 />
        <Settings />
      </div>
    </div>
  );
};

export default App;
