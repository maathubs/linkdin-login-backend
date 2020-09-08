var express = require('express');
var router = express.Router();
var admin_service = require('../../controllers/admin/admin.controller');

router.post('/login', (req, res) => {
    admin_service.login(req, res);
})

module.exports = router;