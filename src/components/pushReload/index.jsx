import React, { useState, useEffect } from 'react';

const PullDownRefresh = () => {
    const [startY, setStartY] = useState(0);
    const [pullDistance, setPullDistance] = useState(0);
    const [showArrow, setShowArrow] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isProductPage, setIsProductPage] = useState(false);

    // Check if window is at top
    const checkIfAtTop = () => {
        setIsAtTop(window.scrollY === 0);
    };

    // Check if current page is a product page
    const checkIfProductPage = () => {
        const path = window.location.pathname;
        setIsProductPage(path.startsWith('/product/'));
    };

    const handleTouchStart = (e) => {
        // Only set start position if we're at the top of the page and not on a product page
        if (window.scrollY === 0 && !isProductPage) {
            setStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e) => {
        // Only handle pull if we're at the top of the page and not on a product page
        if (!isAtTop || isProductPage) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > 0) {
            setPullDistance(distance);
            if (distance > 150) {
                setShowArrow(true);
            } else {
                setShowArrow(false);
            }
        }
    };

    const handleTouchEnd = () => {
        // Only handle refresh if we're at the top, arrow is shown, and not on a product page
        if (isAtTop && showArrow && !isProductPage) {
            const urlWithoutParams = window.location.origin + window.location.pathname;
            window.history.replaceState(null, '', urlWithoutParams);
            window.location.reload();
        }
        setPullDistance(0);
        setShowArrow(false);
    };

    useEffect(() => {
        // Initial checks
        checkIfAtTop();
        checkIfProductPage();

        // Add scroll listener to update top status
        window.addEventListener('scroll', checkIfAtTop);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        // Add route change listener
        const handleRouteChange = () => {
            checkIfProductPage();
        };
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('scroll', checkIfAtTop);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [startY, showArrow, isAtTop, isProductPage]);

    // Don't render anything if we're on a product page
    if (isProductPage) return null;

    return (
        <div style={{ height: 'auto', padding: '10px', position: 'relative' }}>
            {showArrow && (
                <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', fontSize: '24px', background: 'lightgray', borderRadius: '50%', padding: '10px', width: '40px', display: 'flex', justifyContent: 'center', color: 'red', alignItems: 'center', height: '40px', zIndex: 1000, transition: 'opacity 0.3s' }}>
                    ↓
                </div>
            )}
        </div>
    );
};

export default PullDownRefresh;