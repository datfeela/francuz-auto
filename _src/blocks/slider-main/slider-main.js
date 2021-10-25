document.addEventListener("DOMContentLoaded", (event) => {
    const swiperMain = new Swiper('.slider-main__body', {
        speed: 2000,
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        grabCursor: true,
        navigation: {
            nextEl: '.controls-slider-main__button_prev',
            prevEl: '.controls-slider-main__button_next',
        },
        autoplay: {
            delay: 6000,
            waitForTransition: true
        },
    });
});