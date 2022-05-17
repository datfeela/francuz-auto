document.addEventListener('DOMContentLoaded', () => {
    const mainBlock = document.querySelector('.main'),
        popup = document.querySelector('.about__popup'),
        popupImage = document.querySelector('.popup__image');

    const swiperAbout = new Swiper('.images-about', {
        speed: 500,
        spaceBetween: 25,
        slidesPerView: 1,
        threshold: 30,
        loop: true,
        navigation: {
            nextEl: '.slider-controls-about__button_prev',
            prevEl: '.slider-controls-about__button_next',
        },

        breakpoints: {
            480: {
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

    mainBlock.addEventListener('click', (event) => {
        const targetElement = event.target;


        if (targetElement.classList.contains('images-about__image')) {
            const imgId = targetElement.id.slice(3);

            popup.classList.toggle('_active');
            popupImage.src = targetElement.src;
            popupImage.previousElementSibling.srcset = `img/about/${imgId}.webp`;
        }
    })

    popup.addEventListener('click', (event) => {
        const targetElement = event.target;

        if (!targetElement.classList.contains('popup__image')) {
            popup.classList.toggle('_active');
        }
    })
});