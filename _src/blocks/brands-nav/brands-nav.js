document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('.brands-nav__body');

    body.addEventListener('click', (event) => {
        const targetElement = event.target;

        if (targetElement.classList.contains('tabs-brands-nav__tab')) {
            changeActivePage(targetElement);
        }
    })


    //functions
    function changeActivePage(tab) {
        const activeTab = document.querySelector('.tabs-brands-nav__tab._active'),
            activePage = document.querySelector('.brands-nav__page._active'),
            passCarsPage = document.querySelector('#passenger-cars-page'),
            passCarsPageRu = document.querySelector('#passenger-cars-ru-page'),
            motoPage = document.querySelector('#moto-page');

        activePage.classList.remove('_active');
        activeTab.classList.remove('_active');
        tab.classList.add('_active');

        if (tab.id == 'passenger-cars-button') {
            passCarsPage.classList.add('_active');
            return
        }
        if (tab.id == 'passenger-cars-ru-button') {
            passCarsPageRu.classList.add('_active');
            return
        }
        if (tab.id == 'moto-button') {
            motoPage.classList.add('_active');
            return
        }
    }
})

