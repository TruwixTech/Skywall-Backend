import cartHelper from '../../helpers/cart.helper';
import productHelper from '../../helpers/product.helper';
import userHelper from '../../helpers/user.helper';
import Pincode from 'pincode-distance';

export async function addNewCartHandler(input) {
    const cart = await cartHelper.getObjectByQuery({ query: { user: input.user } });
    if (cart) {
        // Update the existing cart with the new details
        const updatedItems = [...cart.items];
        input.items.forEach(newItem => {
            const existingItemIndex = updatedItems.findIndex(item => item.product.toString() === newItem.product.toString());
            if (existingItemIndex !== -1) {
                // Update the quantity of the existing product
                updatedItems[existingItemIndex].quantity += newItem.quantity;
            } else {
                // Add the new product to the cart
                updatedItems.push(newItem);
            }
        });

        const updatedCart = {
            ...cart,
            items: updatedItems,
            updatedAt: new Date()
        };
        return await cartHelper.directUpdateObject(cart._id, updatedCart);
    } else {
        return await cartHelper.addObject(input);
    }
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

export async function getCartTotalCostHandler(userId_input) {
    try {
      const cart = await cartHelper.getObjectByQuery({ query: { user: userId_input } });
      if (!cart) {
        return { success: false, error: "Cart not found" };
      }
      const products = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));
      let totalPrice = 0;
      for (let i = 0; i < products.length; i++) {
        const obj_Id = products[i].product;
        const product = await productHelper.getObjectById(obj_Id);
        if (!product) {
          return { success: false, error: "Product not found" };
        }
        totalPrice += product.price * products[i].quantity;
      }
      return { success: true, data: totalPrice };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
}