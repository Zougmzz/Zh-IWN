document.addEventListener('DOMContentLoaded', function () {
    const showImagesButton = document.getElementById("showImagesButton");
    const LianContainer = document.getElementById("Lian");
    const FenContainer = document.getElementById("Fen");
    const existingCategories = new Set();
    let isImageVisible = false;
    let cachedWebsiteData = [];

    // 搜索功能
    const searchBox = document.getElementById("searchBox");
    const searchButton = document.getElementById("searchButton");

    function performSearch() {
        const keyword = searchBox.value.trim().toLowerCase();

        if (cachedWebsiteData) {
            const filteredData = cachedWebsiteData.filter(item => {
                const baoName = item[0].toLowerCase();
                return baoName.includes(keyword);
            });

            const categories = [...new Set(filteredData.map(item => item[2]))];
            displayWebsitesByCategory(categories, filteredData);
        }
    }

    searchBox.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    // 获取网站数据
    function fetchWebsiteData() {
        const url1 = 'https://gitee.com/mysterious_fog/Zh-IWN/raw/Zuner/WangZhan.txt';
        const url2 = 'https://raw.githubusercontent.com/Zougmzz/Zh-IWN/Zuner/WangZhan.txt';
    
        const fetchPromises = [
            fetch(url1).then(response => response.text()).catch(error => ''),
            fetch(url2).then(response => response.text()).catch(error => '')
        ];
    
        Promise.all(fetchPromises)
            .then(responses => {
                const allData = [];
    
                responses.forEach(data => {
                    if (data) {
                        const lines = data.split('\n');
                        const dataArray = lines
                            .map(line => line.trim())
                            .filter(line => line !== "")
                            .map(line => line.split(','));
                        allData.push(...dataArray);
                    }
                });
    
                const uniqueData = removeDuplicates(allData);
    
                cachedWebsiteData = uniqueData;
                createCategoryButtons();
                displayWebsitesByCategory([cachedWebsiteData[0][2]], cachedWebsiteData);
            })
            .catch(error => {
                console.error('发生错误：', error);
            });
    }

    searchButton.addEventListener("click", performSearch);

    // 去除重复项
    function removeDuplicates(dataArray) {
        const uniqueData = [];
        const uniqueKeys = new Set();
    
        dataArray.forEach(item => {
            const key = `${item[0]}_${item[1]}`;
            if (!uniqueKeys.has(key)) {
                uniqueData.push(item);
                uniqueKeys.add(key);
            }
        });
    
        return uniqueData;
    }

    // 显示网站
    function displayWebsitesByCategory(categories, websiteData) {
        LianContainer.innerHTML = '';

        categories.forEach(category => {
            const filteredData = websiteData.filter(item => item[2] === category);

            let currentKuai = null;
            let currentRow = null;

            filteredData.forEach((item, index) => {
                if (index % 3 === 0) {
                    currentKuai = document.createElement("div");
                    currentKuai.className = "kuai";
                    currentRow = document.createElement("div");
                    currentRow.className = "row";
                    LianContainer.appendChild(currentKuai);
                    currentKuai.appendChild(currentRow);
                }

                const baoContainer = document.createElement("div");
                baoContainer.className = "bao";

                const faviconImage = document.createElement("img");
                faviconImage.src = `${item[1]}/favicon.ico`;
                faviconImage.classList.add("icon");

                const websiteLink = document.createElement("a");
                websiteLink.href = item[1];
                websiteLink.target = "_blank";
                websiteLink.textContent = item[0];

                const iconLinkContainer = document.createElement("div");
                iconLinkContainer.className = "icon-link";

                let iconLoadTimeout = setTimeout(() => {
                    faviconImage.style.display = "none";
                    const noIconText = document.createElement("div");
                    noIconText.textContent = "没找到图标";
                    noIconText.style.fontWeight = "bold";
                    baoContainer.insertBefore(noIconText, websiteLink);
                }, 1000);

                faviconImage.onload = function () {
                    clearTimeout(iconLoadTimeout);
                };

                iconLinkContainer.appendChild(faviconImage);
                baoContainer.appendChild(iconLinkContainer);
                baoContainer.appendChild(websiteLink);

                if (currentRow) {
                    currentRow.appendChild(baoContainer);
                }
            });
        });
    }

    // 创建类别按钮
    function createCategoryButtons() {
        cachedWebsiteData.forEach(item => {
            const category = item[2];
            if (!existingCategories.has(category)) {
                existingCategories.add(category);
    
                const button = document.createElement("button");
                button.textContent = category;
                button.addEventListener("click", () => {
                    const filteredData = cachedWebsiteData.filter(item => item[2] === category);
                    displayWebsitesByCategory([category], filteredData);
                });
                if (FenContainer) {
                    FenContainer.appendChild(button);
                }
            }
        });
    
        let isNightMode = localStorage.getItem("isNightMode") === "true";
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "切换";
        toggleButton.id = "Qhuan";
        toggleButton.addEventListener("click", () => {
            isNightMode = !isNightMode;
            const rootElement = document.documentElement;
            if (isNightMode) {
                rootElement.classList.add("night-mode");
                rootElement.classList.remove("day-mode");
            } else {
                rootElement.classList.remove("night-mode");
                rootElement.classList.add("day-mode");
            }

            localStorage.setItem("isNightMode", isNightMode.toString());
        });
    
        const rootElement = document.documentElement;
        if (isNightMode) {
            rootElement.classList.add("night-mode");
        } else {
            rootElement.classList.add("day-mode");
        }
    
        if (FenContainer) {
            FenContainer.appendChild(toggleButton);
        }
    }

    // 捐赠通道
    showImagesButton.addEventListener("click", function () {
        if (!isImageVisible) {

            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");

            const imageSources = [
                "https://gitee.com/mysterious_fog/Zh-IWN/raw/Zuner/images/zfb.png",
                "https://gitee.com/mysterious_fog/Zh-IWN/raw/Zuner/images/wx.png",
                "https://github.com/Zougmzz/Zh-IWN/blob/Zuner/images/zfb.png",
                "https://github.com/Zougmzz/Zh-IWN/blob/Zuner/images/wx.png",
            ];

            imageSources.forEach(source => {
                const image = document.createElement("img");
                image.src = source;
                image.alt = source.includes("zfb.png") ? "支付宝" : "微信";
                image.classList.add("thumbnail");
                image.onerror = function () {
                    this.style.display = "none";
                };
                imageContainer.appendChild(image);
            });

            const lian = document.getElementById("Lian");
            lian.parentNode.insertBefore(imageContainer, lian);

            isImageVisible = true;
        } else {
            const imageContainer = document.querySelector(".image-container");
            if (imageContainer) {
                imageContainer.parentNode.removeChild(imageContainer);
            }
            isImageVisible = false;
        }
    });
    
    // 尝试获取网站数据
    try {
        fetchWebsiteData();
    } catch (error) {
        console.error('发生错误：', error);
    }
});
