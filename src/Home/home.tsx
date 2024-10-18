import Banner from './banner'
import Event from './event'
import News from './news'

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center pt-20">
        <Banner />
      </div>

      <div className="flex items-center justify-center pt-20 pb-20">
        <Event />
      </div>

      <div className="flex items-center justify-center pb-40 pt-20">
        <News />
      </div>
    </div>
  )
}
