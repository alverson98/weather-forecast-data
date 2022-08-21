$(document).ready(function () {
  // VARIABLE DECLARATIONS

  // HTML id variables
  var cityInput = $("#city-input");
  var searchHistory = $("#search-history");
  var forecastWeather = $("#forecast");
  var submitBtn = $("#submit-btn");

  // Search variables
  var cityName = "";
  var cityHistoryArray = [];

  // API - weatherbit.io
  var currentWeatherURL =
    "https://api.weatherbit.io/v2.0/current?city=" +
    cityName +
    "&country=US&key=020dba26b42c4d61b7324a5ea43152c7&units=I";

  var forecastWeatherURL =
    "https://api.weatherbit.io/v2.0/forecast/daily?city=" +
    cityName +
    "&country=US&key=020dba26b42c4d61b7324a5ea43152c7&units=I&days=5";

  // Current Weather Data
  function getCurrentWeather(cityName) {
    fetch(currentWeatherURL)
      .then(function (response) {
        return response.json();
      })
      // setting variables of data from API
      .then(function (data) {
        var current = {
          city: data.data[0].city_name,
          date: data.data[0].datetime,
          weatherIcon: data.data[0].weather.icon,
          weatherStatus: data.data[0].weather.description,
          temp: data.data[0].temp,
          humidity: data.data[0].rh,
          windSpeed: data.data[0].wind_spd,
          uv: data.data[1].uv,
        };
      });
  }

  // Forecasted Weather
  function getForecastWeather(cityName) {
    fetch(forecastWeatherURL)
      .then(function (response) {
        return response.json();
      })
      // setting variables of data from API
      .then(function (data) {
        var forecast = {
          date: data.data[0].datetime,
          weatherIcon: data.data[0].weather.icon,
          weatherStatus: data.data[0].weather.description,
          temp: data.data[0].temp,
          humidity: data.data[0].rh,
          windSpeed: data.data[0].wind_spd,
        };
      });
  }

  // Submitting City - new input or history
  $(submitBtn, cityBtn).on("click", function (event) {
    event.preventDefault;
    var clickEvent = $(event.target);
    // new city vs. city history select
    if (clickEvent.id === submitBtn) {
      var cityName = $(cityInput).val().trim();
    } else {
      var cityName = clickEvent.innerText;
    }

    // Calling functions for API calls
    getCurrentWeather(cityName);
    getForecastWeather(cityName);

    // Calling Local storage function update
    updateStorage(cityName);
  });

  // Local Storage
  function updateStorage(cityName) {
    var cityHistory = JSON.parse(localStorage.getItem(cityHistory));
    cityHistory.push(cityHistoryArray);

    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
  }
});
