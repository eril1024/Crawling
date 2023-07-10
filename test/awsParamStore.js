const AWS = require('aws-sdk');

const ssm = new AWS.SSM();


const getParameter = async (parameterName) => {
    const params = {
        Name: parameterName,
        WithDecryption: true
    };

    try {
        const response = await ssm.getParameter(params).promise();
        return response.Parameter.Value;
    } catch (error) {
        console.error("에러", error.message);
    }
};

(async () => {
    const parameterName = "db_passwd"; 
    const parameterValue = await getParameter(parameterName);
    console.log(`Parameter: ${parameterName}\nValue: ${parameterValue}`);
})();
