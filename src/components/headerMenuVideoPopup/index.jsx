import React, { useEffect, useRef } from 'react'
import { usePopup } from '../DataContext'
import "./style.css"
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination'
import SinginPopup from "@components/signInPopup/index";
import POSTS from "@client/postsClient";
import { fixUrl } from "../../helpers/helpers"
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';

const index = () => {
  const swiperRef = useRef(null);
  const videoRefs = useRef([])
  const navigate = useNavigate();
  const { headerMenuVideoPopup, setopenSigninPopup, openHeaderMenuVideoPopup } = usePopup()
  const [videoArr, setvideoArr] = useState([])
  const fetchVideo = async () => {
    const { data, error } = await POSTS.getPosts({
      with: 'video',
      filterByColumns: {
        filterJoin: "OR",
        columns: [
          {
            column: 'post_type',
            value: 'shop_stories',
            operator: '=',
          }
        ]
      },
      per_page: 20,
    })

    if (data) {
      setvideoArr(headerMenuVideoPopup.video != null ? data?.posts?.data?.slice(data?.posts?.data.findIndex((person) => person.id === headerMenuVideoPopup.video.id), data?.posts?.data.length) : data?.posts?.data)
    }
    if (error) {
      console.error(error);
    }
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (headerMenuVideoPopup) {
      fetchVideo()
    }
  }, [headerMenuVideoPopup]);

  /* --------------------------------------------- X -------------------------------------------- */

  const handleVideoPlayPause = (swiper) => {

    swiper.slides.forEach((slide, index) => {
      const video = slide.querySelector('video');
      if (video) {
        if (slide.classList.contains('swiper-slide-active')) {
          video.play();
        } else {
          video.pause();
        }
      }
    });
  };
  useEffect(() => {
    if (swiperRef.current) {
      handleVideoPlayPause(swiperRef.current);
      swiperRef.current.on('onSlideChangeTransitionEnd', () => handleVideoPlayPause(swiperRef.current));
    }
  }, [swiperRef.current]);

  /* --------------------------------------------- X -------------------------------------------- */

  const handleSlideTransitionEnd = () => {
    const activeVideo = document.querySelector('.swiper-slide-active video');
    if (activeVideo) {
      activeVideo.play();
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const settings = {
    dots: true,
    vertical: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    verticalSwiping: true,
  };
  const options = {
    direction: 'ttb',
    wheel: true,
    height: '100rem',
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // const Likevideo = async (e, videoId, userId) => {
  //   if (e.target.classList.contains("like")) {
  //     e.target.classList.toggle("liked")
  //   } else {
  //     e.target.parentElement.classList.toggle("liked")
  //   }
  //   try {
  //     const response = await axiosClient.get(`${import.meta.env.VITE_API_ENDPOINT}/header-menu-slider/${videoId}/${userId}`);
  //   } catch (error) {
  //     setopenSigninPopup(true)
  //   }
  // }

  /* --------------------------------------------- X -------------------------------------------- */

  return (
    <>
      {/* <SinginPopup /> */}
      {headerMenuVideoPopup.display &&
        <div className='headerMenuvideoPopup'>
          <div className="bg" onClick={() => openHeaderMenuVideoPopup(null)} />
          {<Swiper
            ref={swiperRef}
            style={{
              height: '90vh',
              borderRadius: '20px',
              top: '5vh',
              border: '5px solid #ccc',
            }}
            direction='vertical'
            slidesPerView={1}
            onSlideChangeTransitionEnd={() => handleVideoPlayPause(swiperRef.current)}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesToScroll={1}
            // slidesToShow={1}
            // options={options}
            className="mySwiper"
          >
            {videoArr?.map((video, index) => {
              if (!videoRefs.current[index]) {
                videoRefs.current[index] = React.createRef();
              }
              return (
                <SwiperSlide key={index} className="videoContainer">
                  <video ref={videoRefs.current[index]} className='' src={video?.video?.media?.url} />
                  {/* <img style={{width : "400px", height:"80vh"}} src="https://tjara-api.sn66.me/storage/media/1718890192-b399ac9b-3bdf-46ce-b14c-cd7003bc041a.jpg" alt="" /> */}
                  {/* <div className="buttons">
                    <button className='like' onClick={() => Likevideo(event, video.id, 0)}>
                      100+
                    </button>
                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" /></svg>
                    </button>
                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" /></svg>
                    </button>
                  </div> */}
                  <div onClick={() => navigate(`/store/${video?.shop?.shop?.slug}`)} className="videoDetails">
                    <img src={fixUrl(video?.shop?.shop?.thumbnail?.media?.url)} alt="" />
                    <div className="text">
                      <h2>{video?.name}</h2>
                      <p>{video?.shop?.shop?.name}</p>
                    </div>
                  </div>
                </SwiperSlide>)
            })}
          </Swiper>}
        </div>}
    </>
  )
}

export default index