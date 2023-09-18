document.addEventListener('DOMContentLoaded', function () {
    const LianContainer = document.getElementById("Lian");
    const FenContainer = document.getElementById("Fen");
    const existingCategories = new Set();
    let cachedWebsiteData = null;

    function displayWebsitesByCategory(category, websiteData) {
        LianContainer.innerHTML = '';

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
            baoContainer.innerHTML = `
                <div class="icon-link">
                    <img src="${item[1]}/favicon.ico" class="icon" >
                    <a href="${item[1]}" target="_blank">${item[0]}</a>
                </div>
            `;
            if (currentRow) {
                currentRow.appendChild(baoContainer);
            }
        });
    }

    const searchBox = document.getElementById("searchBox");
    const searchButton = document.getElementById("searchButton");

    function performSearch() {
        const keyword = searchBox.value.trim().toLowerCase();

        if (cachedWebsiteData) {
            const filteredData = cachedWebsiteData.filter(item => {
                const baoName = item[0].toLowerCase();
                return baoName.includes(keyword);
            });

            displayWebsitesByCategory(filteredData[0][2], filteredData);
        }
    }

    // 添加回车键事件处理程序
    searchBox.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    // 添加点击搜索按钮事件处理程序
    searchButton.addEventListener("click", performSearch);

    function createCategoryButtons() {
        cachedWebsiteData.forEach(item => {
            const category = item[2];
            if (!existingCategories.has(category)) {
                existingCategories.add(category);

                const button = document.createElement("button");
                button.textContent = category;
                button.addEventListener("click", () => {
                    displayWebsitesByCategory(category, cachedWebsiteData);
                });
                if (FenContainer) {
                    FenContainer.appendChild(button);
                }
            }
        });
    }

    function fetchWebsiteData() {
        const now = new Date();
        const today = now.getDay();

        // 检查是否是星期一
        if (today !== 1) {
            // 如果不是星期一，则尝试从本地存储加载数据
            const localWebsiteData = localStorage.getItem('websiteData');
            if (localWebsiteData) {
                cachedWebsiteData = JSON.parse(localWebsiteData);
                createCategoryButtons();
                displayWebsitesByCategory(cachedWebsiteData[0][2], cachedWebsiteData);
                return; // 不执行网络请求
            }
        }

        const urls = [
            'https://raw.githubusercontent.com/Zougmzz/Zh-IWN/Zuner/WangZhan.txt',
            'https://gitee.com/mysterious_fog/Zh-IWN/raw/Zuner/WangZhan.txt'
        ];

        Promise.all(urls.map(url => fetch(url)
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n');

                return lines
                    .map(line => line.trim())
                    .filter(line => line !== "")
                    .map(line => line.split(','));
            })))
            .then(dataArray => {
                cachedWebsiteData = dataArray.reduce((acc, currentData) => {
                    currentData.forEach(item => {
                        const key = `${item[0]}_${item[1]}`;
                        if (!acc.has(key)) {
                            acc.set(key, item);
                        }
                    });
                    return acc;
                }, new Map());

                cachedWebsiteData = [...cachedWebsiteData.values()];

                // 将数据保存到本地存储
                localStorage.setItem('websiteData', JSON.stringify(cachedWebsiteData));

                createCategoryButtons();
                displayWebsitesByCategory(cachedWebsiteData[0][2], cachedWebsiteData);
            });
    }

    try {
        // 检查是否是星期一
        const now = new Date();
        const today = now.getDay();

        if (today === 1) {
            // 如果是星期一，则进行数据更新
            fetchWebsiteData();
        } else {
            // 如果不是星期一，则尝试从本地存储加载数据
            const localWebsiteData = localStorage.getItem('websiteData');
            if (localWebsiteData) {
                cachedWebsiteData = JSON.parse(localWebsiteData);
                createCategoryButtons();
                displayWebsitesByCategory(cachedWebsiteData[0][2], cachedWebsiteData);
            } else {
                // 如果本地没有数据，仍然进行网络请求
                fetchWebsiteData();
            }
        }
    } catch (error) {
        console.error('发生错误：', error);
    }
});
