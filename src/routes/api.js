const express = require('express');

const Controller = require('../controllers/api');

const Validation = require('../validations/validations');

const {getAccessToken, attachAccessToken, refreshToken} = require('../middlewares/alysonAuth');

const router = express.Router();

router.get('/hello',(req, res) => {
    console.log({"message": "Hello!, welcome"});
    res.json({message: "Hello! welome to this plugin"});
})

// just to test
// router.post('/getAuth', Controller.getAuth)

router.post('/refresh-token', refreshToken, (req, res) => {
    res.json({ new_access_token: req.accessToken });
})

router.get('/categories', attachAccessToken, Controller.getCategories);

router.get('/courses', attachAccessToken, Controller.getCourses);

router.get('/courses_by_id', attachAccessToken, Controller.getCoursesById);

router.get('/category-courses', attachAccessToken, Controller.getCategoryCourses);

router.post('/register', Validation.register, attachAccessToken, Controller.registerUser);

router.post('/login', attachAccessToken, Validation.login,  Controller.loginUser);

module.exports = router;