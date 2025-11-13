const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      status: false,
      msg: "No hay token de autenticación en la petición.",
    });
  }

  /**Verificar el token */
  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    req.uid = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      status: false, // Indica que la solicitud no fue exitosa.
      msg: "El usuario no está identificado.", // Mensaje de error cuando el token es inválido.
    });
  }
};

module.exports = {
  validateJWT,
};
