document.addEventListener("DOMContentLoaded", () => {
    const filtroCount = document.querySelector(".icone-filtro-contador");
    const tipoSelect = document.getElementById("tipo");
    const quantidadeSelect = document.getElementById("quantidade");
    const deInput = document.getElementById("de");
    const ateInput = document.getElementById("ate");
    const form = document.querySelector(".dialog-filtro-form");
  
    function updateFiltroCount() {
      let count = 0;
  
      if (tipoSelect.value !== "") count++;
      if (quantidadeSelect.value !== "0" && quantidadeSelect.value !== "")
        count++;
      if (deInput.value) count++;
      if (ateInput.value) count++;
  
      filtroCount.textContent = count;
    }
  
    form.addEventListener("change", updateFiltroCount);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      updateFiltroCount();
    });
  
    updateFiltroCount();
  });  

  //URL da API
const url = "https://servicodados.ibge.gov.br/api/v3/noticias";

//Elementos do filtro
const filtro = document.querySelector(".icone-filtro  ");
const dialog = document.querySelector(".dialog-filtro");
const dialogFechar = document.querySelector(".dialog-filtro-fechar");
const dialogAplicar = document.querySelector(".dialog-filtro-aplicar");

//Campo de busca
const formBusca = document.querySelector(".form-busca");
const inputBusca = formBusca.querySelector("input");
let busca = inputBusca.value || "";

//Buscar as notícias
formBusca.addEventListener("submit", (event) => {
  event.preventDefault();

  paginaAtual = 1;
  busca = inputBusca.value;

  atualizarUrl();
  buscarNoticias();
});

//Abrir, fechar e aplicar o dialog de filtro
dialogAplicar.addEventListener("click", () => {
  atualizarFiltros();
  dialog.close();
});

filtro.addEventListener("click", () => {
  dialog.showModal();
});

dialogFechar.addEventListener("click", () => {
  dialog.close();
});

//Campos de filtro
let tipo = document.querySelector("#tipo");
let qtd = document.querySelector("#quantidade");
let de = document.querySelector("#de");
let ate = document.querySelector("#ate");

//Notícias
const listaNoticias = document.querySelector(".lista-noticias");

//Lista de paginas
const listaPaginacao = document.querySelector(".lista-paginacao");
let paginaAtual = 1;
let totalPaginas = 1;

//Notícia LI
function criarNoticia(noticia) {
  const li = document.createElement("li");

  const imagem = document.createElement("img");
  const imagemObj = JSON.parse(noticia.imagens);
  imagem.src = `https://agenciadenoticias.ibge.gov.br/${imagemObj.image_intro}`;

  const titulo = document.createElement("h2");
  titulo.textContent = noticia.titulo;

  const intro = document.createElement("p");
  intro.textContent = noticia.introducao;

  const editorias = document.createElement("span");
  editorias.textContent = noticia.editorias
    ? noticia.editorias
        .split(";")
        .map((editoria) => `#${editoria}`)
        .join(" ")
    : "";

  const publicado = document.createElement("span");
  publicado.textContent = calcularDataPublicacao(noticia.data_publicacao);

  const botaoLeiaMais = document.createElement("button");
  botaoLeiaMais.textContent = "Leia mais";
  botaoLeiaMais.addEventListener("click", () => {
    window.open(noticia.link, "_blank");
  });

  //Estrutura da notícia
  const divNoticia = document.createElement("div");
  divNoticia.classList.add("noticia");

  const divNoticiaConteudo = document.createElement("div");
  divNoticiaConteudo.classList.add("noticia-conteudo");

  const divNoticiaImagem = document.createElement("div");
  divNoticiaImagem.classList.add("noticia-imagem");

  const divConteudoInfo = document.createElement("div");
  divConteudoInfo.classList.add("conteudo-info");

  const divConteudoPublicado = document.createElement("div");
  divConteudoPublicado.classList.add("conteudo-publicado");

  const divLeiaMais = document.createElement("div");
  divLeiaMais.classList.add("leia-mais");

  divConteudoInfo.appendChild(titulo);
  divConteudoInfo.appendChild(intro);
  divConteudoPublicado.appendChild(editorias);
  divConteudoPublicado.appendChild(publicado);
  divLeiaMais.appendChild(botaoLeiaMais);

  divNoticiaConteudo.appendChild(divConteudoInfo);
  divNoticiaConteudo.appendChild(divConteudoPublicado);
  divNoticiaConteudo.appendChild(divLeiaMais);

  divNoticiaImagem.appendChild(imagem);

  divNoticia.appendChild(divNoticiaImagem);
  divNoticia.appendChild(divNoticiaConteudo);

  li.appendChild(divNoticia);

  return li;
}

//Data de publicação
function calcularDataPublicacao(data) {
  const dataAtual = new Date();
  const dataPublicacao = new Date(
    data.replace(
      /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
      "$2/$1/$3 $4:$5:$6"
    )
  );
  const diferencaTempo = Math.abs(dataAtual - dataPublicacao);
  const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
  if (diferencaDias === 0) {
    return "Publicado hoje";
  } else if (diferencaDias === 1) {
    return "Publicado ontem";
  } else {
    return `Publicado há ${diferencaDias} dias`;
  }
}

//Atualização do filtro quando o dialog é aplicado
//Busca das notícias e a atualização da url
function atualizarFiltros() {
  tipo = document.querySelector("#tipo");
  qtd = document.querySelector("#quantidade");
  de = document.querySelector("#de");
  ate = document.querySelector("#ate");
  paginaAtual = 1;

  buscarNoticias();
  atualizarUrl();
}

//Atualiza url com os filtros
function atualizarUrl() {
  const params = new URLSearchParams();

  busca !== "" && params.append("busca", busca);
  tipo.value !== "" && params.append("tipo", tipo.value);
  de.value !== "" && params.append("de", de.value);
  ate.value !== "" && params.append("ate", ate.value);
  params.append("qtd", qtd.value);
  params.append("page", paginaAtual);

  window.history.pushState({}, "", `?${params}`);
}

//Filtro quando a página é carregada pela primeira vez e tiver dados na url
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);

  busca = urlParams.get("busca") || "";
  tipo.value = urlParams.get("tipo") || "";
  qtd.value = urlParams.get("qtd") || 10;
  de.value = urlParams.get("de") || "";
  ate.value = urlParams.get("ate") || "";
  paginaAtual = parseInt(urlParams.get("page")) || 1;

  if (busca !== "") {
    inputBusca.value = busca;
  }

  buscarNoticias();
});

//Buscar as notícias da API do IBGE
function buscarNoticias() {
  const params = new URLSearchParams();

  busca !== "" && params.append("busca", busca);
  tipo.value !== "" && params.append("tipo", tipo.value);
  de.value !== "" && params.append("de", de.value);
  ate.value !== "" && params.append("ate", ate.value);
  params.append("qtd", qtd.value);
  params.append("page", paginaAtual);

  fetch(`${url}?${params}`)
    .then((response) => response.json())
    .then((data) => {
      listaNoticias.innerHTML = "";
      data.items.forEach((noticia) => {
        listaNoticias.appendChild(criarNoticia(noticia));
      });
      totalPaginas = data.totalPages;
      paginarNoticias();
    });
}

//Paginar as notícias
function paginarNoticias() {
  listaPaginacao.innerHTML = "";

  const paginas = [];

  for (let i = 1; i <= totalPaginas; i++) {
    paginas.push(i);
  }

  let paginasVisiveis = [];

  if (totalPaginas <= 10) {
    paginasVisiveis = paginas;
  } else {
    let inicio = paginaAtual - 4;
    let fim = paginaAtual + 5;

    if (inicio < 1) {
      inicio = 1;
      fim = 10;
    }

    if (fim > totalPaginas) {
      fim = totalPaginas;
      inicio = totalPaginas - 9;
    }

    for (let i = inicio; i <= fim; i++) {
      paginasVisiveis.push(i);
    }
  }

  //Botão da primeira página
  const primeiraPagina = document.createElement("li");
  const botaoPrimeiraPagina = document.createElement("button");
  botaoPrimeiraPagina.addEventListener("click", () => {
    paginaAtual = 1;
    buscarNoticias();
    atualizarUrl();
  });


  listaPaginacao.appendChild(primeiraPagina);

  //Botão da página anterior
  const paginaAnterior = document.createElement("li");
  const botaoPaginaAnterior = document.createElement("button");
  botaoPaginaAnterior.addEventListener("click", () => {
    paginaAtual = paginaAtual - 1;
    buscarNoticias();
    atualizarUrl();
  });

  listaPaginacao.appendChild(paginaAnterior);

  //Paginas visiveis
  paginasVisiveis.forEach((pagina) => {
    const li = document.createElement("li");
    const botao = document.createElement("button");
    botao.textContent = pagina;
    botao.addEventListener("click", () => {
      paginaAtual = pagina;
      buscarNoticias();
      atualizarUrl();
    });
    if (pagina === paginaAtual) {
      botao.style.backgroundColor = "#4682b4";
      botao.style.color = "#ffffff";
    }
    li.appendChild(botao);
    listaPaginacao.appendChild(li);
  });

  //Botão da próxima página
  const proximaPagina = document.createElement("li");
  const botaoProximaPagina = document.createElement("button");
  botaoProximaPagina.addEventListener("click", () => {
    paginaAtual = paginaAtual + 1;
    buscarNoticias();
    atualizarUrl();
  });

  listaPaginacao.appendChild(proximaPagina);

  //Botão da última página
  const ultimaPagina = document.createElement("li");
  const botaoUltimaPagina = document.createElement("button");
  botaoUltimaPagina.addEventListener("click", () => {
    paginaAtual = totalPaginas;
    buscarNoticias();
    atualizarUrl();
  });

  listaPaginacao.appendChild(ultimaPagina);
}