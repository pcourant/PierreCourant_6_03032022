function mediaFactory(data) {
  const { id, photographerId, title, image, video, likes, date, price } = data;

  const picture = `assets/images/${image}`;
  const video_source = `assets/images/${video}`;

  function getMediaCardDOM() {
    // Création de l'élément DOM : article
    const article = document.createElement("article");

    // Création du lien : img ou video
    const link = document.createElement("a");
    link.id = `${id}`;
    link.setAttribute("href", `/photographer.html?id=${id}`);

    if (image) {
      const img = document.createElement("img");
      img.setAttribute("src", picture);
      // Texte alternatif vide selon la maquette Figma
      img.setAttribute("alt", "");

      link.appendChild(img);
    } else if (video) {
      const vid = document.createElement("video");
      vid.textContent = "Sorry, your browser doesn't support embedded videos.";

      vid.setAttribute("controls", "");

      const src = document.createElement("source");
      src.setAttribute("src", video_source);
      src.setAttribute(
        "type",
        "video/" + video_source.substring(video_source.indexOf(".") + 1)
      );

      vid.insertBefore(src, vid.firstChild);
      // vid.appendChild(src);
      // vid.textContent = "Sorry, your browser doesn't support embedded videos.";

      link.appendChild(vid);
    }
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
