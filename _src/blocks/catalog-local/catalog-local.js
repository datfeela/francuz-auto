document.addEventListener('DOMContentLoaded', () => {
    const searchRequest = new URL(location.href).searchParams.get('cat'),
        productsSearchBlock = document.querySelector('.catalog__items'),
        documentTitle = document.querySelector('title'),
        nothingFoundBlock = document.querySelector('.items-catalog__nothing-found');
        cartCounter = document.querySelector('.search-header__counter'),
        loadButton = document.querySelector('.catalog__load-more-button'),
        filters = document.querySelector('.sidebar__filters');
    let sortedData = [],
        filteredData = [],
        productsCount = 0,
        availabilityIsChecking = 0,
        numericSort = 0,
        filterParams = {};

    changeTitle();
    resetRadio();
    getData();

    //подгрузка новых товаров
    loadButton.addEventListener('click', () => {
        //по фильтрам, если имеются
        if (filteredData.length > 0 && productsCount < filteredData.length) loadData(filteredData);
        //из сортированного по категории массива
        else if (productsCount < sortedData.length) loadData(sortedData);
    })

    //сортировка
    filters.addEventListener('change', (event) => {
        const targetElement = event.target;

        //по чекбоксам
        if (targetElement.classList.contains('options-filter__checkbox')) {
            //по производителю
            if (targetElement.parentNode.parentNode.id == 'brands-filter') sortByBrand();
        }

        //по радио
        if (targetElement.classList.contains('options-filter__radio')) {
            //по цене
            if (targetElement.id == 'price-decrease') {
                numericSort = -1;
                filterData();
            }
            if (targetElement.id == 'price-increase') {
                numericSort = 1;
                filterData();
            }
            //по наличию
            if (targetElement.id == 'availability-in-stock') {
                availabilityIsChecking = 1;
                filterData();
            }
            if (targetElement.id == 'availability-for-order') {
                availabilityIsChecking = 0;
                filterData();
            }
        }
    })

    //сворачивание фильтров
    filters.addEventListener('click', (event) => {
        const targetElement = event.target;

        if (targetElement.closest('.filter__dropdown-button')) {
            const parentContainer = targetElement.closest('.filter');

            parentContainer.classList.toggle('_hidden');
            $(parentContainer).children('.filter__body').slideToggle();
        }
    })

    //поиск внутри фильтра
    filters.addEventListener('input', (event) => {
        const targetElement = event.target;

        if (targetElement.classList.contains('search-filter__input')) {
            const filtersArray = Array.from(targetElement.parentNode.nextElementSibling.children);
            if (targetElement.value != '') {
                filtersArray.forEach(element => {
                    if (!element.firstElementChild.name.includes(targetElement.value.toUpperCase())) element.classList.add('_hidden');
                    else element.classList.remove('_hidden');
                })
            }
            else filtersArray.forEach(element => {
                element.classList.remove('_hidden');
            })
        }
    })

    //добавление товара в корзину
    productsSearchBlock.addEventListener('click', (event) => {
        const targetElement = event.target;
        if (targetElement.closest('.product__button_buy')) {
            event.preventDefault();
            targetElement.closest('.product__button_buy').classList.add('onclick')
            setTimeout(() => {
                targetElement.closest('.product__button_buy').classList.remove('onclick');
            }, 200);
            changeCookie(targetElement, '.items-catalog__row', 1)
            document.querySelector('.search-header__counter').innerHTML = +cartCounter.innerHTML + 1;
            if (cartCounter.innerHTML != '0') cartCounter.classList.add('_active');
        }
    })

    //functions

    async function getData() {
        const file = 'json/data.json';
        let response = await fetch(file, { method: 'GET' });
        if (response.ok) {
            let result = await response.json();
            sortData(result);
        } else {
            alert('something went wrong...');
        }
    }

    function sortData(data) {
        let keyword;
        switch (searchRequest) {
            case 'oil':
                keyword = 'МАСЛА и жидкости'
                break
            case 'lamps':
                keyword = 'лампа'
                break
            case 'filters':
                keyword = 'фильтры'
                break
        }
        sortedData = data.filter(element => element.col9 == keyword);
        loadFilters(sortedData);
        loadData(sortedData);
    }

    function loadData(data) {
        searchResultCover = document.querySelector('.items-catalog__cover');

        if (productsCount + 20 < data.length) {
            productsToLoadCount = 20;
            loadButton.classList.remove('_blocked');
        }
        else {
            productsToLoadCount = data.length - productsCount;
            loadButton.classList.add('_blocked');
        }

        for (let arrCount = productsCount; arrCount < productsCount + productsToLoadCount; arrCount++) {
            let element = data[arrCount];
            const productName = element.col4;
            const productPrice = element.col6;
            let productBrand = element.col1,
                productArticleNumber = element.col2,
                productLink = fixString(productBrand, ' ', '_') + '__' + fixString(productArticleNumber, ' ', '_');           

            let productTemplate = `
                <a href="product?id=${productLink}" class="items-catalog__row product">
                    <div class="product__block product__block_brand">
                        <span class="product__text product__text_brand">${productBrand} ${productArticleNumber}</span>
                    </div>
                    <div class="product__block product__block_description">
                        <span class="product__text product__text_description">${productName}</span>
                    </div>
                    <div class="product__block product__block_price">
                        <span class="product__text product__text_price">${productPrice}₽</span>
                    </div>
                    <button class="product__button product__button_buy button" type="button">
                        <span class="product__button-text button__text">В корзину</span>
                    </button>
                </a>
                `;
            productsSearchBlock.insertAdjacentHTML('beforeend', productTemplate);
        }
        productsCount += productsToLoadCount;
        searchResultCover.classList.add('_hidden');
    }

    function filterData() {
        filteredData = [];

        sortedData.forEach(element => {
            let brandsCheck = 0,
                availabilityCheck = 0;
            if (filterParams.brands && filterParams.brands.length > 0) {
                filterParams.brands.forEach(brand => {
                    if (brand == element.col1) brandsCheck = 1;
                })
            }
            else brandsCheck = 1;
            if (availabilityIsChecking == 1) {
                if (element.col8 > 0) availabilityCheck = 1;
            }
            else availabilityCheck = 1;

            if (brandsCheck == 1 && availabilityCheck == 1) filteredData.push(element);
        })
        if (numericSort == 1) filteredData.sort(compareNumeric);
        else if (numericSort == -1) filteredData.sort(compareNumericReverse);

        loadFilteredData(filteredData);
    }

    function loadFilteredData(data) {
        Array.from(productsSearchBlock.querySelectorAll('.items-catalog__row')).forEach(element => {
            element.remove();
        })

        productsCount = 0;
        loadData(data);

        if (data.length == 0) nothingFoundBlock.classList.add('_active');
        else nothingFoundBlock.classList.remove('_active');
    }

    function changeTitle() {
        let titleText;
        const title = document.querySelector('.catalog__title');

        switch (searchRequest) {
            case 'oil':
                titleText = 'Масла и жидкости'
                break
            case 'lamps':
                titleText = 'Лампы'
                break
            case 'filters':
                titleText = 'Фильтры'
                break
        }
        title.insertAdjacentText('beforeend', titleText);
        documentTitle.insertAdjacentText('beforeend', `${titleText} | Француз-Авто`);
    }

    function resetRadio() {
        Array.from(document.querySelectorAll('input[type=radio]')).forEach(element => {
            element.checked = false;
        })
    }

    function loadFilters(data) {
        let brandsArr = [data[0].col1];
        const brandsFilterBlock = document.querySelector('#brands-filter');

        data.forEach(element => {
            let check = 0;
            brandsArr.forEach(el => {
                if (el == element.col1) check = 1;
            })
            if (check == 0) brandsArr.push(element.col1);
        });

        brandsArr.forEach(element => {
            brandsFilterBlock.insertAdjacentHTML('beforeend', `
                <div class="options-filter__item">
                    <input id="${element}" class="options-filter__checkbox" type="checkbox" name="${element}" value="${element}" />
                    <label class="options-filter__label" for="${element}"> ${element} </label>
                </div>
            `)
        })
    }

    function sortByBrand() {
        const brandsFilter = document.querySelector('#brands-filter');
        let brandsArray = [];

        Array.from(brandsFilter.children).forEach(element => {
            if (element.firstElementChild.checked == true) {
                brandsArray.push(element.firstElementChild.name);
            }
        })

        filterParams.brands = brandsArray;

        filterData();
    }

    function compareNumeric(a, b) {
        let a1, b1;
        if (a.col6.split(',')[1]) {
            a1 = (a.col6.split(',')[0] + a.col6.split(',')[1]);
        }
        else a1 = a.col6;
        if (b.col6.split(',')[1]) {
            b1 = (b.col6.split(',')[0] + b.col6.split(',')[1]);
        }
        else b1 = b.col6;
        if (+a1 > +b1) return 1;
        if (+a1 == +b1) return 0;
        if (+a1 < +b1) return -1;
    }

    function compareNumericReverse(a, b) {
        let a1, b1;
        if (a.col6.split(',')[1]) {
            a1 = (a.col6.split(',')[0] + a.col6.split(',')[1]);
        }
        else a1 = a.col6;
        if (b.col6.split(',')[1]) {
            b1 = (b.col6.split(',')[0] + b.col6.split(',')[1]);
        }
        else b1 = b.col6;
        if (+a1 < +b1) return 1;
        if (+a1 == +b1) return 0;
        if (+a1 > +b1) return -1;
    }
})