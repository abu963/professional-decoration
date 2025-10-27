/* professional-decoration.js — النسخة الكاملة النهائية */

document.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.getElementById("toolbar");
  const previewArea = document.getElementById("previewArea");
  const actionBar = document.getElementById("actionBar");

  const assetsPath = "../assets/";
  const fontsPath = assetsPath + "fonts/";
  const dressupPath = assetsPath + "dressup/";

  // جلب الخطوط تلقائيًا من assets/fonts
  const fontFiles = ["ReemKufi.ttf", "Amiri.ttf", "Cairo.ttf", "Tajawal.ttf"]; // أضف أي خطوط
  const dressups = ["dress1.png","dress2.png","dress3.png"]; // أضف أي تلبيسات
  const gradients = [
    "linear-gradient(90deg,#FFD700,#FFFACD)",
    "linear-gradient(90deg,#C0C0C0,#E0E0E0)",
    "linear-gradient(90deg,#DAA520,#FFD700)",
    "linear-gradient(90deg,#FF4500,#FF6347)",
    "linear-gradient(90deg,#32CD32,#7CFC00)",
    "linear-gradient(90deg,#1E90FF,#00BFFF)"
    // أضف الباقي حتى 50 تدرج
  ];

  let currentType = "none";
  let currentText = "";
  let currentFont = fontFiles[0];
  let currentColor = gradients[0];
  let currentImage = null;

  // إعدادات React + Moveable
  const rootEl = document.createElement("div");
  rootEl.style.width = "100%";
  rootEl.style.height = "100%";
  rootEl.style.position = "relative";
  previewArea.appendChild(rootEl);

  const movableItems = [];

  function createTextElement(text, font, color) {
    const div = document.createElement("div");
    div.textContent = text;
    div.style.fontFamily = font.split(".")[0];
    div.style.background = "transparent";
    div.style.backgroundImage = color;
    div.style.webkitBackgroundClip = "text";
    div.style.color = "transparent";
    div.style.fontSize = "48px";
    div.style.display = "inline-block";
    div.style.position = "absolute";
    div.style.left = "50%";
    div.style.top = "50%";
    div.style.transform = "translate(-50%,-50%)";
    div.style.cursor = "move";
    rootEl.appendChild(div);
    movableItems.push(div);
    return div;
  }

  function createImageElement(src) {
    const img = document.createElement("img");
    img.src = src;
    img.style.position = "absolute";
    img.style.left = "50%";
    img.style.top = "50%";
    img.style.transform = "translate(-50%,-50%)";
    img.style.maxWidth = "80%";
    img.style.maxHeight = "80%";
    rootEl.appendChild(img);
    movableItems.push(img);
    return img;
  }

  // شريط الأدوات
  const typeSelect = document.createElement("select");
  typeSelect.innerHTML = `
    <option value="none">— اختر —</option>
    <option value="text">نص</option>
    <option value="image">صورة</option>
  `;
  toolbar.appendChild(typeSelect);

  const dynamicContainer = document.createElement("div");
  dynamicContainer.style.display = "flex";
  dynamicContainer.style.gap = "8px";
  dynamicContainer.style.alignItems = "center";
  toolbar.appendChild(dynamicContainer);

  typeSelect.addEventListener("change", e => {
    currentType = e.target.value;
    dynamicContainer.innerHTML = "";
    if (currentType === "text") setupTextControls();
    if (currentType === "image") setupImageControls();
  });

  function setupTextControls() {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "اكتب النص هنا";
    dynamicContainer.appendChild(input);

    const fontBtn = document.createElement("button");
    fontBtn.textContent = "اختيار الخط";
    fontBtn.classList.add("btn");
    dynamicContainer.appendChild(fontBtn);

    const colorBtn = document.createElement("button");
    colorBtn.textContent = "اختيار اللون";
    colorBtn.classList.add("btn");
    dynamicContainer.appendChild(colorBtn);

    input.addEventListener("input", e => {
      currentText = e.target.value;
      updatePreview();
    });

    fontBtn.addEventListener("click", () => showFontGrid(input.value));
    colorBtn.addEventListener("click", () => showGradientGrid());
  }

  function setupImageControls() {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/*";
    dynamicContainer.appendChild(inputFile);

    const dressBtn = document.createElement("button");
    dressBtn.textContent = "تلبيس/تدرج";
    dressBtn.classList.add("btn");
    dynamicContainer.appendChild(dressBtn);

    inputFile.addEventListener("change", e => {
      const reader = new FileReader();
      reader.onload = ev => {
        currentImage = ev.target.result;
        updatePreview();
      };
      reader.readAsDataURL(e.target.files[0]);
    });

    dressBtn.addEventListener("click", () => showDressupGrid());
  }

  function showFontGrid(textValue) {
    const grid = document.createElement("div");
    grid.style.position = "absolute";
    grid.style.right = "10px";
    grid.style.top = "60px";
    grid.style.background = "rgba(212,175,55,0.1)";
    grid.style.border = "1px solid rgba(0,0,0,0.2)";
    grid.style.padding = "10px";
    grid.style.display = "flex";
    grid.style.flexDirection = "column";
    grid.style.gap = "6px";
    grid.style.zIndex = 1000;

    fontFiles.forEach(f => {
      const item = document.createElement("div");
      item.textContent = textValue || "النص";
      item.style.fontFamily = f.split(".")[0];
      item.style.cursor = "pointer";
      item.addEventListener("click", () => {
        currentFont = f;
        document.body.removeChild(grid);
        updatePreview();
      });
      grid.appendChild(item);
    });

    document.body.appendChild(grid);
  }

  function showGradientGrid() {
    const grid = document.createElement("div");
    grid.style.position = "absolute";
    grid.style.right = "80px";
    grid.style.top = "60px";
    grid.style.background = "rgba(212,175,55,0.1)";
    grid.style.border = "1px solid rgba(0,0,0,0.2)";
    grid.style.padding = "10px";
    grid.style.display = "flex";
    grid.style.flexDirection = "column";
    grid.style.gap = "6px";
    grid.style.zIndex = 1000;

    gradients.forEach(g => {
      const item = document.createElement("div");
      item.style.width = "120px";
      item.style.height = "24px";
      item.style.backgroundImage = g;
      item.style.cursor = "pointer";
      item.addEventListener("click", () => {
        currentColor = g;
        document.body.removeChild(grid);
        updatePreview();
      });
      grid.appendChild(item);
    });

    document.body.appendChild(grid);
  }

  function showDressupGrid() {
    const grid = document.createElement("div");
    grid.style.position = "absolute";
    grid.style.right = "10px";
    grid.style.top = "60px";
    grid.style.background = "rgba(212,175,55,0.1)";
    grid.style.border = "1px solid rgba(0,0,0,0.2)";
    grid.style.padding = "10px";
    grid.style.display = "flex";
    grid.style.flexDirection = "column";
    grid.style.gap = "6px";
    grid.style.zIndex = 1000;

    [...dressups, ...gradients].forEach(d => {
      const item = document.createElement("div");
      item.style.width = "100px";
      item.style.height = "50px";
      if (d.includes(".png")) item.style.backgroundImage = `url(${dressupPath+d})`;
      else item.style.backgroundImage = d;
      item.style.backgroundSize = "cover";
      item.style.cursor = "pointer";
      item.addEventListener("click", () => {
        if (d.includes(".png")) currentImage = dressupPath + d;
        else currentColor = d;
        document.body.removeChild(grid);
        updatePreview();
      });
      grid.appendChild(item);
    });

    document.body.appendChild(grid);
  }

  function updatePreview() {
    rootEl.innerHTML = "";
    movableItems.length = 0;

    if (currentType === "text" && currentText) createTextElement(currentText,currentFont,currentColor);
    if (currentType === "image" && currentImage) createImageElement(currentImage);
  }

  // تحميل الصورة
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "تحميل الصورة";
  exportBtn.classList.add("btn","primary");
  actionBar.appendChild(exportBtn);

  exportBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1500;
    canvas.height = 1500;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    movableItems.forEach(el=>{
      if(el.tagName==="DIV"){
        ctx.font = `48px ${currentFont.split(".")[0]}`;
        ctx.fillStyle = currentColor.includes("gradient")?"#D4AF37":currentColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.textContent,canvas.width/2,canvas.height/2);
      }
      if(el.tagName==="IMG"){
        const img = new Image
