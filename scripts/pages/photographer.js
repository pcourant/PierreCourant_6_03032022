// Ouverture du menu dropdown
// @data: les medias du photographe à trier
function dropDown(data) {
  let arrowOpen = document.getElementById("arrow-down-open");
  let arrowClose = document.getElementById("arrow-up-close");

  // le DOM element du dropdown menu
  let hiddenSorting = document.getElementById("hidden-sorting");

  // Ajout des event listeners sur les chevrons haut et bas du dropdown menu "trier par"
  arrowOpen.addEventListener("click", () => {
    hiddenSorting.classList.add("display");
  });
  arrowClose.addEventListener("click", () => {
    hiddenSorting.classList.remove("display");
  });

  // Ajout des event listeners sur les éléments du dropdown menu
  sortMedias(data);
}

// Ajout des event listeners sur les éléments du dropdown menu
function sortMedias(data) {
  // let medias_sorted_array = [];
  // const MEDIAS = data.dataMedias;
  let btnSorting = document.getElementById("sorting-btn");
  let hiddenSorting = document.getElementById("hidden-sorting");
  let sortingItems = Array.from(document.getElementsByClassName("sorting"));

  console.log(sortingItems);

  sortingItems.forEach((item, index) =>
    item.addEventListener("click", () => {
      hiddenSorting.classList.remove("display");
      let newSorting = item.querySelector("span").textContent;
      let oldSorting = sortingItems[0].querySelector("span").textContent;
      if (index === 0) {
        // btnSorting.querySelector("span").textContent = `Popularité`;
        // item.parentNode.insertBefore(item, item.parentNode.firstChild);
        // Trier par popularité
        // medias_sorted_array = MEDIAS.sort((a, b) => {
        //   return b.likes - a.likes;
        // });
      } else if (index === 1) {
        btnSorting.querySelector("span").textContent = newSorting;
        sortingItems[0].querySelector("span").textContent = newSorting;
        item.querySelector("span").textContent = oldSorting;

        // Trier par date
        // medias_sorted_array = MEDIAS.sort((a, b) => {
        //   return new Date(a.date).valueOf() - new Date(b.date).valueOf();
        // });
      } else if (index === 2) {
        btnSorting.querySelector("span").textContent = newSorting;
        sortingItems[0].querySelector("span").textContent = newSorting;
        item.querySelector("span").textContent = oldSorting;

        // Trier par titre
        // medias_sorted_array = MEDIAS.sort((a, b) => {
        //   if (a.photoName.toLowerCase() < b.photoName.toLowerCase()) {
        //     return -1;
        //   } else if (a.photoName.toLowerCase() > b.photoName.toLowerCase()) {
        //     return 1;
        //   }
        // });
      }
      // Affichage des médias triés
      // this.displaySortMedia(medias_sorted_array);
    })
  );
}

// Récupère l'ID du photographe
function getPhotographerIdFromURL() {
  const parsedUrl = new URL(window.location.href);
  const id = parsedUrl.searchParams.get("id");
  // console.log("id", id);
  return id;
}

function displayPhotographHeader(photographerModel) {
  const photographHeader = document.querySelector(".photograph-header");

  photographerModel.constructPhotographHeaderDOM(photographHeader);
}

async function displayMedias(medias) {
  const mediaContainer = document.querySelector(".media-container");

  medias.forEach((media) => {
    const mediaModel = mediaFactory(media);
    // console.log(mediaModel);
    // console.log(mediaModel.id);
    const mediaCardDOM = mediaModel.getMediaCardDOM();
    mediaContainer.appendChild(mediaCardDOM);
  });
}

async function displayLikesAndPrice(photographerModel) {
  const priceContainer = document.getElementById("price-container");

  priceContainer.textContent = photographerModel.price;
}

async function init() {
  const photographerId = getPhotographerIdFromURL();
  const photographer = await getPhotographer(photographerId);
  // console.log("photographer", photographer);
  const photographerModel = photographerFactory(photographer);

  displayPhotographHeader(photographerModel);

  displayLikesAndPrice(photographerModel);

  dropDown(null);

  // Récupère les medias du photographe
  const medias = await getMediasOfPhotographer(photographerId);
  // console.log(medias);
  displayMedias(medias);
}

init();
