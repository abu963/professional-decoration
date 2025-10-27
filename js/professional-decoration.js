/* professional-decoration.js — النسخة النهائية المتكاملة */

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const sidePanel = document.getElementById("sidePanel");
  const closePanel = document.getElementById("closePanel");
  const toolbar = document.getElementById("toolbar");
  const previewArea = document.getElementById("reactPreviewRoot");
  const actionBar = document.getElementById("actionBar");

  // التحكم بالقائمة الجانبية
  menuBtn?.addEventListener("click", () => sidePanel.classList.add("open"));
  closePanel?.addEventListener("click", () => sidePanel.classList.remove("open"));

  // بيانات أولية
  const fontsFolder = "../assets/fonts/";
  const dressupFolder = "../assets/dressup/";
  const gradients = [
    "linear-gradient(45deg,#ffd700,#fffacd)",
    "linear-gradient(45deg,#c0c0c0,#e6e6fa)",
    "linear-gradient(45deg,#d4af37,#fff8dc)",
    "linear-gradient(45deg,#ff69b4,#ffc0cb)",
    "linear-gradient(45deg,#00ffff,#7fffd4)",
    // ... أكمل إلى 50 تدرج حسب اختيارك
  ];

  const App = {
    toolbar,
    previewArea,
    actionBar,
    state: { type: "none", text: "", font: "", color: "", image: null },
    init() {
      this.renderToolbar();
      this.renderActionBar();
      this.renderPreview();
    },
    renderToolbar() {
      const container = document.createElement("div");
      container.className = "toolbar-inner";

      // اختيار نوع المحتوى
      const typeGroup = document.createElement("div");
      typeGroup.className = "control-group";
      const selectType = document.createElement("select");
      selectType.innerHTML = `<option value="none">— اختر —</option>
                              <option value="text">نص</option>
                              <option value="image">صورة</option>`;
      typeGroup.appendChild(selectType);
      container.appendChild(typeGroup);

      // الحقول الديناميكية حسب الاختيار
      const dynamic = document.createElement("div");
      dynamic.className = "dynamic-options";
      container.appendChild(dynamic);

      // حدث تغيير النوع
      selectType.addEventListener("change", (e) => {
        this.state.type = e.target.value;
        dynamic.innerHTML = "";
        if (this.state.type === "text") this.addTextControls(dynamic);
        if (this.state.type === "image") this.addImageControls(dynamic);
      });

      this.toolbar.appendChild(container);
    },
    addTextControls(container) {
      // إدخال النص
      const textInput = document.createElement("input");
      textInput.type = "text";
      textInput.placeholder = "أدخل الاسم";
      textInput.addEventListener("input", (e) => {
        this.state.text = e.target.value;
        this.updatePreview();
      });
      container.appendChild(textInput);

      // زر اختيار الخطوط
      const fontBtn = document.createElement("button");
      fontBtn.className = "btn small";
      fontBtn.textContent = "اختر الخط";
      fontBtn.addEventListener("click", () => this.showFontPicker());
      container.appendChild(fontBtn);

      // زر اختيار التدرج/اللون
      const colorBtn = document.createElement("button");
      colorBtn.className = "btn small";
      colorBtn.textContent = "اختر اللون";
      colorBtn.addEventListener("click", () => this.showGradientPicker());
      container.appendChild(colorBtn);
    },
    addImageControls(container) {
      // إدخال الصورة
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.state.image = reader.result;
            this.updatePreview();
          };
          reader.readAsDataURL(file);
        }
      });
      container.appendChild(fileInput);

      // زر اختيار التدرج/التلبيس
      const styleBtn = document.createElement("button");
      styleBtn.className = "btn small";
      styleBtn.textContent = "اختر التدرج/تلبيس";
      styleBtn.addEventListener("click", () => this.showDressupPicker());
      container.appendChild(styleBtn);
    },
    renderPreview() {
      previewArea.innerHTML = "";
      const rootDiv = document.createElement("div");
      rootDiv.id = "previewRoot";
      rootDiv.style.width = "100%";
      rootDiv.style.height = "100%";
      previewArea.appendChild(rootDiv);

      const previewContent = document.createElement("div");
      previewContent.id = "previewContent";
      previewContent.style.position = "absolute";
      previewContent.style.top = "50%";
      previewContent.style.left = "50%";
      previewContent.style.transform = "translate(-50%, -50%)";
      previewRoot.appendChild(previewContent);

      this.previewContent = previewContent;
      this.updatePreview();
    },
    updatePreview() {
      if (!this.previewContent) return;
      this.previewContent.innerHTML = "";
      if (this.state.type === "text" && this.state.text) {
        const span = document.createElement("span");
        span.textContent = this.state.text;
        span.style.fontFamily = this.state.font || "'Reem Kufi', sans-serif";
        span.style.background = this.state.color || "transparent";
        span.style.padding = "5px 10px";
        span.style.borderRadius = "5px";
        this.previewContent.appendChild(span);
      }
      if (this.state.type === "image" && this.state.image) {
        const img = document.createElement("img");
        img.src = this.state.image;
        img.style.maxWidth = "100%";
        img.style.maxHeight = "100%";
        this.previewContent.appendChild(img);
      }
    },
    renderActionBar() {
      actionBar.innerHTML = "";
      const exportBtn = document.createElement("button");
      exportBtn.className = "btn primary";
      exportBtn.textContent = "تحميل الصورة";
      exportBtn.addEventListener("click", () => this.exportImage());
      actionBar.appendChild(exportBtn);
    },
    showFontPicker() {
      const picker = document.createElement("div");
      picker.className = "grid-panel";
      const sampleText = document.createElement("div");
      sampleText.className = "font-sample";
      sampleText.textContent = this.state.text || "نص المعاينة";
      picker.appendChild(sampleText);

      // قراءة الخطوط من مجلد fonts (مثال، تعدل حسب ملفاتك)
      const fontList = ["ReemKufi","Amiri","Cairo","Tajawal"];
      fontList.forEach(f => {
        const item = document.createElement("div");
        item.className = "grid-item";
        item.style.fontFamily = f;
        item.textContent = this.state.text || "نص المعاينة";
        item.addEventListener("click", () => {
          this.state.font = f;
          this.updatePreview();
          picker.remove();
        });
        picker.appendChild(item);
      });
      document.body.appendChild(picker);
    },
    showGradientPicker() {
      const picker = document.createElement("div");
      picker.className = "grid-panel";
      gradients.forEach(g => {
        const item = document.createElement("div");
        item.className = "grid-item";
        item.style.background = g;
        item.style.height = "36px";
        item.addEventListener("click", () => {
          this.state.color = g;
          this.updatePreview();
          picker.remove();
        });
        picker.appendChild(item);
      });
      document.body.appendChild(picker);
    },
    showDressupPicker() {
      const picker = document.createElement("div");
      picker.className = "grid-panel";
      // مثال على تلبيسات
      const dressups = ["dress1.png","dress2.png","dress3.png"];
      dressups.forEach(d => {
        const item = document.createElement("img");
        item.className = "dressup-thumb";
        item.src = dressupFolder + d;
        item.addEventListener("click", () => {
          this.state.color = `url(${dressupFolder + d})`;
          this.updatePreview();
          picker.remove();
        });
        picker.appendChild(item);
      });
      document.body.appendChild(picker);
    },
    exportImage() {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = 1500;
      canvas.height = 1500;
      const ctx = canvas.getContext("2d");

      if (this.state.type === "text" && this.state.text) {
        ctx.font = `bold 100px ${this.state.font || 'Reem Kufi'}`;
        ctx.fillStyle = "#D4AF37";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.state.text, canvas.width / 2, canvas.height / 2);
      }

      if (this.state.type === "image" && this.state.image) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const link = document.createElement("a");
          link.download = "decoration.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        };
        img.src = this.state.image;
        return;
      }

      const link = document.createElement("a");
      link.download = "decoration.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  App.init();
});
