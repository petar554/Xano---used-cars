let apiMainUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:MYXwu2O1';

// user registraion
if (document.getElementById('registerBtn')) {
    document.getElementById('registerBtn').onclick = function(e) {
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
            if(data.authToken) {
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
    document.getElementById('noviOglasBtn').onclick = function(e) {
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

// user logout
if (document.getElementById('odjaviSe')) {
    document.getElementById('odjaviSe').onclick = function(e) {
        e.preventDefault();

        localStorage.clear();
        window.location.href = 'index.html';
    }
}