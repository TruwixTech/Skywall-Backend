import orderHelper from '../../helpers/order.helper';

export async function addNewOrderHandler(input) {
    return await orderHelper.addObject(input);
}

export async function getOrderDetailsHandler(input) {
    return await orderHelper.getObjectById(input);
}

export async function updateOrderDetailsHandler(input) {
    return await orderHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getOrderListHandler(input) {
    const list = await orderHelper.getAllObjects(input);
    const count = await orderHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteOrderHandler(input) {
    return await orderHelper.deleteObjectById(input);
}

export async function getOrderByQueryHandler(input) {
    return await orderHelper.getObjectByQuery(input);
}  
