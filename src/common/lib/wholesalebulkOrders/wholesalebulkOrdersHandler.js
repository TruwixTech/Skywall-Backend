import wholesalebulkOrdersHelper from '../../helpers/wholesalebulkOrders.helper';
import { mailsend_details_bulkorder } from '../../util/utilHelper';

export async function addNewWholesalebulkOrdersHandler(input) {
    const response = await wholesalebulkOrdersHelper.addObject(input);

    let filter = {}
    filter.id = response._id
    filter.populatedQuery = [
        {
            model: "Product",
            path: "products.product_id",
            select: {},
        },
    ]
    const populatedOrder = await wholesalebulkOrdersHelper.getObjectById(filter)

    let template = "bulkorder";
    let mail_subject = "Bulk Order Confirmation";
    const input2 = {
        app_details: populatedOrder,
        templateName: template,
        email: input.email,
        subject_input: mail_subject
    }
    await mailsend_details_bulkorder(input2);
    return response
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
