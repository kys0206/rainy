import type {ChangeEvent} from 'react'
import {useState, useCallback} from 'react'
import {Link} from 'react-router-dom'
import {get} from '../../../server'

type LoginFormType = Record<'name' | 'birth' | 'phone', string>
const initialFormState = {name: '', birth: '', phone: ''}

export default function FindEmail() {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [{name, birth, phone}, setForm] = useState<LoginFormType>(initialFormState)
  const [email, setEmail] = useState<string | null>(null)
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  const findEmail = useCallback(async () => {
    try {
      const query = new URLSearchParams({name, birth, phone}).toString()
      get(`/auth/find/email?${query}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            setEmail(data.email)
            setModalOpen(true)
          } else {
            alert(data.errorMessage || '이메일을 찾는 데 실패했습니다.')
          }
        })
    } catch (e) {
      if (e instanceof Error) setErrorMessage(e.message)
      alert('이메일을 찾는 중 오류가 발생했습니다.')
    }
  }, [name, birth, phone])

  const closeModal = () => {
    setModalOpen(false)
    setEmail(null)
  }

  return (
    <div className="pt-20">
      <div className="h-screen">
        <div className="flex justify-center pt-4 item-center">
          <p className="text-2xl font-bold">회원 이메일 찾기</p>
        </div>
        <div className="flex justify-center pt-10 item-center">
          <div className="">
            <div className="pb-6">
              <label className="block text-sm font-bold">이름</label>
              <input
                type="text"
                className="w-full py-2 leading-tight placeholder-gray-300 border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="name"
                placeholder="성함을 입력해주세요"
                value={name}
                onChange={changed('name')}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold">생년월일</label>
              <input
                type="text"
                className="w-full py-2 mb-3 leading-tight placeholder-gray-300 border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="birth"
                placeholder="생년월일 8자리를 입력해주세요"
                value={birth}
                onChange={changed('birth')}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold">연락처</label>
              <input
                type="text"
                className="w-full py-2 mb-3 leading-tight placeholder-gray-300 border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="phone"
                placeholder="가입시 입력하신 연락처를 입력하세요"
                value={phone}
                onChange={changed('phone')}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-blue-300 rounded-xl focus:outline-none focus:shadow-outline"
              onClick={findEmail}>
              이메일 찾기
            </button>

            <div className="flex items-center justify-between pt-5 pb-10">
              <Link to="/signup" className="text-sm px-7">
                회원 가입
              </Link>

              <Link
                to="/login"
                className="text-sm px-7"
                style={{
                  borderLeft: '1px solid #e3dede',
                  borderRight: '1px solid #e3dede'
                }}>
                로그인
              </Link>

              <Link to="/login/find_birth" className="text-sm px-7">
                비밀번호 찾기
              </Link>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="z-10 p-6 bg-white rounded-lg shadow-lg w-96">
              <div className="pb-5">
                <h2 className="text-xl font-bold mb-7">이메일 찾기 결과</h2>
                <p className="mb-2">검색결과 이메일은 아래와 같습니다</p>
                <div className="w-full border border-gray-300 rounded-md">
                  <p className="py-6 font-bold text-center">{email}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-white bg-blue-300 rounded hover:bg-blue-500">
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pt-20 pb-20">
          <div className="p-10 border-t-2">
            <p className="font-bold">고객센터 1588-0000</p>
            <p className="pt-1 text-sm text-gray-400">
              운영시간 평일 10:00 - 18:00 (주말, 공휴일 휴무)
            </p>
            <p className="text-sm text-gray-400">점심시간 평일 13:00 - 14:00</p>
            <p className="pt-1 text-sm">문의사항은 1:1 문의하기를 이용하세요</p>
          </div>
        </div>
      </div>
    </div>
  )
}
