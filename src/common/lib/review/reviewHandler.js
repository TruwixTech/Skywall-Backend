import reviewHelper from '../../helpers/review.helper';

export async function addNewReviewHandler(input) {
    return await reviewHelper.addObject(input);
}

export async function getReviewDetailsHandler(input) {
    return await reviewHelper.getObjectById(input);
}

export async function updateReviewDetailsHandler(input) {
    return await reviewHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getReviewListHandler(input) {
    const list = await reviewHelper.getAllObjects(input);
    const count = await reviewHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteReviewHandler(input) {
    return await reviewHelper.deleteObjectById(input);
}

export async function getReviewByQueryHandler(input) {
    return await reviewHelper.getObjectByQuery(input);
}  
