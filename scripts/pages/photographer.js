const popularSorting = (a, b) => {
  return b.likes - a.likes;
};
const dateSorting = (a, b) => {
  if (a.date <= b.date) {
    return -1;
  } else {
    return 1;
  }
};
const titleSorting = (a, b) => {
  if (a.title.toLowerCase() <= b.title.toLowerCase()) {
    return -1;
  } else {
    return 1;
  }
};

const SORTING_FUNCTIONS_ENUM = [
  ["Popularité", popularSorting],
  ["Date", dateSorting],
  ["Titre", titleSorting],
];

function getSortingFunction(name) {
  return SORTING_FUNCTIONS_ENUM.find((array) => `${array[0]}` === name)[1];
}

// Ouverture du menu dropdown
// @data: les medias du photographe à trier
async function displayDropDown(mediaModels) {
  // const arrowOpen = document.getElementById("arrow-down-open");
  const sortingBtn = document.getElementById("sorting-btn");
  const arrowClose = document.getElementById("arrow-up-close");

  // le DOM element du dropdown menu
  const hiddenSorting = document.getElementById("hidden-sorting");

  // Ajout des event listeners sur le bouton et le chevron haut du dropdown menu "trier par"
  sortingBtn.addEventListener("click", () => {
    sortingBtn.setAttribute("aria-expanded", "true");
    hiddenSorting.classList.add("display");
  });
  arrowClose.addEventListener("click", () => {
    sortingBtn.setAttribute("aria-expanded", "false");
    hiddenSorting.classList.remove("display");
  });

  // Ajout des event listeners sur les éléments du dropdown menu pour trier les médias
  sortMediasOnClick(mediaModels);
}

// Ajout des event listeners sur les éléments du dropdown menu
async function sortMediasOnClick(mediaModels) {
  const sortingBtn = document.getElementById("sorting-btn");
  const hiddenSorting = document.getElementById("hidden-sorting");
  const sortingListItems = Array.from(
    document.getElementsByClassName("sorting")
  );

  sortingListItems.forEach((item, index) =>
    item.addEventListener("click", () => {
      // Si un autre classement est demandé (autre que celui déjà effectif)
      if (index !== 0) {
        // Récupère les infos du tri actuel
        const newSortingName = item.querySelector("span").textContent;
        const oldSortingName =
          sortingListItems[0].querySelector("span").textContent;

        // Trie et affiche les medias
        mediaModels.sort(getSortingFunction(newSortingName));
        displayMedias(mediaModels);

        // Met à jour le bouton de tri
        sortingBtn.querySelector("span").textContent = newSortingName;

        // Intervertie les entrées du drop down menu
        sortingListItems[0].querySelector("span").textContent = newSortingName;
        item.querySelector("span").textContent = oldSortingName;
      }

      // Retracte le drop down menu
      hiddenSorting.classList.remove("display");
      sortingBtn.setAttribute("aria-expanded", "false");
    })
  );
}

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

async function getAllMediaModels(medias) {
  const mediaModels = new Array();
  medias.forEach((media) => {
    const mediaModel = mediaFactory(media);
    mediaModel.getMediaCardDOM();
    mediaModel.getMediaLightBoxDOM();
    mediaModels.push(mediaModel);
  });
  return mediaModels;
}

async function displayMedias(mediaModels) {
  const mediaContainer = document.querySelector(".media-container");

  mediaModels.forEach((mediaModel) => {
    mediaContainer.appendChild(mediaModel.mediaCardDOM);
  });
}

async function getTotalLikes(mediaModels) {
  let totalLikes = 0;
  mediaModels.forEach((mediaModel) => {
    totalLikes += mediaModel.likes;
  });

  return totalLikes;
}

async function toggleLikesOnClick(mediaModels) {
  mediaModels.forEach((mediaModel) => {
    mediaModel.mediaCardDOM
      .querySelector(".media-likes")
      .addEventListener("click", () => {
        // console.log(mediaModel.mediaCardDOM);
        // e.preventDefault();
        mediaModel.toggleLikes();
        displayLikes(mediaModels);
      });
  });
}

async function displayLikes(mediaModels) {
  const likesContainer = document.getElementById("likes-container");

  likesContainer.textContent = await getTotalLikes(mediaModels);
}

async function displayPrice(photographerModel) {
  const priceContainer = document.getElementById("price-container");

  priceContainer.textContent = photographerModel.price;
}

async function displayModalHeaderH2(photographerModel) {
  const modalHeaderH2 = document.querySelector(".contact-modal h2");

  modalHeaderH2.innerHTML = `Contactez-moi<br />` + `${photographerModel.name}`;
}

async function displayModal() {
  document.querySelector("body > header").classList.add("transparent");
  document.getElementById("main").classList.add("transparent");
  document.querySelector(".contact-modal").classList.add("displayModal");
}

async function closeModal() {
  document.querySelector(".contact-modal").classList.remove("displayModal");
  document.querySelector("body > header").classList.remove("transparent");
  document.getElementById("main").classList.remove("transparent");

  const contactForm = document.getElementById("contact-form");
  contactForm.reset();
}

async function submitFormOnClick(photographerModel) {
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const contactForm = document.getElementById("contact-form");
    const formData = new FormData(contactForm);

    console.log(
      "----- FORM SUBMITTED to " + `${photographerModel.name}` + "-----"
    );

    // Check all for inputs
    for (let pair of formData) {
      let value = pair[1];
      let key = pair[0];
      console.log(key + ": " + value);
    }

    console.log("--------------------------------------------");

    closeModal();
  });
}

async function displayLightBox() {
  document.querySelector("body > header").classList.add("transparent");
  document.getElementById("main").classList.add("transparent");

  const lightboxDOM = document.querySelector(".lightbox-aside");
  // lightboxDOM.removeAttribute("role");
  lightboxDOM.classList.add("displayLightBox");
}

async function closeLightBox() {
  document.querySelector(".lightbox-aside").classList.remove("displayLightBox");
  document.querySelector("body > header").classList.remove("transparent");
  document.getElementById("main").classList.remove("transparent");

  const centerLB = document.getElementById("center-LB-container");
  centerLB.removeChild(centerLB.firstChild);
}

async function displayLightBoxOnClick(mediaModels) {
  mediaModels.forEach((mediaModel) => {
    let mediaDOM = mediaModel.mediaCardDOM.querySelector("article img");
    if (!mediaDOM) {
      mediaDOM = mediaModel.mediaCardDOM.querySelector("article video");
    }

    mediaDOM.addEventListener("click", (e) => {
      // Empêche le navigateur de lire la vidéo lorsque l'on clique dessus
      e.preventDefault();
      // console.log(mediaDOM);

      // On vérifie si la lightbox n'est pas déjà ouverte
      if (document.querySelector(".lightbox-aside.displayLightBox")) {
        console.log("Do nothing => la lightbox est déjà ouverte");
      } else {
        // Ajoute le media à la lightbox
        document
          .getElementById("center-LB-container")
          .appendChild(mediaModel.mediaLightBoxDOM);
        displayLightBox();
      }
    });
  });
}

async function navigationLightBoxOnClick(mediaModels) {
  const previousDom = document.getElementById("previous-chevron-LB");
  const nextDom = document.getElementById("next-chevron-LB");
  const centerLB = document.getElementById("center-LB-container");

  nextDom.addEventListener("click", (e) => {
    const currentMedia = mediaModels.find(
      (x) => `${x.id}` === centerLB.firstChild.id
    );
    let nextMediaIndex = mediaModels.indexOf(currentMedia) + 1;
    if (nextMediaIndex > mediaModels.length - 1) {
      nextMediaIndex = 0;
    }
    const nextMedia = mediaModels[nextMediaIndex];

    // console.log(currentMedia);
    // console.log(nextMedia);
    // console.log(mediaModels);

    centerLB.removeChild(centerLB.firstChild);
    centerLB.appendChild(nextMedia.mediaLightBoxDOM);
  });

  previousDom.addEventListener("click", (e) => {
    const currentMedia = mediaModels.find(
      (x) => `${x.id}` === centerLB.firstChild.id
    );
    let previousMediaIndex = mediaModels.indexOf(currentMedia) - 1;
    if (previousMediaIndex < 0) {
      previousMediaIndex = mediaModels.length - 1;
    }
    const previousMedia = mediaModels[previousMediaIndex];

    centerLB.removeChild(centerLB.firstChild);
    centerLB.appendChild(previousMedia.mediaLightBoxDOM);
  });
}

async function init() {
  const photographerId = await getPhotographerIdFromURL();
  const photographer = await getPhotographer(photographerId);

  const photographerModel = await photographerFactory(photographer);
  displayPhotographHeader(photographerModel);
  displayPrice(photographerModel);
  displayModalHeaderH2(photographerModel);
  submitFormOnClick(photographerModel);

  // Récupère les medias du photographe
  const medias = await getMediasOfPhotographer(photographerId);
  const mediaModels = await getAllMediaModels(medias);
  displayLikes(mediaModels);
  displayMedias(mediaModels.sort(getSortingFunction("Popularité")));
  toggleLikesOnClick(mediaModels);
  displayDropDown(mediaModels);
  displayLightBoxOnClick(mediaModels);
  navigationLightBoxOnClick(mediaModels);
}

init();
