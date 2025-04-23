const galleryGrid = document.getElementById("galleryGrid");
const emptyMsg = document.getElementById("emptyMsg");
const clearGallery = document.getElementById("clearGallery");

function loadGallery() {
  const images = JSON.parse(localStorage.getItem("galleryImages") || "[]");
  galleryGrid.innerHTML = "";

  if (images.length === 0) {
    emptyMsg.textContent = "No images uploaded yet.";
  } else {
    emptyMsg.textContent = "";

    images.forEach((item) => {
      const card = document.createElement("div");
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.alignItems = "center";
      card.style.width = "500px";

      const img = document.createElement("img");
      img.src = typeof item === "string" ? item : item.src;
      img.alt = "Climb Photo";

      const desc = document.createElement("p");
      desc.style.marginTop = "10px";
      desc.style.color = "#427aa1";
      desc.style.fontSize = "15px";
      desc.style.maxWidth = "480px";
      desc.style.wordWrap = "break-word";
      desc.style.padding = "0 10px";

      // Build description and date
      if (typeof item === "object") {
        const descriptionText = item.description
          ? item.description
          : "(No description provided)";
        const dateText = item.date ? `Date: ${item.date}` : "Date: N/A";
        desc.innerHTML = `${descriptionText}<br><em style="color: gray; font-size: 13px">${dateText}</em>`;
      } else {
        desc.textContent = "(No description provided)";
      }

      card.appendChild(img);
      card.appendChild(desc);
      galleryGrid.appendChild(card);
    });
  }
}

clearGallery.onclick = function () {
  if (confirm("Are you sure you want to clear the gallery?")) {
    localStorage.removeItem("galleryImages");
    loadGallery();
  }
};

loadGallery();
