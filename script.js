function showSpinner() {
    document.getElementById("spinner").style.display = "block";
  }
  
  function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
  }
  
  document.getElementById("processBtn").addEventListener("click", () => {
    showSpinner();
  
    const cutMode = document.getElementById("cutMode").value;
    const rows = parseInt(document.getElementById("rows").value) || 2;
    const cols = parseInt(document.getElementById("cols").value) || 2;
  
    const files = document.getElementById("imageUpload").files;
    const mainFile = document.getElementById("mainUpload").files[0];
    const tabFile = document.getElementById("tabUpload").files[0];
    const previewArea = document.getElementById("previewArea");
    previewArea.innerHTML = "";
  
    if (files.length === 0) {
      alert("請至少上傳一張圖片！");
      hideSpinner();
      return;
    }
  
    let mainImage = mainFile || files[0];
    let tabImage = tabFile || files[files.length - 1];
  
    window.zip = new JSZip();
  
    const readerMain = new FileReader();
    readerMain.onload = (e) => {
      window.zip.file("main.png", e.target.result.split(",")[1], {base64: true});
    };
    readerMain.readAsDataURL(mainImage);
  
    const readerTab = new FileReader();
    readerTab.onload = (e) => {
      window.zip.file("tab.png", e.target.result.split(",")[1], {base64: true});
    };
    readerTab.readAsDataURL(tabImage);
  
    let processedCount = 0;
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              const w = img.width / cols;
              const h = img.height / rows;
              canvas.width = w;
              canvas.height = h;
              ctx.drawImage(img, c * w, r * h, w, h, 0, 0, w, h);
  
              const cutImg = new Image();
              cutImg.src = canvas.toDataURL("image/png");
  
              const wrapper = document.createElement("div");
              wrapper.className = "preview-wrapper";
  
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.checked = true;
  
              const deleteBtn = document.createElement("button");
              deleteBtn.innerText = "刪除";
              deleteBtn.addEventListener("click", () => {
                previewArea.removeChild(wrapper);
                window.zip.remove(`sticker_${index}_${r}_${c}.png`);
              });
  
              wrapper.appendChild(cutImg);
              wrapper.appendChild(checkbox);
              wrapper.appendChild(deleteBtn);
              previewArea.appendChild(wrapper);
  
              window.zip.file(`sticker_${index}_${r}_${c}.png`, canvas.toDataURL("image/png").split(",")[1], {base64: true});
            }
          }
          processedCount++;
          if (processedCount === files.length) {
            hideSpinner();
          }
        };
      };
      reader.readAsDataURL(file);
    });
  });
  
  document.getElementById("downloadBtn").add