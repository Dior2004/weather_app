loaderValue.innerText = "Waiting your permission...";

const findMyState = () => {
  let address = "";

  const success = async (coordinates) => {
    loaderValue.innerText = "Loading...";

    address = coordinates.coords.latitude + "," + coordinates.coords.longitude;

    function searchForNewPlace(e) {
      e.preventDefault();
      defaultWeatherInfo(address);
      newLocation.value = "";
    }

    defaultWeatherInfo(address);

    functionCall(searchForNewPlace);
  };

  const error = () => {
    loaderValue.innerText = "Loading...";

    address = "Washington";
    defaultWeatherInfo(address);

    function searchForNewPlace(e) {
      e.preventDefault();
      defaultWeatherInfo(address);
      newLocation.value = "";
    }

    functionCall(searchForNewPlace);
  };

  function functionCall(searchForNewPlace) {
    searchForm.addEventListener("submit", searchForNewPlace);
    returnBack.addEventListener("click", searchForNewPlace);
  }

  async function defaultWeatherInfo(address) {
    const freeWeatherApi = `https://api.weatherapi.com/v1/forecast.json?key=039ce398b86741b895820456231506&q=${
      newLocation.value.trim() === "" ? address : newLocation.value.trim()
    }&days=7&aqi=yes&alerts=yes`;
    await fetch(freeWeatherApi)
      .then((data) => data.json())
      .then((allInfo) => weatherInfo(allInfo))
      .catch((error) => console.log("A small error has ocurred.", error));
  }

  let weatherInfo = (allInfo) => {
    // Date

    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let crDate = allInfo.current.last_updated;

    let dayIndex = new Date(
      `${
        months[parseInt(crDate.slice(5, 7) - 1)]
      } ${allInfo.current.last_updated.slice(8, 10)}, ${crDate.slice(
        0,
        4
      )} ${crDate.slice(-5)}`
    );

    var dayIndexName = dayIndex.toString().slice(0, 3).trim();

    // Day name
    const dayIndexNameMappings = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };

    dayTime.innerText = dayIndexNameMappings[dayIndexName] || "Weekday";
    let dayTimeVar = dayTime.innerText;

    function loaderFN(i) {
      if (i !== "Weekend") {
        loaderPage.style =
          "background-color: #2323a500; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px)";
        setTimeout(() => {
          loaderPage.style = "display: none;";
        }, 510);
      } else {
        loaderPage.style.display = "flex";
      }
    }

    loaderFN(dayTimeVar);

    currentDate.innerText = `${crDate.slice(8, 10)} ${
      months[parseInt(crDate.slice(5, 7) - 1)]
    } ${crDate.slice(0, 4)}`;
    location_name.innerText = `${allInfo.location.name}, ${allInfo.location.country}`;

    // icons

    mainIcon.setAttribute("src", `${allInfo.current.condition.icon}`);

    // temperature

    temperature.innerText = allInfo.current.temp_c + "°C";
    let iconData = allInfo.current.condition.text;
    weatherCondition.innerText = iconData;

    // pressure & humidity & wind

    pressure.innerText = allInfo.current.pressure_mb + " hPa";
    humidity.innerText = allInfo.current.humidity + " %";
    wind.innerText = allInfo.current.wind_kph + " km/h";

    // forecast

    var forecast = allInfo.forecast.forecastday;

    let elements = [];

    forecast.map((a) => {
      elements.push(a.day.condition.icon);

      let forecastDayName = new Date(
        `${months[parseInt(a.date.slice(5, 7) - 1)]} ${a.date.slice(
          -3
        )}, ${a.date.slice(0, 4)}`
      );
      elements.push(forecastDayName.toString().slice(0, 3));

      elements.push(`${a.day.avgtemp_c}°C`);
    });

    day1icon.setAttribute("src", `${elements[0]}`);
    day2icon.setAttribute("src", `${elements[3]}`);
    day3icon.setAttribute("src", `${elements[6]}`);

    day1_time.innerText = `${elements[1]}`;
    day2_time.innerText = `${elements[4]}`;
    day3_time.innerText = `${elements[7]}`;

    day1_temp.innerText = elements[2];
    day2_temp.innerText = elements[5];
    day3_temp.innerText = elements[8];

    // New location

    let form = document.querySelector(".search_area");
    locationChange.addEventListener("click", () => {
      form.style = "right: 0%; transition: 0.55s ease-in-out;";
      returnBack.addEventListener("click", () => {
        form.style = "right: -100%; transition: 0.55s ease-in-out;";
      });
    });
  };

  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
  }); // success & error functions
};

findMyState();
