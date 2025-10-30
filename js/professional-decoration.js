document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("textInput");
  const fileImage = document.getElementById("fileImage");
  const btnAdd = document.getElementById("btnAdd");
  const openFontList = document.getElementById("openFontList");
  const fontList = document.getElementById("fontList");
  const openColorGrid = document.getElementById("openColorGrid");
  const openDressGrid = document.getElementById("openDressGrid");
  const modeSelect = document.getElementById("modeSelect");
  const editorCanvas = document.getElementById("editorCanvas");
  const deleteSelected = document.getElementById("deleteSelected");
  const downloadImage = document.getElementById("downloadImage");
  const widthInput = document.getElementById("widthInput");
  const heightInput = document.getElementById("heightInput");

  let selectedElement = null;
  let selectedData = null;

  // قيم افتراضية
  let currentFont = "Cairo";
  let currentGradient = null;
  let currentDress = null;
  let currentMode = "solid";

  // إنشاء التدرجات
  const gradients = [];
  for (let i = 0; i < 50; i++) {
    const a = `hsl(${(i * 360) / 50} 80% 45%)`;
    const b = `hsl(${((i * 360) / 50 + 40) % 360} 80% 60%)`;
    gradients.push([a, b]);
  }

  // زر فتح قائمة الخطوط
  openFontList.addEventListener("click", () => {
    fontList.classList.toggle("active");
  });

  fontList.querySelectorAll(".font-item").forEach((item) => {
    item.addEventListener("click", () => {
      currentFont = item.style.fontFamily.replace(/['"]/g, "");
      openFontList.textContent = item.textContent;
      fontList.classList.remove("active");
      if (selectedElement && selectedElement.dataset.type === "text") {
        selectedElement.style.fontFamily = currentFont;
      }
    });
  });

  // إنشاء قائمة التدرجات
  openColorGrid.addEventListener("click", () => {
    showPopup("gradients");
  });

  openDressGrid.addEventListener("click", () => {
    showPopup("dressup");
  });

  function showPopup(type) {
    const popup = document.createElement("div");
    popup.className = "popup-container open";
    const inner = document.createElement("div");
    inner.className = "popup";

    const title = document.createElement("h3");
    title.textContent = type === "gradients" ? "اختر تدرج" : "اختر تلبيسة";
    inner.appendChild(title);

    const grid = document.createElement("div");
    grid.className = type === "gradients" ? "grad-grid" : "dress-grid";

    if (type === "gradients") {
      gradients.forEach((g) => {
        const s = document.createElement("div");
        s.className = "grad-sample";
        s.style.background = `linear-gradient(90deg, ${g[0]}, ${g[1]})`;
        s.addEventListener("click", () => {
          currentGradient = g;
          currentMode = "gradient";
          if (selectedElement) applyGradient(selectedElement, g);
          document.body.removeChild(popup);
        });
        grid.appendChild(s);
      });
    } else {
      // تحميل صور من المجلد assets/dressup
      fetch("../assets/dressup/")
        .then(() => {
          for (let i = 1; i <= 20; i++) {
            const d = document.createElement("div");
            d.className = "dress-item";
            const img = document.createElement("img");
            img.src = `../assets/dressup/${i}.png`;
            img.onerror = () => (img.style.display = "none");
            d.appendChild(img);
            d.addEventListener("click", () => {
              currentDress = img.src;
              currentMode = "dress";
              if (selectedElement) applyDress(selectedElement, img.src);
              document.body.removeChild(popup);
            });
            grid.appendChild(d);
          }
        })
        .catch(() => {});
    }

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "إغلاق";
    closeBtn.className = "btn";
    closeBtn.onclick = () => document.body.removeChild(popup);

    inner.appendChild(grid);
    inner.appendChild(closeBtn);
    popup.appendChild(inner);
    document.body.appendChild(popup);
  }

  // زر الإضافة
  btnAdd.addEventListener("click", () => {
    const type = modeSelect.value;
    if (type === "text") {
      const text = textInput.value.trim();
      if (!text) return alert("أدخل نصاً أولاً");

      const div = document.createElement("div");
      div.className = "text-item canvas-item";
      div.textContent = text;
      div.dataset.type = "text";
      div.style.fontFamily = currentFont;
      div.style.left = "50%";
      div.style.top = "50%";
      div.style.transform = "translate(-50%, -50%)";
      editorCanvas.appendChild(div);
      makeMovable(div);
      selectedElement = div;
      applyCurrentStyle(div);
    } else {
      const file = fileImage.files[0];
      if (!file) return alert("اختر صورة أولاً");
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgWrap = document.createElement("div");
        imgWrap.className = "img-wrap canvas-item";
        imgWrap.dataset.type = "image";

        const img = document.createElement("img");
        img.src = e.target.result;
        imgWrap.appendChild(img);
        imgWrap.style.left = "50%";
        imgWrap.style.top = "50%";
        imgWrap.style.transform = "translate(-50%, -50%)";
        editorCanvas.appendChild(imgWrap);
        makeMovable(imgWrap);
        selectedElement = imgWrap;
        applyCurrentStyle(imgWrap);
      };
      reader.readAsDataURL(file);
    }
  });

  // تطبيق الأنماط
  function applyCurrentStyle(el) {
    if (!el) return;
    if (el.dataset.type === "text") {
      el.style.fontFamily = currentFont;
      if (currentMode === "gradient" && currentGradient)
        applyGradient(el, currentGradient);
      else if (currentMode === "dress" && currentDress)
        applyDress(el, currentDress);
      else el.style.color = "#000";
    } else if (el.dataset.type === "image") {
      if (currentMode === "gradient" && currentGradient)
        applyGradient(el, currentGradient);
      else if (currentMode === "dress" && currentDress)
        applyDress(el, currentDress);
    }
  }

  function applyGradient(el, g) {
    if (el.dataset.type === "text") {
      el.style.background = `linear-gradient(90deg, ${g[0]}, ${g[1]})`;
      el.style.webkitBackgroundClip = "text";
      el.style.backgroundClip = "text";
      el.style.color = "transparent";
      el.style.webkitTextFillColor = "transparent";
    } else if (el.dataset.type === "image") {
      el.querySelector("img").style.filter = `contrast(1.2) saturate(1.2) drop-shadow(0 0 3px ${g[0]})`;
    }
  }

  function applyDress(el, src) {
    if (el.dataset.type === "text") {
      el.style.backgroundImage = `url(${src})`;
      el.classList.add("dressed");
    } else if (el.dataset.type === "image") {
      el.querySelector("img").style.mixBlendMode = "multiply";
      el.querySelector("img").src = src;
    }
  }

  // جعل العناصر قابلة للتحريك والتكبير
  function makeMovable(el) {
    let isDragging = false;
    let offsetX, offsetY;
    el.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      selectedElement = el;
    });
    window.addEventListener("mousemove", (e) => {
      if (isDragging) {
        el.style.left = e.pageX - offsetX + "px";
        el.style.top = e.pageY - offsetY + "px";
      }
    });
    window.addEventListener("mouseup", () => (isDragging = false));

    // للموبايل
    let touchStart = null;
    el.addEventListener("touchstart", (e) => {
      touchStart = e.touches[0];
      selectedElement = el;
    });
    el.addEventListener("touchmove", (e) => {
      if (!touchStart) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStart.clientX;
      const dy = touch.clientY - touchStart.clientY;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener("touchend", () => (touchStart = null));
  }

  // حذف العنصر المحدد
  deleteSelected.addEventListener("click", () => {
    if (selectedElement) {
      selectedElement.remove();
      selectedElement = null;
    }
  });

  // التحميل كصورة
  downloadImage.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const w = parseInt(widthInput.value) || 1250;
    const h = parseInt(heightInput.value) || 1250;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    html2canvas(editorCanvas, {
      backgroundColor: null,
      scale: 2,
    }).then((canvasResult) => {
      const imgData = canvasResult.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = imgData;
      a.download = "design.png";
      a.click();
    });
  });
});
