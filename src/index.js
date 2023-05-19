import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  inputValue: document.querySelector('#search-box'),
  listCountry: document.querySelector('.country-list'),
  infoCountry: document.querySelector('.country-info'),
};

refs.inputValue.addEventListener('input', () => {
  const nameCountry = refs.inputValue.value.trim();

  if (nameCountry === '') {
    refs.listCountry.innerHTML = '';
    refs.infoCountry.innerHTML = '';
    return;
  } // якщо поле вводу пусте, очистити розмітку та вийти
  debounce(
    fetchCountries(nameCountry).then(onResolve).catch(onReject),
    DEBOUNCE_DELAY
  ); // виклик функції fetchCountries після припинення активності, через DEBOUNCE_DELAY
}); // створення прослуховування події "input" поля вводу

function onResolve(countrys) {
  if (countrys.length > 10) {
    infoMoreTen();
  } else if (countrys.length > 1) {
    const firstCountry = countrys[0].name.common;
    const secondCountry = countrys[1].name.common;
    if (
      countrys.length === 2 ||
      (firstCountry.toLowerCase().includes(secondCountry.toLowerCase()) &&
        secondCountry.toLowerCase().includes(firstCountry.toLowerCase()))
    ) {
      if (firstCountry.length > secondCountry.length) {
        onBuildMarkupCountry([countrys[1]]);
        return;
      }
      onBuildMarkupCountry([countrys[0]]);
      return;
    } // якщо назва першої країни включає назву другої або навпаки, то будуємо розмітку в div class="country-info" для країни, назва якої входить в назву іншої (менше букв)
    onBuildListCountrys(countrys);
  } else {
    onBuildMarkupCountry(countrys);
  }
}

function onReject(error) {
  Notify.failure('Oops, there is no country with that name');
  refs.listCountry.innerHTML = '';
  refs.infoCountry.innerHTML = '';
  console.log(error);
} // при помилці - повідомлення та очистити розмітку

function infoMoreTen() {
  Notify.info('Too many matches found. Please enter a more specific name.');
  refs.listCountry.innerHTML = '';
  refs.infoCountry.innerHTML = '';
} // якщо масив більше 10 країн, то повідомлення та очистити розмітку

function onBuildListCountrys(countrys) {
  refs.listCountry.innerHTML = countrys
    .map(({ flags, name }) => {
      return `<li class="country-list-item" style="display: flex; align-items: center; gap: 20px;">
        <img src='${flags.svg}' alt="Flag of ${name.official}" width = 40px height = 30px><p class="country-name">${name.official} (${name.common})</p>
      </li>`;
    })
    .join('');
  refs.infoCountry.innerHTML = '';
} // будуємо розмітку в ul class="country-list" для списку вибраних країн, очищаєм розмітку в сусідньому блоці

function onBuildMarkupCountry(country) {
  refs.infoCountry.innerHTML = country
    .map(({ flags, name, capital, population, languages, currencies }) => {
      return `<div class="country-info-header"><img src='${
        flags.svg
      }' alt="Flag of ${
        name.official
      }" width = 60px height = 40px><p class="country-info-header">${
        name.official
      }</p></div>
                  <p class="country-info"><span class="country-info-span">Capital: </span>${capital}</p>
<p class="country-info"><span class="country-info-span">Population: </span>${population}</p>
<p class="country-info"><span class="country-info-span">Languages: </span>${Object.values(
        languages
      ).join(
        ', '
      )}</p><p class="country-info"><span class="country-info-span">Currency: </span>${Object.values(
        Object.values(currencies)[0].name
      ).join('')} (${Object.values(Object.values(currencies)[0].symbol).join(
        ''
      )})</p>`;
    })
    .join();
  refs.listCountry.innerHTML = '';
} // будуємо розмітку в div class="country-info" для вибраної країни, очищаєм розмітку в сусідньому блоці
