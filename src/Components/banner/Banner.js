import React from 'react';
import './banner.css';
import bannerImage from '../../assets/banner.png';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="banner">
      <img src={bannerImage} alt="E-commerce Banner" className="banner-image" />
      <div className="banner-content">
        <h2>🔥 Big Summer Sale is live</h2>
        <p>Up to 60% off on electronics, fashion, and more.</p>
        <Link to="/products">
          <button className="shop-btn">Shop Now</button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
