// Image upload script
const fileInput = document.getElementById("fileInput");
const goToGallery = document.getElementById("goToGallery");

const descModal = document.getElementById("descModal");
const imageDescriptionInput = document.getElementById("imageDescription");
const imageDateInput = document.getElementById("imageDate");
const saveDescriptionBtn = document.getElementById("saveDescriptionBtn");

let imageQueue = [];
let imageDataArray = JSON.parse(localStorage.getItem("galleryImages") || "[]");

fileInput.addEventListener("change", () => {
  const files = Array.from(fileInput.files).filter((file) =>
    file.type.startsWith("image/")
  );
  if (!files.length) return;

  imageQueue = files;
  fileInput.value = ""; // reset input
  promptNextDescription();
});

function promptNextDescription() {
  if (imageQueue.length === 0) {
    localStorage.setItem("galleryImages", JSON.stringify(imageDataArray));
    alert("All images uploaded!");
    return;
  }

  const file = imageQueue.shift();
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageSrc = e.target.result;
    imageDescriptionInput.value = "";
    imageDateInput.value = "";
    descModal.style.display = "flex";

    saveDescriptionBtn.onclick = () => {
      const description = imageDescriptionInput.value.trim();
      const date = imageDateInput.value;

      imageDataArray.push({
        src: imageSrc,
        description: description,
        date: date,
      });

      descModal.style.display = "none";
      promptNextDescription();
    };
  };
  reader.readAsDataURL(file);
}

descModal.addEventListener("click", (e) => {
  if (e.target === descModal) {
    descModal.style.display = "none";
  }
});

goToGallery.onclick = () => {
  window.location.href = "gallery.html";
};

// Calendar script
const calendar = document.getElementById("calendar");
const modal = document.getElementById("modal");
const climbNoteInput = document.getElementById("climbNote");
const saveNoteButton = document.getElementById("saveNote");
const modalDateTitle = document.getElementById("modal-date-title");
const monthSelect = document.getElementById("monthSelect");
const resetMonthBtn = document.getElementById("resetMonthBtn");

let selectedDate = null;
let currentMonthKey = "";
const storedNotes = JSON.parse(localStorage.getItem("climbSchedule")) || {};

function populateMonthSelector() {
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), i, 1);
    const option = document.createElement("option");
    option.value = `${date.getFullYear()}-${i + 1}`;
    option.textContent = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (i === now.getMonth()) option.selected = true;
    monthSelect.appendChild(option);
  }
}

function renderCalendar() {
  calendar.innerHTML = "";
  const [year, month] = monthSelect.value.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  currentMonthKey = `${year}-${month}`;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${currentMonthKey}-${day}`;
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.dataset.date = dateKey;

    const dayNumber = document.createElement("div");
    dayNumber.classList.add("day-number");
    dayNumber.textContent = day;

    const noteText = storedNotes[dateKey];
    const note = document.createElement("div");
    note.classList.add("note");
    if (noteText) {
      note.textContent = noteText;
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => {
        delete storedNotes[dateKey];
        localStorage.setItem("climbSchedule", JSON.stringify(storedNotes));
        renderCalendar();
      };
      dayDiv.appendChild(deleteBtn);
    }

    dayDiv.appendChild(dayNumber);
    dayDiv.appendChild(note);
    calendar.appendChild(dayDiv);
  }
}

calendar.addEventListener("click", function (e) {
  const dayBox = e.target.closest(".day");
  if (!dayBox || e.target.classList.contains("delete-btn")) return;

  selectedDate = dayBox.dataset.date;
  climbNoteInput.value = storedNotes[selectedDate] || "";
  modalDateTitle.textContent = `Add Climb for ${selectedDate}`;
  modal.style.display = "flex";
});

saveNoteButton.addEventListener("click", function () {
  const note = climbNoteInput.value.trim();
  if (note) {
    storedNotes[selectedDate] = note;
  } else {
    delete storedNotes[selectedDate];
  }
  localStorage.setItem("climbSchedule", JSON.stringify(storedNotes));
  modal.style.display = "none";
  renderCalendar();
});

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

monthSelect.addEventListener("change", renderCalendar);

resetMonthBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to clear all climbs for this month?")) {
    const keysToRemove = Object.keys(storedNotes).filter((key) =>
      key.startsWith(currentMonthKey)
    );
    keysToRemove.forEach((key) => delete storedNotes[key]);
    localStorage.setItem("climbSchedule", JSON.stringify(storedNotes));
    renderCalendar();
  }
});

populateMonthSelector();
renderCalendar();
