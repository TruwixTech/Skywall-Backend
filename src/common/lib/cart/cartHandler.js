import cartHelper from '../../helpers/cart.helper';
import productHelper from '../../helpers/product.helper';
import userHelper from '../../helpers/user.helper';
import Pincode from 'pincode-distance';
import { getDistanceByPincode, getDistance} from '../shipping/shippingHandler';

export async function addNewCartHandler(input) {
    return await cartHelper.addObject(input);
}

export async function getCartDetailsHandler(input) {
    return await cartHelper.getObjectById(input);
}

export async function updateCartDetailsHandler(input) {
    return await cartHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getCartListHandler(input) {
    const list = await cartHelper.getAllObjects(input);
    const count = await cartHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteCartHandler(input) {
    return await cartHelper.deleteObjectById(input);
}

export async function getCartByQueryHandler(input) {
    return await cartHelper.getObjectByQuery(input);
}  

export async function getCartTotalCostHandler(userId_input, pinCode, pinCodeTo) {
    try {
      const cart = await cartHelper.getObjectByQuery({ query: { user: userId_input } }).populate('items.product');
      if (!cart) {
        return { success: false, error: "Cart not found" };
      }
  
      console.log("Cart Details:", JSON.stringify(cart, null, 2));
      const products = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));
      console.log("Products:", JSON.stringify(products, null, 2));
  
      let totalPrice = 0;
      let shippingCost = 0;
      const Pincode_ = new Pincode();
      console.log("Flag 1");
      const distance = Pincode_.getDistance(pinCode, pinCodeTo);
      console.log("Flag 2");
  
      for (let i = 0; i < products.length; i++) {
        console.log("Product ID:", products[i].product);
        const product = await productHelper.getObjectById(products[i].product);
        if (!product) {
          return { success: false, error: "Product not found" };
        }
        totalPrice += product.price * products[i].quantity;
      }
  
      console.log("Total Price Details:", totalPrice);
      console.log("pinCode Details:", pinCode);
      console.log("pinCodeTo Details:", pinCodeTo);
  
      const totalCost = {
        totalCost: totalPrice,
        shippingCost: shippingCost,
        distance: distance,
        productCost: totalPrice,
        finalCost: totalPrice + shippingCost,
      };
  
      return { success: true, data: totalCost };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  }