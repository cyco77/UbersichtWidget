import { css } from "uebersicht";

const openWeatherMapApiKey = "";

/**
 * OpenWeatherMaps accepts three parameters here:
 *
 * kelvin
 * imperial
 * metric
 *
 * Default is: kelvin
 */
const units = "metric";
const language = "de";

const additionLocations = [
  { code: "10557,DE", name: "Berlin" }, // code => PostalCode,CountryCode
  { code: "28005,ES", name: "Madrid" },
  { code: "10016,US", name: "New York" },
];

export const color1 = "#EBBA55";
export const color2 = "#FFFFFF";

export const className = `
	left: 50px;
	top: 00px;
	font-family: "Impact";
	z-index: 1;
  position: relative;
`;

const dayNumberCss = css`
  font-size: 500px;
  background: -webkit-linear-gradient(${color1}, transparent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 0px #00000000;
`;

const dayInWeekCss = css`
  color: ${color2};
  text-transform: uppercase;
  position: absolute;
  transform: rotate(-90deg);
  top: 330px;
  font-size: 50px;
`;

const monthNameCss = css`
  color: ${color2};
  text-transform: uppercase;
  position: absolute;
  font-size: 70px;
  top: 200px;
  left: 170px;
`;

const timeCss = css`
  color: ${color2};
  text-transform: uppercase;
  position: absolute;
  font-size: 35px;
  top: 300px;
  left: 170px;
`;

const weatherCss = css`
  border-top: 4px solid ${color2};
  padding-top: 10px;
  color: ${color2};
  position: absolute;
  font-size: 35px;
  top: 350px;
  left: 170px;
`;

const weatherConditionCss = css`
  display: flex;
`;

const weatherIconCss = css`
  width: 40px;
  height: 40px;
`;

export const renderWeather = (weather) => {
  let unit = units == "imperial" ? "F" : units == "kelvin" ? "K" : units == "metric" ? "C" : "K";
  return (
    <div id='weather'>
      <div>
        {weather.city} {weather.temp} °{unit}
      </div>
      <div className={weatherConditionCss}>
        <img className={weatherIconCss} src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} />
        {weather.conditions}
      </div>
    </div>
  );
};

export const render = ({ monthName, dayNumber, dayInWeek, time, localWeather, additionalWeatherList }) => {
  return (
    <div>
      <div className={dayNumberCss}>{dayNumber}</div>
      <div className={dayInWeekCss}>{dayInWeek}</div>
      <div className={monthNameCss}>{monthName}</div>
      <div className={timeCss}>{time}</div>
      <div className={weatherCss}>
        {renderWeather(localWeather)}
        {additionalWeatherList !== undefined &&
          additionalWeatherList.map(function (additionalWeather, i) {
            return renderWeather(additionalWeather);
          })}
      </div>
    </div>
  );
};

export const refreshFrequency = false;

export const updateState = (data, previousState) => ({
  ...previousState,
  ...data,
});

const execute = (action, interval) => {
  action();

  setInterval(action, interval);
};

export const command = async (dispatch) => {
  // Update Date & Time once a minute
  execute(() => {
    const now = new Date();

    let monthName = months[now.getMonth()];
    let dayNumber = padZero(now.getDate(), 2);
    let dayInWeek = weekdays[now.getDay()];
    let time = padZero(now.getHours(), 2) + ":" + padZero(now.getMinutes(), 2);

    dispatch({
      monthName: monthName,
      dayNumber: dayNumber,
      dayInWeek: dayInWeek,
      time: time,
    });
  }, 1000 * 60);

  // Update weather once in an hour
  execute(() => fetchLocalWeather(dispatch), 1000 * 60 * 60);

  // Update weather once in an hour
  execute(() => fetchAdditionalWeather(dispatch), 1000 * 60 * 60);
};

const padZero = (num, places) => String(num).padStart(places, "0");

const fetchLocalWeather = (dispatch) => {
  geolocation.getCurrentPosition(async (geo) => {
    const lat = geo.position.coords.latitude;
    const lon = geo.position.coords.longitude;

    let localWeather = await fetchWeather(lat, lon);

    dispatch({ localWeather: localWeather });
  });
};

const fetchAdditionalWeather = async (dispatch) => {
  let promises = [];

  additionLocations.forEach((location) => {
    let promise = new Promise(async (resolve, reject) => {
      let coordinates = await fetchCoordinates(location.code);

      let additionalWeather = await fetchWeather(coordinates.lat, coordinates.lon);
      additionalWeather.city = location.name;

      resolve(additionalWeather);
    });

    promises.push(promise);
  });

  Promise.all(promises).then((values) => {
    dispatch({ additionalWeatherList: values });
  });
};

const fetchCoordinates = (postacodeCountryCode) => {
  return new Promise(function (resolve) {
    fetch(
      `http://127.0.0.1:41417/http://api.openweathermap.org/geo/1.0/zip?zip=${postacodeCountryCode}&appid=${openWeatherMapApiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        resolve({
          lat: data.lat,
          lon: data.lon,
        });
      });
  });
};

const fetchWeather = (lat, lon) => {
  return new Promise(function (resolve) {
    fetch(
      `http://127.0.0.1:41417/https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${openWeatherMapApiKey}&lang=${language}`
    )
      .then((res) => res.json())
      .then((data) => {
        let captalizeWord = (text) =>
          text
            .toLowerCase()
            .split(" ")
            .map((i, j) => i.charAt(0).toUpperCase() + i.slice(1))
            .join(" ");

        resolve({
          conditions: captalizeWord(data.weather[0].description),
          temp: data.main.temp,
          city: data.name,
          icon: data.weather[0].icon,
        });
      });
  });
};

export const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

export const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
