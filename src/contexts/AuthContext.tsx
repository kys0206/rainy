import type {FC, PropsWithChildren} from 'react'
import {createContext, useContext, useState, useCallback, useEffect} from 'react'
import * as U from '../utils'
import {post} from '../server'

export type LoggedUser = {email: string; password: string; id?: string; userName?: string}
type Callback = () => void

type ContextType = {
  jwt?: string
  errorMessage?: string
  loggedUser?: LoggedUser
  signup: (
    email: string,
    password: string,
    name: string,
    birth: string,
    phone: string,
    callback?: Callback
  ) => void
  login: (email: string, password: string, callback?: Callback) => void
  logout: (Callback?: Callback) => void
  id?: string
}

export const AuthContext = createContext<ContextType>({
  signup: (
    email: string,
    password: string,
    name: string,
    birth: string,
    phone: string,
    callback?: Callback
  ) => {},
  login: (email: string, password: string, callback?: Callback) => {},
  logout: (Callback?: Callback) => {}
})

type AuthProviderProps = {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({children}) => {
  const [loggedUser, setLoggedUser] = useState<LoggedUser | undefined>(undefined)
  const [jwt, setJwt] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const id = loggedUser?.id
  const userName = loggedUser?.userName

  const signup = useCallback(
    (
      email: string,
      password: string,
      name: string,
      birth: string,
      phone: string,
      callback?: Callback
    ) => {
      const user = {email, password, name, birth, phone}

      post('/auth/signup', user)
        .then(res => res.json())
        .then((result: {ok: boolean; body?: string; errorMessage?: string}) => {
          const {ok, body, errorMessage} = result
          if (ok) {
            U.writeStringP('jwt', body ?? '').finally(() => {
              setJwt(body ?? '')
              //setLoggedUser(notUsed => user)
              callback && callback()
              //U.writeObjectP('user', user).finally(() => callback && callback())
            })
          } else setErrorMessage(errorMessage ?? '')
        })
        .catch((e: Error) => setErrorMessage(e.message))
    },
    []
  )

  const login = useCallback((email: string, password: string, callback?: Callback) => {
    const user = {id, email, password, userName}
    U.readStringP('jwt')
      .then(jwt => {
        setJwt(jwt ?? '')
        return post('/auth/login', user, jwt)
      })
      .then(res => res.json())
      .then(
        (result: {
          ok: boolean
          id?: string
          userName?: string
          errorMessage?: string
        }) => {
          if (result.ok) {
            setLoggedUser({email, password, id: result.id, userName: result.userName})
            U.writeObjectP('user', {
              email,
              password,
              id: result.id,
              userName: result.userName
            }).finally(() => callback && callback())
            callback && callback()
          } else {
            setErrorMessage(result.errorMessage ?? '')
          }
        }
      )
      .catch((e: Error) => {
        setErrorMessage(e.message ?? '')
      })
  }, [])

  const logout = useCallback((callback?: Callback) => {
    setJwt(notUsed => '')
    setLoggedUser(undefined)
    U.writeObjectP('user', {})
    callback && callback()
  }, [])

  useEffect(() => {
    const deleteToken = false
    if (deleteToken) {
      U.writeStringP('jwt', '')
        .then(() => {})
        .catch(() => {})
    } else {
      U.readStringP('jwt')
        .then(jwt => setJwt(jwt ?? ''))
        .catch(() => {})

      // 이 코드가 없으면 로그인 상태에서 새로고침 시 오른쪽 위 버튼이 Login, signup으로 나온다. 새로고침해도 로그인 상태이므로 Logout 버튼이 나와야함
      U.readStringP('user')
        .then(user =>
          setLoggedUser(
            user === null ? undefined : user === '{}' ? undefined : JSON.parse(user)
          )
        )
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage)
      setErrorMessage(notUsed => '')
    }
  }, [errorMessage])

  const value = {
    jwt,
    errorMessage,
    loggedUser,
    signup,
    login,
    logout,
    id
  }
  return <AuthContext.Provider value={value} children={children} />
}

export const useAuth = () => {
  return useContext(AuthContext)
}
