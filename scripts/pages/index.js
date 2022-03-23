import { getPhotographers } from "../API/fetchData.js";
import { displayPhotographers } from "../factories/PhotographerFactory.js";

async function init() {
  // Récupère les datas des photographes
  const photographers = await getPhotographers();

  // Affiche les photographes
  displayPhotographers(photographers);
}

init();
