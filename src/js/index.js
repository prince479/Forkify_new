// Global app controller
// import num from './test'
// const x=23
// console.log(`i imported ${num} successfully from another test.js i am very excited and variable  x is ${x}`)
/*
how export default import works
import str from './modules/Search'
import {add as a,multiply as m,ID} from './views/searchView'
 import * as searchView from '/views/searchView' then  we have to call like this searchView.add/multiply/ID
 console.log(`Imported Functions:\n Add :- ${a(ID,9)} \n Multiply :- ${m(5,7)} and ${str} is imported string`)
https://api.edamam.com/search?app_id=97376be2&app_key=150eac4b05b4e40572348e0064f5f69f&q=${query}
*/

import Search from "./modules/Search";
import Recipe from "./modules/Recipe";
import List from "./modules/List";
import Likes from "./modules/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
window.state = state;

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();
  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes

      await state.search.getResults();

      // 5) Render results on UI
      //console.log(state.search.result)
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert("Something wrong with the search...");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10); //base 10
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);
    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
      // Render recipe
      clearLoader();
    } catch (error) {
      console.log(error);
      alert("Error processing recipe!");
    }
  }
};

//multiple events binding
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);
/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;
  //User has not liked the currrent recipe
  if (!state.likes.isLiked(currentId)) {
    //Add like to the state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    likesView.renderLike(newLike);
    // Toggle the like button
    likesView.toggleLikeBtn(true);
  } // user has liked the current recipe
  else {
    // Remove like from the state
    state.likes.deleteLike(currentId);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like from UI list
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes(currentId));
};
// Restore liked recipes on page load
window.addEventListener("load", () => {
  state.likes = new Likes();
  state.list = new List();
  //Restore Likes
  state.likes.readStorage();
  state.list.readList();
  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
  state.list.items.forEach((item) => listView.renderItem(item));
});

// Handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});

//window.l= new List()

/**
 * LIST CONTROLLER
 */
const controlList = () => {
  // Create a new list IF there in none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);
    // Delete from UI
    listView.deleteItem(id);
    // Handle the count update
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});
// CLEAR CART (shopping list)
elements.clearCart.addEventListener("click", (e) => {
  if (e.target.matches(".clearButton")) {
    if (state.list.items.length > 0) {
      state.list.deleteAll();
      listView.deleteList();
    } else {
      alert("Cart is Empty! :( \nAdd some item to the  Shopping List");
    }
  }
});
// ADDING TO SHOPPING LIST MANUALLY
document.querySelector("#add_toList").addEventListener("submit", (e) => {
  e.preventDefault();
  const count = parseInt(document.getElementById("count").value, 10);
  const unit = document.getElementById("unit").value;
  const ingredient = document.getElementById("ing").value;
  const itemobj = {
    count,
    unit,
    ingredient,
  };
  if (count !== NaN && unit !== "" && ingredient !== "") {
    state.list.addItem(count, unit, ingredient);
    listView.renderItem(itemobj);
    console.log("success");
  } else {
    alert("Please Fill All the Fields !!");
  }
});
