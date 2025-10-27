/* professional-decoration.js — نسخة نهائية شاملة */

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const sidePanel = document.getElementById("sidePanel");
  const closePanel = document.getElementById("closePanel");
  const toolbar = document.getElementById("toolbar");
  const previewArea = document.getElementById("previewArea");
  const actionBar = document.getElementById("actionBar");

  // التحكم بالقائمة الجانبية
  menuBtn?.addEventListener("click", () => sidePanel.classList.add("open"));
  closePanel?.addEventListener("click", () => sidePanel.classList.remove("open"));

  // تهيئة المعاينة Moveable
  const previewRoot = document.createElement("div");
  previewRoot.style.width = "100%";
  previewRoot.style.height = "100%";
  previewRoot.style.position = "relative";
  previewArea.appendChild(previewRoot);

  let activeElement = null;

  // بيانات التدرجات
  const gradients = [
    "linear-gradient(90deg,#D4AF37,#FFD700)",
    "linear-gradient(90deg,#C0C0C0,#E5E5E5)",
    "linear-gradient(90deg,#FF5733,#FFC300)",
    "linear-gradient(90deg,#00CED1,#20B2AA)",
    "linear-gradient(90deg,#8A2BE2,#9370DB)",
    "linear-gradient(90deg,#FF69B4,#FFB6C1)",
    "linear-gradient(90deg,#7FFF00,#ADFF2F)",
    "linear-gradient(90deg,#FF4500,#FFA500)",
    "linear-gradient(90deg,#1E90FF,#00BFFF)",
    "linear-gradient(90deg,#4B0082,#8B008B)",
    "linear-gradient(90deg,#F0E68C,#EEE8AA)",
    "linear-gradient(90deg,#DC143C,#FF6347)",
    "linear-gradient(90deg,#20B2AA,#3CB371)",
    "linear-gradient(90deg,#FF7F50,#FF4500)",
    "linear-gradient(90deg,#8B4513,#A0522D)",
    "linear-gradient(90deg,#4682B4,#5F9EA0)",
    "linear-gradient(90deg,#DA70D6,#EE82EE)",
    "linear-gradient(90deg,#00FA9A,#00FF7F)",
    "linear-gradient(90deg,#FF1493,#FF69B4)",
    "linear-gradient(90deg,#B22222,#FF4500)",
    "linear-gradient(90deg,#7CFC00,#32CD32)",
    "linear-gradient(90deg,#00CED1,#40E0D0)",
    "linear-gradient(90deg,#FFD700,#FFA500)",
    "linear-gradient(90deg,#FF8C00,#FF6347)",
    "linear-gradient(90deg,#4B0082,#6A5ACD)",
    "linear-gradient(90deg,#ADFF2F,#7FFF00)",
    "linear-gradient(90deg,#FFB6C1,#FFC0CB)",
    "linear-gradient(90deg,#8A2BE2,#9400D3)",
    "linear-gradient(90deg,#00FF7F,#7CFC00)",
    "linear-gradient(90deg,#FF4500,#FF6347)",
    "linear-gradient(90deg,#20B2AA,#3CB371)",
    "linear-gradient(90deg,#FF69B4,#FF1493)",
    "linear-gradient(90deg,#00CED1,#48D1CC)",
    "linear-gradient(90deg,#FFD700,#FFFACD)",
    "linear-gradient(90deg,#FF6347,#FF4500)",
    "linear-gradient(90deg,#7B68EE,#6A5ACD)",
    "linear-gradient(90deg,#ADFF2F,#32CD32)",
    "linear-gradient(90deg,#FFB6C1,#FF69B4)",
    "linear-gradient(90deg,#00FA9A,#00FF7F)",
    "linear-gradient(90deg,#FF8C00,#FFA500)",
    "linear-gradient(90deg,#FF1493,#FF69B4)",
    "linear-gradient(90deg,#4B0082,#8B008B)",
    "linear-gradient(90deg,#FFD700,#D4AF37)",
    "linear-gradient(90deg,#00CED1,#20B2AA)",
    "linear-gradient(90deg,#8A2BE2,#9370DB)",
    "linear-gradient(90deg,#FF4500,#FF7F50)",
    "linear-gradient(90deg,#7FFF00,#ADFF2F)",
    "linear-gradient(90deg,#FF69B4,#FFB6C1)",
    "linear-gradient(90deg,#4682B4,#5F9EA0)",
    "linear-gradient(90deg,#DA70D6,#EE82EE)",
    "linear-gradient(90deg,#20B2AA,#3CB371)"
  ];

  // عناصر التحكم
  const contentSelect = document.createElement("select");
  contentSelect.innerHTML = `<option value="">— اختر —</option>
                             <option value="text">نص</option>
                             <option value="image">صورة</option>`;
  toolbar.appendChild(contentSelect);

  const dynamicContainer = document.createElement("div");
  dynamicContainer.style.display = "inline-flex";
  dynamicContainer.style.alignItems = "center";
  dynamicContainer.style.gap = "10px";
  toolbar.appendChild(dynamicContainer);

  // زر تحميل
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "تحميل الصورة";
  exportBtn.classList.add("btn", "primary");
  actionBar.appendChild(exportBtn);

  // دالة لإنشاء العنصر القابل للتحريك
  const createMovableElement = (el) => {
    el.style.position = "absolute";
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.transform = "translate(-50%, -50%)";
    previewRoot.appendChild(el);

    const moveable = new Moveable(previewRoot, {
      target: el,
      draggable: true,
      rotatable: true,
      scalable: true,
      origin: false,
      throttleDrag: 0,
      throttleRotate: 0,
      throttleScale: 0
    });

    activeElement = el;
  };

  // التعامل مع اختيار المحتوى
  contentSelect.addEventListener("change", () => {
    dynamicContainer.innerHTML = "";
    previewRoot.innerHTML = "";
    activeElement = null;

    if (contentSelect.value === "text") {
      const inputText = document.createElement("input");
      inputText.type = "text";
      inputText.placeholder = "اكتب النص هنا";
      dynamicContainer.appendChild(inputText);

      // زر اختيار الخطوط
      const fontBtn = document.createElement("button");
      fontBtn.textContent = "اختيار الخط";
      fontBtn.classList.add("btn");
      dynamicContainer.appendChild(fontBtn);

      fontBtn.addEventListener("click", () => {
        const fontContainer = document.createElement("div");
        fontContainer.style.position = "absolute";
        fontContainer.style.top = "50px";
        fontContainer.style.right = "10px";
        fontContainer.style.background = "rgba(255,255,255,0.05)";
        fontContainer.style.padding = "10px";
        fontContainer.style.borderRadius = "8px";
        fontContainer.style.maxHeight = "300px";
        fontContainer.style.overflowY = "auto";

        // جلب الخطوط من مجلد assets/fonts
        fetch("../assets/fonts/")
          .then(() => {
            // يعرض أسماء الملفات كأزرار
            const fonts = ["ReemKufi-Regular.ttf"]; // يمكن إضافة كل الملفات يدويًا أو عبر قائمة
            fonts.forEach(f => {
              const fBtn = document.createElement("button");
              fBtn.textContent = f.replace(/\.[^/.]+$/, "");
              fBtn.classList.add("btn", "small");
              fBtn.addEventListener("click", () => {
                if (inputText.value.trim() === "") return;
                const el = document.createElement("div");
                el.textContent = inputText.value;
                el.style.fontFamily = f.replace(/\.[^/.]+$/, "");
                el.style.fontSize = "40px";
                el.style.background = "transparent";
                el.style.color = "#D4AF37";
                createMovableElement(el);
                document.body.removeChild(fontContainer);
              });
              fontContainer.appendChild(fBtn);
            });
          });

        document.body.appendChild(fontContainer);
      });

      // زر اختيار اللون
      const colorBtn = document.createElement("button");
      colorBtn.textContent = "اختيار اللون";
      colorBtn.classList.add("btn");
      dynamicContainer.appendChild(colorBtn);

      colorBtn.addEventListener("click", () => {
        const colorContainer = document.createElement("div");
        colorContainer.style.position = "absolute";
        colorContainer.style.top = "50px";
        colorContainer.style.right = "150px";
        colorContainer.style.background = "rgba(255,255,255,0.05)";
        colorContainer.style.padding = "10px";
        colorContainer.style.borderRadius = "8px";
        colorContainer.style.maxHeight = "300px";
        colorContainer.style.overflowY = "auto";

        gradients.forEach(g => {
          const gBtn = document.createElement("button");
          gBtn.classList.add("btn", "small");
          gBtn.style.background = g;
          gBtn.style.width = "40px";
          gBtn.style.height = "20px";
          gBtn.addEventListener("click", () => {
            if (!activeElement) return;
            activeElement.style.background = "transparent";
            activeElement.style.backgroundImage = g;
            activeElement.style.webkitBackgroundClip = "text";
            activeElement.style.color = "transparent";
          });
          colorContainer.appendChild(gBtn);
        });

        document.body.appendChild(colorContainer);
      });

    } else if (contentSelect.value === "image") {
      const imgInput = document.createElement("input");
      imgInput.type = "file";
      imgInput.accept = "image/*";
      dynamicContainer.appendChild(imgInput);

      // زر اختيار التلبيس أو التدرج
      const overlayBtn = document.createElement("button");
      overlayBtn.textContent = "اختيار تلبيس / تدرج";
      overlayBtn.classList.add("btn");
      dynamicContainer.appendChild(overlayBtn);

      overlayBtn.addEventListener("click", () => {
        const overlayContainer = document.createElement("div");
        overlayContainer.style.position = "absolute";
        overlayContainer.style.top = "50px";
        overlayContainer.style.right = "10px";
        overlayContainer.style.background = "rgba(255,255,255,0.05)";
        overlayContainer.style.padding = "10px";
        overlayContainer.style.borderRadius = "8px";
        overlayContainer.style.maxHeight = "300px";
        overlayContainer.style.overflowY = "auto";

        // التلبيسات
        const dressups = ["dress1.png", "dress2.png"]; // ضع هنا الملفات الموجودة
        dressups.forEach(d => {
          const dBtn = document.createElement("img");
          dBtn.src = `../assets/dressup/${d}`;
          dBtn.classList.add("dressup-thumb");
          dBtn.addEventListener("click", () => {
            if (!imgInput.files[0]) return;
            const reader = new FileReader();
            reader.onload = e => {
              const el = document.createElement("img");
              el.src = e.target.result;
              el.style.width = "200px";
              el.style.height = "auto";
              createMovableElement(el);
            };
            reader.readAsDataURL(imgInput.files[0]);
          });
          overlayContainer.appendChild(dBtn);
        });

        // التدرجات يمكن إعادة استخدام gradients
        gradients.forEach(g => {
          const gBtn = document.createElement("div");
          gBtn.style.width = "40px";
          gBtn.style.height = "20px";
          gBtn.style.background = g;
          gBtn.style.margin = "2px";
          gBtn.style.cursor = "pointer";
          gBtn.addEventListener("click", () => {
            if (!activeElement) return;
            activeElement.style.background = g;
          });
          overlayContainer.appendChild(gBtn);
        });

        document.body.appendChild(overlayContainer);
      });
    }
  });

  // تحميل الصورة
  exportBtn.addEventListener("click", () => {
    if (!activeElement) return;
    const exportCanvas = document.createElement("canvas");
    const rect = previewRoot.getBoundingClientRect();
    exportCanvas.width = 1500;
    exportCanvas.height = 1500;
    const ctx = exportCanvas.getContext("2d");
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    if (activeElement.tagName === "DIV") {
      ctx.font = "40px Arial";
      ctx.fillStyle = "#D4AF37";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(activeElement.textContent, exportCanvas.width / 2, exportCanvas.height / 2);
    } else if (activeElement.tagName === "IMG") {
      const img = new Image();
      img.src = activeElement.src;
      img.onload = () => {
        const scale = Math.min(exportCanvas.width / img.width, exportCanvas.height / img.height);
        const x = (exportCanvas.width - img.width * scale) / 2;
        const y = (exportCanvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        const link = document.createElement("a");
        link.download = "decoration.png";
        link.href = exportCanvas.toDataURL();
        link.click();
      };
    }
  });

});
