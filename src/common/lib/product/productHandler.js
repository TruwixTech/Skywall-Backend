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
  if (typeof input.specificationSchema === "string") {
    let parsedSpecs = JSON.parse(input.specificationSchema);
    // Remove empty objects
    input.specificationSchema = parsedSpecs.filter(
      spec => spec.title.trim() !== "" && spec.key.trim() !== "" && spec.value.trim() !== ""
    );
  }

  if (typeof input.highlights === "string") {
    input.highlights = JSON.parse(input.highlights);
  }

  // Add file paths to product data
  if (input.files.img) {
    input.images = input.files.img.map(file => ({ path: file.path }));
  }

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
  if (!isNaN(new_price) && new_price !== null && new_price !== undefined) {
    input.new_price = new_price;
  }

  return await productHelper.addObject(input);
}

export async function updateWarrantyPriceHandler(productId, input_Warranty_months) {
  const product = await productHelper.getObjectById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  const warrantyPricing = product.warranty_pricing[input_Warranty_months.toString()];
  if (!warrantyPricing) {
    throw new Error("Invalid warranty months");
  }
  const newPrice = product.price + warrantyPricing;
  const new_Warranty_months = product.warranty_months + input_Warranty_months;
  product.new_price = newPrice;
  product.warranty_months = new_Warranty_months;

  return await productHelper.updateObject(productId.id, product);
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

export async function updateProductv2Handler(input) {
  
  const filters = {
    id: input.objectId
  };
  
  const existingProduct = await productHelper.getObjectById(filters);
  
  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // Handle specificationSchema - Parse and assign to the updateObject
  if (input.updateObject.specificationSchema && typeof input.updateObject.specificationSchema === "string") {
    input.updateObject.specificationSchema = JSON.parse(input.updateObject.specificationSchema);
  }

  // Handle highlights - Parse and assign to the updateObject
  if (input.updateObject.highlights && typeof input.updateObject.highlights === "string") {
    input.updateObject.highlights = JSON.parse(input.updateObject.highlights);
  }

  if (input.files && input.files.img) {
    input.images = input.files.img.map(file => ({ path: file.path }));
  }

  let imageUrls = existingProduct.image || [];
  let new_price = calculateDiscountedPrice(input.updateObject.price, input.updateObject.discount_percentage);

  // Upload new images to Cloudinary and append to existing images
  if (input.images && input.images.length > 0) {
    for (const image of input.images) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "products",
      });
      imageUrls.push(result.secure_url);
    }
  }

  // Add image URLs to the product input
  input.updateObject.image = imageUrls;
  if (!isNaN(new_price) && new_price !== null && new_price !== undefined) {
    input.updateObject.new_price = new_price;
  }

  // Use the string ID for directUpdateObject
  return await productHelper.directUpdateObject(input.objectId, input.updateObject);
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
