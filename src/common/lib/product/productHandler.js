import productHelper from "../../helpers/product.helper";
import { v2 as cloudinary } from "cloudinary";


export async function addNewProductHandler(input) {
  return await productHelper.addObject(input);
}

function calculateDiscountedPrice(price, discountPercentage) {
  if (price < 0 || discountPercentage < 0 || discountPercentage > 100) {
      throw new Error("Invalid price or discount percentage");
  }

  const discountAmount = (price * discountPercentage) / 100;
  const newPrice = price - discountAmount;
  
  return newPrice.toFixed(2); // Returns price rounded to 2 decimal places
}

export async function addNewProductHandlerV2(input) {
  let imageUrls = [];
  let new_price = calculateDiscountedPrice(input.price, input.discount_percentage);
  // Upload images to Cloudinary
  if (input.images && input.images.length > 0) {
    for (const image of input.images) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "products",
      });
      imageUrls.push(result.secure_url);
    }
  }
  // Add image URLs to the product input
  input.image = imageUrls;
  input.new_price = new_price;
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
