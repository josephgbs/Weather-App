const key = '6fb4017032c8368dfee77393c5072238';

const form = document.querySelector('form');
const input = document.querySelector('input');
const cities = document.querySelector('.container-fluid .row.cities');
const citiesAdded = [];


const getWeather = async () => {
    try{
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${key}&units=metric`);
        console.log(res);
        return res.data;
    }catch(err){
        console.log("ERROR!", err);
        return ("City not found, sorry :C");
    }
}

const addWeather = async () => {
    try{
        const weatherData = await getWeather();
        const newDiv = document.createElement('div');
        const {main, name, sys, weather} = weatherData;
        if(!isCityAdded(name, sys.country)){
          citiesAdded.push([name,sys.country]);
          if(name.length > 8){
            newDiv.classList.add('col-md-5')
            newDiv.classList.add('col-lg-4')
            newDiv.classList.add('mb-3')
          }else{
            newDiv.classList.add('col-md-4')
            newDiv.classList.add('col-lg-3')
            newDiv.classList.add('mb-3')
          }
            newDiv.classList.add('col-sm-6')
    
          const markup = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title city">
               ${name}<span class="badge bg-dark text-light country">${sys.country}</span>
                <button class="btn btn-light text-danger fas fa-trash"></button>
              </h5>
              <h1>${Math.round(main.temp)}<sup>°c</sup></h1>
              <img src="http://openweathermap.org/img/w/${weather[0]['icon']}.png" alt="weather icon" />
              <p class="card-text">${weather[0]['description']}</p>
            </div>
          </div>`;
          newDiv.innerHTML = markup;
          cities.append(newDiv);
        }else{
          input.classList.add('error-placeholder');
          input.placeholder = "You already know that city."
        }
    }catch{
      input.classList.add('error-placeholder');
      input.placeholder = "City not found :("
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    addWeather()
    input.value = "";
})

cities.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === "BUTTON"){
      let cityData = e.target.parentNode.innerText;
      let city = cityData.slice(0, cityData.length -3).trim();
      let country = cityData.slice(cityData.length -3).trim();
      removeCity(city, country);
       e.target.parentElement.parentElement.parentElement.parentElement.remove();
    }
})

input.addEventListener('input', () => {
      input.classList.remove('error-placeholder');
      input.placeholder = "Search for a city"
})


const isCityAdded = (city, country) => {
  for (let i = 0; i <= citiesAdded.length - 1; i++) {
    if(city === citiesAdded[i][0] && country === citiesAdded[i][1]){
        return true
    }
  }
  return false;
}

const removeCity = function (city, country) {
  for (let i = 0; i <= citiesAdded.length - 1; i++) {
    if(city === citiesAdded[i][0] && country === citiesAdded[i][1]){
      citiesAdded.splice(i--,1);
    }
  }
}
