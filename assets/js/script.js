$(document).ready(function () {
  // VARIABLE DECLARATIONS

  // Search Section
  var cityInput = $("#city-input");
  var submitBtn = $("#submit-btn");
  var searchHistory = $("#search-history");
  var cityBtn = $(".city-btn");

  // Current Weather Section
  var currentCityDate = $("#current-city-date");
  var currentIcon = $("#current-icon");
  var currentDescription = $("#current-description");
  var currentTemp = $("#current-temp");
  var currentHumidity = $("#current-humidity");
  var currentWindSpeed = $("#current-wind-speed");
  var currentUV = $("#currentUV");

  // Forecast Section -
  var forecastWeather = $("#forecast-div");

  // City History Buttons on page load
  displaySearchHistory();

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
        console.log(data);
        var forecastData = data;
        // var forecastDataArray = [];
        // console.log(forecastDataArray);
        // for (var i = 0; i < forecastData.length; i++) {
        //   var forecast = {
        //     date: data.data[i].datetime,
        //     weatherIcon: data.data[i].weather.icon,
        //     weatherStatus: data.data[i].weather.description,
        //     highTemp: data.data[i].high_temp,
        //     LowTemp: data.data[i].low_temp,
        //     humidity: data.data[i].rh,
        //     windSpeed: data.data[i].wind_spd,
        //   };
        // }
        // forecastDataArray.push(forecast);
        displayForecast(forecastData, cityName);
      });
  }

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

  //Submitting city - history
  $(".city-btn").on("click", function (event) {
    event.preventDefault;
    var eventTarget = event.target;
    var cityName = eventTarget.id;
    console.log(cityName);

    // Calling functions for API calls
    getCurrentWeather(cityName);
    getForecastWeather(cityName);
  });

  function displaySearchHistory() {
    //Creating city history buttons
    var cityStorage = getCityStorage();

    for (var i = 0; i < cityStorage.length; i++) {
      var historyLi = document.createElement("li");
      $(searchHistory).append(historyLi);
      var cityBtn = document.createElement("button");
      $(historyLi).append(cityBtn);

      $(cityBtn).text(cityStorage[i].name);
      $(cityBtn).attr("id", cityStorage[i].name);
      $(cityBtn).addClass("city-btn");
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
      '<img src="https://www.weatherbit.io/static/img/icons/' +
      current.weatherIcon +
      '.png"/>';

    $(currentCityDate).text(cityName + ":     " + current.date);
    $(currentIcon).append(weatherIconsURL);
    $(currentDescription).text(current.weatherStatus);
    $(currentTemp).text(current.temp);
    $(currentHumidity).text(current.humidity);
    $(currentWindSpeed).text(current.windSpeed);
    $(currentUV).text(current.uv);
  }

  //Displaying 5-day forecast
  function displayForecast(forecastData) {
    // creating a card for each forecast day
    for (var i = 0; i < forecastData.data.length; i++) {
      var weatherIconsURL =
        '<img src="https://www.weatherbit.io/static/img/icons/' +
        forecastData.data[i].weather.icon +
        '.png"/>';

      var forecastCard = document.createElement("div");
      var forecastCardTitle = document.createElement("h4");
      var forecastUl = document.createElement("ul");

      // li for every required data to be displayed
      var forecastLiDate = document.createElement("li");
      var forecastLiIcon = document.createElement("li");
      var forecastLiDescription = document.createElement("li");
      var forecastLiHighTemp = document.createElement("li");
      var forecastLiLowTemp = document.createElement("li");
      var forecastLiHumidity = document.createElement("li");
      var forecastLiWindSpeed = document.createElement("li");

      // Appending new elements
      $(forecastWeather).append(forecastCard);
      $(forecastCard).append(forecastCardTitle);
      $(forecastCard).append(forecastUl);
      $(forecastUl).append(
        forecastLiDate,
        forecastLiIcon,
        forecastLiDescription,
        forecastLiHighTemp,
        forecastLiLowTemp,
        forecastLiHumidity,
        forecastLiWindSpeed
      );
      //Displaying weather icon
      $(forecastLiIcon).append(weatherIconsURL);

      // Assigning Classes to appended elements for styling
      $(forecastCard).addClass("card");
      $(forecastCardTitle).addClass("card-title");

      // Adding text to display data
      $(forecastLiDate).text(forecastData.data[i].datetime);
      $(forecastLiDescription).text(forecastData.data[i].weather.description);
      $(forecastLiHighTemp).text(forecastData.data[i].high_temp);
      $(forecastLiLowTemp).text(forecastData.data[i].low_temp);
      $(forecastLiHumidity).text(forecastData.data[i].rh);
      $(forecastLiWindSpeed).text(forecastData.data[i].wind_spd);
    }
  }
});
