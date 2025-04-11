
import _ from 'lodash';
import { Router } from 'express';
import multer from 'multer';
import {
    addNewNewsHandler,
    addNewNewsHandlerV2,
    deleteNewsHandler,
    getNewsDetailsHandler,
    getNewsListHandler,
    updateNewsDetailsHandler,
    updateNewsDetailsHandlerV2
} from '../../common/lib/news/newsHandler';
import responseStatus from "../../common/constants/responseStatus.json";
import responseData from "../../common/constants/responseData.json";
import protectRoutes from '../../common/util/protectRoutes';
import { upload_image } from '../../util/S3';

const router = new Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
});


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

        const outputResult = await getNewsListHandler(filter);
        res.status(responseStatus.STATUS_SUCCESS_OK);
        res.send({
            status: responseData.SUCCESS,
            data: {
                newsList: outputResult.list ? outputResult.list : [],
                newsCount: outputResult.count ? outputResult.count : 0,
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


router.route('/new').post(async (req, res) => {
    try {
        if (!_.isEmpty(req.body)) {
            const outputResult = await addNewNewsHandler(req.body);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    news: outputResult ? outputResult : {}
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

router.route('/create').post(protectRoutes.verifyAdmin, upload.fields([{ name: "img", maxCount: 5 }]), async (req, res) => {
    try {
        if (!_.isEmpty(req.body)) {
            const files = req.files?.img || []; // Handle uploaded images
            const newsData = req.body;
            const outputResult = await addNewNewsHandlerV2({ ...newsData, files });
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    news: outputResult ? outputResult : {}
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
            const gotNews = await getNewsDetailsHandler(req.params);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    news: gotNews ? gotNews : {}
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

router.route('/:id/update').post(async (req, res) => {
    try {
        if (!_.isEmpty(req.params.id) && !_.isEmpty(req.body) && !_.isEmpty(req.body.news)) {
            let input = {
                objectId: req.params.id,
                updateObject: req.body.news
            }
            const updateObjectResult = await updateNewsDetailsHandler(input);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    news: updateObjectResult ? updateObjectResult : {}
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

router.route('/:id/update-v2').post(protectRoutes.verifyAdmin, upload.fields([{ name: "img", maxCount: 5 }]), async (req, res) => {
    try {
        if (!_.isEmpty(req.params.id) && !_.isEmpty(req.body)) {
            let input = {
                objectId: req.params.id,
                updateObject: req.body 
            };

            let { existingImages, imagesToDelete, ...updateFields } = req.body;

            existingImages = existingImages ? JSON.parse(existingImages) : [];
            imagesToDelete = imagesToDelete ? JSON.parse(imagesToDelete) : [];

            let newImageUrls = [];
            if (req.files && req.files.img) {
                for (const image of req.files.img) {
                    const result = await upload_image(image, input.updateObject.title);
                    newImageUrls.push(result.Location);
                }
            }

            updateFields.image = [...existingImages, ...newImageUrls];

            input.updateObject = updateFields;

            const updateObjectResult = await updateNewsDetailsHandlerV2(input);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    news: updateObjectResult ? updateObjectResult : {}
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

router.route('/:id/remove').post(async (req, res) => {
    try {
        if (req.params.id) {
            const deletedNews = await deleteNewsHandler(req.params.id);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    hasNewsDeleted: true
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

