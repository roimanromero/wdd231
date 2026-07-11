// Dynamically outputs the copyright year and the document's last-modified date.
document.getElementById('currentYear').textContent = new Date().getFullYear();

document.getElementById('lastModified').textContent =
  `Last Modification: ${document.lastModified}`;
