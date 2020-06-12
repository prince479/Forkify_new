import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults()  {
    //const key = "150eac4b05b4e40572348e0064f5f69f";
    //const app_id = "97376be2";
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      // result.data.hits.forEach(element => {
      //     console.log(element.recipe["label"])
      // })//hits contain array of recipes
      // }
      this.result = res.data.recipes;
      //console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }
}


/*
calories: 4055.7632762010808
cautions: ["Sulfites"]
dietLabels: ["Low-Carb"]
digest: (26) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
healthLabels: (3) ["Sugar-Conscious", "Peanut-Free", "Tree-Nut-Free"]
image: "https://www.edamam.com/web-img/e42/e42f9119813e890af34c259785ae1cfb.jpg"
ingredientLines: (10) ["1/2 cup olive oil", "5 cloves garlic, peeled", "2 large russet potatoes, peeled and cut into chunks", "1 3-4 pound chicken, cut into 8 pieces (or 3 pound chicken legs)", "3/4 cup white wine", "3/4 cup chicken stock", "3 tablespoons chopped parsley", "1 tablespoon dried oregano", "Salt and pepper", "1 cup frozen peas, thawed"]
ingredients: (11) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
label: "Chicken Vesuvio"
shareAs: "http://www.edamam.com/recipe/chicken-vesuvio-b79327d05b8e5b838ad6cfd9576b30b6/chicken"
source: "Serious Eats"
totalDaily: {ENERC_KCAL: {…}, FAT: {…}, FASAT: {…}, CHOCDF: {…}, FIBTG: {…}, …}
totalNutrients: {ENERC_KCAL: {…}, FAT: {…}, FASAT: {…}, FATRN: {…}, FAMS: {…}, …}
totalTime: 60
totalWeight: 2765.5901364771207
uri: "http://www.edamam.com/ontologies/edamam.owl#recipe_b79327d05b8e5b838ad6cfd9576b30b6"
url: "http://www.seriouseats.com/recipes/2011/12/chicken-vesuvio-recipe.html"
yield: 4
*/