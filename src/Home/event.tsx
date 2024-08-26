export default function Event() {
  return (
    <div className="w-full">
      <div className="h-80 bg-gradient-to-r from-purple-100 to-pink-300">
        <div className="flex items-center justify-center" style={{display: 'grid'}}>
          <div
            className="w-24 p-1 text-center rounded-b-md"
            style={{backgroundColor: '#333333'}}>
            <p className="pl-1 pr-1" style={{color: 'white'}}>
              EVENT ♥
            </p>
          </div>
          <div className="flex">
            <div className="flex-1 pt-10 pb-10 text-left">
              <div className="pb-4">
                <p className="text-3xl font-bold">2024 여행가는달</p>
              </div>
              <div>
                <p>더 풍성한 혜택으로 돌아온 8월 여행가는 달!</p>
                <p>여행을 떠나 행운 가득한 혜택을 즐겨보세요~</p>
              </div>
            </div>
            <div className="flex-1">
              <img className="w-72" src="/assets/images/home_banner_img.png" />
            </div>
          </div>
          <div
            className="flex items-center justify-center rounded-lg"
            style={{backgroundColor: 'white', display: 'grid', marginTop: '-80px'}}>
            <div className="flex justify-center pt-10 pb-5">
              <div className="w-40 p-2 rounded-3xl" style={{backgroundColor: '#333333'}}>
                <p className="pl-2 pr-2" style={{color: 'white'}}>
                  숨은 여행 혜택 찾기
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="p-1 w-60">
                <img className="" src="/assets/images/home_img_1.png" />
              </div>
              <div className="p-1 w-60">
                <img className="" src="/assets/images/home_img_2.png" />
              </div>
              <div className="p-1 w-60">
                <img className="" src="/assets/images/home_img_3.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-96"></div>
    </div>
  )
}
