import type {ChangeEvent} from 'react'
import {useState, useCallback, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts'
import * as U from '../../utils'

type LoginFormType = Record<'email' | 'password', string>
const initialFormState = {email: '', password: ''}

export default function Login() {
  const [{email, password}, setForm] = useState<LoginFormType>(initialFormState)
  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  const navigate = useNavigate()
  const {login} = useAuth()
  const loginAccount = useCallback(() => {
    login(email, password, () => navigate('/'))
  }, [email, login, navigate, password])

  useEffect(() => {
    U.readObjectP<LoginFormType>('user')
      .then(user => {
        if (user) setForm(user)
      })
      .catch(e => {})
  }, [])

  return (
    <div className="pt-20">
      <div className="">
        <div className="flex justify-center item-center">
          <img src="/assets/images/title.png" width="150px" />
        </div>
        <div className="flex justify-center pt-10 item-center">
          <div className="">
            <div className="pb-6">
              <label className="block text-sm font-bold">이메일 주소</label>
              <input
                type="text"
                className="w-full py-2 leading-tight placeholder-gray-300 border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="email"
                placeholder="예) rainy@rainy.co.kr"
                value={email}
                onChange={changed('email')}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold">비밀번호</label>
              <input
                type="password"
                className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="password"
                value={password}
                onChange={changed('password')}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-gray-200 rounded-xl hover:bg-black focus:outline-none focus:shadow-outline"
              onClick={loginAccount}>
              로그인
            </button>

            <div className="flex items-center justify-between pt-5 pb-10">
              <Link to="/signup" className="text-sm px-7">
                이메일 가입
              </Link>

              <Link
                to="/find/email"
                className="text-sm px-7"
                style={{
                  borderLeft: '1px solid #e3dede',
                  borderRight: '1px solid #e3dede'
                }}>
                이메일 찾기
              </Link>

              <Link to="/login/find_password" className="text-sm px-7">
                비밀번호 찾기
              </Link>
            </div>

            <div className="pb-3">
              <button
                className="w-full py-3 font-bold border border-gray-200 rounded-xl"
                type="button">
                네이버로 로그인
              </button>
            </div>

            <div>
              <button
                className="w-full py-3 font-bold border border-gray-200 rounded-xl"
                type="button">
                카카오로 로그인
              </button>
            </div>
          </div>
        </div>
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
