let locationInput = document.querySelector(".location-form");
let btnSubmit = document.querySelector(".btn-submit");
let city = document.querySelector(".city-title");
let cityName = "munich"; //initilize first city
let cityCountry = document.querySelector(".city-country");
let cityTemp = document.querySelector(".city-temp");
let cityWeather = document.querySelector(".city-weather");
let cityFeel = document.querySelector(".city-feels");
let cityHum = document.querySelector(".city-hum");
let cityDesc = document.querySelector(".city-desc");
let cityWind = document.querySelector(".city-wind");
let iconWeather = document.querySelector(".wi");
let switcherTemp = document.querySelector(".city-metric");
let met = "metric";
let defaultTemp = true;
switcherTemp.textContent = "|°F"; //initlialize metric
let forecastTemplate = document.querySelector("#forecast-template");
let forecasts = document.querySelector(".forecasts");
let switcherWeek = document.querySelector(".forecast-week");
let defaultWeek = true;
switcherWeek.textContent = "| WEEK";
let fixWeek = document.querySelector(".forecast-today");
fixWeek.textContent = "TODAY";
let sunrise = document.querySelector(".sunrise");
let sunset = document.querySelector(".sunset");

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  cityName = locationInput.value.toUpperCase(); //store value to forward to API
  locationInput.value = "";
  clearElement(forecasts);
  render();
});

switcherTemp.addEventListener("click", (e) => {
  defaultTemp = !defaultTemp;
  defaultTemp
    ? (switcherTemp.textContent = "|°F")
    : (switcherTemp.textContent = "|°C");
  clearElement(forecasts);
  render();
});

switcherWeek.addEventListener("click", (e) => {
  defaultWeek = !defaultWeek;
  defaultWeek
    ? (switcherWeek.textContent = "| WEEK") && (fixWeek.textContent = "TODAY")
    : (switcherWeek.textContent = "| TODAY") && (fixWeek.textContent = "WEEK");
  clearElement(forecasts);
  render();
});

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

async function loadData(city, defaultTemp) {
  defaultTemp ? (met = "metric") : (met = "imperial");
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=42d3755ff9952be93382336dbfe4f4ff&units=${met}`,
    { mode: "cors" }
  );
  const data = await response.json();
  fillData(data);
  fillIcon(data);
  console.log(data);
  return data;
}

//fill data from API
function fillData(data) {
  city.textContent = data.name.toUpperCase();
  cityCountry.textContent = data.sys.country;
  cityTemp.textContent = data.main.temp + (defaultTemp ? "°C" : "°F");
  cityWeather.textContent = data.weather[0].main.toUpperCase();
  cityFeel.textContent = data.main.feels_like + (defaultTemp ? "°C" : "°F");
  cityDesc.textContent = data.weather[0].description;
  cityHum.textContent = data.main.humidity + "%";
  cityWind.textContent =
    data.wind.speed + (defaultTemp ? " m/sec" : " miles/h");
  sunrise.textContent =
    "Sunrise " + dateToTime(data.sys.sunrise + data.timezone);
  console.log(data.sys.sunrise);
  sunset.textContent = "Sunset " + dateToTime(data.sys.sunset + data.timezone);
}

function dateToTime(date) {
  let time = new Date(date * 1000).toString();
  time = time.split(" ")[4].substring(0, 5);
  return time;
}

//fill data for Icon
function fillIcon(data) {
  const des = data.weather[0].id;
  iconWeather.className = `wi wi-owm-${des} icon`;
}

//load forecast data
async function loadDataForecast(cityName, met) {
  defaultTemp ? (met = "metric") : (met = "imperial");
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=42d3755ff9952be93382336dbfe4f4ff&units=${met}`,
    { mode: "cors" }
  );
  const data = await response.json();
  defaultWeek ? fillDataForecastToday(data) : fillDataForecastWeek(data);
}

function getDay(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date(date * 1000).getDay()];
}

function getTime(date) {
  return date.split(" ")[1].substring(0, 5);
}

function fillDataForecastToday(data) {
  for (let i = 0; i < 3; i++) {
    const forecastElement = document.importNode(forecastTemplate.content, true);

    let forecastTime = forecastElement.querySelector(".forecast-time");
    let forecastIcon = forecastElement.querySelector(".forecast-icon");
    let forecastDegree = forecastElement.querySelector(".forecast-degree");

    forecastTime.textContent =
      getDay(data.list[i].dt) + " " + getTime(data.list[i].dt_txt);
    forecastIcon.className = `forecast-icon wi wi-owm-${data.list[i].weather[0].id} icon`;
    forecastDegree.textContent = data.list[i].main.temp;

    forecasts.appendChild(forecastElement);
  }
}

function fillDataForecastWeek(data) {
  for (let i = 8; i < 25; i += 8) {
    const forecastElement = document.importNode(forecastTemplate.content, true);

    let forecastTime = forecastElement.querySelector(".forecast-time");
    let forecastIcon = forecastElement.querySelector(".forecast-icon");
    let forecastDegree = forecastElement.querySelector(".forecast-degree");

    forecastTime.textContent =
      getDay(data.list[i].dt) + " " + getTime(data.list[i].dt_txt);
    forecastIcon.className = `forecast-icon wi wi-owm-${data.list[i].weather[0].id} icon`;
    forecastDegree.textContent = data.list[i].main.temp;

    forecasts.appendChild(forecastElement);
  }
}

function render() {
  loadData(cityName, defaultTemp);
  loadDataForecast(cityName);
}

render();
