import {refs} from './refs'
export default function markupGalleryList(arr) {
  const markup = arr
    .map(
      item => `<div class="photo-card">
  <a href="${item.largeImageURL}"><img class="photo" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="350px" height="200px" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${item.downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}