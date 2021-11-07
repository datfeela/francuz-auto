document.addEventListener("DOMContentLoaded", (event) => {
    let searchRequest = location.search.slice(8).toUpperCase();
    const mainBlock = document.querySelector('.main__search-result');

    getData();

    // document.cookie = "user=John";

    //functions
    async function getData() {
        const file = "json/data.json";
        let response = await fetch(file, { method: "GET" });
        if (response.ok) {
            let result = await response.json();
            loadData(result);
        } else {
            alert("something went wrong...");
        }
    }

    function loadData(data) {
        const ProductsSearchBlock = document.querySelector('.search-result__data');
        let productFound = false;

        data.forEach(element => {
            if ((element.col1 != '') && (searchRequest.length > 5) && (element.col2 == searchRequest || element.col2 == searchRequest || element.col3.includes(searchRequest))) {
                productFound = true;
                const productBrand = element.col1;
                const productName = element.col4;
                const productArticleNumber = element.col2;
                const productPrice = element.col6;
                const productQuantity = element.col8;
                
                let productTemplate = `
                <div class="search-data__row">
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
                </div>
                `;
                ProductsSearchBlock.insertAdjacentHTML("beforeend", productTemplate);
            }
        });

        if (productFound == true) mainBlock.classList.add('_active');
    }
})