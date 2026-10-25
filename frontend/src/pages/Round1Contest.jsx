import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { quizQuestions as questionBank } from "../data/quizQuestions";
import { Button } from "@/components/ui/button";

const QUIZ_DURATION = 10 * 60; // 10 minutes

const getRandomQuestions = (bank, count) => {
  const shuffled = [...bank];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

const Round1Contest = () => {
  const navigate = useNavigate();
  const [questions] = useState(() => getRandomQuestions(questionBank, 10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const selectedBranch = localStorage.getItem("selectedBranch");

  useEffect(() => {
    if (!selectedBranch) {
      toast.error("All the best!");
      navigate("/round-1/branch-selection");
    }
  }, [selectedBranch, navigate]);

  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleAnswer = (optionIndex) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentIndex]: optionIndex });
  };

  const handleSubmit = (auto = false) => {
    if (!auto && Object.keys(answers).length < questions.length) {
      toast.error(
        `Please answer all questions. ${
          questions.length - Object.keys(answers).length
        } remaining.`
      );
      return;
    }
    setIsSubmitted(true);
    setShowResult(true);
    if (auto) toast.warning("Time up! Auto-submitting...");
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  if (showResult) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <div className="min-h-screen bg-[#0a0505] text-white p-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 mb-4 shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]">
              {percentage >= 60 ? (
                <CheckCircle2 className="h-12 w-12 text-white" />
              ) : (
                <XCircle className="h-12 w-12 text-white" />
              )}
            </div>
            <h1 className="text-4xl font-bold">Quiz Complete!</h1>
            <div className="text-6xl font-bold text-orange-500">
              {score}/{questions.length}
            </div>
            <p className="text-xl text-gray-300">
              {percentage >= 80
                ? "Excellent work! 🎉"
                : percentage >= 60
                ? "Good job! 👍"
                : "Keep practicing! 💪"}
            </p>
          </motion.div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white mb-4">Answer Review</h2>
            {questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correctAnswer;
              const skipped = userAnswer === undefined;

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? "bg-green-500/10 border-green-500/30"
                      : skipped
                      ? "bg-gray-500/10 border-gray-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : skipped ? (
                        <Clock className="h-5 w-5 text-gray-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white mb-2">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        {!skipped && (
                          <p className={isCorrect ? "text-green-300" : "text-red-300"}>
                            Your answer: {q.options[userAnswer]}
                          </p>
                        )}
                        {skipped && <p className="text-gray-400">Not answered</p>}
                        {!isCorrect && (
                          <p className="text-green-300">
                            Correct: {q.options[q.correctAnswer]}
                          </p>
                        )}
                        <p className="text-gray-500 italic mt-2">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Button
            onClick={() => navigate("/")}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white rounded-xl"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0505] text-white p-4">
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold"> Quiz</h1>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg ${
              timeLeft < 60
                ? "bg-red-500/20 text-red-300 animate-pulse border border-red-500/30"
                : "bg-[#1a1313] text-white border border-gray-800"
            }`}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#120c0c] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
          >
            <h2 className="text-xl sm:text-2xl font-semibold leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-center gap-3 ${
                      isSelected
                        ? "bg-orange-500/10 border-orange-500 text-white"
                        : "bg-[#1a1313] border-gray-800 text-gray-300 hover:bg-[#221818] hover:border-gray-600"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-lg font-semibold ${
                        isSelected
                          ? "bg-orange-500 text-white"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="border-gray-700 bg-[#1a1313] text-gray-300 hover:bg-[#221818]"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="hidden sm:flex gap-1.5">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? "bg-orange-500 w-6"
                    : answers[idx] !== undefined
                    ? "bg-green-500"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>

          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={() => handleSubmit(false)}
              className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white"
            >
              Submit
              <Send className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentIndex((i) =>
                  Math.min(questions.length - 1, i + 1)
                )
              }
              className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>

        {answeredCount === questions.length &&
          currentIndex !== questions.length - 1 && (
            <Button
              onClick={() => handleSubmit(false)}
              variant="outline"
              className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              All questions answered — Submit now
            </Button>
          )}
      </div>
    </div>
  );
};

export default Round1Contest;