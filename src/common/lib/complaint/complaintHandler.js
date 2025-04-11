import complaintHelper from '../../helpers/complaint.helper';

export async function addNewComplaintHandler(input) {
    return await complaintHelper.addObject(input);
}

export async function getComplaintDetailsHandler(input) {
    return await complaintHelper.getObjectById(input);
}

export async function updateComplaintDetailsHandler(input) {
    return await complaintHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getComplaintListHandler(input) {
    const list = await complaintHelper.getAllObjects(input);
    const count = await complaintHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteComplaintHandler(input) {
    return await complaintHelper.deleteObjectById(input);
}

export async function getComplaintByQueryHandler(input) {
    return await complaintHelper.getObjectByQuery(input);
}  
