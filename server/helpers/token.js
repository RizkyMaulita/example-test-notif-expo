const { writeFile, readFile } = require("node:fs");
const filePath = "token.txt";

const getToken = () => {
  return new Promise((resolve, reject) => {
    readFile(filePath, "utf-8", (err, data) => {
      if (err) reject({ message: "Failed read file !" });
      else resolve(data);
    });
  });
};

const registToken = (token = "") => {
  return new Promise((resolve, reject) => {
    writeFile(filePath, token, "utf-8", (err) => {
      if (err) reject({ message: "Failed register token !" });
      else resolve({ message: "Successfully register token !" });
    });
  });
};

module.exports = { getToken, registToken };
