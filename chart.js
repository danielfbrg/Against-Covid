//const { city } = require("./api");

var mescladoLayer;

/*Função que Destaca o Polígono */
function highlightFeature(e) {
    var layer = e.target;
   chartRender(layer);
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

/////////// acima apenas copiei tudo do chart pra poder usar o mouseover, tem que apagar.

////////////////////////////////////////////////////////////////////////////

/////////// abaixo o código do chart
function chartRender(layer){

const cityChart= layer._tooltip._content;
const lh3 = document.getElementById('h3label');

lh3.innerHTML=(`Gráficos Casos Acumulados em ${cityChart}`)
chartIt(cityChart);
}



async function chartIt(cityChart) {
    const data = await getData(cityChart);
    const ctx = document.getElementById('chart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.xs,
            datasets: [{
                label: `Casos Covid-19 Acumulados no Munício de ${cityChart}`,
                data: data.ys,
                fill: false,
                backgroundColor: 'rgba(38, 147, 190, 0.1)',
                borderColor: 'rgba(38, 147, 190, 1)',
                borderWidth: 1,
            },

            {
                label: 'Óbitos Acumulados',
                data: data.zs,
                fill: false,
                borderColor: 'rgba(255, 0, 0, 0.6)',
                backgroundColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 1
            }
            ]

        },
        options: {
            legend: {
                labels: {
                    fontColor: "white"
                }
            },

            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: 'white',
                        callback: function (value, index, values) {
                            return value;
                        }

                    }
                }],

                xAxes: [{
                    ticks: {
                       fontColor: "white",
                    }
                }]
            }
        }
    });
}


async function getData(cityChart) {

    const xs = [];
    const ys = [];
    const zs = [];

    const response = await fetch(`dados_${cityChart}.csv`);
    const data = await response.text();


    const table = data.split('\n').slice(1);
    table.forEach(row => {
        const columns = row.split(';');
        const year = columns[0];
        xs.push(year);
        const temp = columns[1];
        ys.push(temp);
        zs.push(columns[2]);
        console.log(year, temp, zs);
    });
    return { xs, ys, zs };
}
