let locationInput = document.querySelector(".location-form");
let btnSubmit = document.querySelector(".btn-submit");
let city = document.querySelector(".city-title");
let cityName = "munich"; //initilize first city
let cityTemp = document.querySelector(".city-temp");
let cityWeather = document.querySelector(".city-weather");
let cityFeel = document.querySelector(".city-feels");
let cityHum = document.querySelector(".city-hum");
let cityRain = document.querySelector(".city-rain"); //need from different API
let cityWind = document.querySelector(".city-wind");
let iconWeather = document.querySelector(".wi");
let switcherTemp = document.querySelector(".city-metric");
let defaultTemp = true;
switcherTemp.textContent = "|°F";

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  cityName = locationInput.value.toUpperCase(); //store value to forward to API
  locationInput.value = "";
  render();
});

switcherTemp.addEventListener("click", (e) => {
  defaultTemp = !defaultTemp;
  console.log(defaultTemp);
  defaultTemp
    ? (switcherTemp.textContent = "|°F")
    : (switcherTemp.textContent = "|°C");
  render();
});

async function loadData(city, defaultTemp) {
  let met = "metric";
  defaultTemp ? (met = "metric") : (met = "imperial");
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=42d3755ff9952be93382336dbfe4f4ff&units=${met}`,
    { mode: "cors" }
  );
  const data = await response.json();
  console.log(data);
  fillData(data);
  fillIcon(data);
  return data;
}

//fill data from API
function fillData(data) {
  city.textContent = data.name.toUpperCase();
  cityTemp.textContent = data.main.temp + (defaultTemp ? "°C" : "°F");
  cityWeather.textContent = data.weather[0].main.toUpperCase();
  cityFeel.textContent = data.main.feels_like + (defaultTemp ? "°C" : "°F");
  cityFeel.textContext = data.main.humidity;
  cityHum.textContent = data.main.humidity + "%";
  cityWind.textContent =
    data.wind.speed + (defaultTemp ? " m/sec" : " miles/h");
}

function fillIcon(data) {
  const des = data.weather[0].id;
  console.log(des);
  iconWeather.className = `wi wi-owm-${des} icon`;
}

function render() {
  loadData(cityName, defaultTemp);
}

render();
