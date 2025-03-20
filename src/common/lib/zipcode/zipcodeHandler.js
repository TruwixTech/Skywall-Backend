import zipcodeHelper from '../../helpers/zipcode.helper';

export async function addNewZipcodeHandler(input) {
    return await zipcodeHelper.addObject(input);
}

export async function getZipcodeDetailsHandler(input) {
    return await zipcodeHelper.getObjectById(input);
}

export async function updateZipcodeDetailsHandler(input) {
    return await zipcodeHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getZipcodeListHandler(input) {
    const list = await zipcodeHelper.getAllObjects(input);
    const count = await zipcodeHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteZipcodeHandler(input) {
    return await zipcodeHelper.deleteObjectById(input);
}

export async function getZipcodeByQueryHandler(input) {
    return await zipcodeHelper.getObjectByQuery(input);
}  
