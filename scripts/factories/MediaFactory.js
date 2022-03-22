function mediaFactory(data) {
  let { id, photographerId, title, image, video, likes, date } = data;

  const picture = `assets/images/${image}`;
  const video_source = `assets/images/${video}`;
  let liked = false;
  let mediaCardDOM = undefined;
  let mediaLightBoxDOM = undefined;

  function getMediaCardDOM() {
    // Création de l'élément DOM : article
    const article = document.createElement("article");

    // Création de l'image...
    if (image) {
      const img = document.createElement("img");
      img.setAttribute("src", picture);
      // Texte alternatif vide selon la maquette Figma
      img.setAttribute("alt", `${title}` + ", closeup view");
      img.setAttribute("tabindex", "0");
      article.appendChild(img);
    }
    // ... ou de la vidéo
    else if (video) {
      const vid = document.createElement("video");
      vid.textContent = "Sorry, your browser doesn't support embedded videos.";
      vid.setAttribute("controls", "");
      vid.setAttribute("aria-label", `${title}` + ", closeup view");
      vid.setAttribute("tabindex", "0");

      const src = document.createElement("source");
      src.setAttribute("src", video_source);
      src.setAttribute(
        "type",
        "video/" + video_source.substring(video_source.indexOf(".") + 1)
      );

      vid.insertBefore(src, vid.firstChild);
      article.appendChild(vid);
    }
    // ------------------------------------------------

    // Création du media title container :
    const divTitle = document.createElement("div");
    divTitle.classList.add("media-title-container");
    const titleParagraph = document.createElement("p");
    titleParagraph.classList.add("media-title");
    titleParagraph.textContent = title;

    const likesParagraph = document.createElement("p");
    likesParagraph.setAttribute("title", "likes");
    likesParagraph.setAttribute("tabindex", "0");
    likesParagraph.classList.add("media-likes");

    const likesSpan = document.createElement("span");
    likesSpan.classList.add("media-likes-span");
    likesSpan.textContent = likes;
    likesParagraph.appendChild(likesSpan);

    const heartIcon = document.createElement("i");
    heartIcon.classList.add("fa");
    heartIcon.classList.add("fa-heart");
    heartIcon.setAttribute("aria-hidden", "true");
    likesParagraph.appendChild(heartIcon);

    divTitle.appendChild(titleParagraph);
    divTitle.appendChild(likesParagraph);
    article.appendChild(divTitle);
    // ------------------------------------------------

    //Save the DOM
    this.mediaCardDOM = article;

    return article;
  }

  function getMediaLightBoxDOM() {
    // Création de l'élément DOM : article
    const article = document.createElement("article");
    const titleParagraph = document.createElement("p");
    let mediaDOM = null;

    // Création de l'image...
    if (image) {
      mediaDOM = document.createElement("img");
      mediaDOM.setAttribute("src", picture);
      // Texte alternatif vide selon la maquette Figma
      mediaDOM.setAttribute("alt", title);
    }
    // ... ou de la vidéo
    else if (video) {
      mediaDOM = document.createElement("video");
      mediaDOM.textContent =
        "Sorry, your browser doesn't support embedded videos.";
      mediaDOM.setAttribute("controls", "");
      mediaDOM.setAttribute("aria-label", title);

      const src = document.createElement("source");
      src.setAttribute("src", video_source);
      src.setAttribute(
        "type",
        "video/" + video_source.substring(video_source.indexOf(".") + 1)
      );
      mediaDOM.insertBefore(src, mediaDOM.firstChild);
    }
    //-------------------------------------------------------------------

    titleParagraph.textContent = title;

    article.appendChild(mediaDOM);
    article.appendChild(titleParagraph);

    article.id = this.id;
    this.mediaLightBoxDOM = article;

    return article;
  }

  function toggleLikes() {
    if (!this.liked) {
      this.likes++;
      this.liked = true;
    } else {
      this.likes--;
      this.liked = false;
    }

    // Update le nombre de likes affiché dans le DOM
    if (this.mediaCardDOM) {
      this.mediaCardDOM.querySelector(".media-likes-span").textContent =
        this.likes;
    }
  }

  return {
    id,
    photographerId,
    title,
    date,
    likes,
    mediaCardDOM,
    mediaLightBoxDOM,
    getMediaCardDOM,
    toggleLikes,
    getMediaLightBoxDOM,
  };
}
