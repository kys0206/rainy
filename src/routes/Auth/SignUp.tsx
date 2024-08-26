import type {ChangeEvent} from 'react'
import {useState, useCallback} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts'
import {get, post} from '../../server'

type SignUpFormType = Record<
  'email' | 'password' | 'confirmPassword' | 'name' | 'birth' | 'phone' | 'code',
  string
>

const initialFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  birth: '',
  phone: '',
  code: ''
}

export default function SignUp() {
  const [{email, password, confirmPassword, name, birth, phone, code}, setForm] =
    useState<SignUpFormType>(initialFormState)
  const [isCodeValid, setIsCodeValid] = useState<boolean>(false) // 인증 상태를 저장하는 상태 변수 추가
  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  const navigate = useNavigate()
  const {signup} = useAuth()

  const createAccount = useCallback(() => {
    console.log(email, password, confirmPassword)
    if (!isCodeValid) {
      alert('이메일 인증이 완료되지 않았습니다. 인증 후 다시 시도해주세요.')
      return
    }
    if (password === confirmPassword) {
      signup(email, password, name, birth, phone, () => navigate('/'))
    } else {
      alert('비밀번호가 일치하지 않습니다. 다시 입력하세요')
    }
  }, [
    isCodeValid,
    confirmPassword,
    email,
    navigate,
    password,
    name,
    birth,
    phone,
    signup
  ])

  const onSendMail = useCallback(
    (event: {preventDefault: () => void}) => {
      event.preventDefault()

      if (!email) {
        alert('이메일이 입력되지 않았습니다. 사용하실 이메일을 입력해주세요.')
        return
      }

      post('/auth/createAuthCode', {email})
        .then(response => {
          console.log('>> 인증코드가 발송되었습니다.')
          alert('인증코드가 발송되었습니다.')
        })
        .catch(error => {
          console.error('인증코드 발송 오류:', error)
          alert('인증코드 발송 중 오류가 발생했습니다.')
        })
    },
    [email]
  )

  const onCheckCode = useCallback(
    (event: {preventDefault: () => void}) => {
      event.preventDefault()

      if (!email || !code) {
        alert('이메일 또는 인증번호가 입력되지 않았습니다. 확인 후 다시 시도해주세요.')
        return
      }

      get(`/auth/validate/code/${encodeURIComponent(email)}/${encodeURIComponent(code)}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setIsCodeValid(true) // 인증 성공 시 상태 업데이트
            alert('인증이 성공적으로 완료되었습니다.')
          } else {
            setIsCodeValid(false) // 인증 실패 시 상태 업데이트
            alert(
              `인증번호가 올바르지 않습니다. 다시 시도해주세요. 오류: ${data.errorMessage}`
            )
          }
        })
        .catch(error => {
          console.error('인증번호 확인 중 오류 발생:', error)
          alert('인증번호 확인 중 오류가 발생했습니다.')
        })
    },
    [email, code]
  )

  return (
    <div className="pt-20">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm px-2 mx-auto">
        <div className="">
          <div className="flex justify-center item-center">
            <p className="text-3xl font-bold">회원가입</p>
          </div>
          <div className="flex justify-center pt-10 item-center">
            <div>
              <div className="pb-4">
                <label className="block text-sm font-bold w-80">이메일 주소</label>
                <div className="flex">
                  <input
                    type="text"
                    className="w-full py-2 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                    name="email"
                    placeholder="예) rainy@rainy.co.kr"
                    value={email}
                    onChange={changed('email')}
                  />
                  <button
                    className="w-24 text-white bg-blue-300 border border-gray-200 rounded-lg"
                    onClick={onSendMail}>
                    인증하기
                  </button>
                </div>
              </div>

              <div className="flex pb-8">
                <input
                  className="w-full py-2 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                  type="text"
                  placeholder="인증번호를 입력하세요"
                  value={code}
                  onChange={changed('code')}
                />

                <button
                  className="w-24 text-white bg-blue-300 border border-gray-200 rounded-lg"
                  onClick={onCheckCode}>
                  확인
                </button>
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
              <div className="mb-6">
                <label className="block text-sm font-bold">비밀번호 확인</label>
                <input
                  type="password"
                  className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={changed('confirmPassword')}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold">이름</label>
                <input
                  type="text"
                  className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                  name="name"
                  value={name}
                  onChange={changed('name')}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold">생년월일</label>
                <input
                  type="text"
                  className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                  name="birth"
                  value={birth}
                  onChange={changed('birth')}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold">연락처</label>
                <input
                  type="text"
                  className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                  name="phone"
                  value={phone}
                  onChange={changed('phone')}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 font-bold text-white bg-gray-200 rounded-xl hover:bg-black focus:outline-none focus:shadow-outline"
                onClick={createAccount}>
                가입하기
              </button>
            </div>
          </div>

          <div className="mt-6 text-grey-dark">
            이미 계정이 있나요?
            <Link className="pl-4 btn btn-link btn-primary" to="/login/">
              로그인
            </Link>
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
  )
}
