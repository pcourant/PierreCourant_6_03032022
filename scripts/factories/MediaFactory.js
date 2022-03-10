function mediaFactory(data) {
  const { id, photographerId, title, image, likes, date, price } = data;

  const picture = `assets/images/${image}`;

  function getMediaCardDOM() {
    // Création de l'élément DOM : article
    const article = document.createElement("article");

    // Création du lien : img
    const link = document.createElement("a");
    link.id = `${id}`;
    link.setAttribute("href", `/photographer.html?id=${id}`);

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    // Texte alternatif vide selon la maquette Figma
    img.setAttribute("alt", "");

    link.appendChild(img);
    // ------------------------------------------------

    // Création du media title container :
    const divTitle = document.createElement("div");
    divTitle.classList.add("media-title-container");
    const titleParagraph = document.createElement("p");
    titleParagraph.classList.add("media-title");
    titleParagraph.textContent = title;

    const likesParagraph = document.createElement("p");
    likesParagraph.classList.add("media-likes");
    likesParagraph.textContent = likes;
    const heartIcon = document.createElement("i");
    heartIcon.classList.add("fa");
    heartIcon.classList.add("fa-heart");
    heartIcon.setAttribute("aria-hidden", "true");
    likesParagraph.appendChild(heartIcon);

    divTitle.appendChild(titleParagraph);
    divTitle.appendChild(likesParagraph);
    // ------------------------------------------------

    // Création de la structure DOM de l'article
    article.appendChild(link);
    article.appendChild(divTitle);

    return article;
  }
  return { id, photographerId, likes, getMediaCardDOM };
}
