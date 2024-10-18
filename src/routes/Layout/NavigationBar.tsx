import {useState, useEffect} from 'react'
import {Link as RRLink, NavLink} from 'react-router-dom'

// icon
import {IoPersonCircleOutline} from 'react-icons/io5'
import {HiOutlineMenu} from 'react-icons/hi'

import {Link} from '../../components'
import {useAuth} from '../../contexts'

export type LoggedUser = {email: string; password: string}

export default function NavigationBar() {
  const {loggedUser} = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const storedData = window.localStorage.getItem('user')
  const parsedData = storedData ? JSON.parse(storedData) : {}
  const userName = parsedData.userName || ''

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <div className="fixed z-50 flex justify-between w-full p-3 bg-white">
      <div className="flex items-center logo">
        <Link to="/" className="btn btn-link">
          <img src="/assets/images/logo.png" width="140" />
        </Link>
      </div>

      {isMobile ? (
        <div className="flex items-center">
          <button onClick={toggleMenu}>
            <HiOutlineMenu size={30} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-lg top-full">
              <div className="flex flex-col p-2">
                <NavLink to="/" className="p-2 hover:bg-gray-200" onClick={toggleMenu}>
                  홈
                </NavLink>
                <NavLink
                  to="/main/thema"
                  className="p-2 hover:bg-gray-200"
                  onClick={toggleMenu}>
                  테마
                </NavLink>
                <NavLink
                  to="/main/area"
                  className="p-2 hover:bg-gray-200"
                  onClick={toggleMenu}>
                  지역
                </NavLink>
                <NavLink
                  to="/trip/list"
                  className="p-2 hover:bg-gray-200"
                  onClick={toggleMenu}>
                  여행정보
                </NavLink>
                <NavLink
                  to="/trip/map"
                  className="p-2 hover:bg-gray-200"
                  onClick={toggleMenu}>
                  여행지도
                </NavLink>

                <div className="border" />

                {!loggedUser && (
                  <NavLink
                    to="/login"
                    className="p-2 hover:bg-gray-200"
                    onClick={toggleMenu}>
                    로그인
                  </NavLink>
                )}

                {loggedUser && (
                  <RRLink
                    to="/mypage"
                    className="p-2 hover:bg-gray-200"
                    onClick={toggleMenu}>
                    마이페이지
                  </RRLink>
                )}

                {loggedUser && (
                  <RRLink
                    to="/logout"
                    className="p-2 hover:bg-gray-200"
                    onClick={toggleMenu}>
                    로그아웃
                  </RRLink>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
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

          <div className="pl-5 pr-32">
            <NavLink
              to="/trip/map"
              className={({isActive}) =>
                isActive ? 'text-skyblue' : 'hover:text-skyblue hover:font-bold'
              }>
              여행지도
            </NavLink>
          </div>
        </div>
      )}
      <div className="flex justify-center items-center tablet:hidden">
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
          <div className="flex">
            <div className="flex justify-center items-center ">
              <img
                className="w-5 h-5"
                src="/assets/images/icon/profile_icon.png"
                alt="profile_icon"
              />
              <button
                onClick={toggleDropdown}
                className="flex items-center mr-4 ml-1 text-sm">
                {userName}
              </button>
            </div>
            {dropdownOpen && (
              <div className="absolute right-5 w-40 mt-2 bg-white rounded-lg shadow-lg top-full text-center">
                <NavLink
                  to="/mypage"
                  className="p-2 block hover:bg-gray-200 text-sm"
                  onClick={toggleDropdown}>
                  마이페이지
                </NavLink>

                <div className="border border-gray-100 mx-2" />
                <NavLink
                  to="/logout"
                  className="p-2 block hover:bg-gray-200 text-sm"
                  onClick={toggleDropdown}>
                  로그아웃
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
