const searchbox = document.getElementById('searchbox');
const area = document.getElementById('area');
const time = document.getElementById('time');
const condition = document.getElementById('condition');
const conditionIconElement = document.getElementById('condition-icon');
const temp = document.getElementById('temp');
const uv = document.getElementById('uv');
const feels = document.getElementById('feels');
const precip = document.getElementById('precip');
const humid = document.getElementById('humid');
const wind = document.getElementById('wind');
const dailyForecastContainer = document.querySelector('.daily-tile-container');
const hourlyForecastContainer = document.querySelector('.hourly-forecast-tile');

async function getWeather(country) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b04164c4e2604ea99d424433241104&q=` 
        + country + `&days=3&aqi=yes&alerts=no`, {mode: 'cors'});
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        alert('Something terrible happened here', error);
        return null;
    }
};

function getDay() {
    const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const currentDay = new Date().getDay();

    const today = week[currentDay];
    const tomorrow = week[(currentDay + 1) % 7];
    const nextDay = week[(currentDay + 2) % 7]
    const lastDay = week[(currentDay + 3) % 7]

    return { today, tomorrow, nextDay, lastDay };
}

function updateDOM(data) {

    const { today, tomorrow, nextDay, lastDay } = getDay();

    if (data) {

        //top section

        const city = data.location.name;
        const region = data.location.region;
        const country = data.location.country;

        const localtime = data.current.last_updated;

        const conditionText = data.current.condition.text;
        const conditionIcon = data.current.condition.icon;

        const tempF = data.current.temp_f;
        const tempC = data.current.temp_c;

        const uvIndex = data.current.uv;
        const feelsLikeC = data.current.feelslike_c;
        const feelsLikeF = data.current.feelslike_f;
        const precipitationIN = data.current.precip_in;
        const precipitationMM = data.current.precip_mm;
        const humidity = data.current.humidity;
        const windSpeedKPH = data.current.wind_kph;
        const windSpeedMPH = data.current.wind_mph;


        area.textContent = `${city}, ${region}, ${country}`;
        time.textContent = `${today}, ${localtime}`;

        condition.textContent = conditionText;
        conditionIconElement.src = `https:${conditionIcon}`;
        temp.textContent = `${tempF}°F / ${tempC}°C`;

        uv.textContent = `UV Index:\n${uvIndex}`;
        feels.textContent = `Feels Like:\n${feelsLikeF}°F / ${feelsLikeC}°C`;   
        precip.textContent = `Precipitation:\n${precipitationIN}in. / ${precipitationMM}mm.`;  
        humid.textContent = `Humidity:\n${humidity}%`;   
        wind.textContent = `Windspeed:\n${windSpeedMPH}mph / ${windSpeedKPH}kph`;    

        //mid-section

        const threeDayForecast = data.forecast.forecastday;

        threeDayForecast.forEach(element => {
            let dayForecastDate = element.date;
            let dayForecastImageURL = element.day.condition.icon;
            let dayAverageTempC = element.day.avgtemp_c;
            let dayAverageTempF = element.day.avgtemp_f;

            let dayForecastIcon = `https:${dayForecastImageURL}`;

            const subTileDiv = document.createElement('div');
            subTileDiv.classList.add('sub-tile');
            dailyForecastContainer.appendChild(subTileDiv);

            const subTileHeader = document.createElement('h3');
            subTileHeader.textContent = dayForecastDate;
            subTileDiv.appendChild(subTileHeader);

            const subTileImageContainer = document.createElement('div');
            subTileImageContainer.classList.add('forecast-icon-container');
            const subTileImage = document.createElement('img');
            subTileImage.alt = 'weather-icon';
            subTileImage.src = dayForecastIcon;
            subTileDiv.appendChild(subTileImageContainer);
            subTileImageContainer.appendChild(subTileImage);

            const subTileFooter = document.createElement('h3');
            subTileFooter.textContent = `${dayAverageTempF}°F / ${dayAverageTempC}°C`;
            subTileDiv.appendChild(subTileFooter);
        });

        //bottom section 

        const hourlyForecast


    } else {
        alert('No data available');
    }
}

window.onload = getWeather('Vancouver').then(updateDOM);

searchbox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        let searchedCountry = searchbox.value;
        getWeather(searchedCountry).then(updateDOM);
    }
});