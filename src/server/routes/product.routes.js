
import _ from 'lodash';
import {Router} from 'express';
import multer from 'multer';
import {
    addNewProductHandler,
    deleteProductHandler,
    getProductDetailsHandler,
    getProductListHandler,
    updateProductDetailsHandler,
    addNewProductHandlerV2
} from '../../common/lib/product/productHandler';
import responseStatus from "../../common/constants/responseStatus.json";
import responseData from "../../common/constants/responseData.json";
import protectRoutes from "../../common/util/protectRoutes";
import { storage } from "../../util/cloudinary.js";

const router = new Router();

const upload = multer({ storage });

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
  
      const outputResult = await getProductListHandler(filter);
      res.status(responseStatus.STATUS_SUCCESS_OK);
      res.send({
        status: responseData.SUCCESS,
        data: {
          productList: outputResult.list ? outputResult.list : [],
          productCount: outputResult.count ? outputResult.count : 0,
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


router.route('/new').post(protectRoutes.verifyAdmin,async (req, res) => {
    try {
       if(!_.isEmpty(req.body)) {
            const outputResult = await addNewProductHandler(req.body.product);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    product: outputResult ? outputResult : {}
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

router.post("/add-product",upload.fields([{ name: "img", maxCount: 5 }]), async (req, res) => {
    try {
        const files = req.files;
        
        const productData = JSON.parse(req.body.product);

        // Add file paths to product data
        if (files.img) {
            productData.images = files.img.map(file => ({ path: file.path }));
        }
        
        const outputResult = await addNewProductHandlerV2(productData);
        res.status(responseStatus.STATUS_SUCCESS_OK).send({
            status: responseData.SUCCESS,
            data: {
                product: outputResult ? outputResult : {}
            }
        });
    } catch (err) {
        console.log(err);
        res.status(responseStatus.INTERNAL_SERVER_ERROR).send({
            status: responseData.ERROR,
            data: { message: err.message }
        });
            }
});

router.route('/:id').get(async (req, res) => {
    try {
        if (req.params.id) {
            const gotProduct = await getProductDetailsHandler(req.params);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    product: gotProduct ? gotProduct : {}
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

router.route('/:id/update').post(protectRoutes.verifyAdmin,async (req, res) => {
    try {
        if (!_.isEmpty(req.params.id) && !_.isEmpty(req.body) && !_.isEmpty(req.body.product)) {
            let input = {
                objectId: req.params.id,
                updateObject: req.body.product
            }
            const updateObjectResult = await updateProductDetailsHandler(input);
            res.status(responseStatus.STATUS_SUCCESS_OK);
                res.send({
                    status: responseData.SUCCESS,
                    data: {
                        product: updateObjectResult ? updateObjectResult : {}
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

router.route('/:id/remove').post(protectRoutes.verifyAdmin,async(req, res) => {
    try {
        if (req.params.id) {
            const deletedProduct = await deleteProductHandler(req.params.id);
            res.status(responseStatus.STATUS_SUCCESS_OK);
            res.send({
                status: responseData.SUCCESS,
                data: {
                    hasProductDeleted: true
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
  
