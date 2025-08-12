import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Camera, AlertCircle } from 'lucide-react'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'
import { Button } from '../ui/button'

interface QRScannerProps {
  onQRScanned: (qrData: string) => void
  onError: (error: string) => void
  isLoading: boolean
}

const QRScanner: React.FC<QRScannerProps> = ({ onQRScanned, onError, isLoading }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [isScannerActive, setIsScannerActive] = useState(false)
  const [scanPermission, setScanPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
      }
    }
  }, [])

  const initializeScanner = async () => {
    try {
      // Check camera permission
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
      setScanPermission(permission.state)

      if (permission.state === 'denied') {
        onError('Camera permission denied. Please enable camera access to scan QR codes.')
        return
      }

      // Clear existing scanner if any
      if (scannerRef.current) {
        await scannerRef.current.clear()
      }

      // Initialize new scanner
      const scanner = new Html5QrcodeScanner(
        'qr-scanner',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
        },
        false
      )

      scanner.render(
        (decodedText: string) => {
          // Success callback
          setIsScannerActive(false)
          scanner.clear().catch(console.error)
          onQRScanned(decodedText)
        },
        (error: string) => {
          // Error callback (usually just no QR found, which is normal)
          // Don't show error for normal scanning states
          if (!error.includes('No QR code found')) {
            console.error('QR scan error:', error)
          }
        }
      )

      scannerRef.current = scanner
      setIsScannerActive(true)
    } catch (error) {
      console.error('Scanner initialization error:', error)
      onError('Failed to initialize camera. Please check camera permissions and try again.')
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear()
        scannerRef.current = null
        setIsScannerActive(false)
      } catch (error) {
        console.error('Error stopping scanner:', error)
      }
    }
  }

  const handleManualInput = () => {
    const qrCode = prompt('Enter QR code manually:')
    if (qrCode && qrCode.trim()) {
      onQRScanned(qrCode.trim())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-[#1a1d2e] rounded-lg p-6 mb-6">
        <div className="text-center mb-6">
          <QrCode className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Scan QR Code
          </h2>
          <p className="text-gray-300">
            Find and scan the QR code at the decorated location
          </p>
        </div>

        {/* Scanner Container */}
        <div className="mb-6">
          {!isScannerActive ? (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Click below to start scanning
              </p>
              
              {scanPermission === 'denied' && (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Camera access denied
                  </div>
                  <p className="text-xs text-red-300 mt-1">
                    Enable camera permission in your browser settings
                  </p>
                </div>
              )}
              
              <Button
                onClick={initializeScanner}
                disabled={isLoading || scanPermission === 'denied'}
                className="w-full mb-3"
                size="lg"
              >
                {isLoading ? 'Processing...' : 'Start Camera'}
                <Camera className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : (
            <div>
              <div id="qr-scanner" className="w-full"></div>
              <Button
                onClick={stopScanner}
                variant="outline"
                className="w-full mt-4"
              >
                Stop Scanner
              </Button>
            </div>
          )}
        </div>

        {/* Manual Input Option */}
        <div className="border-t border-gray-600 pt-4">
          <p className="text-gray-400 text-sm text-center mb-3">
            Having trouble scanning?
          </p>
          <Button
            onClick={handleManualInput}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            Enter Code Manually
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-[#2a2d3e] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[#D4AF37] mb-2">
          📱 Scanning Tips
        </h3>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Hold your phone steady</li>
          <li>• Ensure good lighting</li>
          <li>• Keep QR code within the frame</li>
          <li>• Allow camera permission when prompted</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default QRScanner