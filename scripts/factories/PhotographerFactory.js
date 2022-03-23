export { photographerFactory, displayPhotographers };

function photographerFactory(data) {
  const { name, id, city, country, tagline, price, portrait } = data;

  const picture = `assets/photographers/${portrait}`;
  let userCardDOM = undefined;

  function getUserCardDOM() {
    // Création de l'élément DOM : article
    const article = document.createElement("article");

    // Création du lien : img + h2
    const link = document.createElement("a");
    link.id = `${id}`;
    link.setAttribute("href", `photographer.html?id=${id}`);

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    // Texte alternatif vide selon la maquette Figma
    img.setAttribute("alt", "");
    const h2 = document.createElement("h2");
    h2.textContent = name;
    link.appendChild(img);
    link.appendChild(h2);
    // ------------------------------------------------

    // Création des paragraphes de l'article
    const locationParagraph = document.createElement("p");
    locationParagraph.classList.add("location");
    locationParagraph.textContent = `${city}, ${country}`;
    const taglineParagraph = document.createElement("p");
    taglineParagraph.classList.add("tagline");
    taglineParagraph.textContent = tagline;
    const priceParagraph = document.createElement("p");
    priceParagraph.classList.add("price");
    priceParagraph.textContent = `${price}€/jour`;
    // ------------------------------------------------

    // Création de la structure DOM de l'article
    article.appendChild(link);
    article.appendChild(locationParagraph);
    article.appendChild(taglineParagraph);
    article.appendChild(priceParagraph);

    this.userCardDOM = article;

    return article;
  }

  function constructPhotographHeaderDOM(photographHeader) {
    // Création de l'élément DOM de description : div
    const description = document.createElement("article");
    description.setAttribute("aria-label", "Photographer profil");
    description.classList.add("photographer-profile");

    // Création des éléments descriptifs
    const h1 = document.createElement("h1");
    h1.textContent = name;
    const locationParagraph = document.createElement("p");
    locationParagraph.classList.add("location");
    locationParagraph.textContent = `${city}, ${country}`;
    const taglineParagraph = document.createElement("p");
    taglineParagraph.classList.add("tagline");
    taglineParagraph.textContent = tagline;

    description.appendChild(h1);
    description.appendChild(locationParagraph);
    description.appendChild(taglineParagraph);

    // Création de l'image
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    // Texte alternatif vide selon la maquette Figma
    img.setAttribute("alt", "");

    // Création du DOM
    photographHeader.insertBefore(description, photographHeader.firstChild);
    photographHeader.appendChild(img);

    // return article;
  }

  return {
    id,
    name,
    picture,
    price,
    userCardDOM,
    getUserCardDOM,
    constructPhotographHeaderDOM,
  };
}

async function displayPhotographers(photographers) {
  const photographersSection = document.querySelector(".photographer-section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}
