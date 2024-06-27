import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//MYSQL
const MYSQL_IP = "localhost";
const MYSQL_LOGIN = "root";
const MYSQL_PASSWORD = "raphael#CRUZ";

let con = mysql.createConnection({
  host: MYSQL_IP,
  user: MYSQL_LOGIN,
  password: MYSQL_PASSWORD,
  database: "handsonwork",
});

con.connect(function (err) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("MySQL conectado.");
});

app.get("/", function (req, res) {
  con.query("SELECT * FROM aluno", function (err, alunos, fields) {
    if (err) throw err;
    con.query("SELECT * FROM curso", function (err, cursos, fields) {
      if (err) throw err;
      con.query(
        "SELECT aluno.nome AS nomeAluno, aluno.cpf, curso.nome AS nomeCurso, curso.prazo from alunocurso JOIN aluno ON alunocurso.idAluno = aluno.id JOIN curso ON alunocurso.idCurso = curso.id",
        function (err, alocacao, fields) {
          if (err) throw err;
          res.render("home.ejs", {
            alunos: alunos,
            cursos: cursos,
            alocacoes: alocacao,
          });
        }
      );
    });
  });
});

app.get("/cadastrar-aluno", function (req, res) {
  res.render("cadastro-aluno.ejs");
});

app.get("/cadastrar-curso", function (req, res) {
  res.render("cadastro-curso.ejs");
});

app.get("/alocacao", function (req, res) {
  con.query("SELECT * FROM aluno", function (err, alunos, fields) {
    if (err) throw err;
    con.query("SELECT * FROM curso", function (err, cursos, fields) {
      if (err) throw err;
      res.render("alocar.ejs", { alunos: alunos, cursos: cursos });
    });
  });
});

app.post("/aluno", async function (req, res) {
  console.log(req.body);

  con.query(
    "INSERT INTO aluno (nome, cpf, dataNascimento, sexo, email) VALUES ('" +
      req.body.nome +
      "','" +
      req.body.cpf +
      "','" +
      req.body.nascimento +
      "','" +
      req.body.sexo +
      "','" +
      req.body.email +
      "')"
  );

  res.redirect("/");
});

app.post("/curso", async function (req, res) {
  console.log(req.body);

  con.query(
    "INSERT INTO curso (nome, prazo, situacao, descricao) VALUES ('" +
      req.body.nome +
      "','" +
      req.body.prazo +
      "'," +
      req.body.situacao +
      ",'" +
      req.body.descricao +
      "')"
  );

  res.redirect("/");
});

app.post("/alocacao", async function (req, res) {
  console.log(req.body);

  con.query(
    "INSERT INTO alunocurso (idAluno, idCurso) VALUES ('" +
      req.body.aluno +
      "','" +
      req.body.curso +
      "')"
  );

  res.redirect("/");
});

app.post("/excluir", async function (req, res) {
  console.log(req.body);

  con.query("DELETE FROM aluno WHERE id=" + req.body.excluir);

  res.redirect("/");
});

//Conexão com o servidor
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

//Retorno da conexão
app.listen(port, function () {
  console.log("Server has started successfully");
});
