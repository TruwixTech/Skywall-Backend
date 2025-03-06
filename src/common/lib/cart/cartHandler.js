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
        updatedItems[existingItemIndex].warranty_months = newItem.warranty_months;
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
    const carts = await cartHelper.getAllObjects({
      query: { user: userId_input },
      populatedQuery: 'items.product'
    });

    if (!carts || !Array.isArray(carts) || carts.length === 0) {
      return { success: false, error: "Cart not found" };
    }

    const cart = carts[0];
    if (!cart.items || !Array.isArray(cart.items)) {
      return { success: false, error: "Cart items not found" };
    }

    let totalPrice = 0;
    for (const item of cart.items) {
      if (!item.product) {
        continue;
      }
      totalPrice += item.product.price * item.quantity;
    }

    return { success: true, data: totalPrice };
  } catch (error) {
    console.error("Error in getCartTotalCostHandler:", error);
    throw error;
  }
}


export async function deleteSingleProductFromCartHandler(cartId, input) {
  try {
    const { productId } = input;

    // Update the cart by removing the product from the `items` array
    await cartHelper.directUpdateObject(cartId, {
      $pull: { items: { product: productId } }
    })

    return { success: true, data: "Product removed from cart successfully" };

  } catch (error) {
    console.error("Error in deleteSingleProductFromCartHandler:", error);
    throw error;
  }
}