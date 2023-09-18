// 获取网站图标
function getFavicon(url) {
    return `${url}/favicon.ico`;
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const LianContainer = document.getElementById("Lian");
    const FenContainer = document.getElementById("Fen");
    const existingCategories = new Set(); // 用于跟踪已存在的分类
  
    // 读取WangZhan.txt文件中的数据并解析
    fetch(chrome.runtime.getURL('WangZhan.txt'))
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
  
        // 函数：根据分类显示网站数据
        function displayWebsitesByCategory(category) {
          LianContainer.innerHTML = ''; // 清空 Lian 容器
  
          // 过滤出指定分类的网站数据
          const filteredData = websiteData.filter(item => item[2] === category);
  
          // 创建 Kuai 和 Bao 容器
          let currentKuai = null;
          let currentRow = null;
          filteredData.forEach((item, index) => {
            if (index % 3 === 0) {
              currentKuai = document.createElement("div");
              currentKuai.className = "kuai";
              currentRow = document.createElement("div");
              currentRow.className = "row"; // 新增一行容器
              LianContainer.appendChild(currentKuai);
              currentKuai.appendChild(currentRow); // 将新行添加到当前 Kuai 中
            }
  
            const baoContainer = document.createElement("div");
            baoContainer.className = "bao";
            baoContainer.innerHTML = `
              <div class="icon-link">
                <img src="${getFavicon(item[1])}" class="icon" >
                <a href="${item[1]}" target="_blank">${item[0]}</a>
              </div>
            `;
            if (currentRow) { // 添加条件检查，确保 currentRow 不为空
              currentRow.appendChild(baoContainer); // 将 Bao 添加到当前行
            }
          });
  
          // 自动调整悬浮窗大小
          adjustPopupSize();
        }
  
        const websiteData = lines
          .map(line => line.trim()) // 去除每一行的前后空白字符
          .filter(line => line !== "") // 过滤掉空行
          .map(line => line.split(',')); // 分割每一行数据
  
        // 创建分类按钮，但只创建一个相同分类的按钮
        websiteData.forEach(item => {
          const category = item[2];
          if (!existingCategories.has(category)) {
            existingCategories.add(category);
  
            const button = document.createElement("button");
            button.textContent = category;
            button.addEventListener("click", () => {
              displayWebsitesByCategory(category);
            });
            if (FenContainer) { // 添加条件检查，确保 FenContainer 不为空
              FenContainer.appendChild(button);
            }
          }
        });
  
        // 初始化插件，显示默认分类的网站
        displayWebsitesByCategory(websiteData[0][2]);
      })
      .catch(error => {
        console.error('读取WangZhan.txt文件时出错：', error);
      });
  
    // 自动调整悬浮窗大小的函数
    function adjustPopupSize() {
      const baoContainers = document.querySelectorAll('.bao');
      const buttonContainers = document.querySelectorAll('button');
  
      // 计算所有 Bao 和按钮的总宽度和高度
      let totalWidth = 0;
      let totalHeight = 0;
  
      baoContainers.forEach(container => {
        if (container) { // 添加条件检查，确保 container 不为空
          totalWidth += container.offsetWidth;
          totalHeight += container.offsetHeight;
        }
      });
  
      buttonContainers.forEach(container => {
        if (container) { // 添加条件检查，确保 container 不为空
          totalWidth += container.offsetWidth;
          totalHeight += container.offsetHeight;
        }
      });
  
      // 设置悬浮窗大小
      const popup = document.querySelector('.popup');
      if (popup) { // 添加条件检查，确保 popup 不为空
        popup.style.width = `${totalWidth}px`;
        popup.style.height = `${totalHeight}px`;
      }
    }
  });
  