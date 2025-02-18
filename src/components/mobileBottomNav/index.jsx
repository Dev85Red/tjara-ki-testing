import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BellRing, CircleUserRound, Grip, House, Menu, ShoppingCart, ThumbsUp, BadgeCheck } from 'lucide-react';

import { usePopup } from '../DataContext'
import { useAuth } from "@contexts/Auth";
import NOTIFICATIONS from '../../client/notificationsClient';
import PRODUCTS from "@client/productsClient.js";
import { timeAgo } from '../../helpers/helpers';

import "./style.css"

const index = () => {
  const { currentUser, logout } = useAuth();
  const { settoggleMobileFooter, toggleMobileFooter, cartItemsCount, cartsItemCount, wishlistItemsCount, signInPopup, openHeaderMenuVideoPopup, megaMenuPopup } = usePopup();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState({
    data: [],
    current_page: 1,
    prev_page_url: '',
    next_page_url: '',
    links: [],
  });
  const [ProductChatsCount, setProductChatsCount] = useState(0);
  const [productChats, setProductChats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('notifications');

  /* --------------------------------------------- X -------------------------------------------- */

  const toggleTab = (tab) => {
    setActiveTab(tab);
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
      console.error(error.data.message);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchNotificationsCount = async () => {
    const { data, error } = await NOTIFICATIONS.getNotificationsCount({
      orderBy: "created_at",
      order: "desc",
      per_page: 20,
    });
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
    if (error) {
      toast.error(error.message);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const deleteAllNotifications = async () => {
    const { data, error } = await NOTIFICATIONS.deleteAllNotifications();
    if (data) {
      fetchNotifications()
      toast.success(data.message);
    };
    if (error) {
      toast.error(error.message);
    }
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
      cartsItemCount()
      fetchProductChatsCount();
      fetchProductChats();
      fetchNotificationsCount();
      fetchNotifications();
    }
  }, [currentUser]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className='MobileBottomNav'>
      <div className={`container ${currentUser?.authToken && 'loggedIn'}`}>
        <Link to={"/"} onClick={() => settoggleMobileFooter(false)}>
          <House size={20} />
          Home
        </Link>

        <a /* to={"/shop/products"} */ onClick={() => { settoggleMobileFooter(false); megaMenuPopup() }}>
          <Grip size={20} />
          Categories
        </a>

        {currentUser?.authToken && (
          <div className="mobile-bottom-navigation-sec notifications-dropdown">
            <a className="notifications-icon">
              <BellRing size={20} />
              Notifications
              {notificationsCount > 0 && <span className="notifications-count">{notificationsCount}</span>}
            </a>

            <div className="notifications-and-messages-content">
              <div className="tabs-header">
                <button
                  className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => toggleTab('notifications')}
                >
                  Notifications
                </button>
                <button
                  className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
                  onClick={() => toggleTab('messages')}
                >
                  Messages
                </button>
              </div>

              {activeTab === 'notifications' ? (
                <div className="notifications-content">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button onClick={deleteAllNotifications} className="clear-all">Clear All</button>
                  </div>
                  <ul className="notifications-list">
                    {notifications?.data?.length > 0 ? (
                      notifications.data.map((notification, index) => (
                        <li key={index} className="notification-item">
                          <Link target='_blank' to={notification?.url} className="notification-title">{notification.title}</Link>
                          <div className="notification-description">{notification.description}</div>
                          <div className="notification-date">{notification.date}</div>
                          <button onClick={() => deleteNotification(notification.id)} className="delete-notification">×</button>
                        </li>
                      ))
                    ) : (
                      <li className="no-notifications">No notifications</li>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="notifications-content">
                  <div className="notifications-header">
                    <h3>Messages</h3>
                    <Link target='_blank' to={`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/login?jwt=${currentUser?.authToken}&redirect_url=/chat`} className="clear-all">See All</Link>
                  </div>
                  <ul className="notifications-list">
                    {productChats?.data?.length > 0 ? (
                      productChats.data.map((chat, index) => (
                        <li key={index} className="notification-item">
                          <Link target="_blank" to={`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/login?jwt=${currentUser?.authToken}&redirect_url=/chat?chatId=${chat?.id}`} className="notification-title">{chat?.user?.user?.first_name} {chat?.user?.user?.last_name}</Link>
                          <div className="notification-description">{chat?.last_message}</div>
                          <div className="notification-date">{timeAgo(chat?.created_at)}</div>
                          <Link target="_blank" to={`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/login?jwt=${currentUser?.authToken}&redirect_url=/chat?chatId=${chat?.id}`} className="delete-notification">^</Link>
                        </li>
                      ))
                    ) : (
                      <li className="no-notifications">No messages</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {currentUser ? (
          <Link to={`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}`} onClick={() => settoggleMobileFooter(false)}>
            <CircleUserRound size={20} />
            {currentUser.first_name}
          </Link>
        ) : (
          <a onClick={() => {
            settoggleMobileFooter(false);
            signInPopup()
          }}>
            <CircleUserRound size={20} />
            Account
          </a>
        )}

        <Link style={{ position: 'relative' }} to={"/cart"} onClick={() => settoggleMobileFooter(false)}>
          {cartItemsCount > 0 && <span className="cart-items-count">{cartItemsCount}</span>}
          <ShoppingCart size={20} />
          Cart
        </Link>

        {/* <Link onClick={() => openHeaderMenuVideoPopup(null)}>
          <BadgeCheck size={20} />
          Stories
        </Link> */}

        <Link style={{ position: 'relative' }} to={`/tjara-club`} onClick={() => settoggleMobileFooter(false)}>
          {wishlistItemsCount > 0 && <span style={{ width: '10px', height: '10px', position: 'absolute', top: '-10px', background: 'red', borderRadius: '10px', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', }} className="">{wishlistItemsCount}</span>}
          <BadgeCheck size={20} />
          Tjara Club
        </Link>

        <a onClick={() => settoggleMobileFooter(!toggleMobileFooter)}>
          <Menu size={20} />
          More
        </a>
      </div>
    </div>
  )
}

export default index