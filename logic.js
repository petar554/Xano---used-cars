let apiMainUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:MYXwu2O1';
let loader = document.querySelector('.loader-overlay'); 

// function for POST request
function sendPostRequest(apiEndpoint, requestBody, successCallback, headers = {'Content-type': 'application/json'}, isFormData = false) {
    const body = isFormData ? requestBody : JSON.stringify(requestBody);

    const fetchOptions = {
        method: 'POST',
        headers: headers,
        body: body
    };

    loader.style.display = 'flex';

    fetch(apiEndpoint, fetchOptions)
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error("Error data:", errorData);
                throw new Error('Server responded with a non-OK status');
            });
        }
        return response.json();
    })
    .then(data => successCallback(data))
    .catch(error => console.error("Request failed:", error))
    .finally(() => loader.style.display = 'none');
}

// function for GET request
function sendGetRequest(apiEndpoint, successCallback) {
    loader.style.display = 'flex';

    fetch(apiEndpoint)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error("Error data:", errorData);
                    throw new Error('Server responded with a non-OK status.');
                });
            }
            return response.json();
        })
        .then(data => successCallback(data))
        .catch(error => console.error("Request failed:", error))
        .finally(() => loader.style.display = 'none');
}

// user registraion
function handleRegistration(e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let phone = document.getElementById('phone').value;
    let repeat_password = document.getElementById('repeat_password').value;

    let requestBody = { name, email, password, phone, repeat_password };
    let apiEndpoint = `${apiMainUrl}/auth/signup`;

    sendPostRequest(apiEndpoint, requestBody, data => {
        if (data.authToken) {
            localStorage.setItem('authToken', data.authToken);
            window.location.href = 'novi_oglas.html';
        }
    });
}

if (document.getElementById('registerBtn')) {
    document.getElementById('registerBtn').onclick = handleRegistration;
}

// user login
function handleUserLogin(e) {
    e.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let requestBody = {
        email,
        password
    }

    let apiEndpoint = apiMainUrl + "/auth/login";

    sendPostRequest(apiEndpoint, requestBody, data => {
        if (data.authToken) {
            localStorage.setItem('authToken', data.authToken);
            window.location.href = 'novi_oglas.html';
        }
    });
}

if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').onclick = handleUserLogin;
}


// user logout
if (document.getElementById('odjaviSe')) {
    document.getElementById('odjaviSe').onclick = function (e) {
        e.preventDefault();

        localStorage.clear();
        window.location.href = 'index.html';
    }
}

if (localStorage.getItem('authToken')) {
    document.getElementById("navigation").innerHTML = `<a href="novi_oglas.html" class="btn btn-warning">Add ad</a>
                                                       <a href="#" id="odjaviSe" class="btn btn-info">Log out</a>`

    document.getElementById('odjaviSe').onclick = function (e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    }
}  

// handling add ads
function addingAds(e) {
    e.preventDefault();

    let marka = document.getElementById('marka').value;
    let price = document.getElementById('price').value;
    let fuel = document.getElementById('fuel').value;
    let year = document.getElementById('year').value;
    let karoserija = document.getElementById('karoserija').value;
    let file = document.getElementById('file');

    let apiEndpoint = apiMainUrl + "/car";

    let formData = new FormData();

    formData.append('marka', marka);
    formData.append('price', price);
    formData.append('fuel', fuel);
    formData.append('year', year);
    formData.append('karoserija', karoserija);
    formData.append('file', file.files[0]);

    let authToken = localStorage.getItem('authToken');
    let headers = {
        'Authorization': 'Bearer ' + authToken
    };

    sendPostRequest(apiEndpoint, formData, data => {
        alert('Ad successfully added. Awaiting administrator approval.');
        location.reload();
    }, headers, true);
}

if (document.getElementById('noviOglasBtn')) {
    document.getElementById('noviOglasBtn').onclick = addingAds;
}

// handling of getting all ads
if (document.getElementById('pretraziBtn')) {
    document.getElementById('pretraziBtn').onclick = function () {
        let apiEndpoint = apiMainUrl + "/car";
        sendGetRequest(apiEndpoint, function(cars) {
            let container = document.getElementById('sviOglasi');
            cars.forEach(car => {
                let carElement = document.createElement('div');
                carElement.className = 'col-sm-4';
                carElement.innerHTML = `
                    <div class="car-item-wrapper">
                        <img src="${car.car_image.url}?tpl=big" alt="${car.marka}">
                        <h4>${car.marka}</h4>
                        <p>Cijena: ${car.price}</p>
                        <p>Godište: ${car.year}</p>
                        <a class="btn btn-warning" href="car.html?id=${car.id}">Vidi više</a>
                    </div>`;
                container.appendChild(carElement);
            });
        });
    }
}

// getting the selected ad
if (document.getElementById('appendImage')) {
    let urlParams = new URLSearchParams(window.location.search);
    let car_id = urlParams.get('id');
    let apiEndpoint = apiMainUrl + "/car/" + car_id;

    sendGetRequest(apiEndpoint, function(cars) {
        let car = cars[0];
        let imageContainer = document.querySelector('#appendImage');
            if (imageContainer) {
                let img = document.createElement('img');
                img.src = `${car.car_image.url}`;
                img.alt = car.marka;
                imageContainer.appendChild(img);
            } else {
                alert('Image container #appendImage not found');
            }

            let contentContainer = document.querySelector('#appendContent');
            if (contentContainer) {
                contentContainer.innerHTML = `
                <h4>${car.marka}</h4>
                <p>Cijena: ${car.price}</p>
                <p>Godište: ${car.year}</p>
                <p>Gorivo: ${car.fuel}</p>
                <p>Kontakt telefon: ${car._user.phone}</p>
            `;
            } else {
                alert('Content container #appendContent not found');
            }
    });
}

// search functionality
if(document.getElementById("pretraziBtn") && window.location.href.includes('?')) {
    let queryParams = new URLSearchParams(window.location.search);

    let marka = queryParams.get('marka');
    let year_from = queryParams.get('year_from');
    let year_to = queryParams.get('year_to');
    let price = queryParams.get('price');
    let gorivo = queryParams.get('gorivo');
    let karoserija = queryParams.get('karoserija');

    if(marka) {
        document.getElementById('marka').value = marka;
    }

    if(year_from) {
        document.getElementById('year_from').value = year_from;
    }

    if(year_to) {
        document.getElementById('year_to').value = year_to;
    }

    if(price) {
        document.getElementById('price').value = price;
    }

    if(gorivo) {
        document.getElementById('gorivo').value = gorivo;
    }

    if (karoserija) {
        document.getElementById('karoserija').value = karoserija;
    }

    let apiEndpoint = apiMainUrl + '/search'
    apiEndpoint += `?marka=${encodeURIComponent(marka)}&year_from=${year_from}&year_to=${year_to}&price=${price}&gorivo=${encodeURIComponent(gorivo)}`

    sendGetRequest(apiEndpoint, function(cars) {
        let container = document.querySelector('#sviOglasi');
        container.innerHTML = '';

            console.log(cars);
          
            cars.forEach(car => {
              let carElement = document.createElement('div');
              carElement.className = 'col-sm-4';
              carElement.innerHTML =
                `<div class="car-item-wrapper">
                  <img src="${car.car_image.url}?tpl=big" alt="${car.marka}">
                  <h4>${car.marka}</h4>
                  <p>Cijena: ${car.price}</p>
                  <p>Godište: ${car.year}</p>
                  <a class="btn btn-warning" href="car.html?id=${car.id}">Vidi više</a>
                </div>`;
              container.appendChild(carElement);
            });
    });
}