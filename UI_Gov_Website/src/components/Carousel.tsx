import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import Collage1 from '../assets/collage_final_1.png';
import Collage2 from '../assets/collage_final_2.png';
import Collage3 from '../assets/collage_final_3.png';
import Collage4 from '../assets/collage_final_4.png';
import { useTranslation } from 'react-i18next';

const slideImages = [Collage1, Collage2, Collage3, Collage4];

export default function Carousel() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
  const nextSlide = () => setCurrentSlide((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-full flex bg-gradient-to-r from-yellow-50 via-white to-green-50" style={{height: '520px'}}>
      {/* Left 3/5th: Carousel */}
      <div className="relative mx-4" style={{width: '75%', height: '100%'}}>
        <img
          src={slideImages[currentSlide]}
          alt={t('carousel.slideAlt', { number: currentSlide + 1 })}
          className="object-cover w-full h-full rounded-3xl"
          style={{margin: 0, padding: 0, display: 'block'}}
        />
           <button
             onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-700 p-2 rounded-full shadow"
        >
          <ChevronLeft size={32} />
           </button>
           <button
             onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-700 p-2 rounded-full shadow"
        >
          <ChevronRight size={32} />
           </button>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
           <div className="flex space-x-2">
            {slideImages.map((_, index) => (
               <button
                key={index}
                 onClick={() => setCurrentSlide(index)}
                 className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentSlide === index ? "bg-blue-700" : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Right 2/5th: Maternal Health Quote */}
      <div style={{width: '40%', height: '100%', marginRight: '2rem'}} className="flex items-center justify-center">
        <div className="text-center px-6 py-10 bg-white/90 rounded-3xl shadow-lg border border-green-100">
          <span className="block text-2xl md:text-3xl font-semibold italic text-green-900 leading-snug drop-shadow-lg">
            {t('carousel.quote')}
          </span>
          <span className="block mt-4 text-lg text-yellow-700 font-light">{t('carousel.quoteSource')}</span>
        </div>
      </div>
    </div>
  );
                 }