import React from "react";
import Slider from "react-slick";

import Tick from "./assets/tick.webp"
import Gaddi from "./assets/gaddi.webp"
import Banda from "./assets/banda.webp"
import GolTick from "./assets/goltick.webp"

import "./style.css";

function ServiceRow() {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    autoplay: true
  }

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    window.innerWidth <= 500 ?
      (<div className="service-row">
        <div className="container">
          <div className="service-row-item bar">
            <img src={Tick} />
            <p>Tjara's Commitment</p>
            <Slider {...settings}>
              <p>Low Prices</p>
              <p>Wide Selection</p>
              <p>Exceptional Customer Service</p>
            </Slider>
          </div>
        </div>
      </div>)
      :
      (<div className="service-row">
        <div className="container">
          <div className="service-row-item">
            <img src={Tick} />
            <p>Safe Payment</p>
          </div>
          <div className="service-row-item">
            <img src={Gaddi} />
            <p>Home Delivery</p>
          </div>
          <div className="service-row-item">
            <img src={Banda} />
            <p>24/7 Support</p>
          </div>
          <div className="service-row-item">
            <img src={GolTick} />
            <p>Verified Users</p>
          </div>
        </div>
      </div>)
  );
}

export default ServiceRow;
