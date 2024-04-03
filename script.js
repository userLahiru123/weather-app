const apiKey = "3c87f58703792984a68644c98c4f92a9";

async function loadPage() {
    try {
    
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
              let lon = position.coords.longitude;
              let lat = position.coords.latitude;
              const url =
                `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
                `lon=${lon}&appid=${apiKey}`;
        
              await fetch(url)
                .then((res) => {
                  return res.json();
                })
                .then((data) => {
                  console.log(data);
                  console.log(new Date().getTime());
                  var dat = new Date(data.dt);
                  console.log(dat.toLocaleString(undefined, "Asia/Kelaniya"));
                  console.log(new Date().getMinutes());
                  weatherReport(data);
                });
            });
          }
    
      } catch (error) {
        console.log(error);
      }
}

async function searchByCity() {

  try {
    var place = document.getElementById("input").value;
  var urlSearch =
    `http://api.openweathermap.org/data/2.5/weather?q=${place}&` +
    `appid=${apiKey}`;


    await fetch(urlSearch)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        weatherReport(data);
      });
    document.getElementById("input").value = "";
  } catch (error) {
    console.log(error);
  }
}

async function weatherReport(data) {

  try {

    var urlCast =
    `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` +
    `appid=${apiKey}`;

    await fetch(urlCast)
      .then((res) => {
        return res.json();
      })
      .then((forecast) => {
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast);

        console.log(data);
        document.getElementById("city").innerText =
          data.name + ", " + data.sys.country;
        console.log(data.name, data.sys.country);

        console.log(Math.floor(data.main.temp - 273));
        document.getElementById("temperature").innerText =
          Math.floor(data.main.temp - 273) + " °C";

        document.getElementById("clouds").innerText =
          data.weather[0].description;
        console.log(data.weather[0].description);

        let icon1 = data.weather[0].icon;
        let iconUrl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
        document.getElementById("img").src = iconUrl;
      });
  } catch (error) {
    console.log(error);
  }
}

function hourForecast(forecast) {
  document.querySelector(".templist").innerHTML = "";
  for (let i = 0; i < 5; i++) {
    var date = new Date(forecast.list[i].dt * 1000);
    console.log(
      date.toLocaleTimeString(undefined, "Asia/Colombo").replace(":00", "")
    );

    let hourR = document.createElement("div");
    hourR.setAttribute("class", "next");

    let div = document.createElement("div");
    let time = document.createElement("p");
    time.setAttribute("class", "time");
    time.innerText = date
      .toLocaleTimeString(undefined, "Asia/Colombo")
      .replace(":00", "");

    let temp = document.createElement("p");
    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";

    div.appendChild(time);
    div.appendChild(temp);

    let desc = document.createElement("p");
    desc.setAttribute("class", "desc");
    desc.innerText = forecast.list[i].weather[0].description;

    hourR.appendChild(div);
    hourR.appendChild(desc);
    document.querySelector(".templist").appendChild(hourR);
  }
}

function dayForecast(forecast) {
  document.querySelector(".weekF").innerHTML = "";
  for (let i = 8; i < forecast.list.length; i += 8) {
    console.log(forecast.list[i]);
    let div = document.createElement("div");
    div.setAttribute("class", "dayF");

    let day = document.createElement("p");
    day.setAttribute("class", "date");
    day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(
      undefined,
      "Asia/Colombo"
    );
    div.appendChild(day);

    let temp = document.createElement("p");
    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";
    div.appendChild(temp);

    let description = document.createElement("p");
    description.setAttribute("class", "desc");
    description.innerText = forecast.list[i].weather[0].description;
    div.appendChild(description);

    document.querySelector(".weekF").appendChild(div);
  }
}
