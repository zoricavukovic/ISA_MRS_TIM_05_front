import React from "react";
import Forbidden403Img from "../../icons/Forbidden403.jpg";

export default function ForbiddenPage403() {
    return (
        <div style={{
            backgroundImage: `url(${Forbidden403Img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh'}}>
        </div>
    );
}