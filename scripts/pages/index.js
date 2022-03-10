async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer-section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    console.log(photographerModel);
    console.log(photographerModel.id);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

// async function setAllEventListeners() {
//   const photographers = document.querySelectorAll(".photographer_section > a");

//   photographers.forEach((photographer) => {
//     // Ajout de l'écouteur d'évènement "click" sur le lien du photographe
//     photographer.addEventListener("click", (e) => console.log(photographer));
//   });
// }

async function init() {
  // Récupère les datas des photographes
  // const { photographers } = await getPhotographers();
  const photographers = await getPhotographers();
  console.log(photographers);
  displayData(photographers);
}

init();
