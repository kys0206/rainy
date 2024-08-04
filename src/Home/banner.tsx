import { useState, useEffect } from "react";

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    "/assets/images/img1.png",
    "/assets/images/img2.png",
    "/assets/images/img3.png",
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 제거
  }, []);

  return (
    <div className="relative w-1/2 overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="flex-shrink-0 w-full p-10">
            <img
              src={slide}
              alt={`slide-${index}`}
              className="object-cover rounded-md shadow-lg"
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 flex p-4 space-x-2 transform -translate-x-1/2 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 rounded-full ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
