/**Importar jsonwebtoken */
const jwt = require("jsonwebtoken");

const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payLoad = {
      uid,
    };

    const JWT_SECRET = process.env.JWT_SECRET;
    jwt.sign(
      payLoad,
      JWT_SECRET,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el JWT" + err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
