
import _ from 'lodash';
import { Router } from 'express';

import {
    addNewWholesaleProductsHandler,
    deleteWholesaleProductsHandler,
    getWholesaleProductsDetailsHandler,
    getWholesaleProductsListHandler,
    updateWholesaleProductsDetailsHandler
} from '../../common/lib/wholesaleProducts/wholesaleProductsHandler';
import responseStatus from "../../common/constants/responseStatus.json";
import responseData from "../../common/constants/responseData.json";
import protectRoutes from '../../common/util/protectRoutes';

const router = new Router();

router.route('/list').post(async (req, res) => {
    try {
        let filter = {};
        filter.query = {};

        const inputData = { ...req.body };
        if (inputData) {
            filter.pageNum = inputData.pageNum ? inputData.pageNum : 1;
            filter.pageSize = inputData.pageSize ? inputData.pageSize : 50;

            if (inputData.filters) {
                filter.query = inputData.filters;
            }
        } else {
            filter.pageNum = 1;
            filter.pageSize = 50;
        }

        filter.query = { ...filter.query };
        filter.populatedQuery = [
            {
                model: "Product",
                path: "product",
                select: {},
            },
        ];

        const outputResult = await getWholesaleProductsListHandler(filter);
        res.status(responseStatus.STATUS_SUCCESS_OK);
        res.send({
            status: responseData.SUCCESS,
            data: {
                wholesaleProductsList: outputResult.list ? outputResult.list : [],
                wholesaleProductsCount: outputResult.count ? outputResult.count : 0,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(responseStatus.INTERNAL_SERVER_ERROR);
        res.send({
            status: responseData.ERROR,
            data: { message: err },
        });
    }
});


router.route('/new').post(protectRoutes.verifyAdmin, async (req, res) => {
    try {
        if (!_.isEmpty(req.body)) {
            const outputResult = await addNewWholesaleProductsHandler(req.body);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    wholesaleProducts: outputResult ? outputResult : {}
                }
            });
        } else {
            throw 'no request body sent'
        }
    } catch (err) {
        console.log(err)
        res.status(responseStatus.INTERNAL_SERVER_ERROR);
        res.send({
            status: responseData.ERROR,
            data: { message: err }
        });
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        if (req.params.id) {
            const gotWholesaleProducts = await getWholesaleProductsDetailsHandler(req.params);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    wholesaleProducts: gotWholesaleProducts ? gotWholesaleProducts : {}
                }
            });
        } else {
            throw 'no id param sent'
        }
    } catch (err) {
        console.log(err)
        res.status(responseStatus.INTERNAL_SERVER_ERROR);
        res.send({
            status: responseData.ERROR,
            data: { message: err }
        });
    }
});

router.route('/:id/update').post(protectRoutes.verifyAdmin, async (req, res) => {
    try {
        if (!_.isEmpty(req.params.id) && !_.isEmpty(req.body)) {
            let input = {
                objectId: req.params.id,
                updateObject: req.body
            }
            const updateObjectResult = await updateWholesaleProductsDetailsHandler(input);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    wholesaleProducts: updateObjectResult ? updateObjectResult : {}
                }
            });
        } else {
            throw 'no body or id param sent'
        }
    } catch (err) {
        console.log(err)
        res.status(responseStatus.INTERNAL_SERVER_ERROR);
        res.send({
            status: responseData.ERROR,
            data: { message: err }
        });
    }
});

router.route('/:id/remove').post(protectRoutes.verifyAdmin, async (req, res) => {
    try {
        if (req.params.id) {
            const deletedWholesaleProducts = await deleteWholesaleProductsHandler(req.params.id);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    hasWholesaleProductsDeleted: true
                }
            });
        } else {
            throw 'no id param sent'
        }
    } catch (err) {
        console.log(err)
        res.status(responseStatus.INTERNAL_SERVER_ERROR);
        res.send({
            status: responseData.ERROR,
            data: { message: err }
        });
    }
});

export default router;

