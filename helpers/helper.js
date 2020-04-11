//Libs
let nodeEmoji = require("node-emoji");

const kelvinToCelsius = temp => { return temp - 273.15; };
const kelvinToFahrenheit = temp => { return temp * 9/5 - 459.67; };
const meterToKilometer = meassure => { return meassure / 1000; };
const mpsToKmph = meassure => { return meassure * 3.6; };
const secToHour = time => { return time / 3600 };
const unixToDateString = (time, shift) => {
  let utcDate = new Date(time * 1000);
  let shiftHour = secToHour(shift);
  utcDate.setHours(utcDate.getHours() + shiftHour);
  return utcDate.toLocaleDateString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};
const weatherToEmoji = (condition, id, icon) => {
  switch (condition) {
    case "Thunderstorm":
      if (id >= 200 && id <= 202 || id >= 230 && id <= 232) return nodeEmoji.emojify(":thunder_cloud_and_rain:");
      else return nodeEmoji.emojify(":lightning_cloud:");
    case "Drizzle":
      return nodeEmoji.emojify(":rain_cloud:");
    case "Rain":
      if (id >= 500 && id <= 504) return nodeEmoji.emojify(":sun_behind_rain_cloud:");
      else if (id === 511) return nodeEmoji.emojify(":snow_cloud:");
      else return nodeEmoji.emojify(":rain_cloud:");
    case "Snow":
      return nodeEmoji.emojify(":snowflake:");
    case "Clouds":
      if (id === 801) return nodeEmoji.emojify(":partly_sunny:");
      else return nodeEmoji.emojify(":cloud:");
    case "Clear":
      if (icon === "01d") return nodeEmoji.emojify(":sunny:");
      else return nodeEmoji.emojify(":new_moon:");
    default:
      if (condition === "Tornado") return nodeEmoji.emojify(":tornado:");
      else if (condition === "Ash") return nodeEmoji.emojify(":volcano:");
      else if (condition) return nodeEmoji.emojify(":fog:");
      else return nodeEmoji.emojify(":grey_question:");
  }
};
const windDegreeToEmoji = degree => {
  if (degree === 0 || degree === 360) return nodeEmoji.emojify(":arrow_right:");
  else if (degree > 0 && degree < 90) return nodeEmoji.emojify(":arrow_upper_right:");
  else if (degree === 90) return nodeEmoji.emojify(":arrow_up:");
  else if (degree > 90 && degree < 180) return nodeEmoji.emojify(":arrow_upper_left:");
  else if (degree === 180) return nodeEmoji.emojify(":arrow_left:");
  else if (degree > 180 && degree < 270) return nodeEmoji.emojify(":arrow_lower_left:");
  else if (degree === 270) return nodeEmoji.emojify(":arrow_down:");
  else return nodeEmoji.emojify(":arrow_lower_right:"); 
};

module.exports.formatWeatherJSON = response => {
  return {
    coord: {
      lon: response.coord.lon.toString(),
      lat: response.coord.lat.toString()
    },
    weather: {
      main: response.weather[0].main,
      description: response.weather[0].description
    },
    temp: {
      celsius: {
        current: `${kelvinToCelsius(response.main.temp).toFixed(2)} °C`,
        feelsLike: `${kelvinToCelsius(response.main.feels_like).toFixed(2)} °C`,
        min: `${kelvinToCelsius(response.main.temp_min).toFixed(2)} °C`,
        max: `${kelvinToCelsius(response.main.temp_max).toFixed(2)} °C`
      },
      fahrenheit: {
        current: `${kelvinToFahrenheit(response.main.temp).toFixed(2)} °F`,
        feelsLike: `${kelvinToFahrenheit(response.main.feels_like).toFixed(2)} °F`,
        min: `${kelvinToFahrenheit(response.main.temp_min).toFixed(2)} °F`,
        max: `${kelvinToFahrenheit(response.main.temp_max).toFixed(2)} °F`
      },
      pressure: `${response.main.pressure} hPa`,
      humidity: `${response.main.humidity} %`
    },
    visibility: `${meterToKilometer(response.visibility).toFixed(2)} Km/h`,
    wind: {
      speed: `${mpsToKmph(response.wind.speed).toFixed(2)} Km/h`,
      degree: `${response.wind.deg}°`
    },
    country: response.sys.country,
    city: response.name,
    timezone: `${secToHour(response.timezone)} UTC`,
    sunrise: unixToDateString(response.sys.sunrise, response.timezone),
    sunset: unixToDateString(response.sys.sunset, response.timezone)
  };
};

module.exports.formatWeatherEmojiOne = response => {
  let conditionEmoji = weatherToEmoji(response.weather[0].main, response.weather[0].id, response.weather[0].icon);
  let temperature = `${kelvinToCelsius(response.main.temp).toFixed(2)} °C`;
  return nodeEmoji.emojify(`${conditionEmoji} ${temperature}`);
};

module.exports.formatWeatherEmojiFour = response => {
  let conditionEmoji = weatherToEmoji(response.weather[0].main, response.weather[0].id, response.weather[0].icon);
  let temperature = `${kelvinToCelsius(response.main.temp).toFixed(2)} °C`;
  let windSpeed = `${mpsToKmph(response.wind.speed).toFixed(2)} Km/h`;
  let windDegreeEmoji = windDegreeToEmoji(response.wind.deg);
  return nodeEmoji.emojify(`${response.name}: ${conditionEmoji} :thermometer: ${temperature} :wind_blowing_face: ${windDegreeEmoji} ${windSpeed}`);
};