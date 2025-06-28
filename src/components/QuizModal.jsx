import React from "react";

export default function QuizModal({ question, options, correctAnswer, onSuccess }) {
  const handleClick = (option) => {
    if (option === correctAnswer) {
      alert("Correct! Gate unlocked ✅");
      onSuccess();
    } else {
      alert("Wrong answer 😢 Try again by walking into the gate again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-4">{question}</h2>
        <div className="space-y-3">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(opt)}
              className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
