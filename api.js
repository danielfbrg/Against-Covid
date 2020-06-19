import axios from 'axios' // instalei o axios e importei pra fazer a requisiçao

const city = {
    nome:[], 
    id:[],
    casos:[],
    mortes:[],
    taxa:[]
}

// Salvando a API localmente

function receiveAPI(pos){
      
   axios.get('https://brasil.io/api/dataset/covid19/caso/data/?is_last=True&state=RJ') //busca a API

  .then(response=>{ // Caso cidade seja encontrada
     // console.log(response)

         for(var i=0 ; i<93 ; i++){

            city.nome[i] = response.data.results[i].city
            city.id[i] = response.data.results[i].city_ibge_code
            city.casos[i] = response.data.results[i].confirmed
            city.mortes[i] = response.data.results[i].deaths
            city.taxa[i] = response.data.results[i].death_rate
            // console.log(`${city.nome[i]}`)
        }
        return city;
    })  

  .catch(function(error){ // Caso cidade não seja encontrada
            
    console.log('algo errado.')
     
  })

  }
  receiveAPI();

  export {city};