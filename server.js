const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("🚀 API STP Produtos Online");

/* =========================
   SWAGGER CONFIG
========================= */
const swaggerOptions = {
  definition: {
  openapi: "3.0.0",

  info: {
    title: "STP Produtos API",
    version: "1.0.0",
    description: "API de gestão de produtos locais de São Tomé e Príncipe"
  },

  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key"
      }
    }
  },

  security: [
    {
      ApiKeyAuth: []
    }
  ],

  servers: [
    {
      url: "http://localhost:3000"
    }
  ]
},

  // 🔥 IMPORTANTE: garantir que pega tudo corretamente
  apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

/* =========================
   SWAGGER ROUTE
========================= */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/* =========================
   ROUTES
========================= */
const produtosRoutes = require('./routes/produtos');
app.use('/produtos', produtosRoutes);

/* =========================
   FRONTEND
========================= */
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* =========================
   404
========================= */
app.use((req, res) => {
    res.status(404).json({ message: "Rota não encontrada" });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});