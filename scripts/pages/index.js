//An fetch error with the body of the response
class FetchError extends Error {
  constructor(response) {
    super(`HTTP error ${response.status}`);
    this.response = response;
  }
}

// This is a wrapper that throws an error (with the response body) on failure
// or return a promise that parses a JSON response.
// It checks as well that the input is really JSON
function fetchJSON(...args) {
  return fetch(...args).then((response) => {
    // Get the content type of the response
    var contentType = response.headers.get("content-type");

    if (!response.ok) {
      throw new FetchError(response);
    }

    // Check whether the content type is correct before you process it further
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("The fetchJSON response doesn't contain JSON !");
    }

    return response.json();
  });
}

async function getPhotographers() {
  return fetchJSON("/data/photographers.json")
    .then((data) => data.photographers)
    .catch((error) => {
      console.error(error);
    });

  // return fetch("/data/photographers.json")
  //   .then((response) => response.json())
  //   .then((data) => data.photographers);
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    console.log(photographerModel);
    console.log(photographerModel.id);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function setAllEventListeners() {
  const photographers = document.querySelectorAll(".photographer_section > a");

  photographers.forEach((photographer) => {
    // Ajout de l'écouteur d'évènement "click" sur le lien du photographe
    photographer.addEventListener("click", (e) => console.log(photographer));
  });
}

async function init() {
  // Récupère les datas des photographes
  // const { photographers } = await getPhotographers();
  const photographers = await getPhotographers();
  console.log(photographers);
  await displayData(photographers);
  // Une fois que tous le DOM est construit, les eventListeners sont affichés
  // setAllEventListeners(photographers);
}

init();
