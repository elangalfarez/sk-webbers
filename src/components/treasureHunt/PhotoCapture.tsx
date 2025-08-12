import React, { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { type Player, type TreasureLocation, supabase } from '../../lib/supabase'
import { 
  validateSelfie, 
  validatePhotoMetadata, 
  uploadPhoto, 
  getCurrentLocation 
} from '../../lib/treasureHuntUtils'

interface PhotoCaptureProps {
  player: Player
  location: TreasureLocation
  onPhotoSubmitted: () => void
  onError: (error: string) => void
  faceDetectionReady: boolean
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ 
  player, 
  location, 
  onPhotoSubmitted, 
  onError,
  faceDetectionReady 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [validationResults, setValidationResults] = useState<{
    faceDetected: boolean | null
    exifValid: boolean | null
    geolocationValid: boolean | null
  }>({
    faceDetected: null,
    exifValid: null,
    geolocationValid: null
  })

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', // Front camera for selfies
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCapturing(true)
      }
    } catch (error) {
      console.error('Camera access error:', error)
      onError('Failed to access camera. Please check camera permissions.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCapturing(false)
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob)
        setCapturedPhoto(imageUrl)
        setPhotoBlob(blob)
        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        onError('Please select a valid image file')
        return
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        onError('Image file is too large. Please select a file under 10MB.')
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setCapturedPhoto(imageUrl)
      setPhotoBlob(file)
    }
  }

  const validatePhoto = async () => {
    if (!photoBlob || !capturedPhoto) return

    setIsValidating(true)
    const results = {
      faceDetected: null as boolean | null,
      exifValid: null as boolean | null,
      geolocationValid: null as boolean | null
    }

    try {
      // Face detection validation
      if (faceDetectionReady) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = capturedPhoto
        
        await new Promise((resolve) => {
          img.onload = async () => {
            try {
              results.faceDetected = await validateSelfie(img)
            } catch (error) {
              console.error('Face detection error:', error)
              results.faceDetected = false
            }
            resolve(void 0)
          }
          img.onerror = () => {
            results.faceDetected = false
            resolve(void 0)
          }
        })
      } else {
        // Skip face detection if not ready
        results.faceDetected = true
      }

      // EXIF metadata validation
      try {
        results.exifValid = await validatePhotoMetadata(photoBlob)
      } catch (error) {
        console.error('EXIF validation error:', error)
        results.exifValid = false
      }

      // Geolocation validation (if available)
      try {
        const location = await getCurrentLocation()
        results.geolocationValid = location !== null
      } catch (error) {
        console.error('Geolocation error:', error)
        results.geolocationValid = false
      }

      setValidationResults(results)
    } catch (error) {
      console.error('Photo validation error:', error)
      onError('Failed to validate photo. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const submitPhoto = async () => {
    if (!photoBlob) return

    setIsUploading(true)
    
    try {
      // Upload photo to Supabase
      const photoPath = await uploadPhoto(photoBlob, location.id, player.id)
      
      if (!photoPath) {
        onError('Failed to upload photo. Please try again.')
        setIsUploading(false)
        return
      }

      // Save photo submission record
      const { error } = await supabase
        .from('photo_submissions')
        .insert({
          player_id: player.id,
          location_id: location.id,
          photo_url: photoPath,
          metadata: {
            timestamp: new Date().toISOString(),
            deviceInfo: navigator.userAgent,
            geolocation: validationResults.geolocationValid ? await getCurrentLocation() : null,
            faceDetected: validationResults.faceDetected || false,
            exifValid: validationResults.exifValid || false
          },
          is_verified: validationResults.faceDetected && validationResults.exifValid
        })

      if (error) {
        console.error('Photo submission error:', error)
        onError('Failed to save photo submission.')
        setIsUploading(false)
        return
      }

      onPhotoSubmitted()
    } catch (error) {
      console.error('Photo submission error:', error)
      onError('Failed to submit photo. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const resetPhoto = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto)
    }
    setCapturedPhoto(null)
    setPhotoBlob(null)
    setValidationResults({
      faceDetected: null,
      exifValid: null,
      geolocationValid: null
    })
  }

  const ValidationBadge: React.FC<{ 
    label: string; 
    result: boolean | null; 
    description: string 
  }> = ({ label, result, description }) => (
    <div className="flex items-center justify-between p-3 bg-[#2a2d3e] rounded-lg">
      <div className="flex items-center">
        {result === null ? (
          <div className="w-5 h-5 border-2 border-gray-400 rounded-full animate-pulse mr-3" />
        ) : result ? (
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
        )}
        <div>
          <div className="text-sm font-medium text-white">{label}</div>
          <div className="text-xs text-gray-400">{description}</div>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-[#1a1d2e] rounded-lg p-6 mb-6">
        <div className="text-center mb-6">
          <Camera className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Take Your Selfie
          </h2>
          <p className="text-gray-300 mb-2">
            Take a selfie with the Independence Day decoration at:
          </p>
          <p className="text-[#D4AF37] font-semibold">
            {location.name}
          </p>
        </div>

        {/* Camera/Photo Display */}
        <div className="mb-6">
          {!capturedPhoto ? (
            <div>
              {isCapturing ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-lg bg-black"
                  />
                  <div className="absolute inset-0 border-2 border-[#D4AF37] rounded-lg pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg opacity-50"></div>
                  </div>
                  <Button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                    size="lg"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-3">
                    <Button onClick={startCamera} className="w-full" size="lg">
                      <Camera className="w-5 h-5 mr-2" />
                      Start Camera
                    </Button>
                    <div className="text-gray-400 text-sm">or</div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <img
                src={capturedPhoto}
                alt="Captured selfie"
                className="w-full rounded-lg mb-4"
              />
              
              {/* Validation Results */}
              {validationResults.faceDetected !== null && (
                <div className="space-y-2 mb-4">
                  <ValidationBadge
                    label="Face Detected"
                    result={validationResults.faceDetected}
                    description="Ensures this is actually a selfie"
                  />
                  <ValidationBadge
                    label="Photo Metadata"
                    result={validationResults.exifValid}
                    description="Verifies photo authenticity"
                  />
                  <ValidationBadge
                    label="Location Data"
                    result={validationResults.geolocationValid}
                    description="Confirms you're at the location"
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={resetPhoto}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake
                </Button>
                
                {validationResults.faceDetected === null ? (
                  <Button
                    onClick={validatePhoto}
                    disabled={isValidating}
                    className="flex-1"
                  >
                    {isValidating ? 'Validating...' : 'Validate'}
                  </Button>
                ) : (
                  <Button
                    onClick={submitPhoto}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isUploading ? 'Submitting...' : 'Submit'}
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Instructions */}
      <div className="bg-[#2a2d3e] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[#D4AF37] mb-2">
          📸 Selfie Guidelines
        </h3>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Include the Independence Day decoration in your selfie</li>
          <li>• Ensure your face is clearly visible</li>
          <li>• Take the photo at the actual location</li>
          <li>• Good lighting helps with face detection</li>
          {!faceDetectionReady && (
            <li className="text-yellow-400">• Face detection is loading...</li>
          )}
        </ul>
      </div>
    </motion.div>
  )
}

export default PhotoCapture