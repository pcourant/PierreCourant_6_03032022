export { initTotalLikes };

async function initTotalLikes(mediaModels) {
  updateTotalLikes(mediaModels);
  toggleLikesOnClick(mediaModels);
}

async function updateTotalLikes(mediaModels) {
  const likesContainer = document.getElementById("likes-container");

  likesContainer.textContent = await getTotalLikes(mediaModels);
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
      updateTotalLikes(mediaModels);
    });

    likesDOM.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        mediaModel.toggleLikes();
        updateTotalLikes(mediaModels);
      }
    });
  });
}
