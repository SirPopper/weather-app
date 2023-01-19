let locationInput = document.querySelector(".location-form");
let btnSubmit = document.querySelector(".btn-submit");
let city = "Munich";
let paraWeather = document.querySelector(".main-weather");
let paraCity = document.querySelector(".main-city");

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  city = locationInput.value;
  locationInput.value = "";
  render();
});

async function loadData(city) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=42d3755ff9952be93382336dbfe4f4ff`,
    { mode: "cors" }
  );
  const data = await response.json();
  console.log(data);
  paraWeather.textContent = data.weather[0].main;
  paraCity.textContent = data.name;
  return data;
}

function render() {
  loadData(city);
}

render();
