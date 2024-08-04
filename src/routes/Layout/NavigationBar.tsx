//import {Link} from 'react-router-dom'
import {Link as RRLink, NavLink} from 'react-router-dom'
import {Link} from '../../components'
import {useAuth} from '../../contexts'

export type LoggedUser = {email: string; password: string}

export default function NavigationBar() {
  const {loggedUser} = useAuth()

  return (
    <div className="fixed z-50 flex justify-between w-full p-3 bg-white">
      <div className="flex items-center logo">
        <Link to="/" className="btn btn-link">
          <img src="/assets/images/logo.png" width="140" />
        </Link>
      </div>

      <div className="flex items-center space-x-4 font-bold">
        <div className="pl-5 pr-5">
          <NavLink
            to="/"
            className={({isActive}) =>
              isActive ? 'text-skyblue' : 'hover:text-skyblue hover:font-bold'
            }>
            홈
          </NavLink>
        </div>

        <div className="pl-5 pr-5">
          <NavLink
            to="/main/thema"
            className={({isActive}) =>
              isActive ? 'text-skyblue' : 'hover:text-skyblue hover:font-bold'
            }>
            테마
          </NavLink>
        </div>

        <div className="pl-5 pr-5">
          <NavLink
            to="/main/area"
            className={({isActive}) =>
              isActive ? 'text-skyblue' : 'hover:text-skyblue hover:font-bold'
            }>
            지역
          </NavLink>
        </div>

        <div className="pl-5 pr-5">
          <NavLink
            to="/trip/list"
            className={({isActive}) =>
              isActive ? 'text-skyblue' : 'hover:text-skyblue hover:font-bold'
            }>
            여행정보
          </NavLink>
        </div>

        <div className="pl-5 pr-5">
          <NavLink
            to="/trip/map"
            className={({isActive}) =>
              isActive ? 'text-skyblue' : 'hover:text-skyblue hover:font-bold'
            }>
            여행지도
          </NavLink>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {!loggedUser && (
          <NavLink
            to="/login"
            className={({isActive}) =>
              isActive ? 'text-skyblue' : 'hover:text-skyblue hover:font-bold'
            }>
            <img className="pr-4" src="/assets/images/icon/icon_header_profile1.png" />
          </NavLink>
        )}

        {loggedUser && (
          <RRLink to="/logout" className="ml-4 mr-4">
            <img
              className="pl-2"
              src="/assets/images/icon/logout.png"
              width="30"
              height="auto"
            />
          </RRLink>
        )}
      </div>
    </div>
  )
}
