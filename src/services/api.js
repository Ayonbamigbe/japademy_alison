const Service = {}
const querystring = require('querystring');

// const {attachAccessToken} = require('../middlewares/alysonAuth');

const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const { type } = require('os');

Service.fetchCategories = async (accessToken) => {
    try {
        
        let categories = [];

        const fetchCategoryFunction = async (page) => {
            return await axios.get(`https://alison.com/api/external/v1/categories?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
        };

        const response = await fetchCategoryFunction(1);
        
        const lastPage = response.data.meta.last_page;

        categories = [...response.data.data];

        // If there are more pages, fetch them and concatenate categories
        for (let currentPage = 2; currentPage <= lastPage; currentPage++) {
            const nextPageResponse = await fetchCategoryFunction(currentPage);
            categories = categories.concat(nextPageResponse.data.data);
        }

const textsToCheck = ['health', 'it', 'business'];

        // Filter categories based on texts in the array
        const filteredCategories = categories.filter(category => {
            // Check if any text in textsToCheck array is included in the category code
            return textsToCheck.some(text => category.code.includes(text)) && category.courses_count > 0;
        });

        
        
        // if(!!filteredCategories.length ) {
            // return null
            // }
            
            const extractedCategories = filteredCategories.map(category => ({ id: category.id, 
            total_course: category.courses_count,
            code: category.code }));

            // return (filteredCategories)
            return (extractedCategories)


        // return { totalFetchedCategories: categories.length, categories };
        // return extractedCategories;
    } catch (error) {
        console.log("report from service", error.message);
        return error.message;
    }
};


Service.fetchCourses = async (accessToken) => {
    try {
        const response = await axios.get(`https://alison.com/api/external/v1/courses`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });
        // console.log(response)

        const result = response.data.data

        // console.log(result);

        // return result


        // const coursesHTML = result.map(course => {
        //     return `
        //     <div class="card" style="width: 20rem;">
        //       <img src="${course.image}" class="card-img-top" alt="${course.name}">
        //       <div class="card-body">${course.name}</div>
        //       <a>link: <span>${course.url}</span></a><br/>
        //     </div>
        //     `
        // }).join('');

        // return coursesHTML

        const courses = result.map(course => {
            return {
                image_link: course.image,
                name: course.name,
                url: course.url,
                categories_id: course.categories[0].id,
                categories_code: course.categories[0].code
            }
        })

        return courses;


    } catch (error) {
        console.log("report from service", error.message);
        console.log(error)
        return error.message;
        // return `<p>Error fetching courses: ${error.message}</p>`;
    }
}

Service.fetchCoursesById = async (accessToken) => {
    try {
        const response = await axios.get(`https://alison.com/api/external/v1/courses/get-by-category-id/1?sort=id`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        return response.data;
    } catch (error) {
        console.log("report from service", error.message);
        console.log(error.message)
        return error.message
    }
}

Service.fetchCatgoriesCourse = async (accessToken) => {
    try {

        const categories = await Service.fetchCategories(accessToken);

        // Extract category IDs from categories
        const categoryIds = categories.map(category => category.id);

        const courses = [];

        //Loop through each category ID and fetch courses
        for (let categoryId of categoryIds) {
            console.log("CategoryId :", categoryId);
            const response = await axios.get(`https://alison.com/api/external/v1/courses/get-by-category-id/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
            
            if (Array.isArray(response.data.data)) {
                courses.push(...response.data.data);
            } 
        };

        extractedCourses = courses.map(course => ({
            id: course.id,
            name: course.name,
            slug: course.slug,
            type: course.type,
            image: course.image,
            url: course.url,
            duration: course.duration_avg,
            categories_id: course.categories[0].id,
            categories_code: course.categories[0].code
        }))

        return extractedCourses;



    } catch (error) {
        console.log("report from service", error.message);
        console.log(error.message)
        return error.message
    }
}

Service.registerUser = async (userData, accessToken) => {
    try {
        const formData = querystring.stringify(userData);

        const response = await axios.post('https://alison.com/api/external/v1/register', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`
            },
        })

        //normal thing to do 
        // const response = await axios.post('https://alison.com/api/external/v1/register', userData, {
        //     headers: { Authorization: `Bearer ${accessToken}` },
        // })

        return response.data;
    } catch (error) {
        console.log(error);
        console.log("report from service", "Error registering user", error.message)

        return {
            status: "failed",
            message: error.message
        }
    }
}


Service.loginUser = async (userEmail, accessToken) => {
    try {
        const response = await axios.post('https://alison.com/api/external/v1/login', {
            email: userEmail
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        })


        return response;
    } catch (error) {
        console.log("report from service", "Error logging in user", error)
        console.log()

        return {
            status: "failed",
            message: error.message
        }
    }
}

module.exports = Service