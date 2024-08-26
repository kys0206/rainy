import {Routes, Route} from 'react-router-dom'
import Layout from './Layout'
import RequireAuth from './Auth/RequireAuth'
import Signup from './Auth/SignUp'
import Login from './Auth/Login'
import Logout from './Auth/Logout'
import NoMatch from './NoMatch'
import Home from '../Home/home'

import ThemaPage from '../pages/Thema/thema'
import InfoPage from '../pages/Thema/info'

import AreaPage from '../pages/Area/area'
import TripPage from '../Trip/trip'
import MapPage from '../pages/Map/map'
import TripInfoPage from '../Trip/info'
import AreaInfoPage from '../pages/Area/area_info'
import FoodInfoPage from '../pages/Area/food_info'
import Mypage from './Mypage/mypage'
import FindEmail from './Mypage/Find/findEmail'

export default function RoutesSetup() {
  const storedData = window.localStorage.getItem('user')
  const parsedData = storedData ? JSON.parse(storedData) : {}

  return (
    <div className="flex flex-col min-h-screen text-black font-pretendar">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/main/thema" element={<ThemaPage />} />
          <Route path="/main/thema/info" element={<InfoPage />} />

          <Route path="/main/area" element={<AreaPage />} />
          <Route path="/main/area/info" element={<AreaInfoPage />} />
          <Route path="/main/restaurant/info" element={<FoodInfoPage />} />

          <Route path="/trip/list" element={<TripPage />} />
          <Route path="/trip/info" element={<TripInfoPage />} />

          <Route path="/trip/map" element={<MapPage />} />

          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="/find/email" element={<FindEmail />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route
            path="logout"
            element={
              <RequireAuth>
                <Logout />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  )
}
