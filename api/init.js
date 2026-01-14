const express = require("express");
const methodOverride = require("method-override");
const router = require("./router");
const mongoose = require("mongoose");
const { IAMRouter, IAMSwagger} = require ("aloux-iam");

//Swagger
const swaggerUi = require('swagger-ui-express');

//Iniciar Base de Datos
mongoose.connect(process.env.MONGODB,
    {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
    }
);

const app = express();

// CORS
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(methodOverride());
app.use(IAMRouter);
app.use(router);

app.use(
    "/docs-iam",
    swaggerUi.serveFiles(IAMSwagger, {}),
    swaggerUi.setup(IAMSwagger)
);

app.listen(3000, () => {
    console.log("Servidor iniciado en el puerto http://localhost:3000");
});

module.exports = app;