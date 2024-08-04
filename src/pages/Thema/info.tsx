import React, {useState, useRef} from 'react'
import {useLocation} from 'react-router-dom'

export default function InfoPage() {
  const location = useLocation()
  const thema = location.state?.thema

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
  const recommendRef = useRef<HTMLDivElement>(null)

  const onMoveToDetail = () => {
    detailRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    setSelectedTab('상세보기')
  }

  const onMoveToPhoto = () => {
    photoRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    setSelectedTab('사진보기')
  }

  const onMoveToRecommend = () => {
    recommendRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    setSelectedTab('추천여행')
  }

  return (
    <div className="w-full">
      <div className="flex justify-center px-10 pt-32">
        <div className="text-center">
          <p className="pb-5 text-4xl font-black">{thema?.title}</p>
          <p className="pb-8 text-lg text-gray-500">{thema?.author}</p>
          <p className="pb-5 text-3xl font-bold underline decoration-red-100 decoration-8 underline-offset-1">
            &ensp; 어른들의 놀이터 스몹! &ensp;
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
                  selectedTab === '여행톡' ? 'border-b-2 border-black font-black' : ''
                }`}
                onClick={() => setSelectedTab('여행톡')}>
                여행톡
              </div>

              <div
                className={`flex items-center justify-center w-1/4 h-10 cursor-pointer ${
                  selectedTab === '추천여행' ? 'border-b-2 border-black font-black' : ''
                }`}
                onClick={onMoveToRecommend}>
                추천여행
              </div>
            </div>

            <div className="flex justify-center p-5" ref={photoRef}>
              <img src={thema?.imgURL} width="400px" height="auto" />{' '}
            </div>

            <div className="flex flex-col justify-center pt-20">
              <div className="w-full border-b-2 border-black border-solid">
                <p className="font-bold">상세정보</p>
              </div>

              <div className="pt-5" ref={detailRef}>
                <p className="text-sm">{thema?.content}</p>
              </div>

              <div className="pt-10 font-bold">지도 위치</div>

              <div className="pt-5">
                <table>
                  <tbody className="text-sm">
                    <tr>
                      <td className="w-72">문의 및 안내</td>
                      <td>1668-4832</td>
                    </tr>

                    <tr>
                      <td>홈페이지</td>
                      <td>https://www.smob.co.kr</td>
                    </tr>

                    <tr>
                      <td>주소</td>
                      <td>대전광역시 유성구 엑스포로 1 (도룡동)</td>
                    </tr>

                    <tr>
                      <td>이용시간</td>
                      <td>10:30~21:00</td>
                    </tr>

                    <tr>
                      <td>휴일</td>
                      <td>연중무휴 / *백화점 휴점일 운영시간 (10:30 ~ 20:00)</td>
                    </tr>

                    <tr>
                      <td>주차</td>
                      <td>있음</td>
                    </tr>

                    <tr>
                      <td>체험프로그램</td>
                      <td>기본이용 시간 : 2시간</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-20 pb-24">
                <div>
                  <p className="text-lg font-bold">
                    '{thema?.title}'와(과) 유사한 여행지 추천 👍
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-5 pt-5" ref={recommendRef}>
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
