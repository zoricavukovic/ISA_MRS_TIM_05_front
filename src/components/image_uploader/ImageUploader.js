import React from "react";
import ImageUploading from "react-images-uploading";
import styles from './image_uploading.module.css';

export default function ImageUploader(props) {
    return (
        <ImageUploading
            multiple
            value={props.images}
            onChange={props.onChange}
            maxNumber={props.maxNumber}
            dataURLKey="data_url"
        >
            {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps
            }) => (
                <div className={styles.imageContainer}>
                    <div className={styles.addDeleteAllBtnWrapper}>
                        <button
                            className={styles.imageButton}
                            style={isDragging ? { color: "red" } : null}
                            onClick={onImageUpload}
                            {...dragProps}
                        >
                            Click or Drop here
                        </button>
                        &nbsp;
                        <button className={styles.imageButton} onClick={onImageRemoveAll}>Remove all images</button>
                    </div>
                    {imageList.map((image, index) => (
                        <div key={index} className={styles.imageItem}>
                            <div className={styles.imageScaled}>
                                <img src={image.data_url} alt="" width="200" />    
                            </div>
                            <div className={styles.imageItemBtnWrapper}>
                                <button className={styles.imageButton} onClick={() => onImageUpdate(index)}>Update</button>
                                <button className={styles.imageButton} onClick={() => onImageRemove(index)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ImageUploading>
    )
}