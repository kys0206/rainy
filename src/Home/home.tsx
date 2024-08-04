import Banner from './banner'
import Event from './event'
import News from './news'

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center mt-20">
        <Banner />
      </div>

      <div className="flex items-center justify-center mt-10">
        <Event />
      </div>

      <div className="flex items-center justify-center pb-40 mt-10">
        <News />
      </div>
    </div>
  )
}
