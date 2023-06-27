import './sass/styles.scss';
import { Notify } from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchAPI } from './js/images-api';
const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;
let value = '';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.header-input'),
  searchButton: document.querySelector('.header-search-button'),
  loadButton: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

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
  refs.loadButton.classList.remove('is-hidden');
  renderAPI();
}

async function renderAPI() {
  try {
    const card = await fetchAPI(page, value);
    const cardArr = card.data.hits;
    const totalHits = await card.data.totalHits;
    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      page += 1;
      markupGalleryList(cardArr);
      simpleGallery.refresh();
      if (totalHits < 20) {
        refs.loadButton.classList.add('is-hidden');
      }
    }
  } catch (error) {
    console.log(error);
    Notify.failure(`${error.message}`);
  }
}

async function loadMore() {
  try {
    const options = {
      params: {
        key: '32809248-e617eb740123e44583fb94c77',
        page: `${page}`,
        q: `${value}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.get(`${BASE_URL}`, options);
    page += 1;
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