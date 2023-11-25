const api_url = "https://dummyjson.com";

(async function () {
    const allProducts = await getProductList();
    addHtml(allProducts.products);
    openProductModal()
    searchEngine()
    LoadMoreProducts()
    await addCategoryToHtml();
    addProductForCategory();
    stopModalContentClick();
}());

function closeModal() {
    const myModal = document.getElementById("my-modal")
    myModal.classList.remove("modal-active")
}

function stopModalContentClick() {
    const modalContent = document.querySelector("#my-modal .modal-middle")
    modalContent.onclick = function (c) {
        c.stopPropagation();
    }
}

function openProductModal() {
    const productItems = document.querySelectorAll(".product-item")
    for (let pro of productItems) {
        pro.onclick = async function () {
            const modal = document.getElementById("my-modal");
            modal.classList.add("modal-active")
            const productId = this.getAttribute("pro-id");
            const productInfo = await getProductById(productId);
            addModalHtml(productInfo);
        }
    }
}

async function getProductById(pId) {
    return await (await fetch(`${api_url}/products/${pId}`)).json();
}

async function getProductList() {
    return await (await fetch(`${api_url}/products`)).json()
}

function addModalHtml(prod) {
    const myModal = document.getElementById("my-modal");
    const modalImg = myModal.querySelector(".modal-img img")
    const myModalProductTitle = myModal.querySelector(".modal-product-content h4")
    const myModalProductDesc = myModal.querySelector(".modal-product-content .modal-product-desc")
    const myModalProductPrice = myModal.querySelector(".modal-product-content .modal-price")
    myModalProductTitle.innerText = prod.title;
    myModalProductDesc.innerText = prod.description;
    myModalProductPrice.innerText = prod.price;
    modalImg.src = prod.thumbnail;
}

async function addHtml(products) {
    if (products && products.length == 0) {
        document.querySelector(".product-list .row").innerHTML = "Product Not Find";
        return;
    }
    for (let pro of products) {
        const productItemCol = document.querySelector(".product-list .product-item").parentNode.cloneNode(true);
        const productItem = productItemCol.querySelector(".product-item");
        productItem.setAttribute("pro-id", pro.id)
        productItem.classList.remove("d-none");
        productItem.querySelector(".pro-img").setAttribute("src", pro.thumbnail);
        productItem.querySelector(".title").innerText = pro.title
        productItem.querySelector(".price").innerText = pro.price + " AZN"
        productItem.querySelector(".description").innerText = pro.description
        document.querySelector(".product-list .row").appendChild(productItemCol)
    }
}



function searchEngine() {
    const searchInput = document.querySelector(".search-area input")
    const searchBtn = document.querySelector(".search-area button")

    searchBtn.addEventListener("click", async function () {
        document.querySelector(".product-list .row").innerHTML = "";
        const searchVal = searchInput.value;
        const searchApi = api_url + "/products/search?q=" + searchVal;
        const data = await (await fetch(searchApi)).json()
        addHtml(data.products)
        openProductModal()
    })
}





function LoadMoreProducts() {
    const btnLoad = document.querySelector(".load-more button");
    let skipProduct = 0;
    btnLoad.addEventListener("click", async function () {
        skipProduct += 30;
        const data = await (await fetch(api_url + "/products?skip=" + skipProduct)).json();
        if (skipProduct + data.limit >= data.total) {
            btnLoad.style.display = "none";
        }
        if (skipProduct + data.limit <= data.total) {
            addHtml(data.products);
        }
        openProductModal()

    })
}

//categories
async function getCategoryList() {
    return await (await fetch(`${api_url}/products/categories`)).json()
}

async function addCategoryToHtml() {
    const categoryList = await getCategoryList();
    for (let cat of categoryList) {
        const bt = document.createElement("button")
        bt.className = "btn btn-secondary me-2 mb-2"
        bt.innerHTML = cat;
        document.querySelector("#category-area .d-flex").appendChild(bt)

    }
}

async function getProductListForCategory(catName) {
    return await (await fetch(`${api_url}/products/category/${catName}`)).json()
}

async function addProductForCategory() {
    const categoryBtn = document.querySelectorAll("#category-area .d-flex button")
    for (let cat of categoryBtn) {
        cat.onclick = async function () {
            for (let catt of categoryBtn) {
                catt.classList.remove("active")
            }
            document.querySelector(".product-list .row").innerHTML = ""
            const categoryText = this.innerText;
            this.classList.add("active")
            const productList = await getProductListForCategory(categoryText)
            console.log(categoryText);
            addHtml(productList.products)
            openProductModal()

        }
    }
}

function changeMode() {
    const darkModeBtn = document.querySelector(".change-mode .dark-mode")
    const lightModeBtn = document.querySelector(".change-mode .light-mode")
    const changeModeBtn = document.querySelector(".change-mode")

    changeModeBtn.onclick = function () {
        const modeLocal = localStorage.getItem("color-mode")

        if (modeLocal && modeLocal === "light") {
            localStorage.setItem("color-mode", "dark");
        } else {
            localStorage.setItem("color-mode", "light");
        }

        const findMode= this.querySelector(`${modeLocal}-mode`);
        findMode.classList.remove("d-none")
    }
}

