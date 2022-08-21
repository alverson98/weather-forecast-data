$(document).ready(function () {
  // VARIABLE DECLARATIONS

  // HTML id variables
  var cityInput = $("#city-input");
  var searchHistory = $("#search-history");
  var currentWeather = $("#current-weather");
  var forecast = $("#forecast");

  // Search variables
  var cityName = "Chicago";
  var cityHistory = [];

  // API - weatherbit.io
  //current weather
  var currentWeatherURL =
    "https://api.weatherbit.io/v2.0/current?city=" +
    cityName +
    "&key=020dba26b42c4d61b7324a5ea43152c7&units=I";
  getCurrentWeather();

  function getCurrentWeather() {
    fetch(currentWeatherURL)
      .then(function (response) {
        return response.json();
      })
      // setting variables of data from API
      .then(function (data) {
        var city = data.data[0].city_name;
        var date = data.data[0].datetime;
        var weatherIcon = data.data[0].weather.icon;
        var weatherStatus = data.data[0].weather.description;
        var temp = data.data[0].temp;
        var humidity = data.data[0].rh;
        var windSpeed = data.data[0].wind_spd;
        var uv = data.data[0].uv;
      });
  }
});
