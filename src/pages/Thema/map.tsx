import {useState, useEffect} from 'react'
import {get} from '../../server'
import {useNavigate} from 'react-router-dom'

declare global {
  interface Window {
    kakao: any
  }
}

type Trip = {
  _id: string
  city_name: string
  si_gu_name: string
  place_name: string
  imgName: string
  address: string
  adminId: string
  author: string
}

const MapPage = () => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')

  const navigate = useNavigate()

  const handleTripClick = (trip: Trip) => {
    navigate('/main/area/info', {state: {trip}})
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    let container = document.getElementById('map') // 지도를 담을 영역의 DOM 레퍼런스
    let options = {
      center: new window.kakao.maps.LatLng(35.8175376, 127.1520417), // 지도 중심 좌표
      level: 13 // 지도의 레벨(확대, 축소 정도)
    }

    let map = new window.kakao.maps.Map(container, options) // 지도 생성 및 객체 리턴
    let geocoder = new window.kakao.maps.services.Geocoder() // 주소-좌표 변환 객체 생성

    // 마커 클러스터러 생성
    let clusterer = new window.kakao.maps.MarkerClusterer({
      map: map, // 마커들을 클러스터링할 지도 객체
      averageCenter: true, // 클러스터러의 평균 중심을 계산
      minLevel: 10 // 클러스터 할 최소 지도 레벨
    })

    // 주소를 좌표로 변환하여 마커 생성 및 클러스터러에 추가
    const addMarker = (address: string, placeName: string) => {
      geocoder.addressSearch(address, (result: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          let coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
          let marker = new window.kakao.maps.Marker({
            position: coords
          })

          let infowindow = new window.kakao.maps.InfoWindow({
            content: `<span style="padding:5px; width: max-content; display: flex; align-items: center; justify-content: center; text-align: center;">
              ${placeName} </span>`
          })

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker)
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
          data.body.forEach((trip: Trip) => {
            addMarker(trip.address, trip.place_name)
          })
        } else {
          setErrorMessage(data.errorMessage)
        }
      })
      .catch(e => {
        if (e instanceof Error) setErrorMessage(e.message)
      })
  }, [])

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-screen-xl p-5">
        <div className="pt-20 pb-4 text-xl font-bold text-left">
          <p>테마가 있는 여행을 즐겨보세요.</p>
        </div>
        <div className="flex flex-col md:flex-row">
          <div
            id="map"
            className="flex-grow rounded-lg"
            style={{width: '100%', height: '60vh'}}
          />

          <div className="w-full mt-4 md:w-2/3 md:pl-7 md:mt-0">
            <div className="pb-2">
              <p className="text-2xl font-bold">[여행지도] 추천 관광지</p>
            </div>

            <div className="overflow-y-auto" style={{maxHeight: '50vh'}}>
              {trips.map((trip, index) => (
                <div key={index}>
                  <button className="text-left" onClick={() => handleTripClick(trip)}>
                    <div className="flex pt-10">
                      <div className="w-28 h-28">
                        <img
                          className="object-cover w-full h-full rounded-lg"
                          src={trip.imgName}
                          alt={trip.place_name}
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="pl-6">
                          <p className="font-bold">{trip.place_name}</p>
                          <p className="text-sm text-gray-400">
                            {trip.city_name} {trip.si_gu_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 pb-20">
          <div className="flex w-full">
            <img className="w-full rounded-lg" src="/assets/images/thema_banner.png" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapPage
