// Ouverture du menu dropdown
// @data: les medias du photographe à trier
async function displayDropDown(data) {
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
async function sortMedias(data) {
  // let medias_sorted_array = [];
  // const MEDIAS = data.dataMedias;
  let btnSorting = document.getElementById("sorting-btn");
  let hiddenSorting = document.getElementById("hidden-sorting");
  let sortingItems = Array.from(document.getElementsByClassName("sorting"));

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

  // document.querySelectorAll(".media-likes").forEach((dom) => {
  //   dom.addEventListener("click", () => {
  //     console.log(dom);
  //   });
  // });
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

async function init() {
  const photographerId = await getPhotographerIdFromURL();
  const photographer = await getPhotographer(photographerId);

  const photographerModel = await photographerFactory(photographer);
  displayPhotographHeader(photographerModel);
  displayPrice(photographerModel);
  displayModalHeaderH2(photographerModel);
  submitFormOnClick(photographerModel);

  displayDropDown(null);

  // Récupère les medias du photographe
  const medias = await getMediasOfPhotographer(photographerId);
  const mediaModels = await getAllMediaModels(medias);
  displayLikes(mediaModels);
  displayMedias(mediaModels);
  toggleLikesOnClick(mediaModels);
}

init();
