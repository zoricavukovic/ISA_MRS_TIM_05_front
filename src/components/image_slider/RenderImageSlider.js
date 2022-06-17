import React from "react";
import ImageSlider from "./ImageSlider";
import CardMedia from '@mui/material/CardMedia';
import { URL_PICTURE_PATH } from "../../service/PictureService";

export default function RenderImageSlider(props) {
    return (
        <div>
            {props.pictures.length === 0 ? (
                <CardMedia
                    component="img"
                    height="300"
                    alt="No Images"
                />
            ) : (
                <div>
                    {
                        props.pictures.length > 1 ?
                            (
                                <ImageSlider imageHeight="60vh" slides={props.pictures.map((im) => ({ 'image': URL_PICTURE_PATH + im.picturePath }))} />
                            ) :
                            (
                                <CardMedia
                                    component="img"
                                    style={{ height: "60vh" }}
                                    alt="No Images"
                                    image={URL_PICTURE_PATH + props.pictures[0].picturePath}
                                >
                                </CardMedia>
                            )
                    }
                </div>
            )}
        </div>);
}
