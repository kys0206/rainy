import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {get} from '../server'
import {Festival} from '../data/types'

export default function FestivalInfoPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState('')

  const navigate = useNavigate()

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value)
  }

  const handleClick = (festival: Festival) => {
    navigate('/trip/info', {state: {festival}})
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    get('/festival/list')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setFestivals(data.body)
        } else {
          setErrorMessage(data.errorMesage)
        }
      })
      .catch(e => {
        if (e instanceof Error) setErrorMessage(e.message)
      })
  }, [])

  return (
    <div className="pt-32 h-screen">
      <div className="w-1/2 contents">
        <div>
          <div className="flex items-center justify-center">
            <div className="pr-4">
              <select
                className="p-3 border rounded-md w-44 tablet:w-20"
                value={selectedMonth}
                onChange={handleSelectChange}>
                <option value="">시기</option>
                <option value="1월">1월</option>
                <option value="2월">2월</option>
                <option value="3월">3월</option>
                <option value="4월">4월</option>
                <option value="5월">5월</option>
                <option value="6월">6월</option>
                <option value="7월">7월</option>
                <option value="8월">8월</option>
                <option value="9월">9월</option>
                <option value="10월">10월</option>
                <option value="11월">11월</option>
                <option value="12월">12월</option>
              </select>
            </div>

            <div className="pr-4">
              <select
                className="p-3 border rounded-md w-44 tablet:w-32"
                value={selectedMonth}
                onChange={handleSelectChange}>
                <option value="">지역</option>
                <option value="서울">서울</option>
                <option value="인천">인천</option>
                <option value="대전">대전</option>
                <option value="대구">대구</option>
                <option value="광주">광주</option>
                <option value="부산">부산</option>
                <option value="울산">울산</option>
                <option value="세종시">세종시</option>
                <option value="경기도">경기도</option>
                <option value="강원도">강원도</option>
                <option value="충청북도">충청북도</option>
                <option value="충청남도">충청남도</option>
                <option value="경상북도">경상북도</option>
                <option value="경상남도">경상남도</option>
                <option value="전북특별자치도">전북특별자치도</option>
                <option value="전라남도">전라남도</option>
                <option value="제주도">제주도</option>
              </select>
            </div>

            <div>
              <button className="w-32 p-3 font-bold text-white bg-blue-400 rounded-md tablet:w-20">
                검색
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center pt-10">
          <div className="relative p-2">
            <img
              className="rounded-md"
              src="/assets/images/water_festival.png"
              width="450px"
            />
            <p
              className="absolute left-0 w-full p-10 text-xl font-bold text-left text-white bottom-16 tablet:text-xs tablet:bottom-0 tablet:p-5"
              style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
              렛츠런파크 부산경남 블루밍 워터페스티벌
            </p>
            <p
              className="absolute left-0 w-full p-10 font-bold text-left text-white text-md bottom-8 tablet:text-xs tablet:bottom-0 tablet:p-3 tablet:hidden"
              style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
              2024.07.06 ~ 2024.08.25
            </p>
            <p
              className="absolute left-0 w-full p-10 text-left text-white bottom-2 text-md tablet:text-xs tablet:bottom-0 tablet:p-3 tablet:hidden"
              style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
              부산 강서구
            </p>
          </div>

          <div className="relative p-2">
            <img
              className="rounded-md"
              src="/assets/images/water_festival.png"
              width="450px"
            />
            <p
              className="absolute left-0 w-full p-10 text-xl font-bold text-left text-white bottom-16 tablet:text-xs tablet:bottom-0 tablet:p-5"
              style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
              렛츠런파크 부산경남 블루밍 워터페스티벌
            </p>
            <p
              className="absolute left-0 w-full p-10 font-bold text-left text-white text-md bottom-8 tablet:text-xs tablet:bottom-0 tablet:p-3 tablet:hidden"
              style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
              2024.07.06 ~ 2024.08.25
            </p>
            <p
              className="absolute left-0 w-full p-10 text-left text-white bottom-2 text-md tablet:text-xs tablet:bottom-0 tablet:p-3 tablet:hidden"
              style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
              부산 강서구
            </p>
          </div>

          <div className="relative p-2">
            <img
              className="rounded-md"
              src="/assets/images/water_festival.png"
              width="450px"
            />
            <p
              className="absolute left-0 w-full p-10 text-xl font-bold text-left text-white bottom-16 tablet:text-xs tablet:bottom-0 tablet:p-5"
              style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
              렛츠런파크 부산경남 블루밍 워터페스티벌
            </p>
            <p
              className="absolute left-0 w-full p-10 font-bold text-left text-white text-md bottom-8 tablet:text-xs tablet:bottom-0 tablet:p-3 tablet:hidden"
              style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
              2024.07.06 ~ 2024.08.25
            </p>
            <p
              className="absolute left-0 w-full p-10 text-left text-white bottom-2 text-md tablet:text-xs tablet:bottom-0 tablet:p-3 tablet:hidden"
              style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
              부산 강서구
            </p>
          </div>
        </div>

        <div className="pt-20">
          <div className="flex items-center justify-center">
            <div className="pb-4 text-sm text-end">
              <button className="w-16">축제일순</button>
              <button className="w-16 border-x-2">거리순</button>
              <button className="w-16">인기순</button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex flex-wrap">
              {festivals.map((festival, index) => (
                <div
                  className="p-2 cursor-pointer w-36"
                  onClick={() => handleClick(festival)}
                  key={index}>
                  <img className="h-48 rounded-lg" src={festival.imgName} />
                  <div className="pt-3 pl-2">
                    <p className="text-lg font-bold">{festival.title}</p>
                    <p className="pt-2 pb-1 text-sm">
                      {festival.festival_start} ~ {festival.festival_end}
                    </p>
                    <p className="text-sm text-gray-400">
                      {festival.city_name} {festival.si_gu_name}
                    </p>
                  </div>
                </div>
              ))}

              {/* <div className="p-2">
                <img className="h-48 rounded-lg" src="/assets/images/sugug.png" />
                <div className="pt-3 pl-2">
                  <p className="text-lg font-bold">강진수국길축제</p>
                  <p className="pt-2 pb-1 text-sm">2024.06.28 ~ 2024.06.30</p>
                  <p className="text-sm text-gray-400">전라남도 강진군</p>
                </div>
              </div>

              <div className="p-2">
                <img className="h-48 rounded-lg" src="/assets/images/jeju_memil.png" />
                <div className="pt-3 pl-2">
                  <p className="text-lg font-bold">강릉비치비어페스티벌</p>
                  <p className="pt-2 pb-1 text-sm">2024.06.28 ~ 2024.06.30</p>
                  <p className="text-sm text-gray-400">강원도 강릉시</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
