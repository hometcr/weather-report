

const temp = document.getElementById("temp");

temp.textContent = "99";

city = "Seattle"

axios
    .get(`http://localhost:5000/location`, {
        params: {
            q: city
        },
    })
    .then((response) => {
        console.log(response.data)
        latitude = response.data[0]['lat'];
        longitude = response.data[0]['lon'];
        console.log(`latitude is ${latitude}`);
        console.log(`longitude is ${longitude}`);
    })
    .catch((error) => {
        console.log('I found an error!')
        console.log(error)
    });