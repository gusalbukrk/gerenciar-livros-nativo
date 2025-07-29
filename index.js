import {
  getLivro,
  printTableRows,
  insertLivro,
  updateLivro,
  deleteLivro,
} from "./livros";

const tbody = document.querySelector("#tbody");
const form = document.querySelector("form");
const idInput = document.querySelector("#id");
const tituloInput = document.querySelector("#titulo");
const autorInput = document.querySelector("#autor");
const generoInput = document.querySelector("#genero");
const anoInput = document.querySelector("#ano");
const estoqueQuantidadeInput = document.querySelector("#estoque-quantidade");
const submitButton = document.querySelector("#submit");
const resetButton = document.querySelector("#rst");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const livro = {
    id: parseInt(formData.get("id")),
    titulo: formData.get("titulo"),
    autor: formData.get("autor"),
    genero: formData.get("genero"),
    ano: parseInt(formData.get("ano")),
    estoqueQuantidade: parseInt(formData.get("estoqueQuantidade")),
  };

  if (submitButton.value === "Criar") {
    await insertLivro(livro);
  } else if (submitButton.value === "Atualizar") {
    await updateLivro(livro);
    submitButton.value = "Criar";
  }

  e.target.reset();
});

// listen for clicks in the update & delete buttons
tbody.addEventListener("click", async (e) => {
  const action = e.target.dataset.action;
  const id = parseInt(e.target.parentElement.parentElement.dataset.id);

  if (action === "delete") {
    await deleteLivro(id);
  } else if (action === "update") {
    const livroToUpdate = await getLivro(id);

    idInput.value = livroToUpdate.id;
    tituloInput.value = livroToUpdate.titulo;
    autorInput.value = livroToUpdate.autor;
    generoInput.value = livroToUpdate.genero;
    anoInput.value = livroToUpdate.ano;
    estoqueQuantidadeInput.value = livroToUpdate.estoqueQuantidade;
    submitButton.value = "Atualizar";
  }
});

resetButton.addEventListener("click", (e) => {
  submitButton.value = "Criar";
});

printTableRows();
