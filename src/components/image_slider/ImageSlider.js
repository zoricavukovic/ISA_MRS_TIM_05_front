// source code from https://github.com/briancodex/react-image-slider-carousel

import React, { useState } from 'react';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import styles from './image_slider.module.css';


export default function ImageSlider({ slides, imageHeight }) {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <section className='slider'>
     {slides.map((slide, index) => {
        return (
          <div
            className={index === current ? styles.slideActive : styles.slide}
            key={index}
          >
            <FaArrowAltCircleLeft className={styles.leftArrow} onClick={prevSlide} />
            <FaArrowAltCircleRight className={styles.rightArrow} onClick={nextSlide} />
      
            {index === current && (
              <img src={slide.image} alt='travel image' style={{height:imageHeight}} className={styles.image} />
            )}
          </div>
        );
      })}
    </section>
  );
  
}