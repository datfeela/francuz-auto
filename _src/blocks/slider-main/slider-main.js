document.addEventListener('DOMContentLoaded', () => {
    const swiperMain = new Swiper('.slider-main__body', {
        speed: 800,
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
        breakpoints: {
            600: {
                speed: 1200,
            },
            900: {
                speed: 1600,
            }
        }
    });
    const sliderBody = document.querySelector('.slider-main__body');

    sliderBody.addEventListener('click', () => {
        sliderBody.classList.add('_hover');
    })

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.slider-main__body')) sliderBody.classList.remove('_hover');
    })
});