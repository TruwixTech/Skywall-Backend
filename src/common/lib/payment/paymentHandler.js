import paymentHelper from '../../helpers/payment.helper';

export async function addNewPaymentHandler(input) {
    return await paymentHelper.addObject(input);
}

export async function getPaymentDetailsHandler(input) {
    return await paymentHelper.getObjectById(input);
}

export async function updatePaymentDetailsHandler(input) {
    return await paymentHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getPaymentListHandler(input) {
    const list = await paymentHelper.getAllObjects(input);
    const count = await paymentHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deletePaymentHandler(input) {
    return await paymentHelper.deleteObjectById(input);
}

export async function getPaymentByQueryHandler(input) {
    return await paymentHelper.getObjectByQuery(input);
}  
