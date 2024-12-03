import React, { useState, useRef, useEffect } from "react";

const ContinuousSTT = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("SpeechRecognition API is not supported in your browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = true;
    recognitionRef.current.maxAlternatives = 1;
    recognitionRef.current.continuous = true; // Ensure continuous listening

    recognitionRef.current.onstart = () => {
      console.log("Speech recognition started...");
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const interimTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      console.log("Interim Transcript:", interimTranscript);

      if (event.results[event.results.length - 1].isFinal) {
        console.log("Final Transcript:", interimTranscript);
        setTranscript(interimTranscript); // Append only final results
      } else {
        setTranscript(interimTranscript); // Show only interim results while speaking
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current.onend = () => {
      console.log("Speech recognition ended. Restarting...");
      startListening(); // Automatically restart onend
    };

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.start();
    console.log("Continuous listening started.");
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      console.log("Listening stopped.");
    }
  };

  useEffect(() => {
    startListening(); // Start listening on component mount
    return stopListening; // Stop listening on component unmount
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Continuous Speech-to-Text (STT)</h1>
      <p>{isListening ? "Listening..." : "Not Listening"}</p>
      <div>
        <button onClick={startListening} disabled={isListening}>
          Start Listening
        </button>
        <button onClick={stopListening} disabled={!isListening}>
          Stop Listening
        </button>
      </div>
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <h3>Transcript:</h3>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default ContinuousSTT;
