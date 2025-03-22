import invoiceHelper from '../../helpers/invoice.helper';
import orderHelper from '../../helpers/order.helper';
import zipcodeHelper from '../../helpers/zipcode.helper';
import { v4 as uuidv4 } from 'uuid';
import { sendInvoiceEmail } from '../../util/utilHelper';

export async function addNewOrderHandler(input) {
    return await orderHelper.addObject(input);
}

export async function getOrderDetailsHandler(input) {
    return await orderHelper.getObjectById(input);
}

export async function updateOrderDetailsHandler(input) {
    const { status, order } = input.updateObject
    if (input.updateObject.status === "Delivered") {
        const formattedProducts = order.products.map(product => ({
            product: product.product_id, // Assuming it's an ObjectId reference
            quantity: product.quantity,
            warranty_expiry_date: product.warranty_expiry_date || null,
            extendedWarrantyDuration: product.extended_warranty || 0,
            totalWarranty: product.total_warranty || 0,
        }));

        const data = {
            invoiceNumber: `INV-${uuidv4()}`,
            order_Id: input.objectId,
            user_Id: order.user_id,
            amount: order.totalPrice,
            items: formattedProducts,
        }

        // Create invoice
        const createdInvoice = await invoiceHelper.addObject(data);

        const populatedQuery = {
            id: createdInvoice._id,
            populatedQuery: {
                path: 'items.product user_Id order_Id',
            }
        }

        const populatedInvoice = await invoiceHelper.getObjectById(populatedQuery);
        await sendInvoiceEmail(populatedInvoice.user_Id.email, populatedInvoice);
    }

    const updateObject2 = { status }

    return await orderHelper.directUpdateObject(input.objectId, updateObject2);
}

export async function getOrderListHandler(input) {
    const list = await orderHelper.getAllObjects(input);

    // Iterate over each order and fetch zipcode data dynamically
    for (let order of list) {
        if (order.pincode) {
            // Fetch zipcode details for each order's pincode
            const zipcodeData = await zipcodeHelper.getObjectByQuery({
                query: { zipcode: order.pincode },
                selectFrom: "facilityState returnCenter originCenter dispatchCenter facilityCity"
            });

            // If zipcode data is found, add the fields to the order
            if (zipcodeData) {
                order.facilityState = zipcodeData.facilityState;
                order.returnCenter = zipcodeData.returnCenter;
                order.originCenter = zipcodeData.originCenter;
                order.dispatchCenter = zipcodeData.dispatchCenter;
                order.facilityCity = zipcodeData.facilityCity;
            } else {
                // Assign null if no matching zipcode data is found
                order.facilityState = null;
                order.returnCenter = null;
                order.originCenter = null;
                order.dispatchCenter = null;
                order.facilityCity = null;
            }
        }
    }

    // Get total count of orders
    const count = await orderHelper.getAllObjectCount(input);

    return { list, count };
}

export async function deleteOrderHandler(input) {
    return await orderHelper.deleteObjectById(input);
}

export async function getOrderByQueryHandler(input) {
    return await orderHelper.getObjectByQuery(input);
}  
