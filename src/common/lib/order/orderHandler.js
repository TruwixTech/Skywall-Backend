import orderHelper from '../../helpers/order.helper';
import zipcodeHelper from '../../helpers/zipcode.helper';

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
