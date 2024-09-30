import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import {FaPlus} from 'react-icons/fa'
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa6'
import {get} from '../../server'

type Thema = {
  _id: string
  title: string
  content: string
  adminId: string
  author: string
  imgName: string
}

export default function BannerPage() {
  const [themas, setThemas] = useState<Thema[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState(0)

  const navigate = useNavigate()

  const nextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % themas.length)
  }

  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + themas.length) % themas.length)
  }

  useEffect(() => {
    get('/thema/list')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setThemas(data.body)
        } else {
          setErrorMessage(data.errorMesage)
        }
      })
      .catch(e => {
        if (e instanceof Error) setErrorMessage(e.message)
      })
  }, [])

  const handleClick = (thema: Thema) => {
    navigate('/main/thema/info', {state: {thema}})
  }

  return (
    <>
      <div className="pt-20 bg-yellow-300">
        <div className="p-10">
          <div>
            <p className="text-3xl">다채로운 즐거움이 가득한</p>
            <p className="text-3xl font-bold">전국 테마여행 추천!</p>
          </div>

          <div className="pt-10 pb-60">
            <button className="flex items-center justify-center text-sm">
              <FaPlus />
              <p className="pl-1">모든 테마 보기</p>
            </button>
          </div>
        </div>
      </div>

      <div className="" style={{marginTop: '-200px'}}>
        <div className="relative w-full px-10 pt-10 overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${(currentIndex * 100) / themas.length}%)`, // 현재 슬라이드 위치에 따라 이동
              width: `${themas.length * 300}px`, // 전체 너비 조정
              height: '400px',
              marginTop: '100px'
            }}>
            {themas.map((thema, index) => (
              <div
                key={index}
                onClick={() => handleClick(thema)}
                className={`rounded-sm flex flex-col items-center justify-center flex-shrink-0 pl-4 pr-4 ${
                  index === currentIndex ? 'shadow-md' : ''
                }`}
                style={{
                  width: index === currentIndex ? '390px' : '400px',
                  height: index === currentIndex ? '420px' : '320px',
                  backgroundColor: index === currentIndex ? 'white' : 'transparent', // 현재 슬라이드만 배경색 적용
                  borderTopRightRadius: '47%',
                  borderTopLeftRadius: '47%',
                  marginTop: index === currentIndex ? '-110px' : '-10px'
                }}>
                <img
                  src={thema.imgName}
                  alt={`slide-${index}`}
                  className="object-cover rounded-md shadow-lg"
                  style={{
                    paddingTop: index === currentIndex ? '10px' : '',
                    width: index === currentIndex ? '350px' : '400px',
                    height: index === currentIndex ? '320px' : '300px',
                    borderTopRightRadius: '50%',
                    borderTopLeftRadius: '50%'
                  }}
                />

                {index === currentIndex ? (
                  <div
                    className="flex items-center justify-center w-full"
                    style={{height: '100px'}}>
                    <div className="pb-3 pl-6 pr-6">
                      <p className="pt-3 text-lg text-center">{thema.title}</p>
                      <p className="text-sm text-center text-gray-400">{thema.content}</p>
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-lg text-center text-white"
                    style={{marginTop: '-50px'}}>
                    {thema.title}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <div className="absolute bottom-0 flex items-center w-1/2 px-4 py-5">
              <div className="relative w-full">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-gray-600 rounded-full"
                    style={{
                      width: `${((currentIndex + 1) / themas.length) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div className="w-20 ml-4 text-sm">
                {currentIndex + 1} / {themas.length}
              </div>
              <button
                onClick={prevSlide}
                className="px-2 py-2 ml-4 text-lg bg-white border border-black rounded-full">
                <FaArrowLeft className="text-xs" />
              </button>
              <button
                onClick={nextSlide}
                className="px-2 py-2 ml-3 text-lg bg-white border border-black rounded-full">
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
