export default class Scene {
  constructor() {
    this.models = [];
  }

  addModel(model) {
    this.models.push(model);
  }

  getModels() {
    return this.models;
  }
}
