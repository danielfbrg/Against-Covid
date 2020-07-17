//LayerGeoJSON
var mescladoLayer;


/* Aqui sao as tentativas de fazer o valor da variável aparecer fora da funcao*/

var pos;

const city = {
  nome: [],
  id: [],
  casos: [],
  mortes: [],
  taxa: [],
};


/* Estes dados sao enviados pro Bindtooltips( que é funcao que recebe os dados e mostra-os na POP UP*/

var babilonia = "Gripezinha";

// testando = city.mortes[pos];
//testando = `${city.mortes[pos]}`;
testando = renderCovidCases(city.nome[pos]);
console.log(renderCovidCases(city.nome[pos]));
//renderCovidCases(pos)
var agora;

/* Função que Destaca o Polígono */
function highlightFeature(e) {
  var layer = e.target;

  sendCity(layer);

  document.getElementById("local_selecionado").textContent =
    e.target.feature.properties.NM_MUN; //enviando municipio pro html acima do mapa

  console.log(e.target.feature.properties.NM_MUN);
  console.log(e.target.feature.properties.CD_MUN);
  console.log(layer.feature.properties.NM_MUN);

  layer.setStyle({
    weight: 4,
    color: "#e6e0db",
    fillColor: "white",
    fillOpacity: 0,
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}

/*Função Reseta HighLigth */
function resetHighlight(e) {
  mescladoLayer.resetStyle(e.target);
}

/*Função Click gera Zoom para Municípo Clicado */
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
  var layer = e.target;
  sendCity(layer); //chamando função para enviar cidade quando passar o mou

  console.log(layer);
  console.log(e.target._tooltip._content); // Exibe conteudo da legenda pos click

  layer.setStyle({
    weight: 4,
    color: "#e6e0db",
    fillColor: "red",
    fillOpacity: 1,
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}

/* Foto na Pop Up, nao esta sendo utilizado*/
var photoImg =
  '<img src="https://static.pexels.com/photos/189349/pexels-photo-189349.jpeg" height="100px" width="100px"/>';

/*Função Interação com Munícipio */
function countriesOnEachFeature(feature, layer) {
  //bindTooltip Comando referente ao label com mouseover
  //NM_MUN é o Identificador da tabela de atribudos dos mapas referente ao nome do município
  //layer.bindTooltip(feature.properties.NM_MUN,  { noHide: true })

  layer.bindTooltip(
    ` <center> <b> ${feature.properties.NM_MUN} </b> </center> <br>
    
      Casos Confirmados<span>*</span>: ${city.nome[pos]} <br> 
      Óbitos*: ${babilonia} <br> <br>
      
      <b> <small> Data de Atualização:</b> XX/XX/XXXX</small> <br> 
      <small>*Dados Acumulados</small>`,
    { noHide: true }
  );

  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

/*Função que Define cores das Camadas */
function mescladoStyle(feature) {
  return {
    fillColor: getmescladoColor(feature.properties.NM_MICRO),
    weight: 2.2,
    opacity: 1,
    color: "#005AA8",
    dashArray: 3,
    fillOpacity: 0.7,
  };
}

/*Função que Define Cores pelo tamanho da Área(podemos mudar para número de casos) 
        Estou usando valores fornecidos pela Tabela de atributos(NM_MICRO), como usar da API ?
    */
function getmescladoColor(NM_MICRO) {
  if (NM_MICRO == "Macaé") {
    return "#87cefa";
  } else if (NM_MICRO == "Lagos") {
    return "blue";
  } else if (NM_MICRO == "Campos dos Goytacazes") {
    return "#c1c1c1";
  } else if (NM_MICRO == "Bacia de São João") {
    return "#43bc7e";
  } else {
    return "none";
  }
}

/* Controle do mapa */
var map = L.map("map").setView([-22.50452, -42.6734], 7.4);

mescladoLayer = L.geoJson(mesclado, {
  style: mescladoStyle,
  onEachFeature: countriesOnEachFeature,
}).addTo(map);

/*Adiciona Basemap*/
var Stadia_AlidadeSmoothDark = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }
);
map.addLayer(Stadia_AlidadeSmoothDark);

/* Controle da Legenda */
var legend = L.control({ position: "bottomright" });
legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  var labels = ["Bacia de São João", "Campos dos Goytacazes", "Lagos", "Macaé"];
  var grades = ["Bacia de São João", "Campos dos Goytacazes", "Lagos", "Macaé"];
  div.innerHTML = "<div><b>Microrregiões do Estado RJ</b></div>";
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getmescladoColor(grades[i]) +
      '">&nbsp;&nbsp;</i>&nbsp;&nbsp;' +
      labels[i] +
      "<br />";
  }
  return div;
};
legend.addTo(map);




/* CODE DUDU */

//adicionei codigo abaixo

//modifiquei pra tentar simplificar *PJ*




function sendCity(layer) {
  //teste
  console.log(layer.feature.properties.NM_MUN);
  //OK
  findCity(layer.feature.properties.NM_MUN);
}

function findCity(onmouse) {
  // Função para busca da cidade inserida pelo usuário.

  pos = city.nome.indexOf(`${onmouse}`); // Busca cidade dentro do vetor
  console.log(pos);
  renderCovidCases(pos);
}


//Essa é funcao que vc fez, aqui os consoles "printam", mas quando chamo pra fora dessa funcao aparece undefined...usa os consoles pra tu entender o que ta rolando..."


function renderCovidCases(pos) {
  // função pra mostrar os casos na tela.

  //const d = document.getElementById("cases");

  if (pos != -1) {
    //teste
    console.log(`${city.nome[pos]}`);

    a = city.nome[pos];

    console.log(a);

    console.log(`Casos: ${city.casos[pos]} pessoas.`); // utiliza a posição recebida para referenciar a cidade em [pos].

    //teste
    console.log(`Mortes confirmadas: ${city.mortes[pos]} pessoas.`);

    // d.innerHTML += `<p>${city.nome[pos]}`;

    // d.innerHTML += `<p>Casos confirmados: ${city.casos[pos]} pessoas.`; // utiliza a posição recebida para referenciar a cidade em [pos].

    // d.innerHTML += `<p>Óbitos confirmadas: ${city.mortes[pos]} pessoas.`;
  } else {
    console.log("Nenhuma cidade selecionada");
    console.log(a);
    
    a = city.nome[pos];
  }

  //teste
  console.log(a);
  testando = a;
  a = city.nome[pos];
}

renderCovidCases();
console.log(a);



//CALL API


const api_url =
  "https://brasil.io/api/dataset/covid19/caso/data/?is_last=True&state=RJ";



/* Alimentar Vetor com os dados recebidos, joguei lá pra cima */


// const city = {
//   nome: [],
//   id: [],
//   casos: [],
//   mortes: [],
//   taxa: [],
// };

// Salvando a API localmente

async function receiveAPI(pos) {
  const response = await fetch(api_url); //busca a API
  const data = await response.json();

  // console.log(data.results[68]); //retorna cidade especifica
  // console.log(data.results[68].city); //retorna cidade especifica
  // console.log(data.results[68].city_ibge_code); //retorna  codigo IBGE cidade especifica
  // console.log(data.results[68].deaths);
  // console.log(data);

  for (var i = 0; i < 94; i++) {
    city.nome[i] = data.results[i].city;
    city.id[i] = data.results[i].city_ibge_code;
    city.casos[i] = data.results[i].confirmed;
    city.mortes[i] = data.results[i].deaths;
    city.taxa[i] = data.results[i].death_rate;
  }
  console.log(city.nome[i]);
  console.log(city);
  return city;
}

receiveAPI();
console.log(city.nome);
console.log(a);
console.log(city.nome[pos]);
