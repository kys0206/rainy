import {useEffect, useState} from 'react'
import {get} from '../../server'
import {Restaurant, Trip} from '../../data/types'

declare global {
  interface Window {
    kakao: any
  }
}

const MapPage = () => {
  const [places, setPlaces] = useState<(Trip | Restaurant)[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<(Trip | Restaurant)[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [map, setMap] = useState<any>(null)
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  const [coords, setCoords] = useState<{[key: string]: any}>({})
  const [selectedPlace, setSelectedPlace] = useState<Trip | Restaurant | null>(null) // 선택된 place 상태 추가
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleShareClick = () => {
    setIsModalOpen(true)
  }

  // URL 복사
  const handleCopyUrl = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      alert('URL이 복사되었습니다!')
      setIsModalOpen(false)
    })
  }

  // 모달 창 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    const container = document.getElementById('map')
    const options = {
      center: new window.kakao.maps.LatLng(37.5192901, 127.0521102),
      level: 6
    }
    const mapInstance = new window.kakao.maps.Map(container, options)
    setMap(mapInstance)

    const geocoder = new window.kakao.maps.services.Geocoder()
    const clusterer = new window.kakao.maps.MarkerClusterer({
      map: mapInstance,
      averageCenter: true,
      minLevel: 10
    })

    const addMarker = (address: string, name: string) => {
      geocoder.addressSearch(address, (result: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
          setCoords(prev => ({...prev, [address]: coords}))

          const marker = new window.kakao.maps.Marker({position: coords})
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<span style="padding:5px;">${name}</span>`
          })

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(mapInstance, marker)
          })

          clusterer.addMarker(marker)
        }
      })
    }

    const fetchData = async () => {
      try {
        const [tripResponse, restaurantResponse] = await Promise.all([
          get('/trip/list').then(res => res.json()),
          get('/restaurant/list').then(res => res.json())
        ])

        if (tripResponse.ok && restaurantResponse.ok) {
          const combinedData = [...tripResponse.body, ...restaurantResponse.body]
          const uniquePlaces = Array.from(
            new Map(combinedData.map(item => [item.address, item])).values()
          )

          setPlaces(uniquePlaces)
          setFilteredPlaces(uniquePlaces)
          uniquePlaces.forEach(place =>
            addMarker(
              place.address,
              'place_name' in place ? place.place_name : place.store_name
            )
          )
        } else {
          setErrorMessage('데이터를 불러오는 중 오류가 발생했습니다.')
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        )
      }
    }

    fetchData()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords
          const currentCoords = new window.kakao.maps.LatLng(latitude, longitude)
          setCurrentLocation(currentCoords)

          new window.kakao.maps.Marker({
            position: currentCoords,
            map: mapInstance,
            title: '현재 위치'
          })
        },
        error => console.error('현재 위치를 가져오는데 실패했습니다.', error)
      )
    }
  }, [])

  const calculateDistance = (start: any, end: any) => {
    const toRad = (value: number) => (value * Math.PI) / 180
    const R = 6371
    const dLat = toRad(end.getLat() - start.getLat())
    const dLon = toRad(end.getLng() - start.getLng())
    const lat1 = toRad(start.getLat())
    const lat2 = toRad(end.getLat())

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(1)
  }

  const handleItemClick = (place: Trip | Restaurant) => {
    const geocoder = new window.kakao.maps.services.Geocoder()
    // console.log(place)
    geocoder.addressSearch(place.address, (result: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
        map.setCenter(coords)
        setSelectedPlace(place) // 선택된 place 정보를 상태에 저장
      }
    })
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase()
    setSearchTerm(value)

    const filtered = places.filter(place =>
      ('place_name' in place ? place.place_name : place.store_name)
        .toLowerCase()
        .includes(value)
    )
    setFilteredPlaces(filtered)
  }

  const handleSidebarClose = () => {
    setSelectedPlace(null) // 선택된 place 정보를 초기화하여 사이드바 닫기
  }

  const handleShare = () => {
    const shareData = {
      title: document.title,
      text: '여행지와 음식점을 확인해보세요!',
      url: window.location.href
    }

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log('공유 성공'))
        .catch(err => console.error('공유 중 오류 발생', err))
    } else {
      navigator.clipboard
        .writeText(shareData.url)
        .then(() => alert('URL이 복사되었습니다!'))
        .catch(err => console.error('URL 복사 중 오류 발생', err))
    }
  }

  return (
    <div className="flex">
      <div className="p-5 pt-24 w-80">
        <input
          type="text"
          placeholder="검색할 여행지 이름을 입력하세요"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <ul className="overflow-y-auto" style={{maxHeight: '600px'}}>
          {filteredPlaces.map((place, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(place)}
              className="p-2 rounded cursor-pointer hover:bg-gray-100">
              <div className="flex items-center">
                <strong className="mr-4">
                  {'place_name' in place ? place.place_name : place.store_name}
                </strong>
                <span className="text-xs text-gray-300">
                  {'place_name' in place ? '주변 여행지' : '음식점'}
                </span>
              </div>
              <p className="pb-1 text-sm">{place.address}</p>
              <p className="text-sm text-green-500">{place.contact}</p>
              {currentLocation && coords[place.address] && (
                <p className="text-sm text-blue-500">
                  내 위치로부터{' '}
                  {calculateDistance(currentLocation, coords[place.address])} km
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="z-40">
        {selectedPlace && (
          <div className="relative z-50 shadow-sm w-64bg-white top-24 left-30">
            <button
              className="absolute top-0 right-0 text-xl font-bold text-white w-7 h-7 hover:bg-gray-300"
              onClick={handleSidebarClose}>
              x
            </button>
            <img
              src={selectedPlace.imgName}
              alt={selectedPlace.imgName}
              className="object-cover w-full mb-4 h-44"
            />
            <span className="text-xs text-gray-400">
              {'place_name' in selectedPlace ? '주변 여행지' : '음식점'}
            </span>
            <h2 className="mb-5 text-xl font-semibold">
              {'place_name' in selectedPlace
                ? selectedPlace.place_name
                : selectedPlace.store_name}
            </h2>
            <p className="text-sm">{selectedPlace.address}</p>
            {currentLocation && coords[selectedPlace.address] && (
              <p className="text-sm text-gray-300">
                내 위치로부터{' '}
                {calculateDistance(currentLocation, coords[selectedPlace.address])} km
              </p>
            )}

            {selectedPlace.tags ? (
              <p
                className="pt-5 text-sm"
                dangerouslySetInnerHTML={{
                  __html: selectedPlace.tags
                    .map(
                      (tag: string) =>
                        `<span class="underline text-gray-400">#${tag}</span>`
                    )
                    .join(', ')
                }}
              />
            ) : null}

            <div className="flex items-center justify-center pt-10">
              <div className="px-1">
                <img
                  className="cursor-pointer"
                  src="/assets/images/icon/share_btn.png"
                  width="auto"
                  height="auto"
                  onClick={handleShareClick}
                />
              </div>

              <div className="px-1">
                <img
                  className=""
                  src="/assets/images/icon/save_before_btn.png"
                  width="auto"
                  height="auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-5 bg-white rounded">
            <button
              className="absolute text-2xl font-bold text-gray-500 top-2 right-2 hover:text-black"
              onClick={handleCloseModal}>
              &times;
            </button>
            <h2 className="mb-4 text-lg font-bold text-center">공유하기</h2>
            <div className="flex pt-10">
              <div className="flex">
                <input
                  className="w-64 pl-3 text-xs bg-gray-100 border border-gray-300 rounded-tl-md rounded-bl-md"
                  value={window.location.href}
                  readOnly
                />
                <button
                  className="w-16 px-4 py-2 text-xs text-black border border-gray-300 rounded-tr-md rounded-br-md"
                  onClick={handleCopyUrl}>
                  복사
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-2/3 p-5 pt-24">
        <div className="flex h-screen">
          <div className="map" id="map" style={{width: '100%', height: '85vh'}} />
        </div>
      </div>
    </div>
  )
}

export default MapPage
