let apiMainUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:MYXwu2O1';

// user registraion
if (document.getElementById('registerBtn')) {
    document.getElementById('registerBtn').onclick = function (e) {
        e.preventDefault();

        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let phone = document.getElementById('phone').value;
        let repeat_password = document.getElementById('repeat_password').value;

        let apiEndpoint = apiMainUrl + "/auth/signup";

        let requestBody = {
            name,
            email,
            password,
            phone,
            repeat_password
        }

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error data:", errorData);
                        throw new Error('Server responded with a non-OK status');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.authToken) {
                    localStorage.setItem('authToken', data.authToken);
                    window.location.href = 'novi_oglas.html';
                }
            })
            .catch(error => {
                console.error("Request failed:", error);
            });
    }
}

// adding ads
if (document.getElementById('noviOglasBtn')) {
    document.getElementById('noviOglasBtn').onclick = function (e) {
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

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error data:", errorData);
                        throw new Error('Server responded with a non-OK status.');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert('Ad successfully added. Awaiting administrator approval.');
                //location.reload();
            })
            .catch(error => {
                console.error("Request failed:", error);
            });
    }
}

// user login
if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').onclick = function (e) {
        e.preventDefault();

        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        let requestBody = {
            email,
            password
        }

        let apiEndpoint = apiMainUrl + "/auth/login";

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Error data:", errorData);
                        throw new Error('Server responded with a non-OK status.');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.authToken) {
                    localStorage.setItem('authToken', data.authToken);
                    window.location.href = 'novi_oglas.html';
                }
            })
            .catch(error => {
                console.error("Request failed:", error);
            });
    }
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

// all ads
if (document.getElementById('pretraziBtn')) {
    document.getElementById('pretraziBtn').onclick = function (e) {
        // e.preventDefault();

        let apiEndpoint = apiMainUrl + "/car";

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
            .then(cars => {
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
                            <a class"btn btn-warning" href="car.html?id=${car.id}">Vidi više</a>
                        <div/>
                        `
                    container.appendChild(carElement);
                });
            })
            .catch(error => {
                console.error("Request failed:", error);
            });
    }
}

// selected ad
if (document.getElementById('appendImage')) {
    let urlParams = new URLSearchParams(window.location.search);
    let car_id = urlParams.get('id');
    let apiEndpoint = apiMainUrl + "/car/" + car_id;

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
        .then(car => {
            car = car[0];

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
        })
        .catch(error => {
            console.error("Request failed:", error);
        });
}

//
if(document.getElementById("pretraziBtn")) {
    let currentUrl = window.location.href;

    if(currentUrl.includes('?')) {
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

        if(karoserija) {
            document.getElementById('karoserija').value = karoserija;
        }

        let apiEndpoint = apiMainUrl + '/search'
        apiEndpoint += `?marka=${encodeURIComponent(marka)}&year_from=${year_from}&year_to=${year_to}&price=${price}&gorivo=${encodeURIComponent(gorivo)}`

        fetch(apiEndpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then(cars => {
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
          
            //loader.style.display = 'none';
          });
          
    }
}