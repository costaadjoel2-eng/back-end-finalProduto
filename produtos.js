const express = require('express');
const router = express.Router();
const db = require('../db');
const apiKey = require('../middleware/apiKey');

router.use(apiKey);

/* =========================
   SWAGGER CONFIG
========================= */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 */

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gestão de produtos locais
 */

/* =========================
   LISTAR + PESQUISA
========================= */

/**
 * @swagger
 * /produtos/listar:
 *   get:
 *     tags: [Produtos]
 *     summary: Lista todos os produtos ou pesquisa
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/listar', (req, res) => {

    let search = req.query.search;
    let sql = "SELECT * FROM produtos";

    if (search) {
        sql += " WHERE nome LIKE ? OR categoria LIKE ?";
        search = `%${search}%`;

        db.query(sql, [search, search], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });

    } else {
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    }
});

/* =========================
   CRIAR
========================= */

/**
 * @swagger
 * /produtos/criar:
 *   post:
 *     tags: [Produtos]
 *     summary: Criar produto
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Produto criado
 */
router.post('/criar', (req, res) => {

    const { nome, descricao, preco, categoria, regiao } = req.body;

    db.query(
        "INSERT INTO produtos (nome, descricao, preco, categoria, regiao) VALUES (?,?,?,?,?)",
        [nome, descricao, preco, categoria, regiao],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: "Produto criado",
                id: result.insertId
            });
        }
    );
});

/* =========================
   STATS
========================= */

/**
 * @swagger
 * /produtos/stats:
 *   get:
 *     tags: [Produtos]
 *     summary: Estatísticas dos produtos
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas
 */
router.get('/stats', (req, res) => {

    db.query("SELECT COUNT(*) AS total FROM produtos", (err, r1) => {

        if (err) return res.status(500).json(err);

        db.query("SELECT AVG(preco) AS media FROM produtos", (err, r2) => {

            if (err) return res.status(500).json(err);

            res.json({
                total: r1[0].total,
                mediaPreco: r2[0].media
            });

        });
    });
});

/* =========================
   GET POR ID
========================= */

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     tags: [Produtos]
 *     summary: Produto por ID
 */
router.get('/:id', (req, res) => {

    db.query(
        "SELECT * FROM produtos WHERE id=?",
        [req.params.id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(404).json({ message: "Não encontrado" });
            }

            res.json(result[0]);
        }
    );
});

/* =========================
   UPDATE
========================= */

/**
 * @swagger
 * /produtos/update/{id}:
 *   put:
 *     tags: [Produtos]
 *     summary: Atualizar produto
 *     security:
 *       - ApiKeyAuth: []
 */
router.put('/update/:id', (req, res) => {

    const { nome, descricao, preco, categoria, regiao } = req.body;

    db.query(
        "UPDATE produtos SET nome=?, descricao=?, preco=?, categoria=?, regiao=? WHERE id=?",
        [nome, descricao, preco, categoria, regiao, req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: "Atualizado com sucesso"
            });
        }
    );
});

/* =========================
   DELETE
========================= */

/**
 * @swagger
 * /produtos/delete/{id}:
 *   delete:
 *     tags: [Produtos]
 *     summary: Eliminar produto
 *     security:
 *       - ApiKeyAuth: []
 */
router.delete('/delete/:id', (req, res) => {

    db.query(
        "DELETE FROM produtos WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: "Eliminado com sucesso"
            });
        }
    );
});

module.exports = router;