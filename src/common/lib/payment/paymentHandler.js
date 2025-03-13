import paymentHelper from '../../helpers/payment.helper';
import { mailsend_details } from '../../util/utilHelper'
import { PAYMENT_COMPLETED, PENDING } from '../../constants/enum';
import { processPayment } from '../../../util/razorpay';
import configVariables from '../../../server/config';
import crypto from 'crypto'
import moment from 'moment-timezone';
import orderHelper from '../../helpers/order.helper';

export async function addNewPaymentHandler(input) {
    return await processPayment(input.amount);
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

export async function verifyPayment(orderData) {
    try {
        const {
            orderId,
            paymentId,
            signature,
            amount,
            name,
            email,
            shipping,
            items,
            userId,
            zip,
            city,
            address
        } = orderData

        const secretKey = process.env.RAZORPAY_KEY_SECRET || configVariables.RAZORPAY_KEY_SECRET

        const hmac = crypto.createHmac("sha256", secretKey)

        hmac.update(orderId + "|" + paymentId)

        const generatedSignature = hmac.digest("hex")

        if (generatedSignature === signature) {
            const products = items.map(item => {
                const { quantity, warranty_months, product } = item;

                // Default warranty period (assumed it's always present)
                const defaultWarranty = item.product.warranty_months || 0;

                // Extended warranty from the user
                const extendedWarranty = warranty_months || 0;

                // Total warranty (default + extended)
                const totalWarranty = defaultWarranty + extendedWarranty;

                // Calculate warranty expiry date in IST
                const warrantyExpiryDate = moment()
                    .tz("Asia/Kolkata")
                    .add(totalWarranty, "months")
                    .toDate();

                return {
                    product_id: product._id,
                    quantity,
                    extended_warranty: extendedWarranty,
                    total_warranty: totalWarranty,
                    warranty_expiry_date: warrantyExpiryDate
                };
            });
            const data = {
                user_id: userId,
                totalPrice: amount,
                shippingAddress: address,
                shippingCost: shipping,
                email,
                pincode: zip,
                name,
                city,
                status: PENDING,
                products
                // also add expected delivery later
            }

            const order = await orderHelper.addObject(data)

            const paymentData = {
                orderId: order._id,
                amount,
                status: PAYMENT_COMPLETED,
                userId
            }

            // const populatedOrder = await Order.findById(order._id).populate('products.product_id')
            let filter = {}
            filter.id = order._id
            filter.populatedQuery = [
                {
                    model: "Product",
                    path: "products.product_id",
                    select: {},
                },
            ]
            const populatedOrder = await orderHelper.getObjectById(filter)

            // await Payment.create(paymentData)
            await paymentHelper.addObject(paymentData)

            let template = "order";
            let mail_subject = "Order Confirmation";
            const input = {
                app_details: populatedOrder,
                templateName: template,
                email,
                subject_input: mail_subject
            }
            await mailsend_details(input);
            return { success: true, message: 'Order and Payment created successfully' }
        } else {
            console.log("Payment Verification Failed")
            throw "Payment Verification Failed"
        }
    } catch (error) {
        console.error("Error creating order and payment", error);
        throw error;
    }
}

export async function deletePaymentHandler(input) {
    return await paymentHelper.deleteObjectById(input);
}

export async function getPaymentByQueryHandler(input) {
    return await paymentHelper.getObjectByQuery(input);
}  
