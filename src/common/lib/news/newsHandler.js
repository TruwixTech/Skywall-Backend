import newsHelper from '../../helpers/news.helper';
import { v2 as cloudinary } from "cloudinary";

export async function addNewNewsHandler(input) {
    return await newsHelper.addObject(input);
}

export async function addNewNewsHandlerV2(input) {
    let imageUrls = [];

    // Upload images to Cloudinary
    if (input.files && input.files.length > 0) {
        for (const image of input.files) {
            try {
                const result = await cloudinary.uploader.upload(image.path, {
                    folder: "news", // Store images in "news" folder on Cloudinary
                });
                imageUrls.push(result.secure_url);
            } catch (err) {
                console.error("Cloudinary Upload Error:", err);
            }
        }
    }

    // Add image URLs to the input data
    input.image = imageUrls;

    return await newsHelper.addObject(input);
}


export async function getNewsDetailsHandler(input) {
    return await newsHelper.getObjectById(input);
}

export async function updateNewsDetailsHandler(input) {
    return await newsHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function updateNewsDetailsHandlerV2(input) {
    return await newsHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getNewsListHandler(input) {
    const list = await newsHelper.getAllObjects(input);
    const count = await newsHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteNewsHandler(input) {
    return await newsHelper.deleteObjectById(input);
}

export async function getNewsByQueryHandler(input) {
    return await newsHelper.getObjectByQuery(input);
}  
