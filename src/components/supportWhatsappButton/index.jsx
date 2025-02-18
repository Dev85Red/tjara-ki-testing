import React from 'react'
import whatsapp from "./whatsapp.webp";
import { useheaderFooter } from "@contexts/globalHeaderFooter";
import { Link } from 'react-router-dom';
import './style.css'

const index = () => {
    const { globalSettings } = useheaderFooter();
    return (
        <div className="footer-fixed-support-buttons fixedContactIcons">
            {/* ---------------------------------------------------------------------------------------- */}
            {/*                                      Live Chat Popup                                     */}
            {/* ---------------------------------------------------------------------------------------- */}
            {/* <img onClick={() => {
                settoggleLiveChat(!toggleLiveChat)
                handleChatSubmit()
            }} src={chat} alt="" /> */}
            <Link target="_blank" to={`https://api.whatsapp.com/send?phone=${globalSettings?.website_whatsapp_number}`}>
                <img src={whatsapp} alt="" />
            </Link>
        </div>
    )
}

export default index