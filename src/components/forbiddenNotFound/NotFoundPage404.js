import React from "react";
import NotFoundPage404Img from "../../icons/NotFoundPage404.jpg";

export default function NotFoundPage404() {
    return (
        <div style={{
            backgroundImage: `url(${NotFoundPage404Img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh'}}>
        </div>
    );
}