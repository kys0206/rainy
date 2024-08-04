import {useState, useEffect} from 'react'
import {get} from '../../server'

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
      <div className="p-5">
        <div className="pt-20 pb-4 text-xl font-bold">
          <p>테마가 있는 여행을 즐겨보세요.</p>
        </div>
        <div className="flex">
          <div
            id="map"
            className="rounded-lg"
            style={{width: '600px', height: '600px'}}
          />

          <div className="w-96 pl-7">
            <div>
              <p className="text-2xl font-bold">[여행지도] 추천 관광지</p>
            </div>

            <div className="overflow-y-auto" style={{maxHeight: '600px'}}>
              {trips.map((trip, index) => (
                <div className="flex pt-16">
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
              ))}

              {/* <div className="flex pt-16">
                <div className="w-28 h-28">
                  <img
                    className="object-cover w-full h-full rounded-lg"
                    src="/assets/images/beach/gangmoonbeach.png"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <div className="pl-6">
                    <p className="font-bold">강문해변</p>
                    <p className="text-sm text-gray-400">강원 강릉시</p>
                  </div>
                </div>
              </div>

              <div className="flex pt-16">
                <div className="w-28 h-28">
                  <img
                    className="object-cover w-full h-full rounded-lg"
                    src="/assets/images/beach/gangmoonbeach.png"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <div className="pl-6">
                    <p className="font-bold">강문해변</p>
                    <p className="text-sm text-gray-400">강원 강릉시</p>
                  </div>
                </div>
              </div>

              <div className="flex pt-16">
                <div className="w-28 h-28">
                  <img
                    className="object-cover w-full h-full rounded-lg"
                    src="/assets/images/beach/gangmoonbeach.png"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <div className="pl-6">
                    <p className="font-bold">강문해변</p>
                    <p className="text-sm text-gray-400">강원 강릉시</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="pt-10 pb-20">
          <div className="flex">
            <div
              className="flex items-center justify-start w-full pl-12"
              style={{height: '130px', backgroundColor: '#bdd5e5'}}>
              <p className="text-2xl">
                여행지도에서 <b>더 많은 추천테마</b> 보기
              </p>
            </div>
            <img src="/assets/images/thema_banner_img.png" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapPage
