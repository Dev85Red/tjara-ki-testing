import React, { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { usePopup } from "../DataContext";

import POSTS from "@client/postsClient";

import "./HeaderMenuSlider.css";
import { getOptimizedVideoUrl } from "../../helpers/helpers";

function HeaderMenuSlider({ className = '', ids = null, limit = null }) {
  const productsRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [videoSlides, setVideoSlides] = useState({ data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},] });
  const { openHeaderMenuVideoPopup } = usePopup();

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchShopStories = async () => {
    const ApiParams = {
      ids: ids,
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
    };

    const { data, error } = await POSTS.getPosts(ApiParams)

    if (data) {
      setVideoSlides(data.posts);
      setLoading(false);
    }

    if (error) {
      console.error(error);
      setVideoSlides();
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchShopStories();
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  const VideoPlayer = ({ video }) => {
    const videoRef = useRef(null);
    const handleMouseEnter = () => {
      videoRef?.current?.play();
    };
    const handleMouseLeave = () => {
      videoRef?.current?.pause();
    };

    return (
      <div onClick={() => openHeaderMenuVideoPopup(video)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="header-menu-slider-single-item">
        {getOptimizedVideoUrl(video) ? (
          <video src={getOptimizedVideoUrl(video)} ref={videoRef} muted type="video/mp4" />
        ) : (
          <Skeleton height={140} width={125} />
        )}
        <svg className="header-menu-slider-single-item-play-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="17" fill="#D21642" stroke="white" strokeWidth="2" /><g clipPath="url(#clip0_333_15135)">  <path d="M22.9537 15.6487L17.3898 11.5688C16.9553 11.2506 16.4411 11.0589 15.9042 11.0151C15.3674 10.9712 14.8289 11.0768 14.3484 11.3203C13.868 11.5637 13.4643 11.9354 13.1822 12.3942C12.9 12.8531 12.7504 13.381 12.75 13.9197V22.0834C12.7492 22.6226 12.898 23.1514 13.1798 23.611C13.4617 24.0706 13.8656 24.4429 14.3465 24.6866C14.8275 24.9303 15.3666 25.0357 15.9039 24.9911C16.4412 24.9466 16.9556 24.7538 17.3898 24.4342L22.9537 20.3544C23.3229 20.0835 23.6231 19.7294 23.83 19.3209C24.0369 18.9124 24.1447 18.4609 24.1447 18.003C24.1447 17.5451 24.0369 17.0936 23.83 16.6851C23.6231 16.2765 23.3229 15.9225 22.9537 15.6516V15.6487Z" fill="white" /></g><defs>  <clipPath id="clip0_333_15135">    <rect width="14" height="14" fill="white" transform="translate(11 11)" />  </clipPath></defs></svg>
        <p>{video?.name ? `${video?.name?.substring(0, 10)}...` : <Skeleton width={80} />}</p>
      </div>
    );
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    videoSlides && (
      <div ref={productsRef} className={`header-menu-slider-container ${className}`}>
        {videoSlides?.data?.map((e, i) => (
          <VideoPlayer key={e.id || i} video={e} />
        ))
        }
      </div>
    )
  );
}
export default HeaderMenuSlider;