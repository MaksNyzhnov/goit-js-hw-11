import { Notify } from 'notiflix';
import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchAPI(page, value) {
  try {
    const options = {
      params: {
        key: '32809248-e617eb740123e44583fb94c77',
        per_page: 40,
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
    return response;
  } catch (error) {
    Notify.failure(`${error.message}`);
  }
}