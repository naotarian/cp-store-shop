'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronUp, ChevronDown, Clock } from 'lucide-react'

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function TimePicker({ value, onChange, className = '', placeholder = '時間を選択', disabled = false }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hours, setHours] = useState('10')
  const [minutes, setMinutes] = useState('00')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // valueが変更されたときに内部状態を更新
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':')
      setHours(h || '10')
      setMinutes(m || '00')
    }
  }, [value])

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const timeValue = `${newHours.padStart(2, '0')}:${newMinutes.padStart(2, '0')}`
    onChange(timeValue)
  }

  const incrementHours = () => {
    const newHours = ((parseInt(hours) + 1) % 24).toString()
    setHours(newHours)
    handleTimeChange(newHours, minutes)
  }

  const decrementHours = () => {
    const newHours = ((parseInt(hours) - 1 + 24) % 24).toString()
    setHours(newHours)
    handleTimeChange(newHours, minutes)
  }

  const incrementMinutes = () => {
    const newMinutes = ((parseInt(minutes) + 15) % 60).toString()
    setMinutes(newMinutes)
    handleTimeChange(hours, newMinutes)
  }

  const decrementMinutes = () => {
    const newMinutes = ((parseInt(minutes) - 15 + 60) % 60).toString()
    setMinutes(newMinutes)
    handleTimeChange(hours, newMinutes)
  }

  const formatDisplayTime = () => {
    if (!value) return placeholder
    const [h, m] = value.split(':')
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-left transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-300'
        } ${isOpen ? 'ring-2 ring-purple-500 border-transparent' : ''}`}
      >
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {formatDisplayTime()}
        </span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-center space-x-6">
              {/* 時間選択 */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={incrementHours}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                </button>
                <div className="w-12 h-12 flex items-center justify-center bg-purple-50 border-2 border-purple-200 rounded-lg my-2">
                  <span className="text-lg font-semibold text-purple-900">{hours.padStart(2, '0')}</span>
                </div>
                <button
                  type="button"
                  onClick={decrementHours}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>
                <span className="text-xs text-gray-500 mt-1">時</span>
              </div>

              <div className="text-2xl font-bold text-gray-400">:</div>

              {/* 分選択 */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={incrementMinutes}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                </button>
                <div className="w-12 h-12 flex items-center justify-center bg-purple-50 border-2 border-purple-200 rounded-lg my-2">
                  <span className="text-lg font-semibold text-purple-900">{minutes.padStart(2, '0')}</span>
                </div>
                <button
                  type="button"
                  onClick={decrementMinutes}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>
                <span className="text-xs text-gray-500 mt-1">分</span>
              </div>
            </div>

            {/* プリセット時間 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">よく使う時間</p>
              <div className="grid grid-cols-4 gap-2">
                {['09:00', '12:00', '15:00', '18:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      const [h, m] = time.split(':')
                      setHours(h)
                      setMinutes(m)
                      handleTimeChange(h, m)
                      setIsOpen(false)
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-purple-100 hover:text-purple-700 rounded transition-colors"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* 確定ボタン */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 