import {getWeather} from "./weather.js";
import {ICON_MAP} from "./iconMap.js";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({coords}) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone)

      .then(renderWeather)

      .catch(e => {
        console.error(e)
        alert("Error getting weather")
      })

}

function positionError() {
  alert(
    "There was an error getting your location. Please allow us to use your location and refresh the page."
  )
}

function renderWeather({ current,daily}) {
  renderCurrentweather(current)
  renderDailyweather(daily)
  document.body.classList.toggle("blur", false)

}

 



// function setValue(selector,value,{parent = document} = {} ){
//   parent.querySelector(`[data-${selector}]`).textContent = value
// }
function setValue(selector, value, { parent = document } = {}) {
  const element = parent.querySelector(`[data-${selector}]`);
  if (element) {
    element.textContent = value;
  } else {
    console.error(`Element with selector '[data-${selector}]' not found.`);
  }
}

function getIconUrl(iconCode){
  return `w-icons/${ICON_MAP.get(iconCode)}.png`

}
const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentweather(current){
  currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp", current.currentTemp)
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  setValue("current-fl-high", current.highFeelsLike)
  setValue("current-fl-low", current.lowFeelsLike)
  setValue("current-wind", current.windSpeed)
  setValue("current-precip", current.precip)
}


const DAY_FORMATTER = new Intl.DateTimeFormat(undefined,{weekday:"long"})
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyweather(daily){
  dailySection.innerHTML = ""
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true)
    setValue("temp", day.maxTemp,{parent:element})
    setValue("date", DAY_FORMATTER.format(day.timestamp),{parent:element}, {parent:element})
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.append(element)

    
  });

}
