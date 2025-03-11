const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')

const notFoundSection = document.querySelector(".not-found")

const searchCitySection = document.querySelector(".search-sity")

const countryText = document.querySelector(".country-text")
const tempText = document.querySelector(".temp-text")
const conditionText =document.querySelector(".condition-text")
const humidityValueText = document.querySelector(".humidity-value-text")
const windValueText = document.querySelector(".wind-value-text")
const weatherSummaryImg = document.querySelector(".weather-summary-img")
const currentDateText = document.querySelector(".current-date-text")
const forecastItemsContainer = document.querySelector(".forecast-items-container")



const apiKey = "fd461d4c3b20cc06e3ca2fab4e99f83d"


searchBtn.addEventListener("click", () => {
    if(cityInput.value.trim() != ""){
         updateWeatherInfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()

    }
})



cityInput.addEventListener("keydown", (event) => {

    if(event.key == "Enter" && cityInput.value.trim() != ""){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()
    }
})

async function getFetchData(endpoint, city) {
   
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)
    return response.json()
    
}

function getWeatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate() {
    const currentDate = new Date() 
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',

    }
     return currentDate.toLocaleDateString('en-GB', options)
}



async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city)
   
     if(weatherData.cod != 200){
       
       showDisplaySection(notFoundSection)
        return
     }

    console.log(weatherData)

    const {
        name: country, 
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData
       

     countryText.textContent = country
     tempText.textContent = Math.round(temp)  + " ℃"
     conditionText.textContent = main
     humidityValueText.textContent = humidity + " %"
     windValueText.textContent = speed + " M/s"
     
     currentDateText.textContent = getCurrentDate()
     weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
      

     await updateForecastInfo(city)
     showDisplaySection(weatherInfoSection)


}

async function updateForecastInfo(city){
    const forecastsData = await getFetchData("forecast", city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    
    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
             
          updateForecastItems(forecastWeather)
        }
         
    })
    
}

function updateForecastItems(weatherData){
     console.log(weatherData)

     const {
        dt_txt: date,
        weather: [{id }],
        main: {temp}
     } = weatherData

     const dateTaken = new Date(date)
     const dateOption = {
        day: '2-digit',
        month: 'short'
     }

     const dateResult = dateTaken.toLocaleDateString("en-US", dateOption)

     const forecastItem = `
        <div class="forecast-item">
                 <h5 class="forecast-item-date regular-text">
                    ${dateResult}
                 </h5>
                 <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
                 <h5 class="forecast-item-temp">${Math.round(temp)} ℃</h5>
        </div>
       
     `

     forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem)
}

function showDisplaySection(section){
        [weatherInfoSection, searchCitySection,notFoundSection].forEach(section => section.style.display = "none" )

        section.style.display = "flex"
}

