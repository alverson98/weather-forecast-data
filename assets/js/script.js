$(document).ready(function () {
  // VARIABLE DECLARATIONS

  // Search Section
  var cityInput = $("#city-input");
  var submitBtn = $("#submit-btn");
  var searchHistory = $("#search-history");

  // Current Weather Section
  var currentCityDate = $("#current-city-date");
  var currentIcon = $("#current-icon");
  var currentDescription = $("#current-description");
  var currentTemp = $("#current-temp");
  var currentHumidity = $("#current-humidity");
  var currentWindSpeed = $("#current-wind-speed");
  var currentUV = $("#currentUV");

  // Forecast Section
  var forecastWeather = $("#forecast-div");
  var forecastCard = $("div");
  var forecastCardTitle = $("h4");

  // Appending new elements
  //   $(forecastWeather).append(forecastCard);
  //   $(forecastCard).append(forecastCardTitle);
  //   $(forecastCard).append(forecastUl);
  //   $(forecastUl).append(
  //     forecastLiIcon,
  //     forecastLiDescription,
  //     forecastLiHighTemp,
  //     forecastLiLowTemp,
  //     forecastLiHumidity,
  //     forecastLiWindSpeed
  //   );

  // Assigning Classes to new elements
  $(forecastCard).addClass("card");
  $(forecastCardTitle).addClass("card-title");

  var weatherIcon = "";

  // Current Weather Data
  function getCurrentWeather(cityName) {
    var currentWeatherURL =
      "https://api.weatherbit.io/v2.0/current?city=" +
      cityName +
      "&country=US&key=020dba26b42c4d61b7324a5ea43152c7&units=I";
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
          uv: data.data[0].uv,
        };

        console.log(current);
        displayCurrent(current, cityName);
      });
  }

  // Forecasted Weather
  function getForecastWeather(cityName) {
    var forecastWeatherURL =
      "https://api.weatherbit.io/v2.0/forecast/daily?city=" +
      cityName +
      "&country=US&key=020dba26b42c4d61b7324a5ea43152c7&units=I&days=5";
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
          highTemp: data.data[0].high_temp,
          LowTemp: data.data[0].low_temp,
          humidity: data.data[0].rh,
          windSpeed: data.data[0].wind_spd,
        };
        displayForecast(forecast, cityName);
      });
  }
  buttonClick();
  function buttonClick() {
    // Submitting City - new input
    $(submitBtn).on("click", function (event) {
      event.preventDefault;

      var cityName = $(cityInput).val().trim();
      console.log(cityName);

      // function to access local storage
      var cityStorage = getCityStorage();
      var newCity = {
        name: cityName,
      };

      cityStorage.push(newCity);

      localStorage.setItem("cityStorage", JSON.stringify(cityStorage));

      // Calling function to display city buttons
      displaySearchHistory();

      // Calling functions for API calls
      getCurrentWeather(cityName);
      getForecastWeather(cityName);
    });

    // Submitting city - history
    //   $(cityBtn).on("click", function (event) {
    //     event.preventDefault;
    //       var cityName = $(cityInput).val().trim();
    //       console.log(cityName);

    //       // Calling functions for API calls
    //        getCurrentWeather(cityName);
    // getForecastWeather(cityName);

    //       // Calling Local storage function update
    //       updateStorage(cityName);
    //     }
    //   )});
  }

  function displaySearchHistory() {
    //Creating city history buttons
    var cityStorage = getCityStorage();

    for (var i = 0; i < cityStorage.length; i++) {
      var historyLi = document.createElement("li");
      $(searchHistory).append(historyLi);
      var cityBtn = document.createElement("button");
      $(historyLi).append(cityBtn);

      $(cityBtn).text(cityStorage[i].name);
    }
  }
  // Local Storage
  function getCityStorage() {
    var cityStorage = [];

    var storedCities = localStorage.getItem("cityStorage");

    if (storedCities !== null) {
      cityStorage = JSON.parse(storedCities);
    }

    return cityStorage;
  }

  // Displaying current weather
  function displayCurrent(current, cityName) {
    var weatherIconsURL =
      "https://www.weatherbit.io/static/img/icons/" + weatherIcon + ".png";

    var test = $(currentCityDate).text(cityName + ":     " + current.date);
    $(currentIcon).text(weatherIconsURL);
    $(currentDescription).text(current.weatherStatus);
    $(currentTemp).text(current.temp);
    $(currentHumidity).text(current.humidity);
    $(currentWindSpeed).text(current.windSpeed);
    $(currentUV).text(current.uv);
    console.log(test);
  }

  // Displaying 5-day forecast
  function displayForecast(forecast, cityName) {}
});
