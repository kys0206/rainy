import {useEffect, useState, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa6'

import {get} from '../../server'
import {City, District, Trip, Restaurant} from '../../data/types'

export default function AreaPage() {
  const [citys, setCitys] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')

  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([])
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])

  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [slide, setSlide] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const slideRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    get('/area/city/list')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setCitys(data.body)
          if (data.body.length > 0) {
            const firstCity = data.body[0]
            setSelectedCity(firstCity.short_name)
            get('/area/district/list')
              .then(res => res.json())
              .then(data => {
                if (data.ok) {
                  setDistricts(data.body)
                  const cityDistricts = data.body.filter(
                    (district: {city_name: string}) =>
                      district.city_name === firstCity.city_name
                  )
                  setFilteredDistricts(cityDistricts)
                } else {
                  setErrorMessage(data.errorMessage)
                }
              })
              .catch(e => {
                if (e instanceof Error) setErrorMessage(e.message)
              })
            get('/trip/list')
              .then(res => res.json())
              .then(data => {
                if (data.ok) {
                  setTrips(data.body)
                  const cityTrips = data.body.filter(
                    (trip: {city_name: string}) => trip.city_name === firstCity.city_name
                  )
                  setFilteredTrips(cityTrips)
                } else {
                  setErrorMessage(data.errorMessage)
                }
              })
              .catch(e => {
                if (e instanceof Error) setErrorMessage(e.message)
              })
            get('/restaurant/list')
              .then(res => res.json())
              .then(data => {
                if (data.ok) {
                  setRestaurants(data.body)
                  const cityRestaurants = data.body.filter(
                    (restaurant: {city_name: string}) =>
                      restaurant.city_name === firstCity.city_name
                  )
                  setFilteredRestaurants(cityRestaurants)
                } else {
                  setErrorMessage(data.errorMessage)
                }
              })
              .catch(e => {
                if (e instanceof Error) setErrorMessage(e.message)
              })
          }
        } else {
          setErrorMessage(data.errorMessage)
        }
      })
      .catch(e => {
        if (e instanceof Error) setErrorMessage(e.message)
      })
  }, [])

  const handleCityClick = (city: City) => {
    setSelectedCity(city.short_name)
    const cityDistricts = districts.filter(
      district => district.city_name === city.city_name
    )
    const cityTrips = trips.filter(trip => trip.city_name === city.city_name)
    const cityRestaurants = restaurants.filter(
      restaurant => restaurant.city_name === city.city_name
    )
    setFilteredDistricts(cityDistricts)
    setFilteredTrips(cityTrips)
    setFilteredRestaurants(cityRestaurants)
    setCurrentSlide(0)
  }

  const handleTripClick = (trip: Trip) => {
    navigate('/main/area/info', {state: {trip}})
    window.scrollTo(0, 0)
  }

  const handleRestClick = (restaurant: Restaurant) => {
    navigate('/main/restaurant/info', {state: {restaurant}})
    window.scrollTo(0, 0)
  }

  const nextSlide = () => {
    if (currentSlide < Math.ceil(filteredTrips.length / 2) - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const randomTrips = (cityTrips: Trip[]) => {
    const random = [...cityTrips].sort(() => 0.5 - Math.random())
    return random.slice(0, 4)
  }

  let startX: number
  let scrollLeft: number

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (slideRef.current) {
      startX = e.pageX - slideRef.current.offsetLeft
      scrollLeft = slideRef.current.scrollLeft
      slideRef.current.style.cursor = 'grabbing'
      slideRef.current.addEventListener('mousemove', handleMouseMove)
      slideRef.current.addEventListener('mouseup', handleMouseUp)
      slideRef.current.addEventListener('mouseleave', handleMouseLeave)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (slideRef.current) {
      const x = e.pageX - slideRef.current.offsetLeft
      const walk = (x - startX) * 2 // 스크롤 속도 조절
      slideRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    if (slideRef.current) {
      slideRef.current.style.cursor = 'grab'
      slideRef.current.removeEventListener('mousemove', handleMouseMove)
      slideRef.current.removeEventListener('mouseup', handleMouseUp)
      slideRef.current.removeEventListener('mouseleave', handleMouseLeave)
    }
  }

  const handleMouseLeave = () => {
    if (slideRef.current) {
      slideRef.current.style.cursor = 'grab'
      slideRef.current.removeEventListener('mousemove', handleMouseMove)
      slideRef.current.removeEventListener('mouseup', handleMouseUp)
      slideRef.current.removeEventListener('mouseleave', handleMouseLeave)
    }
  }

  return (
    <div className="tablet:w-full">
      <div className="p-10 pt-32 bg-blue-200">
        <div className="">
          <div>
            <p className="text-3xl font-black">구석구석 지역 정보</p>
            <p className="text-3xl">어디까지 가봤니?</p>
          </div>

          <div>
            <div
              ref={slideRef}
              className="w-full overflow-hidden cursor-grab"
              onMouseDown={handleMouseDown}>
              <div
                className="flex pt-16 pb-40 transition-transform duration-300"
                style={{transform: `translateX(-${slide * 100}%)`}}>
                {citys.map((city, index) => (
                  <div className="pr-5" key={city._id}>
                    <button onClick={() => handleCityClick(city)} className="">
                      <div
                        className="rounded-full hover:shadow-lg"
                        style={{
                          backgroundImage: `url(${city.imgName})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          width: '100px',
                          height: '100px'
                        }}
                      />
                      <p className="pt-2 text-gray-600">{city.short_name}</p>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10" style={{marginTop: '-200px'}}>
        <div className="flex pb-4">
          <p className="pr-3 text-2xl font-bold">{selectedCity || '지역명'}</p>
          <button>
            <img
              src="/assets/images/icon/icon_zone_link.png"
              width="25px"
              alt="icon_zone"
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="px-2 py-2 mr-3 text-lg bg-white border border-black rounded-full"
            onClick={prevSlide}
            disabled={currentSlide === 0}>
            <FaArrowLeft className="text-xs" />
          </button>
          <div className="w-full overflow-hidden">
            <div
              className="flex transition-transform duration-300 tablet:flex-col"
              style={{transform: `translateX(-${currentSlide * 100}%)`}}>
              {filteredTrips.length > 0 ? (
                filteredTrips.map((trip, index) => (
                  <div
                    className="flex-shrink-0 w-1/3 px-2 sm:w-1/2 tablet:w-full"
                    key={trip._id}>
                    <div className="bg-white border border-black rounded-md p-7 tablet:p-4 tablet:m-0.5">
                      <div className="w-12 text-sm text-center text-white bg-gray-800 rounded-full">
                        테마
                      </div>
                      <div className="pt-5 text-lg h-28 tablet:h-20">
                        <p>[{selectedCity}]</p>
                        <p>{trip.place_name}</p>
                      </div>
                      <div className="h-8 pt-2 pb-14 tablet:pb-0">
                        <span className="text-sm text-gray-600">
                          {trip.short_info.slice(0, 32)}
                        </span>
                      </div>
                      <div className="flex justify-end underline pt-7">
                        <a
                          className="text-sm text-gray-400 cursor-pointer"
                          onClick={() => handleTripClick(trip)}>
                          자세히보기
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-grow flex-shrink-0 bg-white border border-black rounded-md flex-basis-100 p-7">
                  <p className="text-xl text-gray-600">여행지 정보가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
          <button
            className="px-2 py-2 ml-4 text-lg bg-white border border-black rounded-full"
            onClick={nextSlide}
            disabled={currentSlide >= Math.ceil(filteredTrips.length / 2) - 1}>
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      </div>

      <div className="px-10 pb-10">
        <div className="w-full p-5 border rounded-md">
          <p>
            <b>{selectedCity}</b> 지역 문화관광 홈페이지 바로가기
          </p>
          <div className="w-auto">
            <div className="pt-3">
              <div className="flex flex-wrap w-full">
                {filteredDistricts.map(district => (
                  <div className="pt-2 pr-2" key={district._id}>
                    <button
                      className="w-16 text-sm text-gray-400 border rounded-xl"
                      onClick={() => window.open(district.web_url, '_blank')}>
                      {district.si_gu_name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full">
        <div className="w-full pb-24">
          <div className="pb-10 bg-gray-100">
            <div className="flex px-5 md:px-10 lg:px-20" style={{display: 'grid'}}>
              <div className="flex">
                <div className="pt-5">
                  <div className="pb-4">
                    <p className="text-xl">
                      <b>{selectedCity}</b> 추천 여행지
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-start w-full gap-4">
                {randomTrips(filteredTrips).map((trip, index) => (
                  <div
                    className="flex items-center justify-center bg-white rounded-lg shadow-md w-52 h-52 tablet:w-44 tablet:h-44 tablet:ml-2"
                    key={trip._id}>
                    <button className="" onClick={() => handleTripClick(trip)}>
                      <div className="">
                        <img className="" src={trip.imgName} />
                      </div>
                      <div className="p-2">
                        <p className="text-center text-md">{trip.place_name}</p>
                        <p className="text-xs text-center text-gray-300">
                          {trip.city_name} {trip.si_gu_name}
                        </p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex px-5 md:px-10 lg:px-20" style={{display: 'grid'}}>
              <div className="flex w-full">
                <div className="w-full pt-5">
                  <div className="pb-4">
                    <p className="text-xl">
                      <b>{selectedCity}</b> 추천 맛집
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-start w-full gap-4">
                {filteredRestaurants.map((rest, index) => (
                  <div
                    className="flex items-center justify-center bg-white rounded-lg shadow-md w-52 h-52 tablet:w-44 tablet:h-44 tablet:ml-2"
                    key={rest._id}>
                    <button className="" onClick={() => handleRestClick(rest)}>
                      <div>
                        <img src={rest.imgName} />
                      </div>
                      <div className="p-2">
                        <p className="text-center text-md">{rest.store_name}</p>
                        <p className="text-xs text-center text-gray-300">
                          {rest.city_name} {rest.si_gu_name}
                        </p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
