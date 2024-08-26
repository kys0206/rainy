import {useEffect, useState} from 'react'
import {get} from '../../server'
import {Trip} from '../../data/types'

declare global {
  interface Window {
    kakao: any
  }
}

const MapPage = () => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]) // 필터링된 여행지 목록 상태 추가
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('') // 검색어 상태 추가
  const [map, setMap] = useState<any>(null) // 지도 객체를 상태로 관리
  const [currentLocation, setCurrentLocation] = useState<any>(null) // 현재 위치 상태 추가
  const [tripCoords, setTripCoords] = useState<{[key: string]: any}>({}) // 여행지 좌표를 저장하는 상태 추가

  useEffect(() => {
    let container = document.getElementById('map') // 지도를 담을 영역의 DOM 레퍼런스
    let options = {
      center: new window.kakao.maps.LatLng(37.5192901, 127.0521102), // 지도 중심 좌표
      level: 6 // 지도의 레벨(확대, 축소 정도)
    }

    let mapInstance = new window.kakao.maps.Map(container, options) // 지도 생성 및 객체 리턴
    setMap(mapInstance) // 지도 객체를 상태로 설정

    let geocoder = new window.kakao.maps.services.Geocoder() // 주소-좌표 변환 객체 생성

    // 마커 클러스터러 생성
    let clusterer = new window.kakao.maps.MarkerClusterer({
      map: mapInstance, // 마커들을 클러스터링할 지도 객체
      averageCenter: true, // 클러스터러의 평균 중심을 계산
      minLevel: 10 // 클러스터 할 최소 지도 레벨
    })

    // 주소를 좌표로 변환하여 마커 생성 및 클러스터러에 추가
    const addMarker = (address: string, placeName: string, contact: string) => {
      geocoder.addressSearch(address, (result: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          let coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)

          // 여행지 좌표를 저장
          setTripCoords(prevState => ({
            ...prevState,
            [address]: coords
          }))

          let marker = new window.kakao.maps.Marker({
            position: coords
          })

          let infowindow = new window.kakao.maps.InfoWindow({
            content: `<span style="padding:5px; width: max-content; display: flex; align-items: center; justify-content: center; text-align: center;">
              ${placeName} </span>`
          })

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(mapInstance, marker)
          })

          // 클러스터러에 마커 추가
          clusterer.addMarker(marker)
        }
      })
    }

    // 여행지 리스트를 받아와서 마커 추가
    get('/trip/list')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setTrips(data.body)
          setFilteredTrips(data.body) // 필터링된 목록도 초기화
          data.body.forEach((trip: Trip) => {
            addMarker(trip.address, trip.place_name, trip.contact)
          })
        } else {
          setErrorMessage(data.errorMessage)
        }
      })
      .catch(e => {
        if (e instanceof Error) setErrorMessage(e.message)
      })

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords
          const currentCoords = new window.kakao.maps.LatLng(latitude, longitude)
          setCurrentLocation(currentCoords)

          // 현재 위치 마커 생성
          new window.kakao.maps.Marker({
            position: currentCoords,
            map: mapInstance,
            title: '현재 위치'
          })
        },
        error => {
          console.error('현재 위치를 가져오는데 실패했습니다.', error)
        }
      )
    }
  }, [])

  // Haversine 공식을 이용하여 두 지점 간의 거리 계산 (킬로미터 단위)
  const calculateDistance = (start: any, end: any) => {
    const toRad = (value: number) => (value * Math.PI) / 180

    const R = 6371 // 지구의 반지름 (킬로미터 단위)
    const lat1 = start.getLat()
    const lon1 = start.getLng()
    const lat2 = end.getLat()
    const lon2 = end.getLng()

    const φ1 = toRad(lat1)
    const φ2 = toRad(lat2)
    const Δφ = toRad(lat2 - lat1)
    const Δλ = toRad(lon2 - lon1)

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = R * c // 두 지점 간 거리 (킬로미터 단위)
    return distance.toFixed(1) // 소수점 첫째 자리까지 반올림
  }

  // 목록 항목 클릭 시 해당 위치로 이동
  const handleItemClick = (address: string) => {
    let geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.addressSearch(address, (result: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        let coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
        map.setCenter(coords) // 지도 중심 좌표만 변경
      }
    })
  }

  // 검색어 입력 시 호출되는 함수
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)

    // 검색어에 따라 여행지 목록 필터링
    const filtered = trips.filter(trip =>
      trip.place_name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredTrips(filtered)
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
          {filteredTrips.map((trip, index) => (
            <>
              <li
                key={index}
                onClick={() => handleItemClick(trip.address)}
                className="p-2 rounded cursor-pointer hover:bg-gray-100">
                <strong>{trip.place_name}</strong>
                <p className="pb-1 text-sm">{trip.address}</p>
                <p className="text-sm text-green-500">{trip.contact}</p>
                {currentLocation && tripCoords[trip.address] && (
                  <p className="text-sm text-blue-500">
                    내 위치로부터{' '}
                    {calculateDistance(currentLocation, tripCoords[trip.address])} km
                  </p>
                )}
              </li>
              <div className="my-2 border" />
            </>
          ))}
        </ul>
      </div>
      <div className="w-2/3 p-5 pt-24">
        <div className="flex h-screen">
          <div className="map" id="map" style={{width: '100%', height: '85vh'}} />
        </div>
      </div>
    </div>
  )
}

export default MapPage
