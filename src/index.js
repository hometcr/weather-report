

const currentState = {
    city: "dallas",
    latitude: 38.9696,
    longitude: 77.3861,
    temp: 72,
    weather: "snowy"
}

const getWeatherFromCity = () => {
    axios
        .get(`http://localhost:5000/location`, {
            params: {
                q: currentState.city
            },
        })
        .then((response) => {
            currentState.latitude = response.data[0]['lat'];
            currentState.longitude = response.data[0]['lon'];
            console.log(`latitude is ${currentState.latitude}`);
            console.log(`longitude is ${currentState.longitude}`);
            getWeatherFromCoords();

        })
        .catch((error) => {
            console.log('I found an error!')
            console.log(error)
        });
    }


const changeTempColor = (tempStr) => {
    const currentTemp = document.getElementById('temp');
    tempStr = currentTemp.textContent.slice(0, -1);
    temp = parseInt(tempStr);

    let color;
    if (temp < 20) {
        color = "lightblue";
    } else if (temp < 40) {
        color = "blue";
    } else if (temp < 60) {
        color = "green"
    } else if (temp < 80) {
        color = "orange"
    } else if (temp < 100) {
        color = "red"
    };

    return color;
}


const changeLandscape = (temp) => {
    const currentLandscape = document.getElementById('landscape_photo');
    if (temp < 40) {
        currentLandscape.src = "assets/snowy-landscape.jpg"
    } else if (temp < 75) {
        currentLandscape.src = "assets/green-landscape.jpg"
    } else if (temp < 90) {
        currentLandscape.src = "assets/beach-landscape.jpg"
    } else {
        currentLandscape.src = "assets/desert-landscape copy.jpg"
    }
}

const updateSky = (weather) => {
    const currentSky = document.getElementById('sky_photo')
    if (weather.includes("snow")) {
        currentState.weather = "snowy"
        currentSky.src = "assets/snowy-sky-1.jpg"
        selectElement("sky_options", "snowy");
    } else if (weather.includes("cloud")) {
        currentState.weather = "cloudy"
        currentSky.src = "assets/cloudy-sky.jpg"
        selectElement("sky_options", "cloudy");
    } else if (weather.includes("rain") || weather.includes("storm")) {
        currentState.weather = "rainy"
        currentSky.src = "assets/stormy-sky-1.jpg"
        selectElement("sky_options", "rainy");
    } else {
        currentState.weather = "sunny"
        currentSky.src = "assets/sunny-sky-1.jpg"
        selectElement("sky_options", "sunny");
    }
}

const getWeatherFromCoords = () => {
    axios 
        .get(`http://localhost:5000/weather`, {
            params: {
                lat: currentState.latitude,
                lon: currentState.longitude
            }
        })
        .then((response) => {
            console.log(response);

            // get temp and update
            kelvinTemp = response.data["main"]["temp"]
            tempDegF = kelvinToDegF(kelvinTemp)
            updateTemp(tempDegF);

            // get weather and update
            weather = response.data["weather"][0]["description"];
            currentState.weather = weather;
            updateSky(weather);
        })
        .catch((error) => {
            console.log(error)
        })
}

const updateTemp = (temp) => {
    const currentTemp = document.getElementById('temp');
    // update state
    currentState.temp = temp
    // update temp value
    currentTemp.textContent = `${Math.floor(temp)}°`
    // update temp color
    tempColor = changeTempColor(temp);
    currentTemp.style.color = tempColor;
    // update landscape
    changeLandscape(temp);
}

const updateCity = (city) => {
    city = capitalizeFirstLetter(city)
    const currentCity = document.getElementById('city');
    currentCity.textContent = city
    getWeatherFromCity()
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


const kelvinToDegF = (kelvinTemp) => {
    let tempDegF = (kelvinTemp - 273.15) * (9 / 5) + 32
    return tempDegF
}

const raiseTemp = () => {
    const currentTemp = document.getElementById('temp');
    temp = currentTemp.textContent.slice(0, -1);
    newTemp = parseInt(temp) + 1;
    currentState.temp = newTemp
    updateTemp(newTemp)
}

const lowerTemp = () => {
    const currentTemp = document.getElementById('temp');
    temp = currentTemp.textContent.slice(0, -1);
    newTemp = parseInt(temp) - 1;
    currentState.temp = newTemp
    updateTemp(newTemp);
}

const selectElement = (id, valueToSelect) => {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

const registerEventHandlers = () => {
    getWeatherFromCity()

    const raiseTempButton = document.getElementById('up_arrow');
    raiseTempButton.addEventListener('click', raiseTemp)

    const lowerTempButton = document.getElementById('down_arrow');
    lowerTempButton.addEventListener('click', lowerTemp)

    const skyOptions = document.getElementById("sky_options")
    sky_options.addEventListener('change', changeSky = (event) => {
        updateSky(event.target.value)
    })
    


    // call functions to always run
    // updateCityName();


    // call functions to run on events
    // const currentTempButton = document.getElementById('currentTempButton');
    // currentTempButton.addEventListener('click', findLatAndLong);

};


// when site loads, run registerEventHandlers function
document.addEventListener('DOMContentLoaded', registerEventHandlers);