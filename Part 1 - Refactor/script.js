import Data from "./config.js";
const searchBar = document.querySelector("#searchBar");
const container = document.querySelector(".container");
const cityNameContainer = document.querySelector(".city-name");

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
console.log("hello world");

searchBar.addEventListener("keyup", (event) => {
  console.log(event.target.value);
  if (event.key === "Enter") {
    const thisCity = event.target.value.toLowerCase();
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast/?q=${thisCity}
        &appid=${Data.key}`;
    event.currentTarget.value = "";
    console.log(apiUrl);
    getCityCoordinates(apiUrl).then((coords) =>
      getCityWeather(coords).then((data) => displayForecast(data))
    );
  }
});

const getCityCoordinates = async (apiUrl) => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    let lon = data.city.coord.lon;
    let lat = data.city.coord.lat;
    cityNameContainer.innerHTML = data.city.name;
    console.log(lon, lat);

    return { lon, lat };
  } catch (error) {
    console.error("Error:", "not a place!");

    return alert("Are you sure you aren't holding your map upside down?");

    // Handle the error here or throw it to be caught by the caller
    throw error;
  }
};

const getCityWeather = async (coord) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=${Data.key}`
    );
    const result = await response.json();
    console.log(result);
    console.log(
      "Welcome to this basic weather app. This is not a product but the product of an academic exercise."
    );
    return result;
  } catch (error) {
    console.error("Error:", error);

    // Handle the error here or throw it to be caught by the caller
    throw error;
  }
};

const displayForecast = (result) => {
  for (let i = 0; i < 5; i++) {
    // Use the remainder operator (%) to switch from saturday (last in array) back to sunday (first in array)
    const date = new Date();
    let dayOfTheWeek = weekdays[(date.getDay() + i) % 7];
    const data = result.list[i];

    // Create the elements with Data
    const card = document.createElement("div");
    card.classList.add("card");
    container.appendChild(card);

    const imageBox = document.createElement("div");
    imageBox.classList.add("imgBx");
    card.appendChild(imageBox);

    const cardImg = document.createElement("img");
    cardImg.src =
      "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    imageBox.appendChild(cardImg);

    const contentBox = document.createElement("div");
    contentBox.classList.add("contentBx");
    card.appendChild(contentBox);

    const cardHeader = document.createElement("h2");
    cardHeader.innerHTML = dayOfTheWeek;
    contentBox.appendChild(cardHeader);

    const tempDescription = document.createElement("h4");
    tempDescription.innerHTML = data.weather[0].description;
    contentBox.appendChild(tempDescription);

    const currentTempBox = document.createElement("div");
    currentTempBox.classList.add("color");
    contentBox.appendChild(currentTempBox);

    const currentTempHeader = document.createElement("h3");
    currentTempHeader.innerHTML = "Temp:";
    currentTempBox.appendChild(currentTempHeader);

    const currentTemp = document.createElement("span");
    currentTemp.classList.add("current-temp");
    currentTemp.innerHTML = Math.round(data.main.temp) + "°C";
    currentTempBox.appendChild(currentTemp);

    const minMaxTemperatures = document.createElement("div");
    minMaxTemperatures.classList.add("details");
    contentBox.appendChild(minMaxTemperatures);

    const minMaxTempHeader = document.createElement("h3");
    minMaxTempHeader.innerHTML = "More:";
    minMaxTemperatures.appendChild(minMaxTempHeader);

    const minTemp = document.createElement("span");
    minTemp.classList.add("min-temp");
    minTemp.innerHTML = Math.round(data.main.temp_min) + "°C";
    minMaxTemperatures.appendChild(minTemp);

    const maxTemp = document.createElement("span");
    maxTemp.classList.add("max-temp");
    maxTemp.innerHTML = Math.round(data.main.temp_max) + "°C";
    minMaxTemperatures.appendChild(maxTemp);
  }
};
