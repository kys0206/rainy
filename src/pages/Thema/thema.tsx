import {useState, useEffect} from 'react'
import BannerPage from './banner'
import MapPage from './map'

export default function ThemaPage() {
  return (
    <div>
      <BannerPage />

      <MapPage />
    </div>
  )
}
