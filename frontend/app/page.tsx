"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const speakAnswer = (text: string) => {
    if (!text) return;


    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);


  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition;


    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
    };

    recognition.start();


  };

  const askAI = async () => {
    if (!question.trim()) return;


    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
          }),
        }
      );

      const data = await response.json();

      setAnswer(data.answer);

      speakAnswer(data.answer);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend");
    }

    setLoading(false);


  };

  return (<main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black flex items-center justify-center p-8"> <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-700"> <h1 className="text-5xl font-bold text-center mb-2 text-white">
    🎤 AI Version of Saurabh Raj Varma</h1>


    <textarea
      className="w-full rounded-lg p-4 bg-slate-900 text-white border border-slate-600"
      rows={4}
      placeholder="Ask me anything..."
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
    />

    <div className="flex gap-3 mt-4 flex-wrap">
      <button
        onClick={startListening}
        className="bg-blue-600 text-white px-5 py-3 rounded-lg"
      >
        🎤 Speak
      </button>

      <button
        onClick={askAI}
        className="bg-black text-white px-5 py-3 rounded-lg"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      <button
        onClick={() =>
          speakAnswer(
            "Hello, I am AI Saurabh. Nice to meet you."
          )
        }
        className="bg-green-600 text-white px-5 py-3 rounded-lg"
      >
        🔊 Test Voice
      </button>
    </div>

    {answer && (
      <div className="mt-6 rounded-lg p-4 bg-slate-900 border border-slate-700">
        <h2 className="font-bold text-xl mb-2 text-white">
          Answer
        </h2>

        <p className="whitespace-pre-wrap text-slate-200 leading-relaxed">
          {answer}
        </p>

        <button
          onClick={() => speakAnswer(answer)}
          className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
        >
          🔊 Speak Answer
        </button>
      </div>
    )}
  </div>
  </main>


  );
}
