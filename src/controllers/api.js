const Controller = {}
const querystring = require('querystring')
const axios = require('axios')

// const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
// const compiledTemplate = handlebars.compile(source);

const { getAccessToken } = require('../middlewares/alysonAuth');
const Service = require('../services/api');
const Validation = require('../validations/validations');

Controller.getCategories = async(req, res)=> {
    try{
        const accessToken = req.accessToken;
        if(!accessToken) throw new Error("Access not granted")

        const categories = await Service.fetchCategories(accessToken)

        if(!categories) throw "No Categories Found"

        return res.status(200).json({success: true , data : categories})
    }
    catch(error){
        console.log('Error fetching categories', "report from controller", error.message)

        res.status(500).send('Internal Server Error');
    }
};

Controller.getCourses = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        if (!accessToken) throw new Error("Access not granted")

        // const coursesHTML = await Service.fetchCourses(accessToken)

        // if (!coursesHTML) throw "No Courses Found"

        const courses = await Service.fetchCourses(accessToken)
        if(!courses) throw "No courses found"

        return res.status(200).json({
            success: true,
            data: courses
        })

        // res.status(200).send(
        //     `<!DOCTYPE html>
        //     <html lang="en">
        //     <head>
        //         <meta charset="UTF-8">
        //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //         <title>Course Listing</title>
        //         <style>
        //             /* Define CSS styles for the course div */
        //             .course {
        //                 border: 1px solid #ddd;
        //                 border-radius: 4px;
        //                 padding: 20px;
        //                 margin-bottom: 20px;
        //                 box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
        //                 background-color: #fff;
        //             }

        //             .course h2 {
        //                 font-size: 20px;
        //                 color: #333;
        //                 margin-bottom: 10px;
        //             }

        //             .course p {
        //                 font-size: 16px;
        //                 color: #666;
        //                 line-height: 1.5;
        //             }

        //             .course p.duration {
        //                 font-weight: bold;
        //             }

        //             .course p.category {
        //                 color: #999;
        //             }
        //         </style>
        //     </head>
        //     <body>
        //         <div id="courses-container">${coursesHTML}</div>
        //     </body>
        //     </html>
        //     `
        // )

    } catch (error) {
        console.log('Error fetching categories', "report from controller", error.message)

        res.status(500).send('Internal Server Error');
    }
};

Controller.getCoursesById = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        if (!accessToken) throw new Error("Access not granted")

        const courses = await Service.fetchCoursesById(accessToken)

        if (!courses) throw "No Categories Found"

        return res.status(200).json({
            success: true,
            data: courses
        })
    } catch (error) {
        console.log('Error fetching categories', "report from controller", error.message)

        res.status(500).send('Internal Server Error');
    }
};

Controller.getCategoryCourses = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        if (!accessToken) throw new Error("Access not granted")

        const courses = await Service.fetchCatgoriesCourse(accessToken)

        if (!courses) throw "No courses Found"

        return res.status(200).json({
            success: true,
            data: courses
        })

        // res.send(JSON.stringify(courses));
    } catch (error) {
        console.log('Error fetching categories', "report from controller", error.message)

        res.status(500).send('Internal Server Error');
    }
};


Controller.getCoursesByCategoryId = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        if (!accessToken) throw new Error("Access not granted")

        const courses = await Service.fetchCatgoriesCourse(accessToken)
        if(!courses) throw "No courses found"

        const coursesHTML = courses.map(course => {
            return `
            `
        })

        return res.status(200).json({
            success: true,
            data: courses
        })

        // res.status(200).send(
        //     `<!DOCTYPE html>
        //     <html lang="en">
        //     <head>
        //         <meta charset="UTF-8">
        //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //         <title>Course Listing</title>
        //         <style>
        //             /* Define CSS styles for the course div */
        //             .course {
        //                 border: 1px solid #ddd;
        //                 border-radius: 4px;
        //                 padding: 20px;
        //                 margin-bottom: 20px;
        //                 box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
        //                 background-color: #fff;
        //             }

        //             .course h2 {
        //                 font-size: 20px;
        //                 color: #333;
        //                 margin-bottom: 10px;
        //             }

        //             .course p {
        //                 font-size: 16px;
        //                 color: #666;
        //                 line-height: 1.5;
        //             }

        //             .course p.duration {
        //                 font-weight: bold;
        //             }

        //             .course p.category {
        //                 color: #999;
        //             }
        //         </style>
        //     </head>
        //     <body>
        //         <div id="courses-container">${coursesHTML}</div>
        //     </body>
        //     </html>
        //     `
        // )

    } catch (error) {
        console.log('Error fetching categories', "report from controller", error.message)

        res.status(500).send('Internal Server Error');
    }
};



Controller.registerUser = async(req, res) => {
    try{
        const userData = req.body;
        const accessToken = req.accessToken;

        //Joi Validation
        const { error} = Validation.register(userData);

        if (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }

        if(!accessToken) throw new Error("Access not available")

        const result = await Service.registerUser(userData, accessToken);

        return res.status(200).json({success: true, data: result });
    }
    catch(error){
        console.log(error);
        console.log('Error registering user', error.message);
 
        return res.status(500).send('Server Error');
    }
}

Controller.loginUser = async(req, res) => {
    try{
        const loginData = req.body;
        const accessToken = req.accessToken;

        if(!accessToken) throw new Error('Access token missing');

        const token = await Service.loginUser(loginData);
        
        // Return jwt token and user info to the client side
        return res.header('auth-token', token.token).status(200).json({ success:true, data:token});
    }
    catch(error){
        console.log('Login failed!', error.message);

        return res.status(500).send('Server Error')
    }
}


module.exports = Controller