document.addEventListener('DOMContentLoaded', () => {
    const swiperMain = new Swiper('.bestsellers__body', {
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
            waitForTransition: true
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
});