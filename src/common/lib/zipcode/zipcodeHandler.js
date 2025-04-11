import zipcodeHelper from '../../helpers/zipcode.helper';

export async function addNewZipcodeHandler(input) {
    return await zipcodeHelper.addObject(input);
}
export async function getZipcodeHandler(input) {
    try {
        const {zipcode} = input;
        const zipcodeData = await zipcodeHelper.getObjectByQuery({
            query: { zipcode: input.zipcode },
          })
        if (zipcodeData) {
            return { exists: true, data: zipcodeData };
        }
        const allZipcodes = await zipcodeHelper.getAllObjects({ selectFrom: "zipcode" });
        const zipcodesList = allZipcodes.map(z => z.zipcode);
            
        // Sort zipcodes
        const sortedZipcodes = [...zipcodesList].sort((a, b) => a - b);
        const index = sortedZipcodes.indexOf(zipcode);
        
        if (index === -1) {
            sortedZipcodes.push(zipcode);
            sortedZipcodes.sort((a, b) => a - b);
        }
        
        const newIndex = sortedZipcodes.indexOf(zipcode);
        const beforeThree = sortedZipcodes.slice(Math.max(0, newIndex - 3), newIndex);
        const afterThree = sortedZipcodes.slice(newIndex + 1, newIndex + 4);
        
        // Fetch full data for these zipcodes
        const beforeData = await zipcodeHelper.getAllObjects({ query: { zipcode: { $in: beforeThree } } });
        const afterData = await zipcodeHelper.getAllObjects({ query: { zipcode: { $in: afterThree } } });
        
        return {
            exists: false,
            beforeFive: beforeData,
            afterFive: afterData
        };
    } catch (error) {
        throw error
    }


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
