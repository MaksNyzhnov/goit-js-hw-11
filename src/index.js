import './sass/styles.scss';
import { Notify } from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchAPI } from './js/images-api';
import markupGalleryList from './js/markup-api'
import refs from './js/refs'
let page = 1;
let value = '';



refs.form.addEventListener('submit', onFormSubmit);
refs.loadButton.addEventListener('click', loadMore);

let simpleGallery = new simpleLightbox('.gallery a');

function onFormSubmit(evt) {
  evt.preventDefault();
  value = refs.form.firstElementChild.value.trim();
  page = 1;
  refs.gallery.innerHTML = '';

  if (value === '') {
    Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }
  // refs.loadButton.classList.remove('is-hidden');
  renderAPI();
}

async function renderAPI() {
  try {
    const card = await fetchAPI(page, value);
    const cardArr = card.data.hits;
    const totalHits = await card.data.totalHits;

    if (totalHits === 0) {
      refs.loadButton.classList.add('is-hidden');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      page += 1;
      markupGalleryList(cardArr);
      simpleGallery.refresh();
      refs.loadButton.classList.remove('is-hidden')
      if (totalHits < 40) {
        refs.loadButton.classList.add('is-hidden');
      }
    }
  } catch (error) {
    console.log(error);
    Notify.failure(`${error.message}`);
  }
}

async function loadMore() {
  

  page += 1;
  try {
  const response = await fetchAPI(page, value)
    const cardArr = await response.data.hits;
    const totalHits = await response.data.totalHits;
    markupGalleryList(cardArr);
    simpleGallery.refresh();
    if (refs.gallery.children.length === totalHits) {
      refs.loadButton.classList.add('is-hidden');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
    Notify.failure(`${error.message}`);
  }
}

function markupGalleryList(arr) {
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