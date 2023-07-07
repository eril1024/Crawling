const mysql = require("mysql");
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-northeast-2', // AWS 리전을 설정
});
// ec2올리면 주석 필요 


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

const upbitDB = () => {
  async function createConnection() {
    const db_host = await getParameter("db_host");
    const db_port = await getParameter("db_port");
    const db_user = await getParameter("db_user");
    const db_passwd = await getParameter("db_passwd");
    return new Promise((resolve, reject) => {
      const conn = mysql.createConnection({
        host : db_host,
        port : db_port,
        user : db_user,
        password : db_passwd,
        database : "practice"
      });
      conn.connect((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(conn);
        }
      });
    });
  }

  function insertUpbitData(conn, data, query) {
    return new Promise((resolve, reject) => {
      conn.query(query, data, (error, results, fields) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  function selectUpbitRecentNotiId(conn,query){
    return new Promise((resolve, reject) => {
      conn.query(query, (error, results, fields) => {
        if (error) reject(error);
        if(results.length===1){
          resolve(results[0]);
        }else{
          resolve(results);
        }
      });
    });
  }

  return { createConnection, insertUpbitData ,selectUpbitRecentNotiId};
};

module.exports = upbitDB();
