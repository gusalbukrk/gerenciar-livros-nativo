import initializeSQLite from "./initializeSQLite.js";

const { promiser, dbId } = await initializeSQLite();
await promiser("exec", {
  dbId,
  sql: `CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY,
    titulo TEXT NOT NULL UNIQUE,
    autor TEXT,
    genero TEXT,
    ano INT DEFAULT 2020,
    estoqueQuantidade INT DEFAULT 1
)`,
});

const livroKeys = [
  "id",
  "titulo",
  "autor",
  "genero",
  "ano",
  "estoqueQuantidade",
];

const rowTemplate = document.querySelector("#row-template");

let livro;

async function getLivro(id) {
  const livros = [];

  await promiser("exec", {
    dbId,
    sql: "SELECT * FROM livros WHERE id = ?",
    bind: [id],
    callback: (result) => {
      if (!result.row) {
        return;
      }

      const [id, titulo, autor, genero, ano, estoqueQuantidade] = result.row;

      livro = {
        id,
        titulo,
        autor,
        genero,
        ano,
        estoqueQuantidade,
      };
    },
  });

  console.log("livro", livro);
  return livro;
}

async function getLivros() {
  const livros = [];

  await promiser("exec", {
    dbId,
    sql: "SELECT * FROM livros",
    callback: (result) => {
      if (!result.row) {
        return;
      }

      const [id, titulo, autor, genero, ano, estoqueQuantidade] = result.row;

      const livro = {
        id,
        titulo,
        autor,
        genero,
        ano,
        estoqueQuantidade,
      };
      livros.push(livro);
    },
  });

  return livros;
}

async function printLivros() {
  tbody.innerHTML = "";

  const livros = await getLivros();

  livros.forEach((livro) => {
    const rowFragment = rowTemplate.content.cloneNode(true);

    rowFragment.querySelector("tr").dataset.id = livro.id;

    const tds = rowFragment.querySelectorAll("td");
    livroKeys.forEach((key, index) => {
      tds[index].textContent = livro[key];
    });

    tbody.appendChild(rowFragment);
  });
}

async function insertLivro({ titulo, autor, genero, ano, estoqueQuantidade }) {
  await promiser("exec", {
    dbId,
    sql: "INSERT OR IGNORE INTO livros (titulo, autor, genero, ano, estoqueQuantidade) VALUES (?,?,?,?,?)",
    bind: [titulo, autor, genero, ano, estoqueQuantidade],
  });

  await printLivros();
}

async function updateLivro({
  id,
  titulo,
  autor,
  genero,
  ano,
  estoqueQuantidade,
}) {
  await promiser("exec", {
    dbId,
    sql: `UPDATE livros SET
      titulo = ?,
      autor = ?,
      genero = ?,
      ano = ?,
      estoqueQuantidade = ?
      WHERE id = ?;`,
    bind: [titulo, autor, genero, ano, estoqueQuantidade, id],
  });

  await printLivros();
}

async function deleteLivro(id) {
  await promiser("exec", {
    dbId,
    sql: "DELETE FROM livros WHERE id = ?",
    bind: [id],
  });

  await printLivros();
}

const seed = [
  {
    titulo: "harry potter 1",
    autor: "J.K. Rowling",
    genero: "Adventure",
    ano: 1997,
    estoqueQuantidade: 100,
  },
  {
    titulo: "harry potter 2",
    autor: "J.K. Rowling",
    genero: "Adventure",
    ano: 1998,
    estoqueQuantidade: 50,
  },
];
// NOTE: uncomment to seed
// for (const livro of seed) {
//   await insertLivro(livro);
// }

// must stay open otherwise user action would fail
// await promiser("close", { dbId });

export {
  getLivro,
  getLivros,
  printLivros as printTableRows,
  insertLivro,
  updateLivro,
  deleteLivro,
};
