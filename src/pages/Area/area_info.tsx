import React, {useEffect, useState, useRef} from 'react'
import {useLocation} from 'react-router-dom'

export default function AreaInfoPage() {
  const location = useLocation()
  const trip = location.state?.trip

  const [isScrolled, setIsScrolled] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTab, setSelectedTab] = useState('')
  const postsPerPage = 2

  // 현재 페이지에 보여질 게시물
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage

  // 페이지 변경
  const paginate = (pageNumber: React.SetStateAction<number>) =>
    setCurrentPage(pageNumber)

  const detailRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const recommendRef = useRef<HTMLDivElement>(null)

  const onMoveToDetail = () => {
    detailRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    setSelectedTab('상세보기')
  }

  const onMoveToPhoto = () => {
    photoRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    setSelectedTab('사진보기')
  }

  const onMoveToInfo = () => {
    infoRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    setSelectedTab('여행정보')
  }

  const onMoveToRecommend = () => {
    recommendRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    setSelectedTab('추천여행')
  }

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
    if (trip?.address) {
      geocoder.addressSearch(
        trip.address,
        (result: {x: string; y: string}[], status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            let coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords
            })

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div className="text-center" style="padding:5px; width: 230px;">${trip.address}</div>`
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
  }, [trip?.address])

  return (
    <div className="w-full">
      <div className="flex justify-center px-10 pt-32">
        <div className="text-center">
          <p className="pb-5 text-3xl font-black">{trip?.place_name}</p>
          <p className="pb-8 text-gray-500 text-md">
            {trip.city_name}&ensp;
            {trip?.si_gu_name}
          </p>
          <p className="pb-5 text-xl font-bold underline decoration-red-100 decoration-8 underline-offset-1">
            {trip.short_info}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-8/12">
          <div className="flex flex-col pt-10 pb-4">
            <div className="flex flex-row text-center border-t-2 border-b-2 border-solid">
              <div
                className={`flex items-center justify-center w-1/4 h-10 cursor-pointer ${
                  selectedTab === '사진보기' ? 'border-b-2 border-black font-black' : ''
                }`}
                onClick={onMoveToPhoto}>
                사진보기
              </div>

              <div
                className={`flex items-center justify-center w-1/4 h-10 cursor-pointer ${
                  selectedTab === '상세보기' ? 'border-b-2 border-black font-black' : ''
                }`}
                onClick={onMoveToDetail}>
                상세보기
              </div>

              <div
                className={`flex items-center justify-center w-1/4 h-10 cursor-pointer ${
                  selectedTab === '여행 정보' ? 'border-b-2 border-black font-black' : ''
                }`}
                onClick={onMoveToInfo}>
                여행 정보
              </div>

              <div
                className={`flex items-center justify-center w-1/4 h-10 cursor-pointer ${
                  selectedTab === '추천여행' ? 'border-b-2 border-black font-black' : ''
                }`}
                onClick={onMoveToRecommend}>
                추천여행
              </div>
            </div>

            <div className="flex justify-center p-5 pt-10" ref={photoRef}>
              <img src={trip?.imgName} width="500px" height="auto" />
            </div>

            <div className="flex flex-col justify-center pt-10">
              <div className="w-full border-b-2 border-black border-solid">
                <p className="font-bold">상세정보</p>
              </div>

              <div className="pt-5" ref={detailRef}>
                <p className="text-sm whitespace-pre-wrap">{trip?.place_info}</p>
              </div>

              <div className="py-10 pt-10 border-b-2">
                <p className="pb-2 font-bold text-md">위치</p>
                <div
                  id="map"
                  className="rounded-lg"
                  style={{width: '100%', height: '300px'}}
                />
              </div>

              <div className="pt-5" ref={infoRef}>
                <table>
                  <tbody className="text-sm">
                    <tr>
                      <li className="pb-2 w-72">문의 및 안내</li>
                      <td className="pb-2 text-gray-500">{trip.contact}</td>
                    </tr>

                    <tr>
                      <li className="pb-2">홈페이지</li>
                      <td className="pb-2 text-gray-500">{trip.web_url}</td>
                    </tr>

                    <tr>
                      <li className="pb-2">주소</li>
                      <td className="pb-2 text-gray-500">{trip.address}</td>
                    </tr>

                    <tr>
                      <li className="pb-2">이용시간</li>
                      <td className="pb-2 text-gray-500">{trip.operating_hours}</td>
                    </tr>

                    <tr>
                      <li className="pb-2">이용요금</li>
                      <td className="pb-2 text-gray-500">{trip.entrace_fee}</td>
                    </tr>

                    <tr>
                      <li className="pb-2">주차</li>
                      <td className="pb-2 text-gray-500">{trip.parking_status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-20 pb-24">
                <div>
                  <p className="text-lg font-bold">
                    '{trip?.place_name}'와(과) 유사한 여행지 추천 👍
                  </p>
                </div>
                {/* <div className="grid grid-cols-3 gap-5 pt-5" ref={recommendRef}>
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
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
