// modules
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@contexts/Auth";
import { usePopup } from "@components/DataContext";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { User, LogOut, MessageCircleMore, ShoppingCart, Heart, MessageSquareMore, BellRing, Languages, ChevronDown, ExternalLink, X } from 'lucide-react';
// api clients
import NOTIFICATIONS from '../../client/notificationsClient';
import PRODUCTS from "@client/productsClient.js";
// components
import LoginModal from "@components/LoginModal/LoginModal";
import LeadGenerationModal from "@components/LeadGenerationModal/LeadGenerationModal";
import ForgotPasswordModal from "@components/ForgotPasswordModal";
import ResetPasswordModal from "@components/ResetPasswordModal";
import SmsVerificationModal from "@components/SmsVerificationModal";
import SignUpModal from "@components/SignUpModal/SignUpModal";
// contexts
// import { usePopup } from "@components/DataContext";
import { useheaderFooter } from "@contexts/globalHeaderFooter";
// helpers
import { timeAgo } from "../../helpers/helpers";
// images
import logo from "@assets/logo.svg";
import logoOptimized from "./assets/tjara.png";
import dashboard from "@assets/header-dashboard.svg";
import headerCaret from "@assets/header-caret.svg";
import language from "@assets/language.svg";
import wishlist from "@assets/wishlist.svg";
import cart from "@assets/header-shopping-cart.svg";
import account from "@assets/header-user.svg";
// css
import 'swiper/css';
import 'swiper/css/autoplay';
import "./Header.css";
import AccountDropdown from "../AccountDropdown";

/* ---------------------------------------------- X --------------------------------------------- */

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/* ---------------------------------------------- X --------------------------------------------- */

function Header() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCameraPopup, setshowCameraPopup] = useState(false)
  const { globalSettings } = useheaderFooter();
  const [searchInput, setsearchInput] = useState('');
  const [searchbarDropdown, setsearchbarDropdown] = useState({ name: "All", route: "global/products" });
  const [toggleSearchdropdown, settoggleSearchdropdown] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const searchBar = useRef(null);
  const { signInPopup, cartItemsCount, cartsItemCount, wishlistItemsCount, fetchWishlistItemsCount, currentHeaderColor, resetPassPopup } = usePopup();
  const { currentUser, logout } = useAuth();
  const [cartPopup, setcartPopup] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const resetPassQuery = query.get('password-reset');
  const [notifications, setNotifications] = useState({
    data: [],
    current_page: 1,
    prev_page_url: '',
    next_page_url: '',
    links: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [ProductChatsCount, setProductChatsCount] = useState(0);
  const [productChats, setProductChats] = useState([]);
  const [suggestions] = useState(['Mobile phones', 'Mens clothing', 'Books', 'Mens shoes', 'Fitness equipment', 'Mens watches', 'Furniture', 'Mens grooming kits', 'Toys & games', 'Mens backpacks', 'Used cars', 'Mens jackets', 'Laptops', 'Mens sportswear', 'Smartwatches', 'Mens wallets', 'Womens clothing', 'Tablets', 'Womens shoes', 'Gaming consoles', 'Womens handbags', 'Headphones', 'Womens jewelry', 'Home appliances', 'Womens skincare', 'Kitchen gadgets', 'Womens makeup', 'Smart TVs', 'Womens perfumes', 'Office supplies']);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(suggestions[0]);
  const [fade, setFade] = useState(true);
  let placeholderIndex = 0;

  /* --------------------------------------------- X -------------------------------------------- */

  const openSearch = () => {
    if (window.innerWidth <= 1024) {
      searchBar.current.classList.toggle("active");
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleSearchInput = async (e) => {
    setsearchInput(e);
    const url = `/${searchbarDropdown.route}?search=${encodeURIComponent(e)}`;
    const newUrl = window.location.origin + url;
    window.history.replaceState(null, '', newUrl);
  };


  /* --------------------------------------------- X -------------------------------------------- */

  const handleSearch = async () => {
    setsearchbarDropdown(searchbarDropdown == "Products" ? "shop/products" : searchbarDropdown)
    navigate(`/${searchbarDropdown.route}?search=${searchInput}`)
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (resetPassQuery == 'true') {
      resetPassPopup();
    }
  }, [resetPassQuery])

  /* --------------------------------------------- X -------------------------------------------- */

  const startCamera = async () => {
    try {
      setshowCameraPopup(!showCameraPopup);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing the camera', error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setStream(null);
      videoRef.current.srcObject = null;
      setshowCameraPopup(!showCameraPopup);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');
    setshowCameraPopup(!showCameraPopup);
    setCapturedImage(imageDataUrl);
    navigate("/global/products");
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchProductChatsCount = async () => {
    const { data, error } = await PRODUCTS.getProductChatsCount();
    if (data) {
      setProductChatsCount(data.chats_count);
    }
    if (error) {
      console.error("Error fetching chats count:", error);
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                          Fetch Chat                                          */
  /* -------------------------------------------------------------------------------------------- */

  const fetchProductChats = async () => {
    const { data, error } = await PRODUCTS.getProductChats({
      orderBy: "created_at",
      order: "desc",
      per_page: 20,
    });
    if (data) {
      setProductChats(data.ProductChats);
    }
    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchNotificationsCount = async () => {
    const { data, error } = await NOTIFICATIONS.getNotificationsCount();
    if (data) {
      setNotificationsCount(data.notifications_count);
    }
    if (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchNotifications = async () => {
    const { data, error } = await NOTIFICATIONS.getNotifications({
      orderBy: "created_at",
      order: "desc",
      page: currentPage,
      per_page: 20,
    });
    if (data) {
      setNotifications(data.notifications);
      setCurrentPage(data.notifications.current_page);
    }
    if (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const deleteNotification = async (id) => {
    const { data, error } = await NOTIFICATIONS.deleteNotification(id);
    if (data) {
      fetchNotifications()
      toast.success(data.message);
    };
    if (error) toast.error(error.message);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const deleteAllNotifications = async () => {
    const { data, error } = await NOTIFICATIONS.deleteAllNotifications();
    if (data) {
      fetchNotifications()
      toast.success(data.message);
    };
    if (error) toast.error(error.message);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (currentUser?.authToken) {
      const intervalId = setInterval(() => {
        fetchProductChatsCount()
        fetchProductChats();
        fetchNotificationsCount();
        fetchNotifications();
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (currentUser?.authToken) {
      cartsItemCount();
      fetchWishlistItemsCount();
      fetchProductChatsCount();
      fetchProductChats();
      fetchNotificationsCount();
      fetchNotifications();
    }
  }, [currentUser]);

  /* --------------------------------------------- X -------------------------------------------- */

  // const SearchBar = ({ image }) => {
  //   const [searchQuery, setSearchQuery] = useState('');
  //   const handleSearch = () => {
  //   };
  //   return (
  //     <div>
  //       <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." />
  //       <button onClick={handleSearch}>Search</button>
  //     </div>
  //   );
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        placeholderIndex = (placeholderIndex + 1) % suggestions.length;
        setCurrentPlaceholder(suggestions[placeholderIndex]);
        setFade(true);
      }, 500);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [suggestions]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                   Lead Generation Modal                                  */}
      {/* ---------------------------------------------------------------------------------------- */}
      <LeadGenerationModal />
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                        Login Modal                                       */}
      {/* ---------------------------------------------------------------------------------------- */}
      <LoginModal />
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                   Forgot Password Modal                                  */}
      {/* ---------------------------------------------------------------------------------------- */}
      <ForgotPasswordModal />
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                   Reset Password Modal                                   */}
      {/* ---------------------------------------------------------------------------------------- */}
      <ResetPasswordModal />
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                      Register Modal                                      */}
      {/* ---------------------------------------------------------------------------------------- */}
      <SignUpModal />
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                  Sms Verification Modal                                  */}
      {/* ---------------------------------------------------------------------------------------- */}
      <SmsVerificationModal />
      {/* // <div className="header" style={window.innerWidth <= 500 ? { backgroundColor: currentHeaderColor } : {}}> */}
      <div className="header" style={window.innerWidth <= 500 ? { backgroundColor: 'var(--main-red-color)' } : {}}>
        {/* ---------------------------------------------------------------------------------------- */}
        {/*                                        Header Logo                                       */}
        {/* ---------------------------------------------------------------------------------------- */}
        <Link to={"/"}>
          <img src={/* globalSettings.website_logo_url ?? */ logoOptimized} style={{ maxWidth: "165px" }} alt="Tjara Logo" className="logo" />
        </Link>
        <div className="header-search-prod-container" ref={searchBar}>
          <div className={`searchbarDropdown ${toggleSearchdropdown ? "active" : ""}`}>
            <div className="header-product-container" onClick={() => settoggleSearchdropdown(!toggleSearchdropdown)}>
              <img width="18px" height="18px" src={dashboard} alt="" />
              <p>{searchbarDropdown.name}</p>
              <img width="14px" height="7px" className="header-caret-icon" src={headerCaret} alt="" />
            </div>
            <div className="dropdown">
              <div className="bg" onClick={() => settoggleSearchdropdown(!toggleSearchdropdown)} />
              <p onClick={() => {
                setsearchbarDropdown({ name: "All", route: "global/products" })
                settoggleSearchdropdown(false)
              }}>All</p>
              <p onClick={() => {
                setsearchbarDropdown({ name: "Products", route: "shop/products" })
                settoggleSearchdropdown(false)
              }}>Products</p>
              <p onClick={() => {
                setsearchbarDropdown({ name: "Cars", route: "cars/products" })
                settoggleSearchdropdown(false)
              }}>Cars</p>
              <p onClick={() => {
                setsearchbarDropdown({ name: "Services", route: "services" })
                settoggleSearchdropdown(false)
              }}>Services</p>
              <p onClick={() => {
                setsearchbarDropdown({ name: "Contests", route: "contests" })
                settoggleSearchdropdown(false)
              }}>Contests</p>
              {/* <p onClick={() => {
              setsearchbarDropdown({ name: "Stores", route: "store" })
              settoggleSearchdropdown(false)
            }}>Stores</p> */}
            </div>
          </div>
          <div className="header-input-container">
            <div className="search-field">
              <input type="search" placeholder={currentPlaceholder} className={fade ? 'fade-in' : 'fade-out'} value={searchInput} onKeyDown={(e) => { e.key == "Enter" ? handleSearch(e) : null }} onChange={(e) => handleSearchInput(e.target.value)} />
              {/* <svg className="camera" onClick={startCamera} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" /></svg> */}
              <div className="searchIcon">
                <svg onClick={handleSearch} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.875 13.875L16.5 16.5M15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625Z" stroke="#096C2B" strokeWidth="1.92857" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="header-menus-right">
          <div style={{ display: "none" }} className="header-menus-item-single">
            <Languages size={20} />
            <div className="langauge-drop-down">
              <select name="" id="">
                <option value="">English</option>
                <option value="">Arabic</option>
                <option value="">Spanish</option>
                <option value="">French</option>
              </select>
            </div>
            {/* <ChevronDown size={20} /> */}
          </div>

          <div className="header-menus-item-single wishlist">
            <Link to={"/wishlist"}><Heart size={18} /> {wishlistItemsCount > 0 && <span className="">{wishlistItemsCount}</span>}My Wishlist</Link>
          </div>

          <div className="header-menus-item-single count">
            <Link to="/cart">{cartItemsCount > 0 && <span className="">{cartItemsCount}</span>} <ShoppingCart size={18} /> Cart</Link>
          </div>

          {currentUser?.authToken && (
            <div className="header-menus-item-single notifications-dropdown">
              <div className="notifications-icon">
                <MessageSquareMore size={20} />
                {ProductChatsCount > 0 && <span className="notifications-count">{ProductChatsCount}</span>}
              </div>
              <div className="notifications-content">
                <div className="notifications-header">
                  <h3>Messages</h3>
                  <Link target='_blank' to={`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/product-chats`} className="clear-all">See All</Link>
                </div>
                <ul className="notifications-list">
                  {productChats?.data?.length > 0 ? (
                    productChats.data.map((chat, index) => (
                      <li onClick={() => window.open(`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/product-chats?chatId=${chat?.id}`, "_blank")} key={index} className="notification-item">
                        <Link className="notification-title">{chat?.user?.user?.first_name} {chat?.user?.user?.last_name}</Link>
                        <div className="notification-description">{chat?.last_message}</div>
                        <div className="notification-date">{timeAgo(chat?.created_at)}</div>
                        <Link className="delete-notification"><ExternalLink size={15} /></Link>
                      </li>
                    ))
                  ) : (
                    <li className="no-notifications">No messages</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {currentUser?.authToken && (
            <div className="header-menus-item-single notifications-dropdown">
              <div className="notifications-icon">
                <BellRing size={20} />
                {notificationsCount > 0 && <span className="notifications-count">{notificationsCount}</span>}
              </div>
              <div className="notifications-content">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button onClick={deleteAllNotifications} className="clear-all">Clear All</button>
                </div>
                <ul className="notifications-list">
                  {notifications?.data?.length > 0 ? (
                    notifications.data.map((notification, index) => (
                      <li key={index} className="notification-item">
                        <Link to={notification?.url} className="notification-title">{notification.title}</Link>
                        <div className="notification-description">{notification.description}</div>
                        <div className="notification-date">{notification.date}</div>
                        <button onClick={() => deleteNotification(notification.id)} className="delete-notification"><X size={15} /></button>
                      </li>
                    ))
                  ) : (
                    <li className="no-notifications">No notifications</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          <AccountDropdown currentUser={currentUser} logout={logout} signInPopup={signInPopup} />

          <div className="header-menus-item-single searchIcon" onClick={openSearch}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.875 13.875L16.5 16.5M15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625Z" stroke="#096C2B" strokeWidth="1.92857" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {showCameraPopup &&
          <div className="cameraPopup">
            <button className="closeCamera" onClick={stopCamera}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" /></svg>
            </button>
            <button className="captureImage" onClick={captureImage} />
            <video ref={videoRef} width="320" height="240" autoPlay />
            <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
            {capturedImage && (
              <div>
                <h2>Captured Image</h2>
                <img src={capturedImage} alt="Captured" />
              </div>
            )}
          </div>
        }
      </div>
    </>
  );
}

export default Header;