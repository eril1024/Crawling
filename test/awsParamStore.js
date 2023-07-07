const AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-northeast-2', // 사용하는 AWS 리전을 설정하세요
    accessKeyId: 'AKIAS5GPPVEBG56ADRVP',
    secretAccessKey: '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' 
});

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