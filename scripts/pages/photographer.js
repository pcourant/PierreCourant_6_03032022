let MEDIA_MODELS = null;

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
  const sortingBtn = document.getElementById("sorting-btn");
  // const arrowOpen = document.getElementById("arrow-down-open");
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

  sortingListItems.forEach((item, index) => {
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

      // Remet le focus sur le bouton de tri
      // sortingBtn.focus();
    });

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

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
          sortingListItems[0].querySelector("span").textContent =
            newSortingName;
          item.querySelector("span").textContent = oldSortingName;
        }

        // Retracte le drop down menu
        hiddenSorting.classList.remove("display");
        sortingBtn.setAttribute("aria-expanded", "false");
      }
    });
  });
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
    const likesDOM = mediaModel.mediaCardDOM.querySelector(".media-likes");

    likesDOM.addEventListener("click", () => {
      // console.log(mediaModel.mediaCardDOM);
      // e.preventDefault();
      mediaModel.toggleLikes();
      displayLikes(mediaModels);
    });

    likesDOM.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        mediaModel.toggleLikes();
        displayLikes(mediaModels);
      }
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
  const modalDOM = document.querySelector(".contact-modal");

  // Masque le reste de la page HTML aux techno d'assistance
  document.querySelector("body > header").setAttribute("aria-hidden", "true");
  document.getElementById("main").setAttribute("aria-hidden", "true");
  document.querySelector(".lightbox-aside").setAttribute("aria-hidden", "true");

  // Diminue la visibilité du reste de la page HTML
  document.querySelector("body > header").classList.add("transparent");
  document.getElementById("main").classList.add("transparent");

  // Affiche la modale
  modalDOM.classList.add("displayModal");
  modalDOM.setAttribute("aria-hidden", "false");

  // Garde le focus de la page dans la modale
  document.addEventListener("keydown", trapFocusInsideModalTabHandler);
  document.getElementById("firstname").focus();
}

async function closeModal() {
  const modalDOM = document.querySelector(".contact-modal");

  // Enlève le masque ARIA du reste de la page HTML
  document.querySelector("body > header").setAttribute("aria-hidden", "false");
  document.getElementById("main").setAttribute("aria-hidden", "false");
  document
    .querySelector(".lightbox-aside")
    .setAttribute("aria-hidden", "false");

  // Affiche normalement le reste de la page HTML
  document.querySelector("body > header").classList.remove("transparent");
  document.getElementById("main").classList.remove("transparent");

  // Invisibilise la modale
  modalDOM.classList.remove("displayModal");
  modalDOM.setAttribute("aria-hidden", "true");

  // Fait le focus sur le bouton d'ouverture de la modale
  document.querySelector(".contact-button").focus();
  document.removeEventListener("keydown", trapFocusInsideModalTabHandler);

  // Reset le formulaire de contact
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
  const lightboxDOM = document.querySelector(".lightbox-aside");

  // Masque le reste de la page HTML aux techno d'assistance
  document.querySelector("body > header").setAttribute("aria-hidden", "true");
  document.getElementById("main").setAttribute("aria-hidden", "true");
  document.querySelector(".contact-modal").setAttribute("aria-hidden", "true");

  // Diminue la visibilité du reste de la page HTML
  document.querySelector("body > header").classList.add("transparent");
  document.getElementById("main").classList.add("transparent");

  // Affiche la lightbox
  lightboxDOM.classList.add("displayLightBox");
  lightboxDOM.setAttribute("aria-hidden", "false");

  // Garde le focus de la page dans la lightbox
  document.addEventListener("keydown", trapFocusInsideLightBoxTabHandler);
  document.getElementById("close-LB").focus();
}

async function closeLightBox(mediaModel) {
  const lightboxDOM = document.querySelector(".lightbox-aside");

  // Masque le reste de la page HTML aux techno d'assistance
  document.querySelector("body > header").setAttribute("aria-hidden", "false");
  document.getElementById("main").setAttribute("aria-hidden", "false");
  document.querySelector(".contact-modal").setAttribute("aria-hidden", "false");

  // Affiche normalement le reste de la page HTML
  document.querySelector("body > header").classList.remove("transparent");
  document.getElementById("main").classList.remove("transparent");

  // Invisibilise la lightbox
  lightboxDOM.classList.remove("displayLightBox");
  lightboxDOM.setAttribute("aria-hidden", "true");

  // Reset de la lightbox en supprimant le media affiché
  const centerLB = document.getElementById("center-LB-container");
  centerLB.removeChild(centerLB.firstChild);

  // Fait le focus sur le dernier media affiché
  const likeDOM = mediaModel.mediaCardDOM.querySelector("article .media-likes");
  document.removeEventListener("keydown", trapFocusInsideLightBoxTabHandler);
  likeDOM.focus();
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

    mediaDOM.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

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
      }
    });
  });
}

async function navigationLightBoxOnClick(mediaModels) {
  const previousDom = document.getElementById("previous-chevron-LB");
  const nextDom = document.getElementById("next-chevron-LB");
  const closeDOM = document.getElementById("close-LB");
  const centerLB = document.getElementById("center-LB-container");

  nextDom.addEventListener("click", () => {
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

  previousDom.addEventListener("click", () => {
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

  closeDOM.addEventListener("click", () => {
    const currentMedia = mediaModels.find(
      (x) => `${x.id}` === centerLB.firstChild.id
    );
    closeLightBox(currentMedia);
  });
}

// async function closeModalOnEscapeKey(mediaModels) {
//   const modalDOM = document.querySelector(".contact-modal");

//   modalDOM.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       // Si la modale est ouverte, on la ferme
//       if (modalDOM.classList.contains("displayModal")) {
//         closeModal();
//         e.preventDefault();
//       }
//     }
//   });
// }

// function closeModalOnEscapeKey(mediaModels) {
//   const modalDOM = document.querySelector(".contact-modal");

//   modalDOM.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       // Si la modale est ouverte, on la ferme
//       if (modalDOM.classList.contains("displayModal")) {
//         closeModal();
//         e.preventDefault();
//       }
//     }
//   });
// }

// // Close modal or lightbox when escape key is pressed
// async function closeModalOrLightBoxOnEscapeKey(mediaModels) {
//   const modalDOM = document.querySelector(".contact-modal");
//   const lightboxDOM = document.querySelector(".lightbox-aside");

//   document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       // Si la modale est ouverte, on la ferme
//       if (modalDOM.classList.contains("displayModal")) {
//         closeModal();
//       }
//       // Si la lightbox est ouverte, on la ferme
//       else if (lightboxDOM.classList.contains("displayLightBox")) {
//         const centerLB = document.getElementById("center-LB-container");
//         const currentMedia = mediaModels.find(
//           (x) => `${x.id}` === centerLB.firstChild.id
//         );
//         closeLightBox(currentMedia);
//       }
//     }
//   });
// }

function trapFocusInsideModalTabHandler(e) {
  // Source of the code : https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700
  // add all the elements inside modal which you want to make focusable
  const focusableElements =
    'button, input, textarea, [tabindex]:not([tabindex="-1"])';

  const modal = document.querySelector(".contact-modal");

  const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
  const focusableContent = modal.querySelectorAll(focusableElements);
  const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (e.key) {
    case "Tab":
      if (e.shiftKey) {
        // if shift key pressed for shift + tab combination
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus(); // add focus for the last focusable element
          e.preventDefault();
        }
      } else {
        // if tab key is pressed
        if (document.activeElement === lastFocusableElement) {
          // if focused has reached to last focusable element then focus first focusable element after pressing tab
          firstFocusableElement.focus(); // add focus for the first focusable element
          e.preventDefault();
        }
      }
      break;
    case "Escape":
      closeModal();
      e.preventDefault();
      break;
    case "Enter":
      switch (document.activeElement) {
        case document.getElementById("close-modal"):
          closeModal();
          e.preventDefault();
          break;
        default:
          return; // Quit when this doesn't handle the key event.
      }
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
}

function trapFocusInsideLightBoxTabHandler(e) {
  // Source of the code : https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700
  // add all the elements inside modal which you want to make focusable
  const focusableElements =
    'button, video, input, textarea, [tabindex]:not([tabindex="-1"])';

  const lightboxDOM = document.querySelector(".lightbox-aside");

  const firstFocusableElement =
    lightboxDOM.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
  const focusableContent = lightboxDOM.querySelectorAll(focusableElements);
  const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

  const centerLB = document.getElementById("center-LB-container");
  const currentMedia = MEDIA_MODELS.find(
    (x) => `${x.id}` === centerLB.firstChild.id
  );

  let previousMediaIndex = null;
  let nextMediaIndex = null;
  let previousMedia = null;
  let nextMedia = null;

  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (e.key) {
    case "Tab":
      if (e.shiftKey) {
        // if shift key pressed for shift + tab combination
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus(); // add focus for the last focusable element
          e.preventDefault();
        }
      } else {
        // if tab key is pressed
        if (document.activeElement === lastFocusableElement) {
          // if focused has reached to last focusable element then focus first focusable element after pressing tab
          firstFocusableElement.focus(); // add focus for the first focusable element
          e.preventDefault();
        }
      }
      break;
    case "Escape":
      closeLightBox(currentMedia);
      e.preventDefault();
      break;
    case "Left": // IE/Edge specific value
    case "ArrowLeft":
      previousMediaIndex = MEDIA_MODELS.indexOf(currentMedia) - 1;
      if (previousMediaIndex < 0) {
        previousMediaIndex = MEDIA_MODELS.length - 1;
      }
      previousMedia = MEDIA_MODELS[previousMediaIndex];

      centerLB.removeChild(centerLB.firstChild);
      centerLB.appendChild(previousMedia.mediaLightBoxDOM);
      e.preventDefault();
      break;
    case "Right": // IE/Edge specific value
    case "ArrowRight":
      nextMediaIndex = MEDIA_MODELS.indexOf(currentMedia) + 1;
      if (nextMediaIndex > MEDIA_MODELS.length - 1) {
        nextMediaIndex = 0;
      }
      nextMedia = MEDIA_MODELS[nextMediaIndex];

      centerLB.removeChild(centerLB.firstChild);
      centerLB.appendChild(nextMedia.mediaLightBoxDOM);
      e.preventDefault();
      break;
    case "Enter":
      switch (document.activeElement) {
        case document.getElementById("close-LB"):
          closeLightBox(currentMedia);
          e.preventDefault();
          break;
        case document.getElementById("previous-chevron-LB"):
          previousMediaIndex = MEDIA_MODELS.indexOf(currentMedia) - 1;
          if (previousMediaIndex < 0) {
            previousMediaIndex = MEDIA_MODELS.length - 1;
          }
          previousMedia = MEDIA_MODELS[previousMediaIndex];

          centerLB.removeChild(centerLB.firstChild);
          centerLB.appendChild(previousMedia.mediaLightBoxDOM);
          e.preventDefault();
          break;
        case document.getElementById("next-chevron-LB"):
          nextMediaIndex = MEDIA_MODELS.indexOf(currentMedia) + 1;
          if (nextMediaIndex > MEDIA_MODELS.length - 1) {
            nextMediaIndex = 0;
          }
          nextMedia = MEDIA_MODELS[nextMediaIndex];

          centerLB.removeChild(centerLB.firstChild);
          centerLB.appendChild(nextMedia.mediaLightBoxDOM);
          e.preventDefault();
          break;
        default:
          return;
      }
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
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
  MEDIA_MODELS = await getAllMediaModels(medias);
  // closeModalOrLightBoxOnEscapeKey(MEDIA_MODELS);
  displayLikes(MEDIA_MODELS);
  displayMedias(MEDIA_MODELS.sort(getSortingFunction("Popularité")));
  toggleLikesOnClick(MEDIA_MODELS);
  displayDropDown(MEDIA_MODELS);
  displayLightBoxOnClick(MEDIA_MODELS);
  navigationLightBoxOnClick(MEDIA_MODELS);
}

init();
