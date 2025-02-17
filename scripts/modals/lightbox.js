import { MEDIA_MODELS } from "../factories/MediaFactory.js";
export { initLightbox };

async function initLightbox() {
  displayLightBoxOnEvent();
  navigateInLightBoxOnEvent();
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
  document.addEventListener("keydown", trapFocusInsideLightBoxAndEventsHandler);
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
  document.removeEventListener(
    "keydown",
    trapFocusInsideLightBoxAndEventsHandler
  );
  likeDOM.focus();
}

function displayLightBoxEventHandler(e) {
  if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
    // Empêche le navigateur de lire la vidéo lorsque l'on clique dessus
    e.preventDefault();

    const mediaDOM = e.currentTarget;
    const mediaModel = MEDIA_MODELS.find(
      (x) => x.mediaCardDOM.querySelector("article .media") === mediaDOM
    );

    // On vérifie si la lightbox ou la contact-me modal ne sont pas déjà ouvertes
    if (
      document.querySelector(".lightbox-aside.displayLightBox") ||
      document.querySelector(".contact-modal.displayModal")
    ) {
      console.log("Do nothing => une modale est déjà ouverte");
    } else {
      // Ajoute le media à la lightbox
      document
        .getElementById("center-LB-container")
        .appendChild(mediaModel.mediaLightBoxDOM);
      displayLightBox();
    }
  }
}

async function displayLightBoxOnEvent() {
  MEDIA_MODELS.forEach((mediaModel) => {
    const mediaDOM = mediaModel.mediaCardDOM.querySelector("article .media");

    mediaDOM.addEventListener("click", displayLightBoxEventHandler);
    mediaDOM.addEventListener("keydown", displayLightBoxEventHandler);
  });
}

function closeEventHandler() {
  const centerLB = document.getElementById("center-LB-container");
  const currentMedia = MEDIA_MODELS.find(
    (x) => `${x.id}` === centerLB.firstChild.id
  );
  closeLightBox(currentMedia);
}

function previousEventHandler() {
  const centerLB = document.getElementById("center-LB-container");
  const currentMedia = MEDIA_MODELS.find(
    (x) => `${x.id}` === centerLB.firstChild.id
  );
  let previousMediaIndex = MEDIA_MODELS.indexOf(currentMedia) - 1;

  if (previousMediaIndex < 0) {
    previousMediaIndex = MEDIA_MODELS.length - 1;
  }
  const previousMedia = MEDIA_MODELS[previousMediaIndex];

  centerLB.removeChild(centerLB.firstChild);
  centerLB.appendChild(previousMedia.mediaLightBoxDOM);
}

function nextEventHandler() {
  const centerLB = document.getElementById("center-LB-container");
  const currentMedia = MEDIA_MODELS.find(
    (x) => `${x.id}` === centerLB.firstChild.id
  );
  let nextMediaIndex = MEDIA_MODELS.indexOf(currentMedia) + 1;
  if (nextMediaIndex > MEDIA_MODELS.length - 1) {
    nextMediaIndex = 0;
  }
  const nextMedia = MEDIA_MODELS[nextMediaIndex];

  centerLB.removeChild(centerLB.firstChild);
  centerLB.appendChild(nextMedia.mediaLightBoxDOM);
}

async function navigateInLightBoxOnEvent() {
  const previousDom = document.getElementById("previous-chevron-LB");
  const nextDom = document.getElementById("next-chevron-LB");
  const closeDOM = document.getElementById("close-LB");

  nextDom.addEventListener("click", nextEventHandler);
  previousDom.addEventListener("click", previousEventHandler);
  closeDOM.addEventListener("click", closeEventHandler);
}

function trapFocusInsideLightBoxAndEventsHandler(e) {
  // Source of the code : https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700
  // add all the elements inside modal which you want to make focusable
  const focusableElements =
    'button, video, input, textarea, [tabindex]:not([tabindex="-1"])';

  const lightboxDOM = document.querySelector(".lightbox-aside");

  const firstFocusableElement =
    lightboxDOM.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
  const focusableContent = lightboxDOM.querySelectorAll(focusableElements);
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
      closeEventHandler();
      e.preventDefault();
      break;
    case "ArrowLeft":
      previousEventHandler();
      e.preventDefault();
      break;
    case "ArrowRight":
      nextEventHandler();
      e.preventDefault();
      break;
    case "Enter":
      switch (document.activeElement) {
        case document.getElementById("close-LB"):
          closeEventHandler();
          e.preventDefault();
          break;
        case document.getElementById("previous-chevron-LB"):
          previousEventHandler();
          e.preventDefault();
          break;
        case document.getElementById("next-chevron-LB"):
          nextEventHandler();
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
