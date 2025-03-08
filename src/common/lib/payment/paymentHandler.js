import paymentHelper from '../../helpers/payment.helper';
import order from '../../models/order';
import {mailsend_details} from '../../util/utilHelper'
import { mail } from '../auth/authHandler';
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

export async function checkPaymentCompletionHandler(paymentId)
{
    try {
        const payment = await paymentHelper.getObjectById(paymentId);
        const order = await order.getOrderById(payment.orderId);
        if (!payment) {
            return { success: false, message: 'Payment not found' };
        }
        if (payment.status === PAYMENT_COMPLETED) {
            let template="order";
            let mail_subject = "Order Confirmation";
            const resp = await mailsend_details(order,template,order.name,mail_subject);
            return { success: true, message: 'Payment is completed' };
        } 
        else {
            return { success: false, message: 'Payment is not completed' };
        }
    } catch (error) {
        return { success: false, message: 'Error checking payment status', error: error.message };
    }
}

export async function deletePaymentHandler(input) {
    return await paymentHelper.deleteObjectById(input);
}

export async function getPaymentByQueryHandler(input) {
    return await paymentHelper.getObjectByQuery(input);
}  
