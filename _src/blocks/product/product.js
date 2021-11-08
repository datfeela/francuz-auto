document.addEventListener("DOMContentLoaded", (event) => {
    let searchRequest = location.hash.slice(4);
    const productBlock = document.querySelector('.main__product');
    const head = document.querySelector('head');
    const title = document.querySelector('title');

    getData();

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
        let productFound = false;

        data.forEach(element => {
            if ((element.col1 != '') && (searchRequest.length > 3) && (element.col2 == searchRequest )) {
                productFound = true;
                const productBrand = element.col1;
                const productName = element.col4;
                const productArticleNumber = element.col2;
                const productPrice = element.col6;
                const productQuantity = element.col8;

                let productTemplate = `
                <h1 class="product__name">${productName}</h1>
                <div class="product__info">
                    <img class="product__image" src="img/product/no-image.png" alt="image" />
                    <div class="product__characteristic">
                        <div class="product__brand">
                            <span class="product__subtitle">Производитель</span>
                            <span class="product__text">${productBrand}</span>
                        </div>
                        <div class="product__article">
                            <span class="product__subtitle">Артикул</span>
                            <span class="product__text">${productArticleNumber}</span>
                        </div>
                    </div>
                    <div class="product__availibility">
                        <span class="product__price">${productPrice}₽</span>
                        <span class="product__quantity">В наличии ${productQuantity} шт.</span>
                    </div>
                </div>
                `;
                productBlock.insertAdjacentHTML("beforeend", productTemplate);
                title.insertAdjacentHTML("beforeend", `Француз-Авто | ${productName}`);
                head.insertAdjacentHTML("beforeend", `<meta name="description" content="${productName} в интернет-магазине Француз-Авто с гарантией и доставкой по Челябинску и области. Ознакомиться с фотографиями, техническими характеристиками и описанием." />`);
            }
        });

        if (productFound == true) productBlock.classList.add('_active');
    }
})