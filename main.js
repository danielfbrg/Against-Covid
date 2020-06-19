
import {city} from './api.js' // importando cidades recebidas da API

var mescladoLayer;

/*Função que Destaca o Polígono */
function highlightFeature(e) {
    var layer = e.target;

    sendCity(layer) //chamando função para enviar cidade quando passar o mouse
    
    layer.setStyle(
        {
            weight: 4,
            color: '#e6e0db',
            fillColor: 'white',
            fillOpacity: 0
        }
    );
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
    sendCity(layer) //chamando função para enviar cidade quando clica
console.log(e.target._tooltip._content)

    layer.setStyle(
        {
            weight: 4,
            color: '#e6e0db',
            fillColor: 'red',
            fillOpacity: 1
        }
    );
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

/*Função Interação com Munícipio */
function countriesOnEachFeature(feature, layer) {
    //bindTooltip Comando referente ao label com mouseover
    //NM_MUN é o Identificador da tabela de atribudos dos mapas referente ao nome do município
    layer.bindTooltip(feature.properties.NM_MUN, { noHide: true });

    layer.on(
        {
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        }
    );
}

/*Função que Define cores das Camadas */
function mescladoStyle(feature) {
    return {
        fillColor: getmescladoColor(feature.properties.NM_MICRO),
        weight: 2.2,
        opacity: 1,
        color: '#005AA8',
        dashArray: 3,
        fillOpacity: 0.7,
    }
}

/*Função que Define Cores pelo tamanho da Área(podemos mudar para número de casos) 
    Estou usando valores fornecidos pela Tabela de atributos(NM_MICRO), como usar da API ?
*/
function getmescladoColor(NM_MICRO) {
    if (NM_MICRO == 'Macaé') {
        return '#87cefa';
    } else if (NM_MICRO == 'Lagos') {
        return 'blue';
    } else if (NM_MICRO == 'Campos dos Goytacazes') {
        return '#c1c1c1';
    } else if (NM_MICRO == 'Bacia de São João') {
        return '#43bc7e';
    } else {
        return 'none';
    }
}



/* Controle do mapa */
var map = L.map('map').setView([-22.50452, -42.6734], 7.4);
mescladoLayer = L.geoJson(
    mesclado,
    {
        style: mescladoStyle,
        onEachFeature: countriesOnEachFeature,
    },
    
).addTo(map);


/*Adiciona Basemap*/
var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
map.addLayer(Stadia_AlidadeSmoothDark);

/* Controle da Legenda */
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend')
    var labels = [
        "Bacia de São João",
        "Campos dos Goytacazes",
        "Lagos",
        "Macaé"
    ];
    var grades = ['Bacia de São João', 'Campos dos Goytacazes', 'Lagos', 'Macaé'];
    div.innerHTML = '<div><b>Microrregiões do Estado RJ</b></div>';
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:'
            + getmescladoColor(grades[i]) + '">&nbsp;&nbsp;</i>&nbsp;&nbsp;'
            + labels[i] + '<br />';
    }
    return div;
}
legend.addTo(map);

// adicionei codigo abaixo

function sendCity(layer){
    console.log(layer._tooltip._content)    
     findCity (layer._tooltip._content);  
}



  function findCity(onmouse){ // Função para busca da cidade inserida pelo usuário.

    let pos = city.nome.indexOf(`${onmouse}`); // Busca cidade dentro do vetor
    
    renderCovidCases(pos);
}

function renderCovidCases(pos){ // função pra mostrar os casos na tela.

const d = document.getElementById('cases');

d.innerHTML=''
    if(pos!=-1){
     
     console.log(`${city.nome[pos]}`) 

     console.log(`Casos:${city.casos[pos]} pessoas.`) // utiliza a posição recebida para referenciar a cidade em [pos].
     
     console.log(`Mortes confirmadas:${city.mortes[pos]} pessoas.`) 
     
     d.innerHTML+=(`<p>${city.nome[pos]}`) 

     d.innerHTML+=(`<p>Casos confirmados: ${city.casos[pos]} pessoas.`) // utiliza a posição recebida para referenciar a cidade em [pos].
     
     d.innerHTML+=(`<p>Óbitos confirmadas: ${city.mortes[pos]} pessoas.`)
 

  }else{   
    console.log('Nenhuma cidade selecionada')
  }

}
