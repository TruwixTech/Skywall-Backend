import paymentHelper from '../../helpers/payment.helper';
import Order from '../../models/order';
import Payment from '../../models/payment';
import {mailsend_details} from '../../util/utilHelper'
import { mail } from '../auth/authHandler';
import { PAYMENT_COMPLETED } from '../../constants/enum';

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

export async function processPaymentOrder(orderData,paymentData)
{
    try {
        //create order and payment objects and save them  
        const order = new Order(orderData);
        await order.save();
        // Create and save the payment object
        const payment = new Payment({
            orderId: order._id,
            amount: paymentData.amount,
            payment_method: paymentData.payment_method,
            currency: paymentData.currency,
            status: PAYMENT_COMPLETED, 
            userId: paymentData.userId,
        });
        await payment.save();

        let template="order";
        let mail_subject = "Order Confirmation";
        const resp = await mailsend_details(order,template,order.email,mail_subject);
        return { success: true, message: 'Order and Payment created successfully', data: resp };
        
    } catch (error) {
        return { success: false, message: 'Error creating order and payment', error: error.message };
    }
}

export async function deletePaymentHandler(input) {
    return await paymentHelper.deleteObjectById(input);
}

export async function getPaymentByQueryHandler(input) {
    return await paymentHelper.getObjectByQuery(input);
}  
