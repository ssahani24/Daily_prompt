const express = require('express');

const app = express();

const emailController = require('../controllers/email');

const router = express.Router();

router.get('/', emailController.getIndex);

router.post('/thankyou', emailController.postIndex);

router.get('/thankyou', emailController.getThanks);

module.exports = router;