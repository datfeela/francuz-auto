//спойлеры на <= 560px
document.addEventListener("DOMContentLoaded", (event) => {
    $(".title-footer").click(function () {
        if (document.documentElement.clientWidth <= 560) {
            $(this).next().slideToggle();
            if ($(this).next().hasClass("contacts-footer__wrapper")) {
                $(this).next().css("display", "flex");
            }
            $(this).toggleClass("_active");
        }
    });
});

$(window).resize(function () {
    //делаю видимыми свернутые спойлеры и убираю их при изменении разрешения
    if (document.documentElement.clientWidth > 560) {
        $(".title-footer").next().css("display", "block");
        if ($(".title-footer").next().hasClass("contacts-footer__wrapper")) {
            $(".contacts-footer__wrapper").css("display", "flex");
        }
        if ($(".title-footer").hasClass("_active")) {
            $(".title-footer").removeClass("_active");
        }
    }
    if (document.documentElement.clientWidth <= 560) {
        if (!$(".title-footer").hasClass("_active")) {
            $(".title-footer").next().css("display", "none");
        }
    }
});

