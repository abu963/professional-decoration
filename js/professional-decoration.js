document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("textInput");
  const fileImage = document.getElementById("fileImage");
  const btnAdd = document.getElementById("btnAdd");
  const openFontList = document.getElementById("openFontList");
  const fontList = document.getElementById("fontList");
  const openGradientList = document.getElementById("openGradientList");
  const openDressList = document.getElementById("openDressList");
  const modeSelect = document.getElementById("modeSelect");
  const editorCanvas = document.getElementById("editorCanvas");
  const deleteSelected = document.getElementById("deleteSelected");
  const downloadImage = document.getElementById("downloadImage");
  const widthInput = document.getElementById("widthInput");
  const heightInput = document.getElementById("heightInput");

  let selectedElement = null;
  let currentFont = "Cairo";
  let currentGradient = null;
  let currentDress = null;

  /* إنشاء 50 تدرج */
  const gradients = [];
  for (let i = 0; i < 50; i++) {
    const a = `hsl(${(i * 360) / 50}, 80%, 50%)`;
    const b = `hsl(${((i * 360) / 50 + 45) % 360}, 80%, 65%)`;
    gradients.push([a, b]);
  }

  /* فتح قائمة الخطوط */
  openFontList.addEventListener("click", () => {
    fontList.innerHTML = "";
    fetchFonts();
    fontList.classList.toggle("active");
  });

  function fetchFonts() {
    const fonts = ["ReemKufi", "Amiri", "NotoKufiArabic"];
    fonts.forEach(f => {
      const div = document.createElement("div");
      div.className = "font-item";
      div.style.fontFamily = f;
      div.textContent = f;
      div.onclick = () => {
        currentFont = f;
        if (selectedElement && selectedElement.dataset.type === "text") {
          selectedElement.style.fontFamily = currentFont;
        }
        fontList.classList.remove("active");
      };
      fontList.appendChild(div);
    });
  }

  /* زر إضافة */
  btnAdd.addEventListener("click", () => {
    const mode = modeSelect.value;
    if (mode === "text") {
      const text = textInput.value.trim();
      if (!text) return alert("أدخل نصاً أولاً");
      const div = document.createElement("div");
      div.className = "text-item";
      div.dataset.type = "text";
      div.textContent = text;
      div.style.left = "50%";
      div.style.top = "50%";
      div.style.transform = "translate(-50%, -50%)";
      div.style.fontFamily = currentFont;
      editorCanvas.appendChild(div);
      makeMovable(div);
      selectedElement = div;
    } else {
      const file = fileImage.files[0];
      if (!file) return alert("اختر صورة أولاً");
      const reader = new FileReader();
      reader.onload = e => {
        const wrap = document.createElement("div");
        wrap.className = "img-wrap";
        wrap.dataset.type = "image";
        const img = document.createElement("img");
        img.src = e.target.result;
        wrap.appendChild(img);
        wrap.style.left = "50%";
        wrap.style.top = "50%";
        wrap.style.transform = "translate(-50%, -50%)";
        editorCanvas.appendChild(wrap);
        makeMovable(wrap);
        selectedElement = wrap;
      };
      reader.readAsDataURL(file);
    }
  });

  /* تدرجات */
  openGradientList.addEventListener("click", () => {
    const popup = document.createElement("div");
    popup.className = "popup-container open";
    const inner = document.createElement("div");
    inner.className = "popup";
    const grid = document.createElement("div");
    grid.className = "grad-grid";

    gradients.forEach(g => {
      const el = document.createElement("div");
      el.className = "grad-sample";
      el.style.background = `linear-gradient(90deg, ${g[0]}, ${g[1]})`;
      el.onclick = () => {
        if (selectedElement) applyGradient(selectedElement, g);
        popup.remove();
      };
      grid.appendChild(el);
    });

    inner.appendChild(grid);
    popup.appendChild(inner);
    popup.addEventListener("click", e => { if (e.target === popup) popup.remove(); });
    document.body.appendChild(popup);
  });

  /* تلبيسات */
  openDressList.addEventListener("click", () => {
    const popup = document.createElement("div");
    popup.className = "popup-container open";
    const inner = document.createElement("div");
    inner.className = "popup";
    const grid = document.createElement("div");
    grid.className = "dress-grid";

    for (let i = 1; i <= 20; i++) {
      const div = document.createElement("div");
      div.className = "dress-item";
      const img = document.createElement("img");
      img.src = `../assets/dressup/${i}.png`;
      img.onerror = () => div.remove();
      div.appendChild(img);
      div.onclick = () => {
        if (selectedElement) applyDress(selectedElement, img.src);
        popup.remove();
      };
      grid.appendChild(div);
    }

    inner.appendChild(grid);
    popup.appendChild(inner);
    popup.addEventListener("click", e => { if (e.target === popup) popup.remove(); });
    document.body.appendChild(popup);
  });

  /* تطبيق تدرج */
  function applyGradient(el, g) {
    if (el.dataset.type === "text") {
      el.style.background = `linear-gradient(90deg, ${g[0]}, ${g[1]})`;
      el.style.webkitBackgroundClip = "text";
      el.style.webkitTextFillColor = "transparent";
    } else if (el.dataset.type === "image") {
      el.querySelector("img").style.filter = `contrast(1.2) drop-shadow(0 0 5px ${g[0]})`;
    }
  }

  /* تطبيق تلبيس */
  function applyDress(el, src) {
    if (el.dataset.type === "text") {
      el.style.backgroundImage = `url(${src})`;
      el.classList.add("dressed");
    } else if (el.dataset.type === "image") {
      el.classList.add("dressed");
      el.querySelector("img").src = src;
    }
  }

  /* تحريك وتكبير */
  function makeMovable(el) {
    let isDragging = false, startX, startY;
    el.addEventListener("mousedown", e => {
      isDragging = true;
      startX = e.offsetX;
      startY = e.offsetY;
      selectedElement = el;
    });
    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const rect = editorCanvas.getBoundingClientRect();
      el.style.left = e.pageX - rect.left - startX + "px";
      el.style.top = e.pageY - rect.top - startY + "px";
    });
    document.addEventListener("mouseup", () => isDragging = false);

    // للموبايل
    el.addEventListener("touchstart", e => {
      selectedElement = el;
    });
  }

  /* حذف المحدد */
  deleteSelected.addEventListener("click", () => {
    if (selectedElement) {
      selectedElement.remove();
      selectedElement = null;
    }
  });

  /* تحميل الصورة */
  downloadImage.addEventListener("click", () => {
    html2canvas(editorCanvas, {
      backgroundColor: null,
      scale: 2
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = "design.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
});
