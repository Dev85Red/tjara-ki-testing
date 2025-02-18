import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();
    const navigationType = useNavigationType();

    // Helper function to check if current page is shop
    const isShopPage = () => {
        return pathname.startsWith('/shop') || pathname.startsWith('/cars') || pathname.startsWith('/global');  // Adjust this path according to your routing structure
    };

    useEffect(() => {
        if (!isShopPage()) {
            setTimeout(() => { window.scrollTo(0, 0); }, 500);
        }
    }, [pathname]);

    useEffect(() => {
        if (navigationType === 'POP' && !isShopPage()) {
            setTimeout(() => { window.scrollTo(0, 0); }, 500);
        }
    }, [pathname, navigationType]);

    return null;
}

export default ScrollToTop;