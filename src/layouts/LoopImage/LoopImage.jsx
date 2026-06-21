import React from 'react';
import "./LoopImage.scss";
import { useTranslation } from 'react-i18next';
import Image1 from '../../assets/images/Loop/LoopImage1.jpg';
import Image2 from '../../assets/images/Loop/LoopImage2.jpg';
import Image3 from '../../assets/images/Loop/LoopImage3.jpg';
import Image4 from '../../assets/images/Loop/LoopImage4.jpg';
import Image5 from '../../assets/images/Loop/LoopImage5.jpg';
const LoopImage = () => {
  const { t } = useTranslation();

return (
    <div className="image-scroll-container">
    <div className = "title">
      <h1> {t('loopImage.title')}</h1>
    </div>
    <div className="track">
      {/* Original set */}
      <div className="track-item"><img src={Image1} alt="" /></div>
      <div className="track-item"><img src={Image2} alt="" /></div>
      <div className="track-item"><img src={Image3} alt="" /></div>
      <div className="track-item"><img src={Image4} alt="" /></div>
      <div className="track-item"><img src={Image5} alt="" /></div>
      <div className="track-item"><img src={Image1} alt="" /></div>
      <div className="track-item"><img src={Image2} alt="" /></div>


      <div className="track-item"><img src={Image3} alt="" /></div>
      <div className="track-item"><img src={Image4} alt="" /></div>
      <div className="track-item"><img src={Image5} alt="" /></div>
      <div className="track-item"><img src={Image1} alt="" /></div>
      <div className="track-item"><img src={Image2} alt="" /></div>
      <div className="track-item"><img src={Image3} alt="" /></div>
    </div>
  
  </div>
    );
};

export default LoopImage;