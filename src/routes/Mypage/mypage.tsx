import {useState, useEffect, useCallback, ChangeEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import {get, post} from '../../server'

import {FcCellPhone} from 'react-icons/fc'
import {LiaBirthdayCakeSolid} from 'react-icons/lia'

type LoginFormType = Record<
  | 'name'
  | 'email'
  | 'phone'
  | 'birth'
  | 'password'
  | 'newPassword'
  | 'confirm_new_password',
  string
>
const initialFormState = {
  name: '',
  email: '',
  phone: '',
  birth: '',
  password: '',
  newPassword: '',
  confirm_new_password: ''
}

export default function Mypage() {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [
    {name, email, phone, birth, password, newPassword, confirm_new_password},
    setForm
  ] = useState<LoginFormType>(initialFormState)
  const [isFormComplete, setIsFormComplete] = useState<boolean>(false)
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true)

  const navigate = useNavigate()

  const storedData = window.localStorage.getItem('user')
  const parsedData = storedData ? JSON.parse(storedData) : {}
  const userId = parsedData.id || ''

  useEffect(() => {
    get(`/auth/info/${userId}`)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        if (data.ok) {
          setForm({
            ...data.body,
            phone: formatPhone(data.body.phone),
            birth: formatBirth(data.body.birth)
          })
        } else {
          setErrorMessage(data.errorMessage)
        }
      })
      .catch(e => {
        if (e instanceof Error) setErrorMessage(e.message)
      })
  }, [userId])

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }

  const formatBirth = (birth: string) => {
    return birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  }

  const changed = useCallback(
    (key: keyof LoginFormType) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(obj => ({
          ...obj,
          [key]:
            key === 'phone'
              ? formatPhone(e.target.value)
              : key === 'birth'
              ? formatBirth(e.target.value)
              : e.target.value
        }))
      },
    []
  )

  useEffect(() => {
    if (name && email && phone && birth) {
      setIsFormComplete(true)
    } else {
      setIsFormComplete(false)
    }
  }, [name, email, phone, birth])

  useEffect(() => {
    if (newPassword && confirm_new_password) {
      setIsPasswordMatch(newPassword === confirm_new_password)
    } else {
      setIsPasswordMatch(true)
    }
  }, [newPassword, confirm_new_password])

  const onEditInfo = async () => {
    try {
      const res = await post('/auth/modify/user/info', {
        id: userId,
        name,
        birth,
        phone
      })

      const result = await res.json()
      if (result.ok) {
        alert('사용자 정보 수정이 완료되었습니다.')
        window.location.reload()
      } else {
        setErrorMessage(result.errorMessage)
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      }
    }
  }

  const onEditPW = async () => {
    if (!isPasswordMatch) {
      setErrorMessage('새 비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const response = await post('/auth/modify/password', {
        id: userId,
        password,
        newPassword
      })

      const result = await response.json()
      if (result.ok) {
        setErrorMessage('')
        setIsModalOpen(true)
      } else {
        setErrorMessage(result.errorMessage)
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      }
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    navigate('/')
  }

  return (
    <div className="py-20">
      <div className="h-full">
        <div className="flex justify-center pt-10 item-center">
          <div className="p-10 border border-green-300 rounded-xl w-96">
            <div className="pb-3">
              <label className="text-sm text-gray-400">기본정보</label>
            </div>
            <div className="flex pb-6">
              <div className="pr-4">
                <img
                  src="/assets/images/icon/profile_icon.png"
                  width="100px"
                  alt="profile_icon"
                />
              </div>
              <div className="w-full">
                <div className="pb-1">
                  <input
                    type="text"
                    className="w-full py-2 text-xl font-bold leading-tight placeholder-gray-300 border-b-2 focus:outline-none focus:border-b-cyan-950"
                    name="name"
                    value={name}
                    onChange={changed('name')}
                  />
                </div>
                <div>
                  <label className="text-gray-400">{email}</label>
                </div>
              </div>
            </div>
            <div className="flex mb-2">
              <div className="pt-2 pr-2">
                <LiaBirthdayCakeSolid className="text-xl" />
              </div>
              <input
                type="text"
                className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="birth"
                value={birth}
                onChange={changed('birth')}
              />
            </div>
            <div className="flex mb-6">
              <div className="pt-1 pr-2">
                <FcCellPhone className="text-xl" />
              </div>
              <input
                type="phone"
                className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="phone"
                value={phone}
                onChange={changed('phone')}
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 font-bold rounded-xl focus:outline-none focus:shadow-outline ${
                isFormComplete ? 'bg-gray-700 text-white' : 'bg-gray-300 text-white'
              }`}
              disabled={!isFormComplete}
              onClick={onEditInfo}>
              정보 수정
            </button>
          </div>
        </div>
        <div className="flex justify-center pt-10 item-center">
          <div className="p-10 border border-green-300 rounded-xl w-96">
            <div className="">
              <label className="text-sm text-gray-400">비밀번호 변경</label>
            </div>
            <div className="py-4">
              <li className="text-sm text-red-400">
                안전한 비밀번호로 내정보를 보호하세요
              </li>
              <li className="text-sm text-red-400">
                이전에 사용한 적 없는 비밀번호가 안전합니다.
              </li>
            </div>

            <div className="pt-4 pb-4">
              <div className="w-full">
                <div className="pb-1">
                  <input
                    type="password"
                    className="w-full py-2 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                    name="password"
                    placeholder="현재 비밀번호"
                    value={password}
                    onChange={changed('password')}
                  />
                </div>
              </div>
            </div>
            <div className="flex mb-2">
              <input
                type="password"
                className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="newPassword"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={changed('newPassword')}
              />
            </div>
            <div className="flex mb-6">
              <input
                type="password"
                className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="confirm_new_password"
                placeholder="새 비밀번호 확인"
                value={confirm_new_password}
                onChange={changed('confirm_new_password')}
              />
            </div>
            <div className="py-2">
              {!isPasswordMatch && (
                <p className="text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
              )}
              {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
              {successMessage && (
                <p className="text-sm text-green-500">{successMessage}</p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full py-3 font-bold rounded-xl focus:outline-none focus:shadow-outline ${
                isFormComplete && isPasswordMatch
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-300 text-white'
              }`}
              disabled={!isFormComplete || !isPasswordMatch}
              onClick={onEditPW}>
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="text-lg font-bold">비밀번호가 성공적으로 변경되었습니다.</p>
            <div className="w-full pt-5">
              <button
                className="w-full px-4 py-2 mt-4 text-white bg-gray-500 rounded-lg"
                onClick={closeModal}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
