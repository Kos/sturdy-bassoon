export default class Scene {
  constructor() {
    this.models = [];
  }

  addModel(model) {
    this.models.push(model);
    return model; // shortcut
  }

  getModels() {
    return this.models;
  }
}
