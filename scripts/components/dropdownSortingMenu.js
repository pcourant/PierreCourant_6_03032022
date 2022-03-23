import { MEDIA_MODELS, displayMedias } from "../factories/MediaFactory.js";
export { initDropdownSortingMenu };

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

async function initDropdownSortingMenu() {
  const sortingBtn = document.getElementById("sorting-btn");

  // le DOM element du dropdown menu
  const dropDownMenu = document.getElementById("dropdownmenu");
  const sortingListItems = Array.from(
    document.getElementsByClassName("sorting")
  );

  // Ajout des event listeners sur le bouton et le chevron haut du dropdown menu "trier par"
  sortingBtn.addEventListener("click", () => {
    sortingBtn.setAttribute("aria-expanded", "true");
    sortingBtn.setAttribute("tabindex", "-1");

    sortingListItems.forEach((item) => {
      item.setAttribute("tabindex", "0");
    });
    dropDownMenu.classList.add("display");
    dropDownMenu.querySelector("li").focus();
  });

  // Ajout des event listeners sur les éléments du dropdown menu pour trier les médias
  sortMediasOnEvent();
}

function dropDownMenuHandler(e) {
  if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
    const sortingBtn = document.getElementById("sorting-btn");
    const dropDownMenu = document.getElementById("dropdownmenu");
    const sortingListItems = Array.from(
      document.getElementsByClassName("sorting")
    );
    const item = e.currentTarget;
    const index = sortingListItems.findIndex((x) => x === e.currentTarget);

    // Si un autre classement est demandé (autre que celui déjà effectif)
    if (index !== 0) {
      // Récupère les infos du tri actuel
      const newSortingName = item.querySelector("span").textContent;
      const oldSortingName =
        sortingListItems[0].querySelector("span").textContent;

      // Trie et affiche les medias
      MEDIA_MODELS.sort(getSortingFunction(newSortingName));
      displayMedias(MEDIA_MODELS);

      // Met à jour le bouton de tri
      sortingBtn.querySelector("span").textContent = newSortingName;

      // Intervertie les entrées du drop down menu
      sortingListItems[0].querySelector("span").textContent = newSortingName;
      item.querySelector("span").textContent = oldSortingName;
    }

    // Affiche le bouton
    sortingBtn.setAttribute("aria-expanded", "false");
    sortingBtn.setAttribute("tabindex", "0");

    // Retracte le drop down menu
    sortingListItems.forEach((item) => {
      item.setAttribute("tabindex", "-1");
    });
    dropDownMenu.classList.remove("display");

    // Focus sur le premier media
    MEDIA_MODELS[0].mediaCardDOM.querySelector(".media").focus();
  }
}

// Ajout des event listeners sur les éléments du dropdown menu
async function sortMediasOnEvent() {
  const sortingListItems = Array.from(
    document.getElementsByClassName("sorting")
  );
  sortingListItems.forEach((item) => {
    item.addEventListener("click", dropDownMenuHandler);
    item.addEventListener("keydown", dropDownMenuHandler);
  });
}
