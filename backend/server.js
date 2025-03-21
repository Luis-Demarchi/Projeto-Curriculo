const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require('path');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error("Error to connect with MySQL:", err);
        return;
    }
    console.log("Connected with MySQL!");
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.use(express.static(path.join(__dirname, '../Frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});

app.post("/send", (req, res) => {
    const { name, email, message } = req.body;

    const sql = "INSERT INTO mensagens (name, email, message) VALUES (?, ?, ?)";
    connection.query(sql, [name, email, message], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error to save in database!" });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Novo preenchimento no formulário do seu portfólio!",
            text: `Nome: ${name}\nE-mail: ${email}\nMensagem: ${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: "Error to send message!" });
            } else {
                return res.status(200).json({ message: "Message sent successfully!" });
            }
        });
    });
});

app.listen(3000, '0.0.0.0', () => {
    console.log("Servidor rodando na porta 3000");
});
