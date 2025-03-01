import couponHelper from '../../helpers/coupon.helper';

export async function addNewCouponHandler(input) {
    return await couponHelper.addObject(input);
}

export async function getCouponDetailsHandler(input) {
    return await couponHelper.getObjectById(input);
}

export async function updateCouponDetailsHandler(input) {
    return await couponHelper.directUpdateObject(input.objectId, input.updateObject);
}

export async function getCouponListHandler(input) {
    const list = await couponHelper.getAllObjects(input);
    const count = await couponHelper.getAllObjectCount(input);
    return { list, count };
}

export async function deleteCouponHandler(input) {
    return await couponHelper.deleteObjectById(input);
}

export async function getCouponByQueryHandler(input) {
    return await couponHelper.getObjectByQuery(input);
}  

export async function createCouponHandler(input) {
    const {code} = input;
    const existingCoupon = await couponHelper.getObjectByQuery({ query: { code } });
    if (existingCoupon) {
        throw new Error('Coupon with this code already exists');
    }

    return await couponHelper.addObject(input);
}