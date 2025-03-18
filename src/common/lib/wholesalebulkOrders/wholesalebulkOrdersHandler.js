import wholesalebulkOrdersHelper from '../../helpers/wholesalebulkOrders.helper';

export async function addNewWholesalebulkOrdersHandler(input) {
    return await wholesalebulkOrdersHelper.addObject(input);
}

export async function getWholesalebulkOrdersDetailsHandler(input) {
    return await wholesalebulkOrdersHelper.getObjectById(input);
}

export async function updateWholesalebulkOrdersDetailsHandler(input) {
    return await wholesalebulkOrdersHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getWholesalebulkOrdersListHandler(input) {
    const list = await wholesalebulkOrdersHelper.getAllObjects(input);
    const count = await wholesalebulkOrdersHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteWholesalebulkOrdersHandler(input) {
    return await wholesalebulkOrdersHelper.deleteObjectById(input);
}

export async function getWholesalebulkOrdersByQueryHandler(input) {
    return await wholesalebulkOrdersHelper.getObjectByQuery(input);
}  
