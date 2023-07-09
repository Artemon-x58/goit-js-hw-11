import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/?key=38156163-5b07cf7816d411510811c16ef';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('input[name="searchQuery"]'),
  btnEl: document.querySelector(".btn-form"),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more')
};

const {formEl, inputEl, btnEl, gallery, btnLoadMore} = refs;
let currentPage = 1;
const lightbox = new SimpleLightbox('.gallery a', { 
  captionDelay: 250,
  captionsData: 'alt',
});

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchQuery = inputEl.value.trim();
  
  if (!searchQuery) {
    return;
  }
  
  currentPage = 1;

  try {
    const response = await axios.get(`${BASE_URL}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
    const { data } = response;
    
    console.log(data);
    
    if (data.totalHits > currentPage * 40) {
      btnLoadMore.classList.remove("is-hidden");
    }
    
    if (data.total === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
    }
    
    gallery.innerHTML = "";
    renderCollection(data.hits);
    lightbox.refresh();
    console.log(currentPage);
  } catch (error) {
    console.log(error);
    // Handle error appropriately
  }
});

function makeMurkup ({webformatURL, tags, likes, views, comments, downloads, largeImageURL}) {
  const murkup = `<div class="photo-card">
    <a href ="${largeImageURL}" class="link">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads }</b>
      </p>
    </div>
  </div>`;
  
  gallery.insertAdjacentHTML("beforeend", murkup);
}

function renderCollection (el) {
  el.forEach(el => {
    makeMurkup(el);
    console.log(el);
  });
}

btnLoadMore.addEventListener('click', async () => {
  currentPage++;
  
  try {
    const response = await axios.get(`${BASE_URL}&q=${inputEl.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
    const { data } = response;
    
    if (data.totalHits <= currentPage * 40) {
      Notiflix.Notify.warning('We are sorry, but you have reached the end of the search results.');
      btnLoadMore.classList.add("is-hidden");
    }
    
    renderCollection(data.hits);
    lightbox.refresh();
    console.log(currentPage);
  } catch (error) {
    console.log(error);
    // Handle error appropriately
  }
});