document.addEventListener("DOMContentLoaded", (event) => {
    const swiperMain = new Swiper('.bestsellers__body', {
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 40,
        loop: false,
        navigation: {
            nextEl: '.controls-bestsellers__button_prev',
            prevEl: '.controls-bestsellers__button_next',
        },
        // autoplay: {
        //     delay: 6000,
        //     waitForTransition: true
        // },

        breakpoints: {
            525: {
                slidesPerView: 2
            },
            735: {
                slidesPerView: 3
            },
            950: {
                slidesPerView: 4
            },
            1150: {
                slidesPerView: 5
            },

        }
    });
});