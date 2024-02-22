let apiMainUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:MYXwu2O1';

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