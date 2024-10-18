import {useState, useEffect} from 'react'
import {get} from '../server'
import {Slide} from '../data/types'

import {FaArrowLeft, FaArrowRight, FaPlay, FaPause} from 'react-icons/fa6'

export default function Banner() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const nextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    get('/slide/list')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setSlides(data.body)
        } else {
          setErrorMessage(data.errorMesage)
        }
      })
      .catch(e => {
        if (e instanceof Error) setErrorMessage(e.message)
      })
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide()
      }, 4000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])
  const togglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  return (
    <div className="relative w-3/4 overflow-hidden tablet:w-full">
      <div className="flex">
        <div
          className="flex transition-transform duration-500"
          style={{transform: `translateX(-${currentIndex * 100}%)`}}>
          {slides.map((slide, index) => (
            <div key={index} className="flex flex-shrink-0 w-full p-10">
              <div className="flex flex-col justify-center w-1/2">
                <div className="whitespace-pre-wrap w-36">
                  <div className="py-1 text-center bg-gray-600 rounded-tl-lg rounded-tr-lg rounded-br-lg">
                    <p className="text-xs text-white">{slide.title}</p>
                  </div>
                  <p className="pt-5 text-lg font-semibold">{slide.content}</p>
                </div>
              </div>
              <div className="w-1/2">
                <img
                  src={slide.imgName}
                  alt={`slide-${index}`}
                  className="object-cover w-full rounded-md shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center pt-5">
        <div className="absolute bottom-0 flex items-center w-1/2 px-4 py-5 tablet:w-2/3">
          <div className="relative w-full">
            <div className="h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-gray-600 rounded-full"
                style={{
                  width: `${((currentIndex + 1) / slides.length) * 100}%`
                }}
              />
            </div>
          </div>
          <div className="ml-4 text-xs w-28">
            <b>{currentIndex + 1}</b> / {slides.length}
          </div>

          <button onClick={prevSlide} className="px-2 py-2 ml-4 text-lg bg-white">
            <FaArrowLeft className="text-xs" />
          </button>

          <button onClick={togglePlay} className="px-2 py-2 ml-3 text-lg bg-white">
            {isPlaying ? <FaPause className="text-xs" /> : <FaPlay className="text-xs" />}
          </button>

          <button onClick={nextSlide} className="px-2 py-2 ml-3 text-lg bg-white">
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  )
}
