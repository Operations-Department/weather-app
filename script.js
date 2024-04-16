async function getweather() {
    try {
        const response = await fetch('https://api.weatherapi.com/v1/current.json?key=b04164c4e2604ea99d424433241104&q=tashkent&aqi=no', {mode: 'cors'});
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Something terrible happened here', error);
    }
};

window.onload = getweather();