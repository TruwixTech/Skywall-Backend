import productHelper from "../../helpers/product.helper";
const cloudinary = require("cloudinary").v2;

export async function addNewProductHandler(input) {
  return await productHelper.addObject(input);
}

export async function addNewProductHandlerV2(input) {
  console.log("images here ", input.images);
  let imageUrls = [];
  // Upload images to Cloudinary
  if (input.images && input.images.length > 0) {
    for (const image of input.images) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "products",
      });
      imageUrls.push(result.secure_url);
    }
  }
  console.log("imageUrls : ", imageUrls);
  // Add image URLs to the product input
  input.image = imageUrls;
  console.log("Last Input", input);
  return await productHelper.addObject(input);
}

export async function getProductDetailsHandler(input) {
  return await productHelper.getObjectById(input);
}

export async function updateProductDetailsHandler(input) {
  return await productHelper.directUpdateObject(
    input.objectId,
    input.updateObject
  );
}

export async function getProductListHandler(input) {
  const list = await productHelper.getAllObjects(input);
  const count = await productHelper.getAllObjectCount(input);
  return { list, count };
}

export async function deleteProductHandler(input) {
  return await productHelper.deleteObjectById(input);
}

export async function getProductByQueryHandler(input) {
  return await productHelper.getObjectByQuery(input);
}
