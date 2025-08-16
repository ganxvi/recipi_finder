// Search by name
async function getRecipes() {
  const query = document.getElementById("searchInput").value;
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "<p>Loading...</p>";

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await res.json();

  if (!data.meals) {
    recipeList.innerHTML = "<p>No recipes found. Try another search.</p>";
    return;
  }

  displayRecipes(data.meals);
}

// Search by Cuisine
async function getByCuisine() {
  const cuisine = document.getElementById("cuisineSelect").value;
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "<p>Loading...</p>";

  if (!cuisine) {
    recipeList.innerHTML = "<p>Please select a cuisine.</p>";
    return;
  }

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`);
  const data = await res.json();

  if (!data.meals) {
    recipeList.innerHTML = "<p>No recipes found for this cuisine.</p>";
    return;
  }

  displayRecipes(data.meals);
}

// Search by Category
async function getByCategory() {
  const category = document.getElementById("categorySelect").value;
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "<p>Loading...</p>";

  if (!category) {
    recipeList.innerHTML = "<p>Please select a category.</p>";
    return;
  }

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  const data = await res.json();

  if (!data.meals) {
    recipeList.innerHTML = "<p>No recipes found for this category.</p>";
    return;
  }

  displayRecipes(data.meals);
}

// Display recipes in grid
function displayRecipes(meals) {
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = meals.map(meal => `
    <div class="recipe" onclick="showDetails(${meal.idMeal})">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
    </div>
  `).join('');
}

// Show modal with details
async function showDetails(mealID) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  const data = await res.json();
  const meal = data.meals[0];
  const modalBody = document.getElementById("modalBody");

  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    const ingr = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingr) ingredients += `<li>${measure} ${ingr}</li>`;
  }

  modalBody.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h2>${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul>${ingredients}</ul>
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
    ${meal.strSource ? `<a href="${meal.strSource}" target="_blank">View Source</a>` : ""}
  `;

  document.getElementById("recipeModal").style.display = "block";
}

function closeModal() {
  document.getElementById("recipeModal").style.display = "none";
}
// Show random recipes on page load
async function loadDefaultRecipes() {
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "<p>Loading recipes...</p>";

  let meals = [];

  // Fetch 8 random meals
  for (let i = 0; i < 8; i++) {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await res.json();
    if (data.meals) {
      meals.push(data.meals[0]);
    }
  }

  displayRecipes(meals);
}

// Run this when page loads
window.onload = loadDefaultRecipes;

