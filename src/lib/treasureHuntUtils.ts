import * as faceapi from 'face-api.js'
import * as piexif from 'piexifjs'
import { supabase } from './supabase'

// Initialize face detection models
export const initializeFaceDetection = async (): Promise<boolean> => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    ])
    return true
  } catch (error) {
    console.error('Failed to load face detection models:', error)
    return false
  }
}

// Get current geolocation
export const getCurrentLocation = (): Promise<{ lat: number; lng: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
        resolve(null)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  })
}

// Validate selfie by detecting faces
export const validateSelfie = async (imageElement: HTMLImageElement): Promise<boolean> => {
  try {
    const detections = await faceapi.detectAllFaces(
      imageElement,
      new faceapi.TinyFaceDetectorOptions()
    )
    // Require at least one face detected
    return detections.length > 0
  } catch (error) {
    console.error('Face detection error:', error)
    return false
  }
}

// Validate photo metadata using EXIF data
export const validatePhotoMetadata = (photoBlob: Blob): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer
        const exifData = piexif.load(new Uint8Array(arrayBuffer))
        
        if (!exifData || !exifData['0th']) {
          resolve(false)
          return
        }

        // Check if photo has EXIF timestamp
        const dateTime = exifData['Exif']?.[piexif.ExifIFD.DateTime] || 
                        exifData['0th']?.[piexif.ImageIFD.DateTime]
        
        if (dateTime) {
          // Validate timestamp is recent (within last 5 minutes)
          const exifDate = new Date(dateTime.replace(/(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3'))
          const isRecent = new Date().getTime() - exifDate.getTime() < 300000 // 5 minutes
          resolve(isRecent)
        } else {
          // No timestamp in EXIF suggests it might be a screenshot
          resolve(false)
        }
      } catch (error) {
        console.error('EXIF validation error:', error)
        resolve(false)
      }
    }
    reader.readAsArrayBuffer(photoBlob)
  })
}

// Upload photo to Supabase Storage with metadata
export const uploadPhoto = async (
  photoBlob: Blob,
  locationId: string,
  playerId: string
): Promise<string | null> => {
  try {
    const fileName = `${playerId}-${locationId}-${Date.now()}.jpg`
    
    // Get metadata
    const geolocation = await getCurrentLocation()
    
    // Upload to Supabase Storage with metadata
    const { data, error } = await supabase.storage
      .from('treasure-hunt-photos')
      .upload(fileName, photoBlob, {
        metadata: {
          playerId,
          locationId,
          timestamp: new Date().toISOString(),
          deviceInfo: navigator.userAgent,
          geolocation: geolocation ? JSON.stringify(geolocation) : null
        }
      })
    
    if (error) {
      console.error('Upload error:', error)
      return null
    }
    
    return data.path
  } catch (error) {
    console.error('Photo upload failed:', error)
    return null
  }
}

// Generate unique 6-character code
export const generateUniqueCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Validate purchase amount and generate code
export const validatePurchaseAndGenerateCode = async (
  purchaseAmount: number
): Promise<string | null> => {
  if (purchaseAmount < 150000) { // Rp 150k
    return null
  }
  
  let uniqueCode: string
  let isUnique = false
  
  // Ensure the code is unique
  while (!isUnique) {
    uniqueCode = generateUniqueCode()
    
    const { data } = await supabase
      .from('players')
      .select('id')
      .eq('unique_code', uniqueCode)
      .single()
    
    if (!data) {
      isUnique = true
      return uniqueCode
    }
  }
  
  return null
}