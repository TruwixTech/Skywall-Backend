import productHelper from '../../helpers/product.helper';

export async function addNewProductHandler(input) {
    return await productHelper.addObject(input);
}

export async function getProductDetailsHandler(input) {
    return await productHelper.getObjectById(input);
}

export async function updateProductDetailsHandler(input) {
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
