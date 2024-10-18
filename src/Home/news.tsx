export default function News() {
  return (
    <div className="w-full tablet:w-full tablet:pb-32">
      <div className="h-60">
        <div className="flex items-center justify-center grid">
          <div className="flex tablet:grid">
            <div className="flex-1 p-3 text-center tablet:w-96">
              <img className="rounded-lg" src="/assets/images/news_img.png" />
            </div>
            <div className="flex-1 p-3 text-left tablet:text-sm">
              <div className="pb-4">
                <p className="text-xl font-bold">오늘의 여행 소식</p>
              </div>
              <div className="pt-3 pb-2 border-b-2" style={{borderColor: '#eeeeee'}}>
                <p>한국관광공사ㅣ‘2024 청와대 사랑채 웰컴 위크’ 개최(6.14~30)</p>
              </div>

              <div className="pt-3 pb-2 border-b-2" style={{borderColor: '#eeeeee'}}>
                <p>영상공모전ㅣ2024년 DMZ 접경지역 숏폼여행영상 공모전 개최</p>
              </div>

              <div className="pt-3 pb-2 border-b-2" style={{borderColor: '#eeeeee'}}>
                <p>한국관광공사ㅣ2024 대한민국 관광공모전(사진 부문) 개최</p>
              </div>

              <div className="pt-3 pb-2 border-b-2" style={{borderColor: '#eeeeee'}}>
                <p>영상공모전ㅣ디지털 관광주민증 쇼츠 영상공모전 개최</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
