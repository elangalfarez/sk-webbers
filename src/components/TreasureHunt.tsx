import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, QrCode, Trophy, Gift, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import QRScanner from './treasureHunt/QRScanner'
import PhotoCapture from './treasureHunt/PhotoCapture'
import Quiz from './treasureHunt/Quiz'
import PlayerRegistration from './treasureHunt/PlayerRegistration'
import { supabase, type Player, type TreasureLocation } from '../lib/supabase'
import { initializeFaceDetection } from '../lib/treasureHuntUtils'

type GameStep = 'registration' | 'qr-scan' | 'photo' | 'quiz' | 'complete'

const TreasureHunt: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<GameStep>('registration')
  const [player, setPlayer] = useState<Player | null>(null)
  const [currentLocation, setCurrentLocation] = useState<TreasureLocation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [faceDetectionReady, setFaceDetectionReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize face detection when component mounts
    const setupFaceDetection = async () => {
      const ready = await initializeFaceDetection()
      setFaceDetectionReady(ready)
      if (!ready) {
        setError('Face detection failed to initialize. Some features may not work properly.')
      }
    }
    
    setupFaceDetection()
  }, [])

  const handleRegistrationComplete = (playerData: Player) => {
    setPlayer(playerData)
    setCurrentStep('qr-scan')
    setError(null)
  }

  const handleQRScanned = async (qrData: string) => {
    setIsLoading(true)
    try {
      // Fetch location data based on QR code
      const { data: location, error } = await supabase
        .from('treasure_locations')
        .select('*')
        .eq('qr_code', qrData)
        .eq('is_active', true)
        .single()

      if (error || !location) {
        setError('Invalid QR code or location not found')
        setIsLoading(false)
        return
      }

      // Check if player has already completed this location
      if (player?.completed_locations.includes(location.id)) {
        setError('You have already completed this location!')
        setIsLoading(false)
        return
      }

      setCurrentLocation(location)
      setCurrentStep('photo')
      setError(null)
    } catch (err) {
      setError('Failed to process QR code')
      console.error('QR processing error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoSubmitted = () => {
    setCurrentStep('quiz')
  }

  const handleQuizComplete = async (score: number) => {
    if (!player || !currentLocation) return

    setIsLoading(true)
    try {
      // Update player's progress
      const updatedCompletedLocations = [...player.completed_locations, currentLocation.id]
      const newTotalScore = player.total_score + score

      const { error } = await supabase
        .from('players')
        .update({
          completed_locations: updatedCompletedLocations,
          total_score: newTotalScore
        })
        .eq('id', player.id)

      if (error) {
        setError('Failed to save progress')
        return
      }

      // Update local player state
      setPlayer({
        ...player,
        completed_locations: updatedCompletedLocations,
        total_score: newTotalScore
      })

      setCurrentStep('complete')
    } catch (err) {
      setError('Failed to complete location')
      console.error('Quiz completion error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextLocation = () => {
    setCurrentLocation(null)
    setCurrentStep('qr-scan')
    setError(null)
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'registration':
        return (
          <PlayerRegistration 
            onComplete={handleRegistrationComplete}
            onError={setError}
          />
        )
      
      case 'qr-scan':
        return (
          <QRScanner 
            onQRScanned={handleQRScanned}
            onError={setError}
            isLoading={isLoading}
          />
        )
      
      case 'photo':
        return (
          <PhotoCapture
            player={player!}
            location={currentLocation!}
            onPhotoSubmitted={handlePhotoSubmitted}
            onError={setError}
            faceDetectionReady={faceDetectionReady}
          />
        )
      
      case 'quiz':
        return (
          <Quiz
            location={currentLocation!}
            onComplete={handleQuizComplete}
            onError={setError}
          />
        )
      
      case 'complete':
        return (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-6"
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Location Complete!
              </h3>
              <p className="text-gray-300 mb-4">
                You earned {currentLocation?.points} points!
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Total Score: {player?.total_score} points
              </p>
            </motion.div>
            
            <div className="space-y-4">
              <Button
                onClick={handleNextLocation}
                className="w-full"
                size="lg"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Scan Next Location
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setCurrentStep('registration')}
                className="w-full"
              >
                <Trophy className="w-5 h-5 mr-2" />
                View Progress
              </Button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#121421] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5A2E8A] to-[#4A256F] py-6">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <Gift className="w-8 h-8 text-[#D4AF37] mr-3" />
              <h1 className="text-3xl font-bold">Treasure Hunt</h1>
            </div>
            <p className="text-gray-200">
              Indonesia Independence Day Special
            </p>
            {player && (
              <div className="mt-4 flex justify-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-[#D4AF37] font-bold">{player.completed_locations.length}</div>
                  <div className="text-gray-300">Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-[#D4AF37] font-bold">{player.total_score}</div>
                  <div className="text-gray-300">Points</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Progress Indicator */}
      {player && currentStep !== 'registration' && (
        <div className="bg-[#1a1d2e] py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-4">
              {(['qr-scan', 'photo', 'quiz', 'complete'] as const).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep === step
                        ? 'bg-[#5A2E8A] text-white'
                        : index < ['qr-scan', 'photo', 'quiz', 'complete'].indexOf(currentStep)
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-8 h-1 mx-2 ${
                        index < ['qr-scan', 'photo', 'quiz', 'complete'].indexOf(currentStep)
                          ? 'bg-[#D4AF37]'
                          : 'bg-gray-600'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-red-600 text-white py-3 px-4 text-center"
          >
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-4 underline hover:no-underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TreasureHunt