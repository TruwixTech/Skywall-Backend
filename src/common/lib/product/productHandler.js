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
    try {
      let parsedSpecs = JSON.parse(input.specificationSchema);

      // Ensure it is an array before proceeding
      if (Array.isArray(parsedSpecs)) {
        input.specificationSchema = parsedSpecs
          .filter(spec =>
            typeof spec.title === "string" &&
            spec.title.trim() !== "" &&
            Array.isArray(spec.data) &&
            spec.data.length > 0
          )
          .map(spec => ({
            title: spec.title.trim(),
            data: spec.data
              .filter(item =>
                typeof item.key === "string" &&
                typeof item.value === "string" &&
                item.key.trim() !== "" &&
                item.value.trim() !== ""
              )
              .map(item => ({
                key: item.key.trim(),
                value: item.value.trim()
              }))
          }))
          .filter(spec => spec.data.length > 0); // Remove specifications with empty `data` arrays
      } else {
        input.specificationSchema = []; // Default to an empty array if it's not valid
      }
    } catch (error) {
      console.error("Error parsing specificationSchema:", error);
      input.specificationSchema = []; // Default to an empty array on error
    }
  }

  if (typeof input.highlights === "string") {
    input.highlights = JSON.parse(input.highlights);
  }

  if (typeof input.warranty_pricing === "string") {
    try {
      input.warranty_pricing = JSON.parse(input.warranty_pricing);
    } catch (error) {
      console.error("Invalid JSON in warranty_pricing:", error);
      input.warranty_pricing = {}; // Default to an empty object if parsing fails
    }
  }


  if (typeof input.warranty_pricing === "object" && input.warranty_pricing !== null) {
    Object.keys(input.warranty_pricing).forEach((key) => {
      input.warranty_pricing[key] = Number(input.warranty_pricing[key]); // Convert price values to numbers
    });
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
  
  // Handle specificationSchema
  if (input.updateObject.specificationSchema && typeof input.updateObject.specificationSchema === "string") {
    try {
      let parsedSpecs = JSON.parse(input.updateObject.specificationSchema);

      // Ensure valid structure and remove empty entries
      input.updateObject.specificationSchema = parsedSpecs
        .filter(spec =>
          typeof spec.title === "string" && spec.title.trim() !== "" &&
          Array.isArray(spec.data) && spec.data.length > 0
        )
        .map(spec => ({
          title: spec.title.trim(),
          data: (Array.isArray(spec.data) ? spec.data : []) // Ensure `data` is an array
            .filter(item =>
              typeof item.key === "string" && item.key.trim() !== "" &&
              typeof item.value === "string" && item.value.trim() !== ""
            )
            .map(item => ({
              key: item.key.trim(),
              value: item.value.trim()
            }))
        }));

    } catch (error) {
      console.error("Error parsing specificationSchema:", error);
      input.updateObject.specificationSchema = []; // Set to an empty array in case of error
    }
  }


  // Handle highlights
  if (input.updateObject.highlights && typeof input.updateObject.highlights === "string") {
    input.updateObject.highlights = JSON.parse(input.updateObject.highlights);
  }

  // Handle warranty_pricing correctly
  if (input.updateObject.warranty_pricing && typeof input.updateObject.warranty_pricing === "string") {
    try {
      input.updateObject.warranty_pricing = JSON.parse(input.updateObject.warranty_pricing);
    } catch (error) {
      console.error("Invalid JSON in warranty_pricing:", error);
      input.updateObject.warranty_pricing = {}; // Default to empty object if parsing fails
    }
  }

  if (typeof input.updateObject.warranty_pricing === "object" && input.updateObject.warranty_pricing !== null) {
    Object.keys(input.updateObject.warranty_pricing).forEach((key) => {
      input.updateObject.warranty_pricing[key] = Number(input.updateObject.warranty_pricing[key]); // Convert values to numbers
    });
  }

  // Parse existingImages properly
  let existingImages = existingProduct.image || [];
  if (input.updateObject.existingImages && typeof input.updateObject.existingImages === "string") {
    try {
      existingImages = JSON.parse(input.updateObject.existingImages);
    } catch (error) {
      console.error("Invalid JSON in existingImages:", error);
    }
  }

  // Handle new images
  let newImages = [];
  if (input.files && input.files.img) {
    newImages = input.files.img.map(file => ({ path: file.path }));
  }

  // Upload new images to Cloudinary and merge with existing ones
  let imageUrls = [...existingImages];
  if (newImages.length > 0) {
    for (const image of newImages) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "products",
      });
      imageUrls.push(result.secure_url);
    }
  }

  // Update the product with the merged image list
  input.updateObject.image = imageUrls;

  // Calculate new price
  let new_price = calculateDiscountedPrice(input.updateObject.price, input.updateObject.discount_percentage);
  if (!isNaN(new_price) && new_price !== null && new_price !== undefined) {
    input.updateObject.new_price = new_price;
  }
  // Perform the update operation
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
