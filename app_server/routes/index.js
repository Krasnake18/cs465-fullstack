var express = require('express');
var router = express.Router();
const ctrMain = require('../controllers/mainController');

/* GET home page. */
router.get('/', ctrMain.index);

module.exports = router;
