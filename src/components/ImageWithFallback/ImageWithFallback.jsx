import React, { useState } from "react"; // Add useState import
import { fixUrl } from "../../helpers/helpers";

function ImageWithFallback({ url, name }) {
    const [imageError, setImageError] = useState(false);

    return (
        <>
            {fixUrl(url) && !imageError ? (
                <img
                    className="category-image"
                    src={fixUrl(url)}
                    alt={name || ""}
                    onError={() => setImageError(true)}
                />
            ) : (
                <div
                    className="category-image"
                    style={{
                        fontSize: '25px',
                        fontWeight: '600',
                        color: '#fff',
                    }}
                >
                    {name?.charAt(0)}
                </div>
            )}
        </>
    );
}

export default ImageWithFallback;