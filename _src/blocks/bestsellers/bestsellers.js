document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('.bestsellers__body'),
        swiperMain = new Swiper(body, {
            speed: 500,
            slidesPerView: 1,
            spaceBetween: 50,
            loop: true,
            navigation: {
                nextEl: '.controls-bestsellers__button_prev',
                prevEl: '.controls-bestsellers__button_next',
            },
            autoplay: {
                delay: 6000,
                waitForTransition: true,
                pauseOnMouseEnter: true
            },

            breakpoints: {
                576: {
                    slidesPerView: 2
                },
                800: {
                    slidesPerView: 3
                },
                1050: {
                    slidesPerView: 4
                },
            }
        });
    let cartCounter = document.querySelector('.search-header__counter');
    
    body.addEventListener('click', (event) => {
        const targetElement = event.target;
        let activeProduct = document.querySelector(".product__image-container._active");

        if (targetElement.closest('.product__image-container')) {
            event.preventDefault();
            if (activeProduct != null) activeProduct.classList.remove("_active");
            targetElement.closest('.product__image-container').classList.add('_active');
        }

        if (targetElement.closest('.product__button_buy')) {
            event.preventDefault();
            changeCookie(targetElement, '.bestsellers__item');
            document.querySelector('.search-header__counter').innerHTML = +cartCounter.innerHTML + 1;
            if (cartCounter.innerHTML != '0') cartCounter.classList.add('_active');
        }
    })

    //снимаю product__popup при клике вне
    document.addEventListener('click', (event) => {
        const targetElement = event.target;
        let activeProduct = document.querySelector(".product__image-container._active");
        if (!targetElement.closest('.product__image-container._active') && activeProduct != null) activeProduct.classList.remove('_active')
    })
});
