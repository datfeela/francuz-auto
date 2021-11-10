document.addEventListener('DOMContentLoaded', () => {
    const requestSuccessInfo = document.querySelector('.redirect-info__text_success'),
        requestFailInfo = document.querySelector('.redirect-info__text_fail');
    let redirectUrl = 'http://datfee3c.beget.tech';

    switch (location.hash) {
        case '#requestSuccess':
            requestSuccessInfo.style.display = 'block';
            redirectUrl = 'http://datfee3c.beget.tech';
            redirect(redirectUrl);
            break;
        case '#requestFail':
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