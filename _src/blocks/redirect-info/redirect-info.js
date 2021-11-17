document.addEventListener('DOMContentLoaded', () => {
    const requestSuccessInfo = document.querySelector('.redirect-info__text_success'),
        requestFailInfo = document.querySelector('.redirect-info__text_fail');
    redirectUrl = 'index.html';
    let cookies = document.cookie.split('; ');
    let cookiesSorted = [];

    switch (location.hash) {
        case '#cartRequestSuccess':
            requestSuccessInfo.style.display = 'block';
            cookies.map(function (element) {
                if (element.split('=')[0] != 'announcement' && element.split('=')[0] != 'theme') {
                    deleteCookie(element.split('=')[0]);
                }
            })
            redirect(redirectUrl);
            break;
        case '#cartRequestFail':
            requestFailInfo.style.display = 'block';
            goBack();
            break;
        case '#vinRequestSuccess':
            requestSuccessInfo.style.display = 'block';
            redirect(redirectUrl);
            break;
        case '#vinRequestFail':
            requestFailInfo.style.display = 'block';
            goBack();
            break;
    }

    function goBack() {
        setTimeout(() => { window.history.back();}, 5000);
    }

    function redirect(url) {
        setTimeout(() => { document.location.href = url }, 5000);
    }
})