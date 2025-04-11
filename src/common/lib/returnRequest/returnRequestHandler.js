import { PAYMENT_REFUNDED, RETURNED } from '../../constants/enum';
import orderHelper from '../../helpers/order.helper';
import paymentHelper from '../../helpers/payment.helper';
import returnRequestHelper from '../../helpers/returnRequest.helper';

export async function addNewReturnRequestHandler(input) {
    return await returnRequestHelper.addObject(input);
}

export async function addNewReturnRequestHandlerV2(input) {

    await orderHelper.directUpdateObject(input.order_id, { return_request: true });

    const payment = await paymentHelper.getObjectByQuery({ orderId: input.order_id });

    const data = { ...input, payment_id: payment._id };

    return await returnRequestHelper.addObject(data);
}

export async function getReturnRequestDetailsHandler(input) {
    return await returnRequestHelper.getObjectById(input);
}

export async function updateReturnRequestDetailsHandler(input) {
    if (input.updateObject.refund_status) {
        await orderHelper.directUpdateObject(input.updateObject.data.order_id._id, { status: RETURNED });
        await paymentHelper.directUpdateObject(input.updateObject.data.payment_id, { status: PAYMENT_REFUNDED });
    }
    return await returnRequestHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getReturnRequestListHandler(input) {
    const list = await returnRequestHelper.getAllObjects(input);
    const count = await returnRequestHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteReturnRequestHandler(input) {
    return await returnRequestHelper.deleteObjectById(input);
}

export async function getReturnRequestByQueryHandler(input) {
    return await returnRequestHelper.getObjectByQuery(input);
}  
