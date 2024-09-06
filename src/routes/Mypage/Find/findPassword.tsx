import type {ChangeEvent} from 'react'
import {useState, useCallback} from 'react'
import {Link} from 'react-router-dom'
import {post} from '../../../server'

type LoginFormType = Record<'name' | 'birth' | 'phone' | 'email', string>
const initialFormState = {name: '', birth: '', phone: '', email: ''}

export default function FindPassword() {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [{name, birth, phone, email}, setForm] = useState<LoginFormType>(initialFormState)
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>('')

  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  // 비밀번호 찾기 함수
  const findPassword = useCallback(async () => {
    try {
      const response = await post('/auth/create/temp/password', {
        name,
        birth,
        phone,
        email
      })

      const data = await response.json()
      if (data.message === 'success') {
        setSuccessMessage('임시 비밀번호가 이메일로 전송되었습니다.')
        setModalOpen(true)
      } else {
        setErrorMessage(data.data || '임시 비밀번호 발급에 실패했습니다.')
      }
    } catch (e) {
      if (e instanceof Error) setErrorMessage(e.message)
    }
  }, [name, birth, phone, email])

  const closeModal = () => {
    setModalOpen(false)
    setSuccessMessage('')
  }

  return (
    <div className="pt-20">
      <div className="h-screen">
        <div className="flex justify-center pt-4 item-center">
          <p className="text-2xl font-bold">회원 비밀번호 찾기</p>
        </div>
        <div className="flex justify-center pt-10 item-center">
          <div className="">
            <div className="pb-6">
              <label className="block text-sm font-bold">이름</label>
              <input
                type="text"
                className="w-full py-2 leading-tight placeholder-gray-300 border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="name"
                placeholder="이름을 입력해주세요"
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

            <div className="mb-6">
              <label className="block text-sm font-bold">이메일</label>
              <input
                type="text"
                className="w-full py-2 mb-3 leading-tight placeholder-gray-300 border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="email"
                placeholder="가입시 입력하신 이메일을 입력하세요"
                value={email}
                onChange={changed('email')}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-blue-300 rounded-xl focus:outline-none focus:shadow-outline"
              onClick={findPassword}>
              비밀번호 찾기
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

              <Link to="/find/email" className="text-sm px-7">
                이메일 찾기
              </Link>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="z-10 p-6 bg-white rounded-lg shadow-lg w-96">
              <div className="pb-5">
                <h2 className="text-xl font-bold mb-7">임시 비밀번호 발급완료</h2>
                <p className="mb-2">{successMessage}</p>
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
