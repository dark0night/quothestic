import axios from "https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm";


export function getWeather(lat, lon, timezone) {
  return axios
    .get(
    // waste link "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=auto",
        //"https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime",
        "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime"
      ,{
        params: {
          latitude: lat,
          longitude: lon,
          timezone,
        },
      }
    )
    .then(({ data }) => {
      // console.log(data)
      return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
  
      };
    });
}

function parseCurrentWeather({ current_weather, daily }) {
  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode,
  } = current_weather;

  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [maxFeelsLike],
    apparent_temperature_min: [minFeelsLike],
    precipitation_sum: [precip],
  } = daily;

  return {
    currentTemp:Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    lowFeelsLike: Math.round(minFeelsLike),
    windSpeed:Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    iconCode,
  };
}

function parseDailyWeather({daily}) {
  return daily.time.map((time, index) => {
    return {
      timestamp : time * 1000,
      iconCode: daily.weathercode[index],
      maxTemp:Math.round(daily.temperature_2m_max[index])
    }
  })

}






