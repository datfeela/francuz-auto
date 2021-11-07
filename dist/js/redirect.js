document.addEventListener("DOMContentLoaded", (event) => {
    const requestSuccessInfo = document.querySelector('.main__info_success'),
        requestFailInfo = document.querySelector('.main__info_fail');
    let redirectUrl = 'http://datfee3c.beget.tech';

    switch (location.hash) {
        case '#requestSuccess':
            requestSuccessInfo.style.display = 'block';
            redirectUrl = 'http://datfee3c.beget.tech';
            break;
        case '#requestFail':
            requestFailInfo.style.display = 'block';
            redirectUrl = 'vin-request.html';
            break;
    }

    setTimeout(() => { document.location.href = redirectUrl }, 5000);
})