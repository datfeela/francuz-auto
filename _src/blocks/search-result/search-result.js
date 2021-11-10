document.addEventListener('DOMContentLoaded', () => {
    let searchRequest = location.search.slice(8).toUpperCase();
    const mainBlock = document.querySelector('.main__search-result'),
        heading = document.querySelector('.search-result__title');
    heading.insertAdjacentText('beforeend', searchRequest);
    getData();

    //functions
    async function getData() {
        const file = 'json/data.json';
        let response = await fetch(file, { method: 'GET' });
        if (response.ok) {
            let result = await response.json();
            loadData(result);
        } else {
            alert('something went wrong...');
        }
    }

    function loadData(data) {
        const productsSearchBlock = document.querySelector('#search-result-product'),
            productSearchAnalogs = document.querySelector('#search-result-analogs'),
            productSearchComplects = document.querySelector('#search-result-complects'),
            searchResultCover = document.querySelector('.search-result__cover');
        const ComplectsKeyword = 'КОМПЛЕКТ';
        let productFoundMain = false,
            productFoundAnalogs = false,
            productFoundComplects = false;

        data.forEach(element => {
            if ((element.col1 != '') && (searchRequest.length > 3) && (element.col2 == searchRequest || element.col3.includes(searchRequest))) {
                const productBrand = element.col1;
                const productName = element.col4;
                const productArticleNumber = element.col2;
                const productPrice = element.col6;
                const productQuantity = element.col8;

                let productTemplate = `
                <a href="product.html?id=${productBrand}_${productArticleNumber}" class="search-data__row">
                    <div class="search-data__block search-data__block_brand">
                        <span class="search-data__text search-data__text_brand">${productBrand}</span>
                    </div>
                    <div class="search-data__block search-data__block_description">
                        <span class="search-data__text search-data__text_description">${productName}</span>
                    </div>
                    <div class="search-data__block search-data__block_article-number">
                        <span class="search-data__text search-data__text_article-number">${productArticleNumber}</span>
                    </div>
                    <div class="search-data__block search-data__block_price">
                        <span class="search-data__text search-data__text_price">${productPrice}₽</span>
                    </div>
                    <div class="search-data__block search-data__block_quantity">
                        <span class="search-data__text search-data__text_quantity">${productQuantity}</span>
                    </div>
                </a>
                `;
                if (element.col2 == searchRequest) {
                    productFoundMain = true;
                    productsSearchBlock.insertAdjacentHTML('beforeend', productTemplate);
                }
                else if (element.col3.includes(searchRequest + ' ')) {
                    if (element.col4.includes(ComplectsKeyword)) {
                        productFoundComplects = true;
                        productSearchComplects.insertAdjacentHTML('beforeend', productTemplate);
                    }
                    else {
                        productFoundAnalogs = true;
                        productSearchAnalogs.insertAdjacentHTML('beforeend', productTemplate);
                    }
                }
            }
        });
        if (productFoundMain == true || productFoundAnalogs == true || productFoundComplects == true) mainBlock.classList.add('_active');
        if (productFoundMain == true) {
            productsSearchBlock.classList.add('_active');
            productsSearchBlock.previousElementSibling.classList.add('_active');
        }
        if (productFoundAnalogs == true) {
            productSearchAnalogs.classList.add('_active');
            productSearchAnalogs.previousElementSibling.classList.add('_active');
        }
        if (productFoundComplects == true) {
            productSearchComplects.classList.add('_active');
            productSearchComplects.previousElementSibling.classList.add('_active');
        }
        searchResultCover.style.display = 'none';
    }
})