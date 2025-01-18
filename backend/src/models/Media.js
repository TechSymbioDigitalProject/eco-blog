const db = require('../config/db');
const logger = require('../config/logger');


class Media {
  constructor(id, sectionId, url, type, description, position) {
    this._id = id;
    this._sectionId = sectionId;
    this._url = url;
    this._type = type;
    this._description = description;
    this._position = position;
  }

  // Getters
  get id() {
    return this._id;
  }

  get sectionId() {
    return this._sectionId;
  }

  get url() {
    return this._url;
  }

  get type() {
    return this._type;
  }

  get description() {
    return this._description;
  }

  get position() {
    return this._position;
  }

  // Setters
  set url(url) {
    this._url = url;
  }

  set type(type) {
    this._type = type;
  }

  set description(description) {
    this._description = description;
  }

  set position(position) {
    this._position = position;
  }



}