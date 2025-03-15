import wholesaleProductsHelper from '../../helpers/wholesaleProducts.helper';

export async function addNewWholesaleProductsHandler(input) {
    return await wholesaleProductsHelper.addObject(input);
}

export async function getWholesaleProductsDetailsHandler(input) {
    return await wholesaleProductsHelper.getObjectById(input);
}

export async function updateWholesaleProductsDetailsHandler(input) {
    return await wholesaleProductsHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getWholesaleProductsListHandler(input) {
    const list = await wholesaleProductsHelper.getAllObjects(input);
    const count = await wholesaleProductsHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteWholesaleProductsHandler(input) {
    return await wholesaleProductsHelper.deleteObjectById(input);
}

export async function getWholesaleProductsByQueryHandler(input) {
    return await wholesaleProductsHelper.getObjectByQuery(input);
}  
