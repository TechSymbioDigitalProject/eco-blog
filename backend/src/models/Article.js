const db = require('../config/db');
const logger = require('../config/logger');


class Article {
  constructor(id, titre, statutPublication, auteur, categorieId, datePublication, metaDescription, mainImageUrl) {
    this._id = id;
    this._titre = titre;
    this._statutPublication = statutPublication;
    this._auteur = auteur;
    this._categorieId = categorieId;
    this._datePublication = datePublication;
    this._metaDescription = metaDescription;
    this._mainImageUrl = mainImageUrl;
  }

   // Getters
  get id() {
    return this._id;
  }

  get titre() {
      return this._titre;
  }

  get statutPublication() {
      return this._statutPublication;
  }

  get auteur() {
      return this._auteur;
  }

  get categorieId() {
      return this._categorieId;
  }

  get datePublication() {
      return this._datePublication;
  }

  get metaDescription() {
      return this._metaDescription;
  }

  get mainImageUrl() {
      return this._mainImageUrl;
  }


  // Setters
  set titre(titre) {
    this._titre = titre;
  }

  set statutPublication(statutPublication) {
      this._statutPublication = statutPublication;
  }

  set auteur(auteur) {
      this._auteur = auteur;
  }

  set categorieId(categorieId) {
      this._categorieId = categorieId;
  }

  set datePublication(datePublication) {
      this._datePublication = datePublication;
  }

  set metaDescription(metaDescription) {
      this._metaDescription = metaDescription;
  }

  set mainImageUrl(mainImageUrl) {
      this._mainImageUrl = mainImageUrl;
  }

}