import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Clock, Trophy, CheckCircle, X } from 'lucide-react'
import { Button } from '../ui/button'
import { type TreasureLocation } from '../../lib/supabase'

interface QuizProps {
  location: TreasureLocation
  onComplete: (score: number) => void
  onError: (error: string) => void
}

const Quiz: React.FC<QuizProps> = ({ location, onComplete, onError }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds to answer
  const [isTimeUp, setIsTimeUp] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isTimeUp && !hasAnswered) {
      handleTimeUp()
    }
  }, [isTimeUp, hasAnswered])

  const handleTimeUp = () => {
    setHasAnswered(true)
    setIsCorrect(false)
    // Auto-submit with 0 points after 3 seconds
    setTimeout(() => {
      onComplete(0)
    }, 3000)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered || isTimeUp) return
    
    setSelectedAnswer(answerIndex)
    setHasAnswered(true)
    
    const correct = answerIndex === location.correct_answer
    setIsCorrect(correct)
    
    // Calculate score based on time remaining and correctness
    const timeBonus = Math.floor((timeLeft / 30) * 20) // Up to 20 bonus points for speed
    const basePoints = correct ? location.points : 0
    const totalScore = basePoints + (correct ? timeBonus : 0)
    
    // Auto-submit after showing result for 3 seconds
    setTimeout(() => {
      onComplete(totalScore)
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    return `0:${seconds.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (timeLeft > 20) return 'text-green-500'
    if (timeLeft > 10) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-[#1a1d2e] rounded-lg p-6 mb-6">
        {/* Header */}
        <div className="text-center mb-6">
          <HelpCircle className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Quiz Time!
          </h2>
          <p className="text-gray-300 mb-4">
            Answer the question about {location.name}
          </p>
          
          {/* Timer */}
          <div className="flex items-center justify-center space-x-2">
            <Clock className={`w-5 h-5 ${getTimerColor()}`} />
            <span className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-[#2a2d3e] rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {location.quiz_question}
          </h3>
          
          {/* Answer Options */}
          <div className="space-y-3">
            {location.quiz_options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={hasAnswered || isTimeUp}
                className={`
                  w-full p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${hasAnswered 
                    ? index === location.correct_answer
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : index === selectedAnswer && !isCorrect
                      ? 'border-red-500 bg-red-500/20 text-red-400'
                      : 'border-gray-600 bg-gray-700/20 text-gray-400'
                    : 'border-gray-600 hover:border-[#5A2E8A] hover:bg-[#5A2E8A]/10 text-white cursor-pointer'
                  }
                  ${selectedAnswer === index && !hasAnswered ? 'border-[#5A2E8A] bg-[#5A2E8A]/20' : ''}
                `}
                whileHover={!hasAnswered && !isTimeUp ? { scale: 1.02 } : {}}
                whileTap={!hasAnswered && !isTimeUp ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{option}</span>
                  
                  {hasAnswered && (
                    <div className="ml-3">
                      {index === location.correct_answer ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : index === selectedAnswer && !isCorrect ? (
                        <X className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Result Display */}
        <AnimatePresence>
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              {isCorrect ? (
                <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-6">
                  <Trophy className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">
                    Correct! 🎉
                  </h3>
                  <p className="text-green-300 mb-2">
                    You earned {location.points} base points
                  </p>
                  {timeLeft > 0 && (
                    <p className="text-green-200 text-sm">
                      + {Math.floor((timeLeft / 30) * 20)} speed bonus points!
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-3">
                    {isTimeUp ? (
                      <Clock className="w-12 h-12 text-red-500" />
                    ) : (
                      <X className="w-12 h-12 text-red-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">
                    {isTimeUp ? 'Time\'s Up!' : 'Incorrect'}
                  </h3>
                  <p className="text-red-300">
                    {isTimeUp 
                      ? 'You ran out of time to answer'
                      : 'Better luck next time!'
                    }
                  </p>
                  <p className="text-red-200 text-sm mt-2">
                    The correct answer was: {location.quiz_options[location.correct_answer]}
                  </p>
                </div>
              )}
              
              <p className="text-gray-400 text-sm mt-4">
                Continuing automatically in a few seconds...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        {!hasAnswered && !isTimeUp && (
          <div className="mt-6">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-[#5A2E8A] to-[#D4AF37] h-2 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / 30) * 100}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-[#2a2d3e] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[#D4AF37] mb-2">
          🧠 Quiz Rules
        </h3>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• You have 30 seconds to answer</li>
          <li>• Faster answers get bonus points</li>
          <li>• Base points: {location.points} for correct answer</li>
          <li>• Speed bonus: up to 20 extra points</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default Quiz