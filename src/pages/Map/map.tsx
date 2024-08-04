import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const MapPage = () => {
  useEffect(() => {
    let container = document.getElementById(`map`); // 지도를 담을 영역의 DOM 레퍼런스
    let options = {
      center: new window.kakao.maps.LatLng(37.5192901, 127.0521102), // 지도 중심 좌표
      level: 6, // 지도의 레벨(확대, 축소 정도)
    };

    let map = new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="p-2">
        <div className="flex">
          <div
            className="map"
            id="map"
            style={{ width: "100vh", height: "85vh" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
