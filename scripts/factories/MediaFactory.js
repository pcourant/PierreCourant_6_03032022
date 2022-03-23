export { MEDIA_MODELS, initMediasModels, displayMedias };

const MEDIA_MODELS = new Array();

async function initMediasModels(medias) {
  await getAllMediaModels(medias);

  // tri par défaut
  MEDIA_MODELS.sort((a, b) => {
    return b.likes - a.likes;
  });
}

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
      img.setAttribute("alt", `${title}` + ", closeup view");
      img.setAttribute("tabindex", "0");
      img.classList.add("media");
      article.appendChild(img);
    }
    // ... ou de la vidéo
    else if (video) {
      const vid = document.createElement("video");
      vid.textContent = "Sorry, your browser doesn't support embedded videos.";
      vid.setAttribute("controls", "");
      vid.setAttribute("aria-label", `${title}` + ", closeup view");
      vid.setAttribute("tabindex", "0");
      vid.classList.add("media");

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
    const titleParagraph = document.createElement("h2");
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

    const heartIcon = document.createElement("span");
    heartIcon.classList.add("icon");
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
    if (!liked) {
      this.likes++;
      liked = true;
    } else {
      this.likes--;
      liked = false;
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

async function getAllMediaModels(medias) {
  medias.forEach((media) => {
    const mediaModel = mediaFactory(media);
    mediaModel.getMediaCardDOM();
    mediaModel.getMediaLightBoxDOM();
    MEDIA_MODELS.push(mediaModel);
  });
}

async function displayMedias() {
  const mediaContainer = document.querySelector(".media-container");

  MEDIA_MODELS.forEach((mediaModel) => {
    mediaContainer.appendChild(mediaModel.mediaCardDOM);
  });
}
