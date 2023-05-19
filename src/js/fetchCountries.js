export function fetchCountries(nameCountry) {
  return fetch(
    `https://restcountries.com/v3.1/name/${nameCountry}?fields=flags,name,capital,population,languages,currencies`
  ).then(responce => {
    if (!responce.ok) {
      throw new Error(responce.status); //обробка та передача помилки (404)
    }
    return responce.json(); // чейніннг до промісу відповіді
  }); // повертає проміс запиту
} // іменований експорт функції fetchCountries
