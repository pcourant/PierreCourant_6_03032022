// Récupère l'ID du photographe
function getPhotographerIdFromURL() {
  const parsedUrl = new URL(window.location.href);
  const id = parsedUrl.searchParams.get("id");
  console.log("id", id);
  return id;
}

function displayPhotographHeader(photographer) {
  const photographHeader = document.querySelector(".photograph-header");

  const photographerModel = photographerFactory(photographer);
  photographerModel.constructPhotographHeaderDOM(photographHeader);
}

async function displayMedias(medias) {
  const mediaContainer = document.querySelector(".media-container");

  medias.forEach((media) => {
    const mediaModel = mediaFactory(media);
    console.log(mediaModel);
    console.log(mediaModel.id);
    const mediaCardDOM = mediaModel.getMediaCardDOM();
    mediaContainer.appendChild(mediaCardDOM);
  });
}

async function init() {
  const photographerId = getPhotographerIdFromURL();
  const photographer = await getPhotographer(photographerId);
  console.log("photographer", photographer);

  displayPhotographHeader(photographer);

  // Récupère les medias du photographe
  const medias = await getMediasOfPhotographer(photographerId);
  console.log(medias);
  displayMedias(medias);
}

init();
