document.addEventListener('DOMContentLoaded', () => {
    const searchRequest = new URL(location.href).searchParams.get('cat'),
        productsSearchBlock = document.querySelector('.catalog__items'),
        documentTitle = document.querySelector('title'),
        cartCounter = document.querySelector('.search-header__counter'),
        loadButton = document.querySelector('.catalog__load-more-button'),
        filters = document.querySelector('.sidebar__filters');
    let sortedData = [],
        filteredData = [],
        productsCount = 0,
        filterParams = {};

    changeTitle();
    getData();

    //подгрузка новых товаров
    loadButton.addEventListener('click', () => {
        //по фильтрам, если имеются
        if (filteredData.length > 0 && productsCount < filteredData.length) loadData(filteredData);
        //из сортированного по категории массива
        else if (productsCount < sortedData.length) loadData(sortedData);
    })

    filters.addEventListener('click', (event) => {
        const targetElement = event.target;

        if (targetElement.className == 'options-filter__label') {
            //сортировка по производителю
            if (targetElement.parentNode.parentNode.id == 'brands-filter') {
                if (!targetElement.previousElementSibling.checked) sortByBrand(1, targetElement.previousElementSibling.name);
                else {
                    sortByBrand(0, targetElement.previousElementSibling.name);
                    if (productsSearchBlock.querySelectorAll('.items-catalog__row').length == 0) loadData(sortedData);
                }
            }
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
            const productBrand = element.col1;
            const productArticleNumber = element.col2;
            const productName = element.col4;
            const productPrice = element.col6;
            let productLink = productBrand + '_' + productArticleNumber;

            if (productBrand.split(' ')[1]) productLink = productBrand.split(' ')[0] + '_' + productBrand.split(' ')[1] + '_' + productArticleNumber;

            let productTemplate = `
                <a href="product.html?id=${productLink}" class="items-catalog__row product">
                    <div class="product__block product__block_brand">
                        <span class="product__text product__text_brand">${productBrand}_${productArticleNumber}</span>
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

    function loadFilteredData() {
        Array.from(productsSearchBlock.querySelectorAll('.items-catalog__row')).forEach(element => {
            element.remove();
        })

        productsCount = 0;
        loadData(filteredData);
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

    function sortByBrand(checked, name) {
        const brandsFilter = document.querySelector('#brands-filter');
        let brandsArray = [];
        filteredData = [];

        Array.from(brandsFilter.children).forEach(element => {
            if (element.firstElementChild.checked == true) {
                brandsArray.push(element.firstElementChild.name);
            }
        })

        //если чекбокс чекнут, добавляю в массив только что чекнутый, если чек снят, удаляю из массива

        if (checked == 1) brandsArray.push(name);
        else {
            let deleteIndex = brandsArray.findIndex(function (item, index, array) {
                if (item == name) return item;
            })
            brandsArray.splice(deleteIndex, 1);
        }

        sortedData.forEach(element => {
            brandsArray.forEach(brand => {
                if (brand == element.col1) filteredData.push(element);
            })
        })

        loadFilteredData();
    }
})