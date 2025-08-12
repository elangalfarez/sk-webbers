import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, CreditCard, Key } from 'lucide-react'
import { Button } from '../ui/button'
import { supabase, type Player } from '../../lib/supabase'
import { validatePurchaseAndGenerateCode } from '../../lib/treasureHuntUtils'

interface PlayerRegistrationProps {
  onComplete: (player: Player) => void
  onError: (error: string) => void
}

const PlayerRegistration: React.FC<PlayerRegistrationProps> = ({ onComplete, onError }) => {
  const [step, setStep] = useState<'purchase' | 'code'>('purchase')
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [uniqueCode, setUniqueCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchaseValidation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const amount = parseFloat(purchaseAmount.replace(/[^\d]/g, ''))
      
      if (amount < 150000) {
        onError('Minimum purchase amount is Rp 150,000')
        setIsLoading(false)
        return
      }

      const code = await validatePurchaseAndGenerateCode(amount)
      
      if (!code) {
        onError('Failed to generate unique code. Please try again.')
        setIsLoading(false)
        return
      }

      setUniqueCode(code)
      setStep('code')
    } catch (error) {
      onError('Failed to validate purchase. Please try again.')
      console.error('Purchase validation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create new player in database
      const { data, error } = await supabase
        .from('players')
        .insert({
          unique_code: uniqueCode,
          completed_locations: [],
          total_score: 0,
          purchase_amount: parseFloat(purchaseAmount.replace(/[^\d]/g, '')),
          is_verified: true
        })
        .select()
        .single()

      if (error) {
        onError('Failed to register player. Please try again.')
        console.error('Registration error:', error)
        setIsLoading(false)
        return
      }

      onComplete(data as Player)
    } catch (error) {
      onError('Registration failed. Please try again.')
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseInt(numbers) || 0)
  }

  if (step === 'purchase') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-[#1a1d2e] rounded-lg p-6"
      >
        <div className="text-center mb-6">
          <CreditCard className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Verify Your Purchase
          </h2>
          <p className="text-gray-300">
            Enter your purchase amount to get started
          </p>
        </div>

        <form onSubmit={handlePurchaseValidation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Purchase Amount
            </label>
            <input
              type="text"
              value={formatCurrency(purchaseAmount)}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              placeholder="Rp 150,000"
              className="w-full px-4 py-3 bg-[#2a2d3e] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#5A2E8A]"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Minimum purchase: Rp 150,000
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Validating...' : 'Generate Code'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-[#2a2d3e] rounded-lg">
          <h3 className="text-sm font-medium text-[#D4AF37] mb-2">
            🎯 Independence Day Special
          </h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Shop minimum Rp 150,000</li>
            <li>• Scan QR codes at decorated locations</li>
            <li>• Take selfies with decorations</li>
            <li>• Answer quiz questions</li>
            <li>• Win amazing prizes!</li>
          </ul>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-md mx-auto bg-[#1a1d2e] rounded-lg p-6"
    >
      <div className="text-center mb-6">
        <Key className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Your Unique Code
        </h2>
        <p className="text-gray-300">
          Save this code to continue your treasure hunt
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-[#2a2d3e] border-2 border-[#D4AF37] rounded-lg p-6 text-center">
          <div className="text-3xl font-mono font-bold text-[#D4AF37] tracking-wider">
            {uniqueCode}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Keep this code safe - you'll need it to resume your game
          </p>
        </div>
      </div>

      <form onSubmit={handleRegistration}>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Registering...' : 'Start Treasure Hunt'}
          <User className="w-5 h-5 ml-2" />
        </Button>
      </form>

      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('purchase')}
          className="w-full"
        >
          Back to Purchase
        </Button>
      </div>
    </motion.div>
  )
}

export default PlayerRegistration