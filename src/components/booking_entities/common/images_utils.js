import { dataURLtoFile } from "../../../service/PictureService";


export const MAX_NUMBER_OF_IMAGES_TO_UPLOAD = 50;


export const _getImagesInJsonBase64 = (images) => {
    if (images.length === 0) {
        return [];
    }
    let retVal = [];

    for (let img of images) {
        retVal.push({
            imageName: img.file.name,
            dataBase64: getBase64String(img.data_url),
        });
    }
    return retVal;
}

const getBase64String = (data_url) => {
    return data_url.split(";")[1].split(',')[1];
}

export const _fillImageListFromBase64Images = (setImages, base64Images) => {
    let imgArray = [];
    for (let img of base64Images) {
        let imgName = img.split(',')[0];
        let mimeType = imgName.split('.')[1];
        let base64Part = img.split(',')[1];
        if (mimeType === 'jpg') {
            mimeType = 'jpeg';
        }
        let dataUrl = "data:image/" + mimeType + ";base64," + base64Part;
        let newFile = dataURLtoFile(dataUrl, imgName);
        let newImgObj = {
            data_url: dataUrl,
            file: newFile
        };
        console.log(newImgObj);
        imgArray.push(newImgObj);
    }
    setImages(imgArray);
}


