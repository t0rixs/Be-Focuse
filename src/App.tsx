import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [isFocused, setIsFocused] = useState(false)
  const [count, setCount] = useState(0)
  const [isFirst, setIsFirst] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const formatCurrentTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  // 現在時刻を1秒ごとに更新
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  useEffect(() => {
    if (isFocused) {
      window.addEventListener("blur", () => {
        setEndTime(currentTime)
        setIsFocused(false)
      });
      setStartTime(currentTime)
    }
  }, [isFocused])
  useEffect(() => {
    if (isFocused) {
      const intervalId = setInterval(() => {
        setCount(prevCount => prevCount + 1)
      }, 1000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [isFocused])

  return (
    <>
      <div className="main-container">
        <div className="current-time-display">
          {isFocused ? `${formatCurrentTime(startTime ?? currentTime)} - ${formatCurrentTime(currentTime)}` : formatCurrentTime(currentTime)}
        </div>
        <div className={`content-wrapper ${isFocused ? 'focused' : ''}`}>
          <button
            className={`power-button ${isFocused ? 'power-on' : 'power-off'}`}
            onClick={() => {
              setIsFocused(!isFocused)
              setIsFirst(false)
            }}
            aria-label={isFocused ? 'Stop Focus' : 'Start Focus'}
          >
            <div className="power-button-inner">
              <svg
                className="power-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isFocused ? (
                  <path d="M6 6L18 18M18 6L6 18" />
                ) : (
                  <path d="M12 2V12M18 6A8 8 0 1 1 6 6" />
                )}
              </svg>
            </div>
          </button>
          <div className="timer-display">
            {isFocused ? (
              <span className="time-text">{formatTime(count)}</span>
            ) : (
              <span className="welcome-text">DIVE INTO FOCUS</span>
            )}
          </div>
        </div>
      </div>
      {!isFirst && !isFocused && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Session Complete</h2>
            <p className="modal-time">You Focused for {formatTime(count)}!</p>
            <button
              className="restart-button"
              onClick={() => {
                setIsFocused(false)
                setIsFirst(true)
                setCount(0)
                setStartTime(null)
                setEndTime(null)
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
