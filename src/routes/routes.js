const express = require('express');

const getControler = require('../controllers/getControler');
const delControler = require('../controllers/delControler');
const postControler = require('../controllers/postControler');
const putControler = require('../controllers/putControler');

const router = express.Router();

router.get('/', getControler.getControler);
router.post('/', postControler.postControl);
router.put('/:id', putControler.putController);
router.delete('/:id', delControler.delControler);

module.exports = router;