import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }
  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };
    this.items.push(item);
    this.persistList();
    return item;
  }
  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id);
    // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
    // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8] //do not mutate
    this.items.splice(index, 1); // we want 1 element to remove
    this.persistList();
  }
  deleteAll() {
    while (this.items.length) {
      this.items.pop();
    }
    this.persistList();
  }

  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).count = newCount;
    this.persistList()
  }
  persistList() {
    localStorage.setItem("shoppinglist", JSON.stringify(this.items));
  }
  readList() {
    const storage = JSON.parse(localStorage.getItem("shoppinglist"));
    if (storage) this.items = storage;
  }
}
