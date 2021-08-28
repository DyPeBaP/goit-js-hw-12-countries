import "./sass/main.scss";
import "@pnotify/core/dist/BrightTheme.css";
import { notice, error, Stack } from "@pnotify/core";

import fetchCountries from "./fetchCountries";
import countryListMarkup from "./templates/countriesList.hbs";
import countryCardMarkup from "./templates/countryCard.hbs";

const debounce = require("lodash.debounce");
const refs = {
  input: document.querySelector(".input__text"),
  renderBox: document.querySelector(".render_box"),
  debouncedOnInput: debounce(onInput, 1000),
};

refs.input.addEventListener("input", refs.debouncedOnInput);

function onInput(e) {
  const country = e.target.value;
  fetchCountries(country).then((r) => console.log(r));
  fetchCountries(country)
    .then((r) => renderResult(r))
    .catch(() => noticeMessage(alert))
    .catch(() => errorServerMessage());
}

function renderResult(arr) {
  if (arr.length === 1) {
    createCountryCardMarkup(arr);
  }
  if (arr.length >= 2 && arr.length < 10) {
    createCountryListMarkup(arr);
  }
  if (arr.length > 10) {
    noticeMessage();
  }
  if (arr.status === 404) {
    errorMessage();
  }
}

function createCountryListMarkup(arr) {
  refs.renderBox.innerHTML = countryListMarkup(arr);
}

function createCountryCardMarkup(arr) {
  refs.renderBox.innerHTML = countryCardMarkup(arr);
}

function noticeMessage() {
  refs.renderBox.innerHTML = "";
  notice({
    title: "Attention",
    text: "To many matches found. Please enter a more specific query!",
    width: "300px",
    minHeight: "15px",
    delay: 5000,
  });
}
function errorMessage() {
  refs.renderBox.innerHTML = "";
  error({
    title: "Error",
    text: "No matchs found!",
    width: "300px",
    minHeight: "15px",
    delay: 2000,
  });
}
function errorServerMessage() {
  refs.renderBox.innerHTML = "";
  error({
    title: "Error",
    text: "Some things goes wrong, try again later",
    width: "300px",
    minHeight: "15px",
    delay: 2000,
  });
}
