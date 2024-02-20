const axios = require('axios');
const querystring = require('querystring');


const base_Url = process.env.BASE_URL
const alysonCredentials = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    organization_id: process.env.ORGANIZATION_ID,
    organization_key: process.env.ORGANIZATION_KEY,
};

// Function to obtain an access token from Alyson
const getAccessToken = async () => {
    try {
        const formData = querystring.stringify({
            client_id: alysonCredentials.client_id,
            client_secret: alysonCredentials.client_secret,
            organization_id: alysonCredentials.organization_id,
            organization_key: alysonCredentials.organization_key,
        });

        // const response = await axios.post('https://alison.com/api/external/v1/access-token', formData, {
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded' // Specify form-data content type
        //     }
        // });

        //normal step
        const response = await axios.post('https://alison.com/api/external/v1/access-token', {
            client_id: alysonCredentials.client_id,
            client_secret: alysonCredentials.client_secret,
            organization_id: alysonCredentials.organization_id,
            organization_key: alysonCredentials.organization_key,
        });
        return response.data.access_token;
    } catch (error) {
        console.log(error)
        console.error('Error obtaining access token:', error.message);
        throw error;
    }
};

// Middleware to attach the Alyson access token to requests
const attachAccessToken = async (req, res, next) => {
    try {
        const accessToken = await getAccessToken();
        req.accessToken = accessToken;
        next();
    } catch (error) {
        console.log("report from middleware");
        console.log(error);
        res.status(500).send({message: 'Internal Server Error', error: error.message});
    }
};

const refreshToken = async (req, res, next) => {
    try{
        // If there is no access token in memory or it's expired, generate a new
        const refreshToken = req.body.refresh_token;

        const refreshTokenResult = await axios.post('https://alison.com/api/external/v1/refresh-token', {
        refresh_token: refreshToken,
        })

        //store the new access token in the request object
        req.accessToken = refreshTokenResult.data.access_token;

        next();
    }
    catch (error){
        console.log("report from middleware", error);
        res.status(500).send({message: 'Internal Server Error', error: error.message});
    }
}

module.exports = {getAccessToken, attachAccessToken, refreshToken}