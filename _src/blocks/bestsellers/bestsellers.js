document.addEventListener("DOMContentLoaded", (event) => {
    const swiperMain = new Swiper('.bestsellers__body', {
        speed: 400,
        slidesPerView: 6,
        spaceBetween: 30,
        loop: false,
        navigation: {
            nextEl: '.controls-bestsellers__button_prev',
            prevEl: '.controls-bestsellers__button_next',
        },
        // autoplay: {
        //     delay: 6000,
        //     waitForTransition: true
        // },
    });
});