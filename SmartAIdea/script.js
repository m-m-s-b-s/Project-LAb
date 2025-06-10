// Handle upload form submission
document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");
  if (fileInput.files.length === 0) return;

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const item = document.createElement("p");
      item.innerHTML = `<a href="http://localhost:3000/${data.filename}" target="_blank">${data.originalname}</a>`;
      fileList.appendChild(item);
      fileInput.value = "";
    })
    .catch((err) => console.error("Upload failed:", err));
});

function loadUploadedFiles() {
  fetch("http://localhost:3000/files")
    .then((res) => res.json())
    .then((files) => {
      const gallery = document.getElementById("fileGallery");
      gallery.innerHTML = "";
      files.forEach(file => {
        const link = document.createElement("p");
        link.innerHTML = `📄 <a href="http://localhost:3000/${file}" target="_blank">${file}</a>`;
        gallery.appendChild(link);
      });
    })
    .catch((err) => console.error("Failed to load files:", err));
}

document.getElementById("myFilesBtn").addEventListener("click", function (e) {
  e.preventDefault();
  loadUploadedFiles();
});
