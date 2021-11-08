document.addEventListener("DOMContentLoaded", (event) => {
    const requestSuccessInfo = document.querySelector('.redirect-info__text_success'),
        requestFailInfo = document.querySelector('.redirect-info__text_fail');
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