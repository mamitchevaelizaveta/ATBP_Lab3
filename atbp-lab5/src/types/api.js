// src/types/api.js
// Модели данных для API

export const MovieAccessRequest = {
  movieId: '',
  age: 0,
  withAdult: false
};

export const MovieAccessResponse = {
  allowed: false,
  movieId: '',
  movieTitle: '',
  ageRating: 0,
  reason: ''
};

export const Movie = {
  id: '',
  title: '',
  ageRating: 0
};