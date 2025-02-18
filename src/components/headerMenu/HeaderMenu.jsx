import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import "./HeaderMenu.css";
import { usePopup } from "../DataContext";
import MegaMenu from '@components/MegaMenu';
import PRODUCT_ATTRIBUTES from "@client/productAttributesClient";
import { isDarkColor } from "../../helpers/helpers";
import { useheaderFooter } from "@contexts/globalHeaderFooter";


function HeaderMenu() {
  const { category } = useParams()
  const { globalSettings } = useheaderFooter();
  const navigate = useNavigate();
  const { homeSubcategoryId, currentHeaderColor, megaMenuPopup } = usePopup();
  const mbMenu = useRef(null);
  const [categoriesArr, setcategoriesArr] = useState(null)

  /* --------------------------------------------- X -------------------------------------------- */

  const mobileNavbar = () => {
    if (window.innerWidth <= 1024) {
      mbMenu.current.classList.toggle("active");
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCategories = async () => {
    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('categories', {
      hide_empty: true,
      ids: globalSettings?.header_categories?.split(','),
      order_by: 'name',
      order: 'asc',
    });
    if (data) setcategoriesArr(data?.product_attribute?.attribute_items?.product_attribute_items);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCategories()
  }, [globalSettings?.header_categories?.split(',')?.length > 0]);

  /* --------------------------------------------- X -------------------------------------------- */

  return (
    <>
      <MegaMenu homeSubcategoryId={homeSubcategoryId} />
      {/* <div className={`header-menu ${isDarkColor(currentHeaderColor) ? "IsDark" : ""}`} style={window.innerWidth <= 500 ? {backgroundColor : currentHeaderColor} : null}> */}
      <div className={`header-menu ${isDarkColor(currentHeaderColor) ? "IsDark" : null}`} style={window.innerWidth <= 500 ? { backgroundColor: 'var(--main-red-color)' } : null}>
        <div className="header-menu-browse-category-container">
          <svg onClick={() => window.innerWidth < 500 ? mobileNavbar() : megaMenuPopup()} width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.5294 5.18604H1.2353C0.553065 5.18604 0 5.6836 0 6.29738C0 6.91115 0.553065 7.40872 1.2353 7.40872H18.5294C19.2117 7.40872 19.7647 6.91115 19.7647 6.29738C19.7647 5.6836 19.2117 5.18604 18.5294 5.18604Z" fill="white" /><path d="M1.2353 2.22268H18.5294C19.2117 2.22268 19.7647 1.72511 19.7647 1.11134C19.7647 0.497568 19.2117 0 18.5294 0H1.2353C0.553065 0 0 0.497568 0 1.11134C0 1.72511 0.553065 2.22268 1.2353 2.22268Z" fill="white" /><path d="M18.5294 10.3726H1.2353C0.553065 10.3726 0 10.8701 0 11.4839C0 12.0977 0.553065 12.5952 1.2353 12.5952H18.5294C19.2117 12.5952 19.7647 12.0977 19.7647 11.4839C19.7647 10.8701 19.2117 10.3726 18.5294 10.3726Z" fill="white" /></svg>
          <p className="heading" onClick={() => megaMenuPopup()}>Browse Categories</p>
          <div className="categories-scroller">
            <p className={`${window.location.pathname == "/" ? "active" : ""}`} onClick={() => { navigate(`/`) }}>All</p>
            {categoriesArr?.map((x, index) => {
              return (
                <p className={`${category == x.id ? "active" : ""}`} key={index} onClick={() => { navigate(x?.post_type == "product" ? `/shop/${x?.slug}` : x?.post_type == "car" ? `/cars/${x?.slug}` : "/global/products") }}>{x?.name}</p>
              )
            })}
          </div>
        </div>

        <div className="header-bottom-menu-items" ref={mbMenu}>
          <div className="category">
            <NavLink to="/">
              Home
              {/* <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
            </svg> */}
            </NavLink>
            {/* <div className="subCategories">
            <Link to={""}>Borjan</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>Longwalk</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>GUCCI</Link>
            <Link to={""}>Men’s Flair</Link>
          </div> */}
          </div>

          <div className="category" >
            <NavLink to="/shop/products">
              Shop
              {/* <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
            </svg> */}
            </NavLink>
            {/* <div className="subCategories">
            <Link to={""}>Borjan</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>Longwalk</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>GUCCI</Link>
            <Link to={""}>Men’s Flair</Link>
          </div> */}
          </div>

          <div className="category" >
            <NavLink to="/cars/products">
              Cars
              {/* <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
            </svg> */}
            </NavLink>
            {/* <div className="subCategories">
            <Link to={""}>Borjan</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>Longwalk</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>GUCCI</Link>
            <Link to={""}>Men’s Flair</Link>
          </div> */}
          </div>
          {/* <div className="category" onClick={() => openSubCategory(event)}>
          <Link to="/shop/products/219ae235-169f-4a22-a656-2adfddb837bf">
            Product
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
            </svg>
          </Link>
          <div className="subCategories">
            <Link to={""}>Borjan</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>Longwalk</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>GUCCI</Link>
            <Link to={""}>Men’s Flair</Link>
          </div>
        </div> */}

          <div className="category" >
            <NavLink to="/jobs">
              Jobs
              {/* <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
            </svg> */}
            </NavLink>
            {/* <div className="subCategories">
            <Link to={""}>Borjan</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>Longwalk</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>GUCCI</Link>
            <Link to={""}>Men’s Flair</Link>
          </div> */}
          </div>
          {/* <div className="category" onClick={() => openSubCategory(event)}>
          <Link to="/cart">
            Cart
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
            </svg>
          </Link>
          <div className="subCategories">
            <Link to={""}>Borjan</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>Longwalk</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>GUCCI</Link>
            <Link to={""}>Men’s Flair</Link>
          </div>
        </div> */}
          {/* <div className="category" onClick={() => openSubCategory(event)}>
          <Link to="/checkout">
            Checkout
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
            </svg>
          </Link>
          <div className="subCategories">
            <Link to={""}>Borjan</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>Longwalk</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>GUCCI</Link>
            <Link to={""}>Men’s Flair</Link>
          </div>
        </div> */}

          <NavLink to="/contests">
            Contests
            {/* <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
            </svg> */}
          </NavLink>

          <div className="category">
            <NavLink to="/services">
              Services
              {/* <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
            </svg> */}
            </NavLink>
            {/* <div className="subCategories">
            <Link to={""}>Borjan</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>Longwalk</Link>
            <Link to={""}>Weixier</Link>
            <Link to={""}>GUCCI</Link>
            <Link to={""}>Men’s Flair</Link>
          </div> */}
          </div>
          <NavLink to="/tjara-club">
            Tjara Club
            {/* <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
        </svg> */}
          </NavLink>
          <NavLink to="/help-and-center">
            Help Center
            {/* <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
        </svg> */}
          </NavLink>
        </div>

        {globalSettings?.website_deals_percentage && <div className="header-bottom-sale-heading">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_333_15070)">
              <path
                d="M9 18C7.7805 18 6.63 17.4645 5.844 16.5308C4.689 16.6635 3.49875 16.2262 2.63625 15.3645C1.7745 14.502 1.3395 13.3095 1.44375 12.093C0.5355 11.37 0 10.2195 0 9C0 7.7805 0.5355 6.63 1.47 5.844C1.33875 4.69125 1.77375 3.49875 2.63625 2.63625C3.49875 1.773 4.689 1.33875 5.907 1.44375C6.63 0.53625 7.7805 0 9 0C10.2195 0 11.37 0.5355 12.156 1.46925C13.3125 1.33725 14.5013 1.77375 15.3638 2.6355C16.2255 3.498 16.6605 4.6905 16.5563 5.907C17.4645 6.63 18 7.7805 18 9C18 10.2195 17.4645 11.37 16.53 12.156C16.6613 13.3088 16.2262 14.5013 15.3638 15.3638C14.5005 16.2262 13.308 16.6605 12.093 16.5563C11.37 17.4638 10.2195 18 9 18ZM5.90475 15.057C6.3255 15.057 6.7155 15.2378 6.99075 15.564C7.49175 16.1588 8.22375 16.5 9 16.5C9.77625 16.5 10.5083 16.1588 11.0092 15.564C11.3115 15.2048 11.7517 15.0233 12.2213 15.0615C12.9967 15.1268 13.7542 14.8515 14.3032 14.3025C14.8515 13.7542 15.1283 12.9953 15.0623 12.2205C15.0218 11.7525 15.2048 11.3108 15.5648 11.0077C16.1588 10.5075 16.5 9.77475 16.5 8.99925C16.5 8.22375 16.1588 7.491 15.5648 6.99075C15.2055 6.6885 15.0218 6.246 15.0623 5.778C15.1283 5.00325 14.8522 4.24425 14.3032 3.696C13.7542 3.14775 12.9922 2.874 12.222 2.937C11.7525 2.97975 11.3115 2.79375 11.0092 2.43525C10.5083 1.8405 9.77625 1.49925 9 1.49925C8.22375 1.49925 7.49175 1.8405 6.99075 2.43525C6.68775 2.7945 6.246 2.9745 5.77875 2.93775C4.9995 2.87025 4.24575 3.14775 3.69675 3.69675C3.1485 4.245 2.87175 5.004 2.93775 5.77875C2.97825 6.24675 2.79525 6.6885 2.43525 6.9915C1.84125 7.49175 1.5 8.2245 1.5 9C1.5 9.7755 1.84125 10.5083 2.43525 11.0085C2.7945 11.3108 2.97825 11.7533 2.93775 12.2213C2.87175 12.996 3.14775 13.755 3.69675 14.3032C4.24575 14.8522 5.0115 15.1267 5.778 15.0623C5.82075 15.0585 5.86275 15.057 5.90475 15.057ZM6.75 6C6.336 6 6 6.336 6 6.75C6 7.164 6.336 7.5 6.75 7.5C7.164 7.5 7.5 7.164 7.5 6.75C7.5 6.336 7.164 6 6.75 6ZM11.25 10.5C10.836 10.5 10.5 10.836 10.5 11.25C10.5 11.664 10.836 12 11.25 12C11.664 12 12 11.664 12 11.25C12 10.836 11.664 10.5 11.25 10.5ZM8.124 11.6663L11.124 7.16625C11.3542 6.822 11.2613 6.3555 10.9163 6.126C10.5705 5.895 10.1055 5.9895 9.876 6.33375L6.876 10.8337C6.64575 11.178 6.73875 11.6445 7.08375 11.874C7.212 11.9595 7.356 12 7.49925 12C7.7415 12 7.98 11.883 8.124 11.6663Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_333_15070">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p >
            {globalSettings?.website_deals_percentage}% off for new customers <Link style={{ color: "white" }} to={"/shop/products?filter_by_column=percentage_discount"}> View Sale</Link>
          </p>
        </div>}

        <svg onClick={mobileNavbar} width="26" className="closeMbNav" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 1.625C6.6625 1.625 1.625 6.6625 1.625 13C1.625 19.3375 6.6625 24.375 13 24.375C19.3375 24.375 24.375 19.3375 24.375 13C24.375 6.6625 19.3375 1.625 13 1.625ZM13 22.75C7.6375 22.75 3.25 18.3625 3.25 13C3.25 7.6375 7.6375 3.25 13 3.25C18.3625 3.25 22.75 7.6375 22.75 13C22.75 18.3625 18.3625 22.75 13 22.75Z" fill="#9E9E9E" />
          <path d="M17.3875 18.6875L13 14.3L8.6125 18.6875L7.3125 17.3875L11.7 13L7.3125 8.6125L8.6125 7.3125L13 11.7L17.3875 7.3125L18.6875 8.6125L14.3 13L18.6875 17.3875L17.3875 18.6875Z" fill="#9E9E9E" />
        </svg>
      </div>
    </>
  );
}

export default HeaderMenu;
