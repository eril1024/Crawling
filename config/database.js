// const AWS = require('aws-sdk');

// AWS.config.update({
//   region: 'ap-northeast-2', // 사용하는 AWS 리전을 설정하세요
//   accessKeyId: 
//   secretAccessKey:
// });
// // ec2올리면 주석 필요  

// const ssm = new AWS.SSM();

// const getParameter = async (parameterName) => {
//   const params = {
//       Name: parameterName,
//       WithDecryption: true
//   };
//   try {
//       const response = await ssm.getParameter(params).promise();
//       return response.Parameter.Value;
//   } catch (error) {
//       console.error("에러", error.message);
//   }
// };

// const db_config = async () =>{
//   const db_host = await getParameter("db_host");
//   const db_port = await getParameter("db_port");
//   const db_user = await getParameter("db_user");
//   const db_passwd = await getParameter("db_passwd");
//   return {
//     host : db_host,
//     port : db_port,
//     user : db_user,
//     password : db_passwd,
//     database : "mysql"
//   }
// }
// module.exports = db_config;

module.exports = {
    host : "coredot-test-db.c0og555lagsl.ap-northeast-2.rds.amazonaws.com",
    port : "3306",
    user : "admin",
    password : "coredot1206!!",
    database : "practice"
  };
