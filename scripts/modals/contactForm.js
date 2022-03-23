export { initContactFormModal };

async function initContactFormModal(photographerModel) {
  displayModalHeaderH2(photographerModel);
  modalEventHandler(photographerModel);
}

async function displayModalHeaderH2(photographerModel) {
  const modalHeaderH2 = document.querySelector(".contact-modal h2");

  modalHeaderH2.innerHTML =
    `Contactez-moi <br />` + `${photographerModel.name}`;
}

async function modalEventHandler(photographerModel) {
  document
    .querySelector(".contact-button")
    .addEventListener("click", displayModal);

  document.getElementById("close-modal").addEventListener("click", closeModal);

  submitFormOnClick(photographerModel);
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
  document.getElementById("close-modal").focus();
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
