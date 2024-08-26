import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'

export default function TripInfoPage() {
  const location = useLocation()
  const festival = location.state?.festival
  console.log(festival)

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let container = document.getElementById('map') // 지도를 담을 영역의 DOM 레퍼런스
    let options = {
      center: new window.kakao.maps.LatLng(35.5981956, 127.2366461), // 지도 중심 좌표
      level: 2 // 지도의 레벨(확대, 축소 정도)
    }

    let map = new window.kakao.maps.Map(container, options) // 지도 생성 및 객체 리턴

    // 주소-좌표 변환 객체 생성
    let geocoder = new window.kakao.maps.services.Geocoder()

    // 주소로 좌표 얻기
    if (festival?.address) {
      geocoder.addressSearch(
        festival.address,
        (result: {x: string; y: string}[], status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            let coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords
            })

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div className="text-center" style="padding:5px; width: 230px;">${festival.address}</div>`
            })
            infowindow.open(map, marker)
            map.setCenter(coords) // 좌표를 지도 중심으로 설정
          }
        }
      )
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY
      if (scrollTop > window.innerHeight / 2) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative w-full">
      <div
        className={`flex justify-center transition-opacity duration-500 ${
          isScrolled ? 'opacity-0' : 'opacity-100'
        }`}>
        <img src={festival.imgName} className="object-cover" />
      </div>

      <div
        className={`flex justify-center pt-10 transition-transform duration-500 ${
          isScrolled ? '-translate-y-40' : 'translate-y-0'
        }`}>
        <div className="w-8/12 p-5 text-left bg-white rounded-lg">
          <p className="pb-5 text-xl font-black">{festival.festival_info}</p>
          <p className="pb-5 text-3xl font-black">{festival.title}</p>
          <div className="pb-4">
            <div className="flex flex-col">
              <div className="">
                <div className="py-2 bg-red-400 rounded-md w-28">
                  <p className="text-lg font-bold text-center text-white">
                    {festival.status}
                  </p>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-center justify-center">
                  <div className="relative p-2">
                    <img className="rounded-md" src={festival.imgName} width="450px" />
                  </div>

                  {/* <div className="relative p-2">
                    <img
                      className="rounded-md"
                      src="/assets/images/water_festival.png"
                      width="450px"
                    />
                  </div> */}
                </div>
              </div>
              <div className="pt-10 pb-10 border-b-2">
                <p className="text-sm whitespace-pre-line">{festival.content}</p>
              </div>
              <div className="py-10 border-b-2">
                <div className="flex">
                  <div className="w-1/3">
                    <img className="rounded-md" src={festival.imgName} />
                  </div>
                  <div className="pl-10">
                    <div className="flex">
                      <img
                        className="w-7 h-7"
                        src="/assets/images/icon/calendar_icon.png"
                      />
                      <p className="flex items-center justify-center pl-3 text-sm">
                        {festival.festival_period}
                      </p>
                    </div>
                    <div className="flex pt-5">
                      <img
                        className="w-7 h-7"
                        src={'/assets/images/icon/marker_icon.png'}
                      />
                      <p className="flex items-center justify-center pl-3 text-sm">
                        {festival.address}
                      </p>
                    </div>
                    <div className="flex pt-5">
                      <img className="w-7 h-7" src="/assets/images/icon/cost_icon.png" />
                      <p className="flex items-center justify-center pl-3 text-sm">
                        {festival.entrace_fee}
                      </p>
                    </div>
                    <div className="flex pt-5">
                      <img className="w-7 h-7" src="/assets/images/icon/house_icon.png" />
                      <p className="flex items-center justify-center pl-3 text-sm">
                        {festival.city_name} {festival.si_gu_name}
                      </p>
                    </div>
                    <div className="flex pt-5">
                      <img className="w-7 h-7" src="/assets/images/icon/phone_icon.png" />
                      <p className="flex items-center justify-center pl-3 text-sm">
                        {festival.contact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-10 border-b-2">
                <p className="pb-4 text-xl font-bold">길찾기</p>
                <div
                  id="map"
                  className="rounded-lg"
                  style={{width: '100%', height: '300px'}}
                />
              </div>

              <div className="pt-20 pb-24">
                <div>
                  <p className="text-lg font-bold">
                    '{festival?.title}'와(과) 유사한 여행지 추천 👍
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-5 pt-5">
                  <div className="flex items-center justify-center rounded h-44">
                    <img
                      src="/assets/images/danghangpo.png"
                      className="object-cover rounded h-44"
                    />
                  </div>
                  <div className="flex items-center justify-center rounded h-44">
                    <img
                      src="/assets/images/buyeo.png"
                      className="object-cover rounded h-44"
                    />
                  </div>
                  <div className="flex items-center justify-center rounded h-44">
                    <img
                      src="/assets/images/forest.png"
                      className="object-cover rounded h-44"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
