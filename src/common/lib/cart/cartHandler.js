import cartHelper from '../../helpers/cart.helper';

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
