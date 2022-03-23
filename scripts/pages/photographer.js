import {
  MEDIA_MODELS,
  initMediasModels,
  displayMedias,
} from "../factories/MediaFactory.js";
import { photographerFactory } from "../factories/PhotographerFactory.js";
import { getPhotographer, getMediasOfPhotographer } from "../API/fetchData.js";
import { initContactFormModal } from "../modals/contactForm.js";
import { initTotalLikes } from "../components/totalLikes.js";
import { initDropdownSortingMenu } from "../components/dropdownSortingMenu.js";
import { initLightbox } from "../modals/lightbox.js";

// Récupère l'ID du photographe
async function getPhotographerIdFromURL() {
  const parsedUrl = new URL(window.location.href);
  const id = parsedUrl.searchParams.get("id");
  return id;
}

async function displayPhotographHeader(photographerModel) {
  const photographHeader = document.querySelector(".photograph-header");

  photographerModel.constructPhotographHeaderDOM(photographHeader);
}

async function displayPrice(photographerModel) {
  const priceContainer = document.getElementById("price-container");

  priceContainer.textContent = photographerModel.price;
}

async function init() {
  // Extrait l'id photographe de l'URL
  const photographerId = await getPhotographerIdFromURL();

  // Crée une instance de photographe
  const photographer = await getPhotographer(photographerId);
  const photographerModel = await photographerFactory(photographer);

  // Met en place le header
  displayPhotographHeader(photographerModel);

  // Met en place l'encart avec le prix
  displayPrice(photographerModel);

  // Met en place la modale de contact
  initContactFormModal(photographerModel);

  // Récupère les medias du photographe
  const medias = await getMediasOfPhotographer(photographerId);
  //Initialise la variable globale MEDIA_MODELS
  await initMediasModels(medias);

  // Affiche tous les médias triés par défaut (Popularité)
  displayMedias();

  // Remplit l'encart de likes
  initTotalLikes(MEDIA_MODELS);

  // Met en place le menu dropdown de tri
  initDropdownSortingMenu(MEDIA_MODELS);

  // Met en place la lightbox
  initLightbox();
}

init();
