function photographerFactory(data) {
  const { name, id, city, country, tagline, price, portrait } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", `portrait de ${name}`);
    const h2 = document.createElement("h2");
    h2.textContent = name;

    const locationParagraph = document.createElement("p");
    locationParagraph.classList.add("location");
    locationParagraph.textContent = `${city}, ${country}`;
    const taglineParagraph = document.createElement("p");
    taglineParagraph.classList.add("tagline");
    taglineParagraph.textContent = tagline;
    const priceParagraph = document.createElement("p");
    priceParagraph.classList.add("price");
    priceParagraph.textContent = `${price}€/jour`;

    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(locationParagraph);
    article.appendChild(taglineParagraph);
    article.appendChild(priceParagraph);

    return article;
  }
  return { name, picture, getUserCardDOM };
}
