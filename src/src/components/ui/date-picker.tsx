'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
  minDate?: string
  theme?: 'purple' | 'emerald'
}

export function DatePicker({ value, onChange, className = '', placeholder = '日付を選択', disabled = false, minDate, theme = 'purple' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // valueが変更されたときに内部状態を更新
  useEffect(() => {
    if (value) {
      // タイムゾーンの問題を避けるため、日付文字列から直接Dateオブジェクトを作成
      const [year, month, day] = value.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      setSelectedDate(date)
      setCurrentDate(date)
    } else {
      setSelectedDate(null)
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

  const formatDisplayDate = () => {
    if (!value) return placeholder
    // タイムゾーンの問題を避けるため、日付文字列から直接解析
    const [year, month, day] = value.split('-').map(Number)
    return `${year}年${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`
  }

  const handleDateSelect = (date: Date) => {
    // ローカル時間で日付文字列を作成
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    onChange(dateString)
    setSelectedDate(date)
    setIsOpen(false)
  }

  const isDateDisabled = (date: Date) => {
    if (minDate) {
      // minDateも同様にタイムゾーンの問題を避けて処理
      const [minYear, minMonth, minDay] = minDate.split('-').map(Number)
      const min = new Date(minYear, minMonth - 1, minDay)
      // 日付のみで比較（時間は無視）
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const minOnly = new Date(min.getFullYear(), min.getMonth(), min.getDate())
      return dateOnly < minOnly
    }
    return false
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }

  const isToday = (date: Date) => {
    return isSameDay(date, new Date())
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // 前月の日付で埋める
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // 当月の日付
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      days.push({ date: currentDate, isCurrentMonth: true })
    }

    // 次月の日付で埋める（6週間分）
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({ date: nextDate, isCurrentMonth: false })
    }

    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    handleDateSelect(today)
  }

  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  // テーマに応じた色設定
  const themeColors = {
    purple: {
      primary: 'purple-600',
      primaryHover: 'purple-700',
      light: 'purple-50',
      lightHover: 'purple-100',
      border: 'purple-200',
      text: 'purple-700',
      ring: 'purple-500',
      borderHover: 'purple-300',
      gradient: 'from-purple-50 to-indigo-50'
    },
    emerald: {
      primary: 'emerald-600',
      primaryHover: 'emerald-700',
      light: 'emerald-50',
      lightHover: 'emerald-100',
      border: 'emerald-200',
      text: 'emerald-700',
      ring: 'emerald-500',
      borderHover: 'emerald-300',
      gradient: 'from-emerald-50 to-teal-50'
    }
  }

  const colors = themeColors[theme]

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${colors.ring} focus:border-transparent bg-white text-left transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : `hover:border-${colors.borderHover}`
        } ${isOpen ? `ring-2 ring-${colors.ring} border-transparent` : ''}`}
      >
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {formatDisplayDate()}
        </span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {/* ヘッダー */}
          <div className={`p-4 bg-gradient-to-r ${colors.gradient} border-b border-gray-100`}>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-white hover:shadow-sm rounded transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-white hover:shadow-sm rounded transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* カレンダー */}
          <div className="p-4">
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map((day, index) => (
                <div
                  key={day}
                  className={`text-center text-xs font-medium py-2 ${
                    index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 日付グリッド */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map(({ date, isCurrentMonth }, index) => {
                const isSelected = selectedDate && isSameDay(date, selectedDate)
                const isTodayDate = isToday(date)
                const isDisabled = isDateDisabled(date)
                const dayOfWeek = index % 7

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => !isDisabled && isCurrentMonth && handleDateSelect(date)}
                    disabled={isDisabled || !isCurrentMonth}
                    className={`
                      h-8 w-8 text-sm rounded-lg transition-all duration-200 relative
                      ${isCurrentMonth 
                        ? isSelected
                          ? `bg-${colors.primary} text-white shadow-lg transform scale-110`
                          : isTodayDate
                            ? `bg-${colors.lightHover} text-${colors.text} font-semibold border-2 border-${colors.border}`
                            : isDisabled
                              ? 'text-gray-300 cursor-not-allowed'
                              : dayOfWeek === 0
                                ? 'text-red-600 hover:bg-red-50'
                                : dayOfWeek === 6
                                  ? 'text-blue-600 hover:bg-blue-50'
                                  : `text-gray-700 hover:bg-${colors.light}`
                        : 'text-gray-300'
                      }
                      ${isCurrentMonth && !isDisabled && !isSelected ? 'hover:shadow-md' : ''}
                    `}
                  >
                    {date.getDate()}
                    {isTodayDate && !isSelected && (
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-${colors.primary} rounded-full`}></div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* フッター */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <button
                type="button"
                onClick={goToToday}
                className={`px-3 py-1 text-sm text-${colors.primary} hover:bg-${colors.light} rounded transition-colors`}
              >
                今日
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 bg-${colors.primary} hover:bg-${colors.primaryHover} text-white text-sm font-medium rounded-lg transition-colors`}
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