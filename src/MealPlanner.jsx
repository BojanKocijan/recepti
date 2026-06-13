import React, { useState, useEffect, useRef } from "react";
import { Plus, X, ChefHat, ShoppingCart, Trash2, Calendar, Camera, Upload, Sparkles, Loader2, Shuffle, Settings, BookOpen, Check, ChevronRight, ChevronLeft, Search, Clock, Users, Flame, ArrowLeft, Edit3, Timer, ListChecks, TrendingDown, TrendingUp, Printer, Download } from "lucide-react";

// ============ STORES ============
const STORE_MULTIPLIERS = {
  ah: { name: "Albert Heijn", multiplier: 1.0 },
  jumbo: { name: "Jumbo", multiplier: 0.96 },
  plus: { name: "Plus", multiplier: 1.02 },
  lidl: { name: "Lidl", multiplier: 0.82 },
  aldi: { name: "Aldi", multiplier: 0.80 },
  ekoplaza: { name: "Ekoplaza", multiplier: 1.35 },
};

const HF_SHIPPING = 5.99;
const getHFPricePerPortion = (people, meals) => {
  const total = people * meals;
  if (total <= 3) return 11.33;
  if (total <= 6) return 6.67;
  if (total <= 8) return 6.13;
  if (total <= 12) return 5.45;
  if (total <= 16) return 5.12;
  if (total <= 20) return 4.94;
  if (total <= 24) return 4.77;
  return 4.30;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_FULL_EN = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
const DAYS_FULL_SR = { Mon: "Ponedeljak", Tue: "Utorak", Wed: "Sreda", Thu: "Četvrtak", Fri: "Petak", Sat: "Subota", Sun: "Nedelja" };
const DAYS_SHORT_SR = { Mon: "Pon", Tue: "Uto", Wed: "Sre", Thu: "Čet", Fri: "Pet", Sat: "Sub", Sun: "Ned" };

// ============ TRANSLATIONS ============
const T = {
  en: {
    // Navigation
    weekPlan: "Meal Plan", recipes: "Your Recipes", compare: "Cost Analysis",
    thisWeek: "This Week", recipesShort: "Recipes", week: "Week", compareShort: "Compare",
    // Settings
    store: "Store", people: "People", mealsPerWeek: "meals/week",
    person: "person", peopleW: "people",
    // Plan view
    weekTotalAt: "Week Total at", mealsPlanned: "of 7 meals planned",
    randomizeWeek: "Randomize my week", tapToAdd: "Tap to add a meal",
    nutritionWeek: "Total nutrition this week", portions: "portions", perPortion: "per portion",
    // Recipes view
    library: "Library", scan: "Scan", new: "New",
    noRecipesYet: "No recipes yet", browseLibraryHint: "Browse the library, scan a recipe, or create one",
    browseLibrary: "Browse 25 starter recipes", searchRecipes: "Search recipes",
    forN: "for", noMatchesFor: "No matches for",
    // Compare view
    nothingPlanned: "Nothing planned yet", planSomeMeals: "Plan some meals on the Week tab to see the comparison.",
    helloFreshWins: "HelloFresh wins this week", cookingWins: "Cooking yourself wins",
    lessThanCooking: "% less than cooking", savedByCooking: "% saved by cooking",
    perYear: "/year", meals: "meals",
    inclShipping: "incl. {shipping} shipping",
    shoppingList: "Shopping List", packsToBuy: "Packs to buy at",
    total: "Total",
    // Recipe detail
    back: "Back", edit: "Edit", recipe: "Recipe", shoppingTab: "Shopping list",
    cheaperToCook: "Cheaper to cook", helloFreshCheaper: "HelloFresh is cheaper",
    save: "Save ", costs: "Costs ", yourCost: "Your cost", vsHF: "vs HF",
    perPortionLabel: "Per portion", kcal: "kcal", protein: "protein", carbs: "carbs", fat: "fat",
    items: "items", min: "min",
    ingredients: "Ingredients", instructions: "Instructions",
    noInstructions: "No instructions yet. Generate them with AI based on the ingredients.",
    generateAI: "Generate with AI", generating: "Generating...",
    regenerate: "Regenerate", startCooking: "Start cooking",
    whatToBuy: "What to buy", tapToCheck: "Tap to check off as you shop",
    totalCheckout: "Total at checkout", recipeNeeds: "recipe needs", restKeeps: "rest keeps",
    scaledFrom: "Scaled from", to: "→",
    freshNote: "Fresh items priced as full packs · pantry staples (oil, spices) pro-rated since they last across meals",
    // Cook mode
    preparingRecipe: "Preparing your recipe...", generatingSteps: "Generating cooking steps",
    step: "Step", of: "of", nextStep: "Next step", doneCooking: "Done cooking 🎉",
    // Library
    recipeLibrary: "Recipe Library", search25: "Search 25 recipes",
    added: "Added", add: "Add", noRecipesMatch: "No recipes match",
    estCost: "Est.",
    // Prefs
    preferences: "Preferences", done: "Done",
    diet: "Diet", anything: "Anything", pescatarian: "Pescatarian", vegetarian: "Vegetarian", vegan: "Vegan",
    includeProteins: "Include proteins",
    meat: "Meat", fish: "Fish", vegetarianP: "Vegetarian", veganP: "Vegan",
    style: "Style", quickFilter: "Quick (<30min)", highProtein: "High protein", lean: "Lean (<500 kcal)", noCook: "No cooking",
    mealsPerWeekTitle: "Meals per week", maxCookingTime: "Max cooking time",
    // Recipe modal
    cancel: "Cancel", saveBtn: "Save",
    editRecipe: "Edit Recipe", reviewScanned: "Review Scanned Recipe", newRecipe: "New Recipe",
    serves: "Serves", time: "Time",
    tags: "Tags",
    nutritionPerPortion: "Nutrition per portion", optional: "(optional)",
    ingredientsCount: "Ingredients",
    searchAndAdd: "Search and add ingredients below",
    searchIngredient: "Search ingredient", noMatches: "No matches",
    setPrice: "Set €",
    customNote: "Some ingredients couldn't be matched to known prices. Set them below.",
    totalFor: "Total for",
    // Scan
    scanRecipe: "Scan Recipe",
    scanHint: "Take a photo of any recipe — works in Dutch and English",
    camera: "Camera", upload: "Upload",
    retake: "Retake", extract: "Extract",
    readingRecipe: "Reading recipe...", extractingHint: "Extracting ingredients and steps",
    didntWork: "That didn't work", tryAgain: "Try again",
    // Empty / general
    addRecipe: "+ Add recipe", createFirst: "Try Randomize ↑",
    pickMealFor: "Pick a meal for",
    noRecipesSaved: "No recipes saved yet.",
    addFromRecipes: "Add some from the Recipes tab first.",
    saved: "saved", language: "Language", english: "English", serbian: "Srpski",
    settingsSaved: "Settings saved",
    weeklyShopping: "Weekly Shopping List", byRecipe: "By recipe", combined: "Combined",
    printList: "Print", printRecipe: "Print recipe",
    forMeal: "for", noPlanYet: "No meals planned yet", goToPlan: "Plan some meals first to see your shopping list",
    grandTotal: "Grand total",
    printDateLabel: "Generated", aboutText: "Personal meal planner",
    leftovers: "Leftovers from your shopping",
    leftoversHint: "These ingredients will remain after your week — turn them into bonus meals",
    suggestRecipe: "Suggest bonus recipe",
    suggesting: "Creating recipe...",
    addBonusRecipe: "Add to my recipes",
    leftoverNone: "Nothing significant left over — well planned!",
    bonusRecipeReady: "Bonus recipe ready",
    leftover: "leftover",
    needs: "needs",
  },
  sr: {
    weekPlan: "Plan Obroka", recipes: "Tvoji Recepti", compare: "Analiza Troškova",
    thisWeek: "Ova Nedelja", recipesShort: "Recepti", week: "Nedelja", compareShort: "Uporedi",
    store: "Prodavnica", people: "Osobe", mealsPerWeek: "obroka/ned",
    person: "osoba", peopleW: "osoba",
    weekTotalAt: "Ukupno za nedelju u", mealsPlanned: "od 7 obroka planirano",
    randomizeWeek: "Nasumično popuni nedelju", tapToAdd: "Dodirni da dodaš obrok",
    nutritionWeek: "Ukupna nutricija za nedelju", portions: "porcija", perPortion: "po porciji",
    library: "Biblioteka", scan: "Skeniraj", new: "Novo",
    noRecipesYet: "Još nema recepata", browseLibraryHint: "Pretraži biblioteku, skeniraj recept, ili napravi novi",
    browseLibrary: "Pogledaj 25 recepata", searchRecipes: "Pretraži recepte",
    forN: "za", noMatchesFor: "Nema rezultata za",
    nothingPlanned: "Još ništa nije planirano", planSomeMeals: "Planiraj obroke u kartici Nedelja da vidiš poređenje.",
    helloFreshWins: "HelloFresh pobeđuje ove nedelje", cookingWins: "Kuvanje kod kuće pobeđuje",
    lessThanCooking: "% manje od kuvanja", savedByCooking: "% uštede kuvanjem",
    perYear: "/godišnje", meals: "obroka",
    inclShipping: "uklj. {shipping} dostava",
    shoppingList: "Spisak za Kupovinu", packsToBuy: "Pakovanja koja treba kupiti u",
    total: "Ukupno",
    back: "Nazad", edit: "Izmeni", recipe: "Recept", shoppingTab: "Spisak",
    cheaperToCook: "Jeftinije je skuvati", helloFreshCheaper: "HelloFresh je jeftiniji",
    save: "Ušteda ", costs: "Skuplje ", yourCost: "Tvoja cena", vsHF: "vs HF",
    perPortionLabel: "Po porciji", kcal: "kcal", protein: "proteina", carbs: "ugljh.", fat: "masti",
    items: "stavki", min: "min",
    ingredients: "Sastojci", instructions: "Uputstva",
    noInstructions: "Još nema uputstava. Generiši ih pomoću AI na osnovu sastojaka.",
    generateAI: "Generiši pomoću AI", generating: "Generišem...",
    regenerate: "Ponovi", startCooking: "Počni kuvanje",
    whatToBuy: "Šta treba kupiti", tapToCheck: "Dodirni da označiš tokom kupovine",
    totalCheckout: "Ukupno na kasi", recipeNeeds: "recept traži", restKeeps: "ostatak ostaje",
    scaledFrom: "Skalirano sa", to: "→",
    freshNote: "Sveže namirnice se računaju kao cela pakovanja · stalne namirnice (ulje, začini) proporcionalno jer traju duže",
    preparingRecipe: "Pripremam recept...", generatingSteps: "Generišem korake kuvanja",
    step: "Korak", of: "od", nextStep: "Sledeći korak", doneCooking: "Gotovo 🎉",
    recipeLibrary: "Biblioteka Recepata", search25: "Pretraži 25 recepata",
    added: "Dodato", add: "Dodaj", noRecipesMatch: "Nema rezultata",
    estCost: "Pribl.",
    preferences: "Podešavanja", done: "Gotovo",
    diet: "Ishrana", anything: "Bilo šta", pescatarian: "Peskatarijanski", vegetarian: "Vegetarijanski", vegan: "Veganski",
    includeProteins: "Uključi proteine",
    meat: "Meso", fish: "Riba", vegetarianP: "Vegetarijansko", veganP: "Vegansko",
    style: "Stil", quickFilter: "Brzo (<30min)", highProtein: "Visok protein", lean: "Lagano (<500 kcal)", noCook: "Bez kuvanja",
    mealsPerWeekTitle: "Obroka nedeljno", maxCookingTime: "Maks. vreme kuvanja",
    cancel: "Odustani", saveBtn: "Sačuvaj",
    editRecipe: "Izmeni recept", reviewScanned: "Pregled skeniranog recepta", newRecipe: "Novi recept",
    serves: "Za", time: "Vreme",
    tags: "Oznake",
    nutritionPerPortion: "Nutricija po porciji", optional: "(opciono)",
    ingredientsCount: "Sastojci",
    searchAndAdd: "Pretraži i dodaj sastojke ispod",
    searchIngredient: "Pretraži sastojak", noMatches: "Nema rezultata",
    setPrice: "Cena €",
    customNote: "Neki sastojci nisu pronađeni u bazi. Postavi im cenu ispod.",
    totalFor: "Ukupno za",
    scanRecipe: "Skeniraj Recept",
    scanHint: "Slikaj bilo koji recept — radi na holandskom i engleskom",
    camera: "Kamera", upload: "Otpremi",
    retake: "Ponovo", extract: "Izvuci",
    readingRecipe: "Čitam recept...", extractingHint: "Izvlačim sastojke i korake",
    didntWork: "Nije uspelo", tryAgain: "Pokušaj ponovo",
    addRecipe: "+ Dodaj recept", createFirst: "Pokreni Nasumično ↑",
    pickMealFor: "Izaberi obrok za",
    noRecipesSaved: "Još nema sačuvanih recepata.",
    addFromRecipes: "Prvo dodaj recepte u kartici Recepti.",
    saved: "sačuvano", language: "Jezik", english: "English", serbian: "Srpski",
    settingsSaved: "Podešavanja sačuvana",
    weeklyShopping: "Spisak za Nabavku — Nedelja", byRecipe: "Po receptima", combined: "Zajedno",
    printList: "Štampaj", printRecipe: "Štampaj recept",
    forMeal: "za", noPlanYet: "Još nema isplaniranih obroka", goToPlan: "Prvo isplaniraj obroke da vidiš spisak za nabavku",
    grandTotal: "Sveukupno",
    printDateLabel: "Generisano", aboutText: "Lični planer obroka",
    leftovers: "Ostaje od kupovine",
    leftoversHint: "Ovi sastojci će ostati nakon nedelje — pretvori ih u bonus obroke",
    suggestRecipe: "Predloži bonus recept",
    suggesting: "Kreiram recept...",
    addBonusRecipe: "Dodaj u recepte",
    leftoverNone: "Ništa značajno ne ostaje — dobro isplanirano!",
    bonusRecipeReady: "Bonus recept spreman",
    leftover: "ostaje",
    needs: "treba",
  },
};

// ============ DESIGN TOKENS (iOS-inspired) ============
const C = {
  bg: "#F2F2F7",        // iOS system gray 6 (page background)
  card: "#FFFFFF",       // pure white cards
  cardAlt: "#FAFAFA",    // subtle off-white
  text: "#1C1C1E",       // near-black
  textSecondary: "#6E6E73", // gray
  textTertiary: "#AEAEB2",  // light gray
  separator: "#E5E5EA",  // hairline
  blue: "#007AFF",       // iOS blue
  blueSoft: "#E8F0FE",   // tinted blue background
  green: "#34C759",      // iOS green
  greenSoft: "#E5F8EA",
  red: "#FF3B30",
  orange: "#FF9500",
  orangeSoft: "#FFF3E0",
  purple: "#AF52DE",
};

// ============ INGREDIENT DATABASE (NL prices in EUR) ============
const INGREDIENT_DB = [
  { name: "Chicken breast", unit: "kg", price: 11.99 },
  { name: "Chicken thigh fillet", unit: "kg", price: 9.99 },
  { name: "Turkey breast", unit: "kg", price: 13.99 },
  { name: "Lean turkey mince", unit: "500g", price: 5.49 },
  { name: "Mixed mince (pork/beef)", unit: "kg", price: 9.49 },
  { name: "Beef mince", unit: "kg", price: 11.99 },
  { name: "Lean beef mince 5%", unit: "500g", price: 6.49 },
  { name: "Steak", unit: "kg", price: 24.99 },
  { name: "Pork tenderloin", unit: "kg", price: 16.99 },
  { name: "Bacon strips", unit: "200g", price: 2.49 },
  { name: "Salmon fillet", unit: "kg", price: 25.99 },
  { name: "White fish", unit: "kg", price: 18.99 },
  { name: "Cod loin (frozen)", unit: "400g", price: 5.99 },
  { name: "Tuna in water (can)", unit: "can", price: 1.39 },
  { name: "Shrimp", unit: "200g", price: 4.99 },
  { name: "Eggs", unit: "10 pcs", price: 3.29 },
  { name: "Egg whites (carton)", unit: "500ml", price: 3.49 },
  { name: "Skim milk", unit: "liter", price: 1.05 },
  { name: "Whole milk", unit: "liter", price: 1.19 },
  { name: "Butter", unit: "250g", price: 2.79 },
  { name: "Aged cheese", unit: "kg", price: 12.49 },
  { name: "Grated cheese", unit: "150g", price: 2.49 },
  { name: "Parmesan", unit: "100g", price: 3.49 },
  { name: "Mozzarella", unit: "125g", price: 1.29 },
  { name: "Light mozzarella", unit: "125g", price: 1.49 },
  { name: "Feta", unit: "200g", price: 2.49 },
  { name: "Greek yogurt", unit: "500g", price: 2.29 },
  { name: "Skyr (0% fat)", unit: "500g", price: 2.79 },
  { name: "Quark (low-fat)", unit: "500g", price: 1.99 },
  { name: "Crème fraîche", unit: "200ml", price: 1.49 },
  { name: "Cooking cream", unit: "250ml", price: 1.39 },
  { name: "Halloumi", unit: "225g", price: 3.49 },
  { name: "Tofu", unit: "375g", price: 2.49 },
  { name: "Tempeh", unit: "200g", price: 2.69 },
  { name: "Chickpeas", unit: "can", price: 0.89 },
  { name: "Black beans", unit: "can", price: 0.99 },
  { name: "Kidney beans", unit: "can", price: 0.95 },
  { name: "Edamame (frozen)", unit: "300g", price: 2.99 },
  { name: "Red lentils", unit: "500g", price: 1.99 },
  { name: "Pasta", unit: "500g", price: 1.29 },
  { name: "Whole wheat pasta", unit: "500g", price: 1.49 },
  { name: "Gnocchi", unit: "500g", price: 1.59 },
  { name: "Rice", unit: "kg", price: 2.49 },
  { name: "Brown rice", unit: "500g", price: 1.79 },
  { name: "Quinoa", unit: "500g", price: 3.49 },
  { name: "Oats", unit: "500g", price: 1.29 },
  { name: "Bananas", unit: "each", price: 0.35 },
  { name: "Wheat flour", unit: "1kg", price: 0.99 },
  { name: "Sugar", unit: "1kg", price: 1.19 },
  { name: "Potatoes", unit: "kg", price: 1.49 },
  { name: "Bread (loaf)", unit: "whole", price: 2.49 },
  { name: "Whole wheat bread", unit: "whole", price: 1.99 },
  { name: "Wraps", unit: "8 pcs", price: 1.99 },
  { name: "Whole wheat wraps", unit: "8 pcs", price: 2.29 },
  { name: "Naan bread", unit: "2 pcs", price: 1.69 },
  { name: "Couscous", unit: "500g", price: 1.99 },
  { name: "Bulgur", unit: "500g", price: 1.79 },
  { name: "Onion", unit: "kg", price: 1.29 },
  { name: "Red onion", unit: "kg", price: 1.49 },
  { name: "Garlic", unit: "bulb", price: 0.69 },
  { name: "Bell pepper", unit: "each", price: 0.79 },
  { name: "Tomatoes", unit: "kg", price: 2.99 },
  { name: "Cherry tomatoes", unit: "250g", price: 1.79 },
  { name: "Cucumber", unit: "each", price: 0.99 },
  { name: "Lettuce (head)", unit: "each", price: 1.29 },
  { name: "Spinach", unit: "300g", price: 1.99 },
  { name: "Arugula", unit: "75g", price: 1.49 },
  { name: "Broccoli", unit: "each", price: 1.69 },
  { name: "Cauliflower", unit: "each", price: 1.99 },
  { name: "Carrots", unit: "kg", price: 1.19 },
  { name: "Zucchini", unit: "each", price: 1.29 },
  { name: "Eggplant", unit: "each", price: 1.49 },
  { name: "Mushrooms", unit: "250g", price: 1.69 },
  { name: "Leek", unit: "each", price: 1.29 },
  { name: "Green beans", unit: "400g", price: 2.49 },
  { name: "Frozen peas", unit: "450g", price: 1.99 },
  { name: "Sweet potato", unit: "kg", price: 2.49 },
  { name: "Lemon", unit: "each", price: 0.49 },
  { name: "Lime", unit: "each", price: 0.59 },
  { name: "Avocado", unit: "each", price: 1.29 },
  { name: "Fresh parsley", unit: "bunch", price: 0.99 },
  { name: "Fresh basil", unit: "pot", price: 1.99 },
  { name: "Fresh cilantro", unit: "bunch", price: 0.99 },
  { name: "Ginger", unit: "100g", price: 0.89 },
  { name: "Olive oil", unit: "500ml", price: 4.99 },
  { name: "Sunflower oil", unit: "liter", price: 2.49 },
  { name: "Soy sauce", unit: "150ml", price: 1.79 },
  { name: "Tomato paste", unit: "can", price: 0.69 },
  { name: "Passata", unit: "bottle", price: 1.49 },
  { name: "Coconut milk", unit: "400ml", price: 1.49 },
  { name: "Stock cube", unit: "each", price: 0.20 },
  { name: "Salt & pepper", unit: "pinch", price: 0.05 },
  { name: "Spices", unit: "tsp", price: 0.15 },
];

// Serbian ingredient translations
const INGREDIENT_SR = {
  "Chicken breast": "Pileći file", "Chicken thigh fillet": "Pileći but bez kosti",
  "Turkey breast": "Ćureći file", "Lean turkey mince": "Mleveno ćureće (lagano)",
  "Mixed mince (pork/beef)": "Mešano mleveno meso", "Beef mince": "Mleveno juneće",
  "Lean beef mince 5%": "Lagano mleveno juneće 5%", "Steak": "Biftek", "Pork tenderloin": "Svinjski file",
  "Bacon strips": "Slanina", "Salmon fillet": "File lososa", "White fish": "Bela riba",
  "Cod loin (frozen)": "Bakalar (smrznut)", "Tuna in water (can)": "Tunjevina u vodi (konzerva)",
  "Shrimp": "Škampi", "Eggs": "Jaja", "Egg whites (carton)": "Belanca (karton)",
  "Skim milk": "Posno mleko", "Whole milk": "Punomasno mleko", "Butter": "Maslac",
  "Aged cheese": "Stari sir", "Grated cheese": "Rendani sir", "Parmesan": "Parmezan",
  "Mozzarella": "Mocarela", "Light mozzarella": "Lagana mocarela", "Feta": "Feta",
  "Greek yogurt": "Grčki jogurt", "Skyr (0% fat)": "Skyr (0% mast)",
  "Quark (low-fat)": "Kvark (lagani)",
  "Crème fraîche": "Pavlaka", "Cooking cream": "Pavlaka za kuvanje",
  "Halloumi": "Halumi", "Tofu": "Tofu", "Tempeh": "Tempeh",
  "Chickpeas": "Leblebije", "Black beans": "Crni pasulj", "Kidney beans": "Crveni pasulj",
  "Edamame (frozen)": "Edamame (smrznut)", "Red lentils": "Crveno sočivo",
  "Pasta": "Testenina", "Whole wheat pasta": "Integralna testenina", "Gnocchi": "Gnoci",
  "Rice": "Pirinač", "Brown rice": "Crveni pirinač", "Quinoa": "Kvinoja", "Oats": "Ovsene pahuljice",
  "Bananas": "Banane", "Wheat flour": "Pšenično brašno", "Sugar": "Šećer",
  "Potatoes": "Krompir", "Bread (loaf)": "Hleb (vekna)", "Whole wheat bread": "Integralni hleb",
  "Wraps": "Tortilje", "Whole wheat wraps": "Integralne tortilje", "Naan bread": "Naan hleb",
  "Couscous": "Kus-kus", "Bulgur": "Bulgur",
  "Onion": "Crni luk", "Red onion": "Crveni luk", "Garlic": "Beli luk",
  "Bell pepper": "Paprika", "Tomatoes": "Paradajz", "Cherry tomatoes": "Cherry paradajz",
  "Cucumber": "Krastavac", "Lettuce (head)": "Salata (glavica)",
  "Spinach": "Spanać", "Arugula": "Rukola", "Broccoli": "Brokoli", "Cauliflower": "Karfiol",
  "Carrots": "Šargarepa", "Zucchini": "Tikvica", "Eggplant": "Plavi patlidžan",
  "Mushrooms": "Pečurke", "Leek": "Praziluk", "Green beans": "Boranija",
  "Frozen peas": "Smrznuti grašak", "Sweet potato": "Slatki krompir",
  "Lemon": "Limun", "Lime": "Limeta", "Avocado": "Avokado",
  "Fresh parsley": "Sveži peršun", "Fresh basil": "Sveži bosiljak", "Fresh cilantro": "Sveži korijander",
  "Ginger": "Đumbir",
  "Olive oil": "Maslinovo ulje", "Sunflower oil": "Suncokretovo ulje",
  "Soy sauce": "Soja sos", "Tomato paste": "Paradajz pire", "Passata": "Paradajz sok",
  "Coconut milk": "Kokosovo mleko", "Stock cube": "Kocka bujona",
  "Salt & pepper": "So i biber", "Spices": "Začini",
};

const UNIT_SR = {
  "kg": "kg", "liter": "litar", "g": "g", "ml": "ml", "each": "kom",
  "pcs": "kom", "bunch": "veza", "bulb": "glavica", "head": "glavica",
  "whole": "ceo", "pot": "saksija", "can": "konzerva", "bottle": "flaša",
  "pinch": "prstohvat", "tsp": "kašičica", "tbsp": "kašika",
  "200g": "200g", "150g": "150g", "100g": "100g", "125g": "125g", "250g": "250g",
  "300g": "300g", "200ml": "200ml", "150ml": "150ml", "250ml": "250ml", "400ml": "400ml",
  "500ml": "500ml", "500g": "500g", "10 pcs": "10 kom", "8 pcs": "8 kom", "2 pcs": "2 kom",
  "32oz": "32oz", "225g": "225g", "375g": "375g", "400g": "400g", "450g": "450g",
};

// Translate display
const tIng = (name, lang) => lang === "sr" ? (INGREDIENT_SR[name] || name) : name;
const tUnit = (unit, lang) => lang === "sr" ? (UNIT_SR[unit] || unit) : unit;

const ing = (name, quantity) => {
  const found = INGREDIENT_DB.find((i) => i.name === name);
  if (!found) {
    console.warn(`Ingredient not in DB: "${name}" — using fallback`);
    return { name, unit: "each", price: 1.0, quantity };
  }
  return { name: found.name, unit: found.unit, price: found.price, quantity };
};

// ============ HELLOFRESH-STYLE LIBRARY (with cooking steps) ============
// ============ LEAN HIGH-PROTEIN LIBRARY (fat-loss focused) ============
// All recipes serve 2, hit 35-45g protein per portion, ~400-550 kcal, lean
const HF_LIBRARY = [
  { id: "hf-1", name: "Grilled chicken & sweet potato", emoji: "🍗", tags: ["meat", "high-protein", "lean"], minutes: 30, people: 2,
    nutrition: { kcal: 480, protein: 48, carbs: 45, fat: 9 },
    ingredients: [ing("Chicken breast", 0.3), ing("Sweet potato", 0.4), ing("Broccoli", 1), ing("Garlic", 0.3), ing("Olive oil", 0.02), ing("Spices", 2), ing("Salt & pepper", 1)],
    steps: ["Preheat oven to 220°C. Cube sweet potato and toss with a teaspoon of oil, paprika, salt and pepper.", "Roast sweet potato for 20 minutes.", "Season chicken with garlic powder, paprika, salt and pepper. Grill or pan-sear in a non-stick pan 5-6 minutes per side until 75°C internal.", "Steam broccoli florets for 4 minutes until bright green and just tender.", "Slice chicken and serve with sweet potato and broccoli."] },

  { id: "hf-2", name: "Tuna & white bean salad", emoji: "🥗", tags: ["fish", "high-protein", "lean", "quick", "no-cook"], minutes: 10, people: 2,
    nutrition: { kcal: 420, protein: 42, carbs: 35, fat: 9 },
    ingredients: [ing("Tuna in water (can)", 2), ing("Chickpeas", 1), ing("Cherry tomatoes", 1), ing("Cucumber", 1), ing("Red onion", 0.05), ing("Lemon", 1), ing("Olive oil", 0.02), ing("Fresh parsley", 1)],
    steps: ["Drain tuna and chickpeas. Halve cherry tomatoes and dice cucumber.", "Finely slice red onion and rinse briefly under cold water to mellow it.", "In a bowl, combine tuna, chickpeas, vegetables, and chopped parsley.", "Dress with lemon juice, a teaspoon of olive oil, salt and pepper. Toss gently.", "Eat immediately or chill for 10 minutes."] },

  { id: "hf-3", name: "Egg white veggie scramble", emoji: "🍳", tags: ["vegetarian", "high-protein", "lean", "quick"], minutes: 15, people: 2,
    nutrition: { kcal: 350, protein: 40, carbs: 30, fat: 7 },
    ingredients: [ing("Egg whites (carton)", 0.5), ing("Eggs", 0.2), ing("Spinach", 0.5), ing("Cherry tomatoes", 1), ing("Mushrooms", 1), ing("Whole wheat bread", 0.3), ing("Garlic", 0.2), ing("Salt & pepper", 1)],
    steps: ["Slice mushrooms and halve cherry tomatoes. Mince garlic.", "Sauté mushrooms in a non-stick pan until golden. Add tomatoes and garlic, cook 1 minute.", "Wilt in spinach.", "Pour in egg whites and 2 whole eggs (whisked). Scramble gently until just set.", "Toast bread and serve alongside."] },

  { id: "hf-4", name: "Skyr chicken curry", emoji: "🍛", tags: ["meat", "high-protein", "lean"], minutes: 25, people: 2,
    nutrition: { kcal: 510, protein: 52, carbs: 50, fat: 9 },
    ingredients: [ing("Chicken breast", 0.3), ing("Skyr (0% fat)", 0.3), ing("Brown rice", 0.16), ing("Onion", 0.2), ing("Garlic", 0.5), ing("Ginger", 0.3), ing("Tomato paste", 1), ing("Spinach", 0.5), ing("Spices", 4)],
    steps: ["Cook brown rice according to package.", "Cube chicken. Season with curry spices and salt.", "Sauté diced onion until soft. Add minced garlic and ginger, cook 1 minute.", "Add chicken and brown lightly. Stir in tomato paste and 100ml water, simmer 8 minutes.", "Wilt in spinach. Off heat, stir in skyr (don't boil — it'll split). Serve over rice."] },

  { id: "hf-5", name: "Tofu stir-fry with edamame", emoji: "🥢", tags: ["vegan", "vegetarian", "high-protein", "lean", "asian"], minutes: 25, people: 2,
    nutrition: { kcal: 470, protein: 40, carbs: 50, fat: 12 },
    ingredients: [ing("Tofu", 1), ing("Edamame (frozen)", 0.5), ing("Brown rice", 0.16), ing("Bell pepper", 1), ing("Carrots", 0.2), ing("Soy sauce", 0.3), ing("Garlic", 0.3), ing("Ginger", 0.3), ing("Spices", 2)],
    steps: ["Cook brown rice. Press tofu and cube it.", "Pan-fry tofu in a non-stick pan with a tiny splash of oil until crispy on all sides, ~8 minutes.", "Add julienned bell pepper and grated carrot. Stir-fry 3 minutes.", "Add frozen edamame, minced garlic and ginger. Cook 2 more minutes.", "Toss with soy sauce and chili flakes. Serve over rice."] },

  { id: "hf-6", name: "Skyr chicken bowl", emoji: "🥣", tags: ["meat", "high-protein", "lean", "quick"], minutes: 15, people: 2,
    nutrition: { kcal: 440, protein: 55, carbs: 25, fat: 11 },
    ingredients: [ing("Chicken breast", 0.3), ing("Skyr (0% fat)", 0.5), ing("Cucumber", 1), ing("Cherry tomatoes", 1), ing("Avocado", 0.5), ing("Lemon", 0.5), ing("Spices", 2), ing("Salt & pepper", 1)],
    steps: ["Season chicken with paprika, garlic powder, salt and pepper. Pan-sear 5 min per side. Slice once cool.", "Dice cucumber and halve cherry tomatoes. Slice half an avocado.", "Build bowls: skyr as the base, chicken on top, vegetables around.", "Squeeze over lemon juice and crack pepper. Done."] },

  { id: "hf-7", name: "Cod with quinoa & asparagus", emoji: "🐠", tags: ["fish", "high-protein", "lean"], minutes: 25, people: 2,
    nutrition: { kcal: 460, protein: 45, carbs: 45, fat: 8 },
    ingredients: [ing("Cod loin (frozen)", 0.7), ing("Quinoa", 0.16), ing("Green beans", 0.5), ing("Lemon", 1), ing("Garlic", 0.3), ing("Olive oil", 0.02), ing("Fresh parsley", 1)],
    steps: ["Rinse quinoa and cook in 1.5x its volume of water, 15 minutes.", "Steam green beans for 5 minutes until just tender.", "Pat cod dry. Season with salt, pepper, and minced garlic.", "Pan-fry cod 3-4 minutes per side in a non-stick pan with a teaspoon of oil.", "Plate quinoa, top with cod and beans. Squeeze lemon over and sprinkle parsley."] },

  { id: "hf-8", name: "Turkey lettuce wraps", emoji: "🥬", tags: ["meat", "high-protein", "lean", "quick", "asian"], minutes: 20, people: 2,
    nutrition: { kcal: 380, protein: 42, carbs: 20, fat: 14 },
    ingredients: [ing("Lean turkey mince", 0.5), ing("Lettuce (head)", 1), ing("Carrots", 0.2), ing("Bell pepper", 1), ing("Garlic", 0.5), ing("Ginger", 0.3), ing("Soy sauce", 0.3), ing("Lime", 1)],
    steps: ["Separate lettuce leaves into cups and rinse. Pat dry.", "Brown turkey mince in a hot non-stick pan, breaking up well.", "Add minced garlic, ginger, grated carrot and diced bell pepper. Cook 4 minutes.", "Stir in soy sauce, lime juice, and a pinch of chili.", "Spoon into lettuce cups and eat with hands."] },

  { id: "hf-9", name: "Lentil & chicken soup", emoji: "🍲", tags: ["meat", "high-protein", "lean"], minutes: 30, people: 2,
    nutrition: { kcal: 480, protein: 50, carbs: 45, fat: 8 },
    ingredients: [ing("Chicken breast", 0.25), ing("Red lentils", 0.15), ing("Carrots", 0.2), ing("Onion", 0.2), ing("Garlic", 0.5), ing("Tomato paste", 1), ing("Stock cube", 2), ing("Spinach", 0.5), ing("Spices", 3)],
    steps: ["Dice onion and carrots. Mince garlic. Cube chicken.", "Sauté onion and carrots in a soup pot, 5 minutes.", "Add chicken and brown lightly. Stir in garlic, cumin, paprika, and tomato paste.", "Add lentils, crumbled stock cubes, and 800ml water. Simmer 20 minutes.", "Stir in spinach until wilted. Season and serve."] },

  { id: "hf-10", name: "Greek yogurt chicken kebabs", emoji: "🍢", tags: ["meat", "high-protein", "lean"], minutes: 30, people: 2,
    nutrition: { kcal: 450, protein: 50, carbs: 30, fat: 12 },
    ingredients: [ing("Chicken breast", 0.3), ing("Greek yogurt", 0.2), ing("Bell pepper", 1), ing("Red onion", 0.15), ing("Bulgur", 0.12), ing("Lemon", 1), ing("Garlic", 0.5), ing("Spices", 3)],
    steps: ["Cube chicken. Mix half the yogurt with garlic, lemon juice, paprika, cumin, salt — marinate chicken 15 minutes (or longer if you have time).", "Cook bulgur in 1.5x its volume of boiling water, 12 minutes.", "Thread chicken onto skewers with chunks of bell pepper and onion.", "Grill or pan-fry kebabs 4 minutes per side until charred and cooked through.", "Serve over bulgur with a dollop of plain yogurt and lemon."] },

  { id: "hf-11", name: "Skyr overnight oats", emoji: "🥣", tags: ["vegetarian", "high-protein", "lean", "quick", "no-cook"], minutes: 5, people: 2,
    nutrition: { kcal: 420, protein: 38, carbs: 55, fat: 6 },
    ingredients: [ing("Oats", 0.16), ing("Skyr (0% fat)", 0.5), ing("Skim milk", 0.3), ing("Eggs", 0.05)],
    steps: ["In two jars or bowls, combine 80g oats, 250g skyr, and 150ml skim milk each.", "Stir well, sweeten with honey or stevia if desired.", "Top with berries (frozen work great).", "Cover and refrigerate overnight (at least 4 hours).", "Eat cold straight from the jar — perfect breakfast or post-workout meal."] },

  { id: "hf-12", name: "Chicken & quinoa bowl", emoji: "🍱", tags: ["meat", "high-protein", "lean"], minutes: 25, people: 2,
    nutrition: { kcal: 500, protein: 48, carbs: 50, fat: 11 },
    ingredients: [ing("Chicken breast", 0.3), ing("Quinoa", 0.16), ing("Avocado", 0.5), ing("Cherry tomatoes", 1), ing("Cucumber", 0.5), ing("Lime", 1), ing("Spices", 2), ing("Fresh cilantro", 0.5)],
    steps: ["Cook quinoa 15 minutes. Let cool slightly.", "Season chicken with cumin, paprika, salt. Pan-sear 5 min per side, slice.", "Halve cherry tomatoes, dice cucumber, slice avocado.", "Build bowls: quinoa base, chicken, vegetables, avocado.", "Squeeze lime over, top with cilantro. Optional: dollop of skyr or hot sauce."] },

  { id: "hf-13", name: "Shrimp zucchini stir-fry", emoji: "🍤", tags: ["fish", "high-protein", "lean", "quick"], minutes: 20, people: 2,
    nutrition: { kcal: 380, protein: 42, carbs: 30, fat: 9 },
    ingredients: [ing("Shrimp", 1.5), ing("Zucchini", 2), ing("Brown rice", 0.16), ing("Garlic", 0.5), ing("Ginger", 0.3), ing("Soy sauce", 0.3), ing("Lime", 1), ing("Spices", 2)],
    steps: ["Cook brown rice.", "Spiralize or thinly slice zucchini into noodle-like ribbons.", "Heat a non-stick pan. Sauté garlic and ginger 30 seconds.", "Add shrimp and cook 2 minutes until pink. Add zucchini and stir-fry 2 more minutes.", "Toss with soy sauce, lime juice, and chili flakes. Serve over rice."] },

  { id: "hf-14", name: "Quark protein pancakes", emoji: "🥞", tags: ["vegetarian", "high-protein", "lean", "quick"], minutes: 15, people: 2,
    nutrition: { kcal: 380, protein: 38, carbs: 45, fat: 6 },
    ingredients: [ing("Quark (low-fat)", 0.4), ing("Oats", 0.1), ing("Eggs", 0.4), ing("Skim milk", 0.1), ing("Spices", 1)],
    steps: ["Blend or whisk together quark, oats, 4 eggs, skim milk, a pinch of cinnamon, and a teaspoon of baking powder.", "Heat a non-stick pan over medium heat — no oil needed.", "Pour small pancakes (~10cm). Cook 2 minutes until bubbles form, flip, cook 1 more.", "Stack and top with berries, a drizzle of honey, or extra quark.", "Makes 8 pancakes — serves 2 generously."] },

  { id: "hf-15", name: "Tempeh sweet potato bowl", emoji: "🍠", tags: ["vegan", "vegetarian", "high-protein", "lean"], minutes: 30, people: 2,
    nutrition: { kcal: 510, protein: 38, carbs: 60, fat: 13 },
    ingredients: [ing("Tempeh", 1), ing("Sweet potato", 0.4), ing("Black beans", 1), ing("Spinach", 0.5), ing("Avocado", 0.5), ing("Lime", 1), ing("Soy sauce", 0.2), ing("Spices", 3)],
    steps: ["Cube sweet potato, toss with paprika and a teaspoon of oil. Roast at 220°C for 25 minutes.", "Slice tempeh and marinate in soy sauce, garlic powder, and chili flakes for 5 minutes.", "Pan-fry tempeh 3 minutes per side until crispy.", "Heat black beans with a pinch of cumin.", "Build bowls: spinach base, sweet potato, beans, tempeh, sliced avocado, lime."] },

  { id: "hf-16", name: "Lean turkey chili", emoji: "🌶️", tags: ["meat", "high-protein", "lean", "spicy"], minutes: 30, people: 2,
    nutrition: { kcal: 460, protein: 45, carbs: 45, fat: 10 },
    ingredients: [ing("Lean turkey mince", 0.5), ing("Kidney beans", 1), ing("Black beans", 1), ing("Tomatoes", 0.4), ing("Onion", 0.2), ing("Garlic", 0.5), ing("Tomato paste", 1), ing("Spices", 4)],
    steps: ["Dice onion and mince garlic. Brown turkey mince in a pot.", "Add onion and garlic, cook 3 minutes.", "Stir in tomato paste, chili powder, cumin, paprika.", "Add diced tomatoes, drained beans, and 200ml water. Simmer 15 minutes.", "Taste and adjust spice. Serve as-is or over a small portion of rice."] },

  { id: "hf-17", name: "Creamy skyr pasta", emoji: "🍝", tags: ["vegetarian", "high-protein", "lean", "quick"], minutes: 15, people: 2,
    nutrition: { kcal: 490, protein: 42, carbs: 65, fat: 7 },
    ingredients: [ing("Whole wheat pasta", 0.16), ing("Skyr (0% fat)", 0.5), ing("Spinach", 0.5), ing("Garlic", 0.3), ing("Cherry tomatoes", 1), ing("Parmesan", 0.2), ing("Spices", 1)],
    steps: ["Cook pasta in salted water until al dente. Reserve 1 cup pasta water.", "Sauté minced garlic in a dry pan with halved cherry tomatoes, 3 minutes.", "Drain pasta, return to pot. Remove from heat. Stir in skyr with a splash of pasta water — off heat so it doesn't split.", "Add tomatoes and wilt in spinach.", "Top with parmesan and black pepper."] },

  { id: "hf-18", name: "Salmon teriyaki bowl", emoji: "🍙", tags: ["fish", "high-protein", "lean", "asian"], minutes: 25, people: 2,
    nutrition: { kcal: 540, protein: 45, carbs: 50, fat: 14 },
    ingredients: [ing("Salmon fillet", 0.25), ing("Brown rice", 0.16), ing("Edamame (frozen)", 0.4), ing("Carrots", 0.15), ing("Soy sauce", 0.3), ing("Ginger", 0.3), ing("Garlic", 0.3), ing("Lime", 1)],
    steps: ["Cook brown rice.", "Mix soy sauce, grated ginger, garlic, and a teaspoon of honey for the glaze.", "Pan-sear salmon skin-side down 4 minutes, flip, brush with glaze, cook 2 more minutes.", "Boil edamame 3 minutes. Grate carrots.", "Build bowls: rice, salmon, edamame, carrots. Drizzle leftover glaze and squeeze lime."] },

  { id: "hf-19", name: "Chicken & broccoli stir-fry", emoji: "🥦", tags: ["meat", "high-protein", "lean", "quick", "asian"], minutes: 20, people: 2,
    nutrition: { kcal: 430, protein: 50, carbs: 35, fat: 9 },
    ingredients: [ing("Chicken breast", 0.3), ing("Broccoli", 1.5), ing("Brown rice", 0.16), ing("Garlic", 0.5), ing("Ginger", 0.3), ing("Soy sauce", 0.3), ing("Spices", 2)],
    steps: ["Cook brown rice.", "Cube chicken. Cut broccoli into small florets.", "Heat a non-stick pan. Stir-fry chicken with minced garlic and ginger until golden, 6-7 minutes.", "Add broccoli and 2 tablespoons of water. Cover and steam 3 minutes.", "Add soy sauce and chili flakes. Toss and serve over rice."] },

  { id: "hf-20", name: "Mediterranean tuna wrap", emoji: "🌯", tags: ["fish", "high-protein", "lean", "quick"], minutes: 10, people: 2,
    nutrition: { kcal: 410, protein: 38, carbs: 40, fat: 10 },
    ingredients: [ing("Tuna in water (can)", 2), ing("Whole wheat wraps", 0.25), ing("Greek yogurt", 0.1), ing("Cucumber", 0.5), ing("Cherry tomatoes", 0.5), ing("Lettuce (head)", 0.3), ing("Lemon", 0.5), ing("Spices", 1)],
    steps: ["Drain tuna and mix with Greek yogurt, lemon juice, salt, pepper, and a pinch of paprika.", "Dice cucumber and halve cherry tomatoes. Shred lettuce.", "Warm wraps briefly in a dry pan or microwave.", "Spread tuna mix down the center, top with vegetables.", "Roll tightly and slice in half."] },

  { id: "hf-21", name: "Lean beef & rice bowl", emoji: "🍚", tags: ["meat", "high-protein", "lean", "asian"], minutes: 25, people: 2,
    nutrition: { kcal: 500, protein: 48, carbs: 50, fat: 11 },
    ingredients: [ing("Lean beef mince 5%", 0.4), ing("Brown rice", 0.16), ing("Spinach", 0.7), ing("Carrots", 0.15), ing("Garlic", 0.5), ing("Ginger", 0.3), ing("Soy sauce", 0.4), ing("Eggs", 0.2)],
    steps: ["Cook brown rice.", "Brown lean beef in a non-stick pan, breaking up well.", "Add minced garlic, ginger, soy sauce, and a teaspoon of honey. Cook 2 minutes.", "Wilt spinach into the beef. Grate carrots.", "Top each bowl: rice, beef, carrots, and a soft-boiled or fried egg."] },

  { id: "hf-22", name: "Greek skyr chicken bowl", emoji: "🥗", tags: ["meat", "high-protein", "lean", "quick"], minutes: 20, people: 2,
    nutrition: { kcal: 470, protein: 52, carbs: 30, fat: 13 },
    ingredients: [ing("Chicken breast", 0.3), ing("Skyr (0% fat)", 0.3), ing("Cucumber", 1), ing("Cherry tomatoes", 1), ing("Red onion", 0.05), ing("Feta", 0.4), ing("Lemon", 1), ing("Spices", 2)],
    steps: ["Season chicken with oregano, garlic powder, salt and pepper. Pan-sear 5-6 min per side. Slice.", "Mix skyr with grated cucumber (squeeze water out first), minced garlic, and lemon for tzatziki.", "Halve cherry tomatoes, dice cucumber, thinly slice red onion.", "Build bowls: vegetables, chicken, crumbled feta on top.", "Dollop tzatziki, finish with lemon and oregano."] },

  { id: "hf-23", name: "White fish curry", emoji: "🐟", tags: ["fish", "high-protein", "lean"], minutes: 25, people: 2,
    nutrition: { kcal: 450, protein: 42, carbs: 45, fat: 11 },
    ingredients: [ing("Cod loin (frozen)", 0.5), ing("Brown rice", 0.16), ing("Spinach", 0.5), ing("Tomato paste", 1), ing("Onion", 0.2), ing("Garlic", 0.5), ing("Ginger", 0.3), ing("Spices", 4)],
    steps: ["Cook brown rice.", "Sauté diced onion until soft. Add minced garlic, ginger, and curry spices.", "Stir in tomato paste and 200ml water. Simmer 5 minutes.", "Cube cod and add to the sauce. Simmer gently 6-8 minutes until fish flakes.", "Wilt in spinach. Serve over rice."] },

  { id: "hf-24", name: "Egg white & turkey scramble", emoji: "🍳", tags: ["meat", "high-protein", "lean", "quick"], minutes: 15, people: 2,
    nutrition: { kcal: 360, protein: 50, carbs: 15, fat: 11 },
    ingredients: [ing("Lean turkey mince", 0.3), ing("Egg whites (carton)", 0.4), ing("Eggs", 0.2), ing("Spinach", 0.7), ing("Mushrooms", 1), ing("Bell pepper", 1), ing("Garlic", 0.3)],
    steps: ["Brown turkey mince in a non-stick pan, breaking up. Set aside.", "In the same pan, sauté diced bell pepper and mushrooms 4 minutes.", "Add minced garlic and spinach, cook until wilted.", "Return turkey to pan. Pour in egg whites + 2 whisked eggs.", "Scramble gently until just set. Season generously."] },

  { id: "hf-25", name: "Chickpea & spinach stew", emoji: "🥘", tags: ["vegan", "vegetarian", "high-protein", "lean"], minutes: 25, people: 2,
    nutrition: { kcal: 440, protein: 38, carbs: 60, fat: 10 },
    ingredients: [ing("Chickpeas", 3), ing("Tofu", 0.5), ing("Spinach", 1), ing("Tomato paste", 1), ing("Onion", 0.2), ing("Garlic", 0.5), ing("Ginger", 0.3), ing("Stock cube", 1), ing("Spices", 4)],
    steps: ["Cube tofu and pan-fry until crispy on all sides.", "In the same pan, sauté diced onion until soft. Add garlic, ginger, cumin, paprika.", "Stir in tomato paste and crumbled stock cube with 300ml water.", "Add drained chickpeas. Simmer 10 minutes to thicken.", "Stir in tofu and spinach. Cook until spinach wilts. Season and serve."] },
  { id: "hf-26", name: "Gnocchi with béchamel and roasted vegetables", emoji: "🥔", tags: ["vegetarian", "quick", "high-protein", "lean"], minutes: 20, people: 2,
    nutrition: { kcal: 420, protein: 35, carbs: 50, fat: 12 },
    ingredients: [ing("Gnocchi", 1), ing("Whole milk", 0.7), ing("Wheat flour", 0.05), ing("Butter", 0.13), ing("Carrots", 0.5), ing("Zucchini", 1), ing("Parmesan", 0.1), ing("Garlic", 0.2), ing("Salt & pepper", 1), ing("Spices", 1)],
    steps: ["Boil gnocchi in salted water until they float, then 1-2 minutes more. Drain and set aside.", "Meanwhile, dice carrot and zucchini into small cubes. Sauté in a dry pan over medium-high heat until caramelized and tender, 8-10 minutes. Season with salt, pepper, minced garlic.", "Make béchamel: melt butter in a small pan, whisk in flour to form a paste (roux), cook 1-2 minutes. Gradually add milk while stirring constantly to avoid lumps. Simmer 5-6 minutes until thickened and smooth.", "Combine gnocchi, vegetables, and béchamel in a bowl. Gently toss to coat. Top with grated Parmesan and cracked pepper. Serve immediately."] },
  { id: "hf-27", name: "Banana bread", emoji: "🍌", tags: ["vegetarian", "baking"], minutes: 55, people: 3,
    nutrition: { kcal: 420, protein: 4, carbs: 40, fat: 22 },
    ingredients: [ing("Bananas", 2), ing("Eggs", 0.2), ing("Wheat flour", 0.18), ing("Sugar", 0.08), ing("Butter", 0.24), ing("Spices", 2), ing("Salt & pepper", 1)],
    steps: ["Preheat oven to 175°C. Mash 2 ripe bananas in a bowl until creamy. Stir in 2 eggs, 60g melted butter, 80g sugar, and a teaspoon of vanilla.", "In another bowl, combine 180g flour, 1 tsp baking powder, ½ tsp baking soda, a pinch of salt, and cinnamon. Mix gently into wet ingredients until flour is just combined — don't overmix.", "Pour into a lined loaf tin. Bake 45-50 minutes until a skewer comes out clean from the center.", "Cool 10 minutes in the tin, then turn out. Slice into 8 pieces. Best served warm with a cup of tea or coffee."] },
];

// Serbian translations for library recipes (by id)
const RECIPE_SR = {
  "hf-1": { name: "Pile na žaru sa slatkim krompirom",
    steps: ["Zagrej rernu na 220°C. Iseckaj slatki krompir na kockice i pomešaj sa kašičicom ulja, slatkom paprikom, soli i biberom.", "Peci slatki krompir 20 minuta.", "Začini pile sa belim lukom u prahu, slatkom paprikom, soli i biberom. Peci ga na grilu ili u tiganju 5-6 min sa svake strane dok ne dostigne 75°C unutra.", "Pari brokoli na pari 4 minuta dok ne postane sjajno zelen i mek.", "Iseci pile i serviraj sa krompirom i brokolijem."] },
  "hf-2": { name: "Salata sa tunjevinom i belim pasuljem",
    steps: ["Iscedi tunjevinu i leblebije. Iseci paradajz na pola, krastavac na kockice.", "Iseci crveni luk na tanke kolutove i kratko isperi pod hladnom vodom.", "U činiji pomešaj tunjevinu, leblebije, povrće i seckani peršun.", "Začini limunovim sokom, kašičicom maslinovog ulja, soli i biberom. Lagano promešaj.", "Jedi odmah ili ohladi 10 minuta."] },
  "hf-3": { name: "Skrambl od belanaca sa povrćem",
    steps: ["Iseci pečurke i paradajz na pola. Iseckaj beli luk.", "Propržiti pečurke u tiganju bez lepljenja dok ne porumene. Dodaj paradajz i beli luk, kuvaj 1 minut.", "Dodaj spanać i pusti ga da uvene.", "Sipaj belanca i 2 cela jaja (umućena). Lagano izmešaj dok se ne stegnu.", "Tostiraj hleb i serviraj uz."] },
  "hf-4": { name: "Skyr piletina kari",
    steps: ["Skuvaj crveni pirinač prema uputstvu na pakovanju.", "Iseci pile na kockice. Začini ga sa kari začinima i soli.", "Propržiti seckani luk dok ne omekša. Dodaj iseckani beli luk i đumbir, kuvaj 1 min.", "Dodaj pile i propržiti. Umešaj paradajz pire i 100ml vode, krčkaj 8 minuta.", "Dodaj spanać. Skini sa vatre, umešaj skyr (ne kuvati - razdelilo bi se). Serviraj sa pirinčem."] },
  "hf-5": { name: "Tofu na brzaka sa edamame",
    steps: ["Skuvaj crveni pirinač. Iscedi tofu i iseci na kockice.", "Propržiti tofu u tiganju bez lepljenja sa malo ulja dok ne postane hrskav, oko 8 minuta.", "Dodaj papriku na kolutove i rendanu šargarepu. Mešaj 3 minuta.", "Dodaj smrznute edamame, iseckani beli luk i đumbir. Kuvaj još 2 minuta.", "Dodaj soja sos i ljute pahuljice. Serviraj sa pirinčem."] },
  "hf-6": { name: "Skyr činija sa piletinom",
    steps: ["Začini pile sa slatkom paprikom, belim lukom u prahu, soli i biberom. Peci 5 min sa svake strane. Iseci kad se ohladi.", "Iseci krastavac i paradajz na kockice. Iseci pola avokada.", "Sastavi činije: skyr kao baza, pile odozgo, povrće okolo.", "Iscedi limunov sok i pospi biberom. Gotovo."] },
  "hf-7": { name: "Bakalar sa kvinojom i šparglama",
    steps: ["Operi kvinoju i kuvaj u 1.5x količine vode, 15 minuta.", "Pari boraniju 5 minuta dok ne omekša.", "Osuši bakalar. Začini sa soli, biberom i iseckanim belim lukom.", "Propržiti bakalar 3-4 min sa svake strane u tiganju sa kašičicom ulja.", "Stavi kvinoju, odozgo bakalar i boraniju. Iscedi limun i pospi peršunom."] },
  "hf-8": { name: "Tortilje sa ćurećim mesom",
    steps: ["Razdvoji listove salate i operi. Osuši.", "Propržiti mleveno ćureće u vrelom tiganju, dobro razbij.", "Dodaj iseckani beli luk, đumbir, rendanu šargarepu i seckanu papriku. Kuvaj 4 minuta.", "Dodaj soja sos, sok od limete i prstohvat ljute paprike.", "Sipaj u listove salate i jedi rukama."] },
  "hf-9": { name: "Supa od sočiva sa piletinom",
    steps: ["Iseci crni luk i šargarepu. Iseckaj beli luk. Iseci pile na kockice.", "Propržiti luk i šargarepu u šerpi, 5 minuta.", "Dodaj pile i lagano propržiti. Dodaj beli luk, kim, slatku papriku i paradajz pire.", "Dodaj sočivo, izmrvljene kocke bujona i 800ml vode. Krčkaj 20 minuta.", "Dodaj spanać dok ne uvene. Začini i serviraj."] },
  "hf-10": { name: "Pileći ražnjići sa grčkim jogurtom",
    steps: ["Iseci pile na kockice. Pomešaj pola jogurta sa belim lukom, sokom od limuna, slatkom paprikom, kimom, soli — marinaj pile 15 min.", "Skuvaj bulgur u 1.5x količine vrele vode, 12 minuta.", "Probodi pile na štapiće sa komadima paprike i luka.", "Peci ražnjiće 4 min sa svake strane dok ne porumene.", "Serviraj sa bulgurom, jogurtom i limunom."] },
  "hf-11": { name: "Skyr pahuljice preko noći",
    steps: ["U dve tegle pomešaj 80g pahuljica, 250g skyra i 150ml posnog mleka.", "Promešaj, zaslade medom ili stevijom po želji.", "Pospi sa bobičastim voćem (smrznuto savršeno odgovara).", "Pokrij i ostavi u frižideru preko noći (najmanje 4 sata).", "Jedi hladno - savršeno za doručak ili posle treninga."] },
  "hf-12": { name: "Činija sa piletinom i kvinojom",
    steps: ["Skuvaj kvinoju 15 minuta. Pusti da se malo ohladi.", "Začini pile sa kimom, slatkom paprikom, soli. Peci 5 min sa svake strane, iseci.", "Iseci paradajz na pola, krastavac na kockice, avokado na kriške.", "Sastavi činije: kvinoja, pile, povrće, avokado.", "Iscedi limetu, pospi korijanderom. Opciono: skyr ili ljuti sos."] },
  "hf-13": { name: "Škampi sa tikvicama",
    steps: ["Skuvaj crveni pirinač.", "Spiraliziraj ili iseci tikvice na tanke trake.", "Zagrej tiglu bez lepljenja. Propržiti beli luk i đumbir 30 sekundi.", "Dodaj škampe i kuvaj 2 min dok ne porozove. Dodaj tikvice i mešaj još 2 min.", "Dodaj soja sos, sok od limete i ljute pahuljice. Serviraj sa pirinčem."] },
  "hf-14": { name: "Proteinske palačinke sa kvarkom",
    steps: ["Mešaj kvark, pahuljice, 4 jaja, mleko, prstohvat cimeta i kašičicu praška za pecivo.", "Zagrej tiglu bez lepljenja - bez ulja.", "Sipaj male palačinke (~10cm). Peci 2 min dok se ne pojave mehurići, okreni, peci još 1 min.", "Slaži i dodaj bobičasto voće, kap meda ili kvark.", "Pravi 8 palačinki - dovoljno za 2 osobe."] },
  "hf-15": { name: "Tempeh činija sa slatkim krompirom",
    steps: ["Iseci slatki krompir na kockice, pomešaj sa slatkom paprikom i kašičicom ulja. Peci na 220°C 25 min.", "Iseci tempeh i marinaj u soja sosu, belom luku u prahu i ljutim pahuljicama 5 min.", "Propržiti tempeh 3 min sa svake strane dok ne postane hrskav.", "Zagrej crni pasulj sa prstohvatom kima.", "Sastavi činije: spanać, krompir, pasulj, tempeh, avokado, limeta."] },
  "hf-16": { name: "Lagani ćureći čili",
    steps: ["Iseci luk i iseckaj beli luk. Propržiti mleveno ćureće u šerpi.", "Dodaj luk i beli luk, kuvaj 3 minuta.", "Dodaj paradajz pire, čili u prahu, kim, slatku papriku.", "Dodaj iseckani paradajz, ocejeni pasulj i 200ml vode. Krčkaj 15 min.", "Probaj i podesi začin. Serviraj samostalno ili sa malo pirinča."] },
  "hf-17": { name: "Kremasta testenina sa skyr-om",
    steps: ["Skuvaj testeninu u slanoj vodi al dente. Sačuvaj 1 šolju vode.", "Propržiti iseckani beli luk u suvom tiganju sa cherry paradajzom, 3 min.", "Iscedi testeninu, vrati u šerpu. Skini sa vatre. Umešaj skyr sa malo vode od testenine — bez vatre da se ne razdeli.", "Dodaj paradajz i spanać dok ne uvene.", "Pospi parmezanom i biberom."] },
  "hf-18": { name: "Losos teriyaki činija",
    steps: ["Skuvaj crveni pirinač.", "Pomešaj soja sos, đumbir, beli luk i kašičicu meda za glazuru.", "Propržiti losos koža dole 4 min, okreni, premaži glazurom, peci još 2 min.", "Skuvaj edamame 3 min. Rendaj šargarepu.", "Sastavi činije: pirinač, losos, edamame, šargarepa. Polij ostatak glazure i iscedi limetu."] },
  "hf-19": { name: "Pile sa brokolijem",
    steps: ["Skuvaj crveni pirinač.", "Iseci pile na kockice. Iseci brokoli na cvetove.", "Zagrej tiglu bez lepljenja. Propržiti pile sa belim lukom i đumbirom 6-7 min.", "Dodaj brokoli i 2 kašike vode. Pokrij i pari 3 minuta.", "Dodaj soja sos i ljute pahuljice. Promešaj i serviraj sa pirinčem."] },
  "hf-20": { name: "Mediteranska tortilja sa tunjevinom",
    steps: ["Iscedi tunjevinu i pomešaj sa grčkim jogurtom, sokom od limuna, soli, biberom i prstohvatom slatke paprike.", "Iseci krastavac i paradajz na pola. Iseckaj salatu.", "Zagrej tortilje u suvom tiganju ili mikrotalasnoj.", "Premaži tunjevinu po sredini, dodaj povrće.", "Zarolaj čvrsto i preseci na pola."] },
  "hf-21": { name: "Lagana junetina sa pirinčem",
    steps: ["Skuvaj crveni pirinač.", "Propržiti laganu junetinu u tiganju bez lepljenja, dobro razbij.", "Dodaj iseckani beli luk, đumbir, soja sos i kašičicu meda. Kuvaj 2 min.", "Dodaj spanać u meso. Rendaj šargarepu.", "Sastavi činije: pirinač, meso, šargarepa i meko kuvano ili prženo jaje."] },
  "hf-22": { name: "Grčka skyr činija sa piletinom",
    steps: ["Začini pile sa origanom, belim lukom u prahu, soli i biberom. Peci 5-6 min sa svake strane. Iseci.", "Pomešaj skyr sa rendanim krastavcem (iscediti vodu prvo), iseckanim belim lukom i limunom za caciki.", "Iseci paradajz na pola, krastavac na kockice, crveni luk na tanke kolutove.", "Sastavi činije: povrće, pile, izmrvljen feta odozgo.", "Stavi caciki, završi sa limunom i origanom."] },
  "hf-23": { name: "Kari od bele ribe",
    steps: ["Skuvaj crveni pirinač.", "Propržiti iseckani luk dok ne omekša. Dodaj beli luk, đumbir i kari začine.", "Umešaj paradajz pire i 200ml vode. Krčkaj 5 min.", "Iseci bakalar na kockice i dodaj u sos. Lagano krčkaj 6-8 min.", "Dodaj spanać. Serviraj sa pirinčem."] },
  "hf-24": { name: "Skrambl od belanaca i ćurećeg mesa",
    steps: ["Propržiti mleveno ćureće u tiganju bez lepljenja, razbij. Skloni.", "U istom tiganju propržiti papriku i pečurke 4 min.", "Dodaj beli luk i spanać, kuvaj dok ne uvene.", "Vrati ćureće u tiganj. Sipaj belanca i 2 umućena jaja.", "Lagano izmešaj dok se ne stegne. Začini."] },
  "hf-25": { name: "Paprikaš od leblebija sa spanaćem",
    steps: ["Iseci tofu na kockice i propržiti dok ne postane hrskav.", "U istom tiganju propržiti luk dok ne omekša. Dodaj beli luk, đumbir, kim, slatku papriku.", "Umešaj paradajz pire i izmrvljenu kocku bujona sa 300ml vode.", "Dodaj ocejene leblebije. Krčkaj 10 minuta da se zgusne.", "Umešaj tofu i spanać. Kuvaj dok spanać ne uvene. Začini i serviraj."] },
  "hf-26": { name: "Gnoci sa bešamel sosom i pečenim povrćem",
    steps: ["Kuvaj gnoci u slanoj vodi dok ne isplivaju, pa još 1-2 minuta. Dreniraj i ostavi sa strane.", "U međuvremenu, iseci šargarepu i tikvicu na male kockice. Propržiti u suvom tiganju na srednjoj-jakoj vatri dok se ne karamelizuju i omekšaju, 8-10 minuta. Začini sa solju, biberom, iseckani beli luk.", "Napraviš bešamel: otopi puter u manjoj šerpi, umešaj brašno da napraviš pastu (roux), kuvaj 1-2 minuta. Postepeno sipaj mleko mešajući bez prestanka da izbegneš grudvice. Krčkaj 5-6 minuta dok se ne zgusne i postane gladak.", "Skupi gnoci, povrće i bešamel u činiji. Lagano promešaj da se prekrije. Pospi parmezanom i biberom. Serviraj odmah."] },
  "hf-27": { name: "Banana hleb",
    steps: ["Zagrej rernu na 175°C. Gnječi 2 zrele banane u činiji dok ne postanu kremaste. Umešaj 2 jaja, 60g otopljenog putera, 80g šećera i kašičicu vanile.", "U drugoj činiji pomešaj 180g brašna, 1 kašičicu praška za pecivo, ½ kašičice sode bikarbone, prstohvat soli i cimet. Lagano umešaj suvo sa mokrim — mešaj samo dok ne nestane brašna. Premešavanje pravi hleb gumastim.", "Sipaj u obložen kalup. Peci 45-50 minuta dok čačkalica izađe čista iz sredine.", "Ostavi da se hladi 10 minuta u kalupu, zatim izvadi. Iseci na 8 kriški. Najbolje topao sa čajem ili kafom."] },
};

const fmt = (n) => `€${n.toFixed(2)}`;

// Robust print helper - works in sandboxed iframes where window.open() is blocked.
// Strategy: try window.open first, fall back to creating a hidden iframe in the same document.
const printHTML = (html) => {
  // Strategy 1: try popup window (works on most desktops)
  try {
    const win = window.open("", "_blank");
    if (win && win.document) {
      win.document.open();
      win.document.write(html);
      win.document.close();
      // Some browsers need a moment before print
      setTimeout(() => {
        try { win.focus(); win.print(); } catch (e) { console.warn("popup print failed", e); }
      }, 300);
      return;
    }
  } catch (e) {
    console.warn("window.open blocked, falling back to iframe", e);
  }

  // Strategy 2: hidden iframe in current document
  try {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    // Use srcdoc to get fully-formed document
    iframe.srcdoc = html;
    iframe.onload = () => {
      try {
        const w = iframe.contentWindow;
        if (w) {
          w.focus();
          w.print();
        }
      } catch (e) {
        console.error("iframe print failed", e);
        alert("Print failed. Try saving the page or using browser's File > Print.");
      }
      // Clean up after a delay (give print dialog time to read content)
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 60000);
    };
    return;
  } catch (e) {
    console.error("Both print methods failed", e);
    alert("Couldn't open print dialog. Please use your browser's print menu (Cmd/Ctrl+P).");
  }
};

const matchIngredient = (name) => {
  const lower = name.toLowerCase().trim();
  let m = INGREDIENT_DB.find((i) => i.name.toLowerCase() === lower);
  if (m) return m;
  m = INGREDIENT_DB.find((i) => lower.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(lower));
  if (m) return m;
  const words = lower.split(/[\s,]+/);
  for (const w of words) {
    if (w.length < 3) continue;
    m = INGREDIENT_DB.find((i) => i.name.toLowerCase().includes(w));
    if (m) return m;
  }
  return null;
};

const DEFAULT_PREFS = {
  diet: "any",
  proteins: { meat: true, fish: true, vegetarian: true, vegan: true },
  cuisines: { quick: true, "high-protein": true, lean: true, "no-cook": true },
  mealsPerWeek: 5,
  maxMinutes: 60,
};

// Package math
const getPackInfo = (unit) => {
  const u = (unit || "").toLowerCase().trim();
  if (u === "kg") return { packAmount: 0.5, packLabel: "500g pack", divisible: false };
  if (u === "liter" || u === "l") return { packAmount: 1, packLabel: "1L carton", divisible: false };
  if (u.includes("g") && u !== "kg") return { packAmount: 1, packLabel: u + " pack", divisible: true };
  if (u.includes("ml")) return { packAmount: 1, packLabel: u + " bottle", divisible: true };
  if (u === "each" || u === "stuk") return { packAmount: 1, packLabel: "each", divisible: false };
  if (u.includes("pcs")) return { packAmount: 1, packLabel: u + " pack", divisible: false };
  if (["bunch","bulb","head","whole","pot","can","bottle"].includes(u)) return { packAmount: 1, packLabel: u, divisible: false };
  if (["pinch","tsp","tbsp"].includes(u)) return { packAmount: 1, packLabel: u, divisible: true };
  return { packAmount: 1, packLabel: unit, divisible: false };
};

const calcPackages = (ingredient, scaledQty, adjustedPrice) => {
  const pack = getPackInfo(ingredient.unit);
  const needed = scaledQty;
  if (pack.divisible) {
    const packsToBuy = Math.ceil(needed);
    return { packsNeeded: packsToBuy, packLabel: pack.packLabel, proRatedCost: adjustedPrice(ingredient.price) * needed, fullPackCost: adjustedPrice(ingredient.price) * packsToBuy, isPartial: needed < 1, actualUsed: needed };
  } else {
    const packsToBuy = Math.max(1, Math.ceil(needed / pack.packAmount));
    return { packsNeeded: packsToBuy, packLabel: pack.packLabel, proRatedCost: adjustedPrice(ingredient.price) * needed, fullPackCost: adjustedPrice(ingredient.price) * pack.packAmount * packsToBuy, isPartial: false, actualUsed: needed };
  }
};

// Convert recipe quantity to a human-readable real-world amount
// e.g. 0.24 of a "500g" pack → "120g"
//      0.5 of "kg" → "500g"
//      1 of "each" → "1"
//      2 of "10 pcs" → "20 pcs"
const humanizeAmount = (quantity, unit, lang) => {
  const u = (unit || "").toLowerCase().trim();

  // kg/liter — multiply by 1000 to get grams/ml when small
  if (u === "kg") {
    const grams = quantity * 1000;
    if (grams >= 1000) return { amount: (grams/1000).toFixed(grams % 1000 === 0 ? 0 : 1), unit: "kg" };
    return { amount: Math.round(grams), unit: "g" };
  }
  if (u === "liter" || u === "l") {
    const ml = quantity * 1000;
    if (ml >= 1000) return { amount: (ml/1000).toFixed(ml % 1000 === 0 ? 0 : 1), unit: "L" };
    return { amount: Math.round(ml), unit: "ml" };
  }
  // Pack-based with explicit gram/ml count → multiply
  const gMatch = u.match(/^(\d+)\s*g$/);
  if (gMatch) {
    const g = parseInt(gMatch[1]) * quantity;
    if (g >= 1000) return { amount: (g/1000).toFixed(g % 1000 === 0 ? 0 : 1), unit: "kg" };
    return { amount: Math.round(g), unit: "g" };
  }
  const mlMatch = u.match(/^(\d+)\s*ml$/);
  if (mlMatch) {
    const ml = parseInt(mlMatch[1]) * quantity;
    if (ml >= 1000) return { amount: (ml/1000).toFixed(ml % 1000 === 0 ? 0 : 1), unit: "L" };
    return { amount: Math.round(ml), unit: "ml" };
  }
  // pcs — multiply by count
  const pcsMatch = u.match(/^(\d+)\s*pcs$/);
  if (pcsMatch) {
    const pcs = Math.round(parseInt(pcsMatch[1]) * quantity);
    return { amount: pcs, unit: lang === "sr" ? "kom" : "pcs" };
  }
  // Discrete items - just round
  if (["each", "stuk", "bunch", "bulb", "head", "whole", "pot", "can", "bottle"].includes(u)) {
    const n = quantity;
    let amount;
    if (n < 1) {
      // For fractions, show as fraction
      if (Math.abs(n - 0.5) < 0.05) amount = "1/2";
      else if (Math.abs(n - 0.25) < 0.05) amount = "1/4";
      else if (Math.abs(n - 0.75) < 0.05) amount = "3/4";
      else if (Math.abs(n - 0.33) < 0.05) amount = "1/3";
      else amount = n.toFixed(2).replace(/\.?0+$/, "");
    } else {
      amount = n % 1 === 0 ? n.toString() : n.toFixed(1).replace(/\.0$/, "");
    }
    return { amount, unit: tUnit(unit, lang) };
  }
  // tsp/tbsp/pinch
  if (["tsp", "tbsp", "pinch"].includes(u)) {
    const n = quantity;
    return { amount: n % 1 === 0 ? n.toString() : n.toFixed(1).replace(/\.0$/, ""), unit: tUnit(unit, lang) };
  }
  // Fallback
  return { amount: quantity.toFixed(2).replace(/\.?0+$/, ""), unit: tUnit(unit, lang) };
};

// Format a leftover for display - handles unit translation and proper spacing
const formatLeftover = (leftover, lang) => {
  if (!leftover) return "";
  const u = leftover.unit;
  // Translate common units to Serbian
  let unit = u;
  if (lang === "sr") {
    if (u === "each" || u === "stuk") unit = "kom";
    else if (u === "bulb") unit = "glavica";
    else if (u === "bunch") unit = "veza";
    else if (u === "pot") unit = "saksija";
    else if (u === "can") unit = "konzerva";
    else if (u === "bottle") unit = "flaša";
    else if (u === "head") unit = "glavica";
    else if (u === "whole") unit = "ceo";
    else if (u === "pcs") unit = "kom";
  }
  // Always add a space between number and unit
  return `${leftover.amount} ${unit}`;
};


const calcLeftover = (ingredient, scaledQty) => {
  const pack = getPackInfo(ingredient.unit);
  const u = (ingredient.unit || "").toLowerCase().trim();

  // For divisible items (gram packs, ml bottles, tsp), leftover = packs - used
  if (pack.divisible) {
    const packsToBuy = Math.ceil(scaledQty);
    const used = scaledQty;
    const leftoverFraction = packsToBuy - used;
    if (leftoverFraction <= 0.01) return null;
    // Convert leftover fraction to human-readable
    const leftover = humanizeAmount(leftoverFraction, ingredient.unit, "en");
    return leftover;
  }

  // For indivisible (kg, each, can) — round up packs
  if (u === "kg") {
    const gNeeded = scaledQty * 1000;
    const packG = 500;
    const packsToBuy = Math.max(1, Math.ceil(gNeeded / packG));
    const totalBought = packsToBuy * packG;
    const leftoverG = totalBought - gNeeded;
    if (leftoverG <= 5) return null;
    if (leftoverG >= 1000) return { amount: (leftoverG/1000).toFixed(1), unit: "kg" };
    return { amount: Math.round(leftoverG), unit: "g" };
  }
  if (u === "liter" || u === "l") {
    const mlNeeded = scaledQty * 1000;
    const packsToBuy = Math.max(1, Math.ceil(mlNeeded / 1000));
    const totalBought = packsToBuy * 1000;
    const leftoverMl = totalBought - mlNeeded;
    if (leftoverMl <= 10) return null;
    return { amount: Math.round(leftoverMl), unit: "ml" };
  }
  // each / can / pot etc - round up
  const packsToBuy = Math.max(1, Math.ceil(scaledQty));
  const leftoverUnits = packsToBuy - scaledQty;
  if (leftoverUnits <= 0.05) return null;
  const lo = humanizeAmount(leftoverUnits, ingredient.unit, "en");
  return lo;
};

// ============ MAIN APP ============
export default function MealPlannerApp() {
  const [store, setStore] = useState("ah");
  const [people, setPeople] = useState(2);
  const [lang, setLang] = useState("en");
  const [recipes, setRecipes] = useState([]);
  const [weekPlan, setWeekPlan] = useState({});
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showPrefsModal, setShowPrefsModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [activeView, setActiveView] = useState("plan");
  const [loading, setLoading] = useState(true);

  const t = T[lang]; // shorthand

  useEffect(() => {
    (async () => {
      try {
        const [r, p, s, pr] = await Promise.all([
          window.storage.get("recipes_v4").catch(() => null),
          window.storage.get("weekPlan_v4").catch(() => null),
          window.storage.get("settings_v4").catch(() => null),
          window.storage.get("prefs_v4").catch(() => null),
        ]);
        if (r) setRecipes(JSON.parse(r.value));
        if (p) setWeekPlan(JSON.parse(p.value));
        if (s) {
          const v = JSON.parse(s.value);
          if (v.store) setStore(v.store);
          if (v.people) setPeople(v.people);
          if (v.lang) setLang(v.lang);
        }
        if (pr) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(pr.value) });
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const persist = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch (e) { console.error(e); } };
  useEffect(() => { if (!loading) persist("recipes_v4", recipes); }, [recipes, loading]);
  useEffect(() => { if (!loading) persist("weekPlan_v4", weekPlan); }, [weekPlan, loading]);
  useEffect(() => { if (!loading) persist("settings_v4", { store, people, lang }); }, [store, people, lang, loading]);
  useEffect(() => { if (!loading) persist("prefs_v4", prefs); }, [prefs, loading]);

  // Localize a recipe (translate name, ingredients, steps for display)
  const tRecipe = (recipe) => {
    if (lang !== "sr" || !recipe) return recipe;
    const sr = recipe.sourceId ? RECIPE_SR[recipe.sourceId] : RECIPE_SR[recipe.id];
    return {
      ...recipe,
      name: sr?.name || recipe.name,
      steps: sr?.steps || recipe.steps,
      ingredients: recipe.ingredients.map(i => ({ ...i, displayName: tIng(i.name, lang), displayUnit: tUnit(i.unit, lang) })),
    };
  };

  const adjustedPrice = (basePrice) => basePrice * STORE_MULTIPLIERS[store].multiplier;

  const recipeStoreCost = (recipe) => {
    const recipePeople = recipe.people || 2;
    const scale = people / recipePeople;
    return recipe.ingredients.reduce((sum, it) => {
      const scaledQty = it.quantity * scale;
      const pack = calcPackages(it, scaledQty, adjustedPrice);
      return sum + (pack.isPartial ? pack.proRatedCost : pack.fullPackCost);
    }, 0);
  };

  const mealsPlanned = Object.values(weekPlan).filter(Boolean).length;

  const weekStoreCost = () =>
    Object.values(weekPlan).reduce((sum, recipeId) => {
      if (!recipeId) return sum;
      const r = recipes.find((x) => x.id === recipeId);
      return sum + (r ? recipeStoreCost(r) : 0);
    }, 0);

  const weekHFCost = () => {
    if (mealsPlanned === 0) return 0;
    return mealsPlanned * getHFPricePerPortion(people, mealsPlanned) * people + HF_SHIPPING;
  };

  const savings = weekHFCost() - weekStoreCost();
  const savingsPercent = weekHFCost() > 0 ? (savings / weekHFCost()) * 100 : 0;

  const addOrUpdateRecipe = (recipe) => {
    if (editingRecipe?.id) {
      setRecipes(recipes.map((r) => (r.id === recipe.id ? { ...r, ...recipe } : r)));
    } else {
      setRecipes([...recipes, { ...recipe, id: recipe.id || Date.now().toString() }]);
    }
    setEditingRecipe(null);
    setShowRecipeModal(false);
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter((r) => r.id !== id));
    const np = { ...weekPlan };
    Object.keys(np).forEach((d) => { if (np[d] === id) np[d] = null; });
    setWeekPlan(np);
  };

  const updateRecipeSteps = (id, steps) => {
    setRecipes(recipes.map(r => r.id === id ? { ...r, steps } : r));
    if (viewingRecipe?.id === id) setViewingRecipe({ ...viewingRecipe, steps });
  };

  const assignToDay = (day, recipeId) => setWeekPlan({ ...weekPlan, [day]: recipeId || null });

  const importFromLibrary = (lib) => {
    const existing = recipes.find((r) => r.sourceId === lib.id);
    if (existing) return existing.id;
    const nr = { ...lib, id: `lib-${lib.id}-${Date.now()}`, sourceId: lib.id };
    setRecipes((p) => [...p, nr]);
    return nr.id;
  };

  const randomizeWeek = () => {
    const dietFilter = (r) => {
      if (prefs.diet === "vegan") return r.tags.includes("vegan");
      if (prefs.diet === "vegetarian") return r.tags.includes("vegetarian") || r.tags.includes("vegan");
      if (prefs.diet === "pescatarian") return !r.tags.includes("meat");
      return true;
    };
    const proteinFilter = (r) => {
      if (prefs.diet !== "any") return true;
      return ["meat","fish","vegan","vegetarian"].some(p => r.tags.includes(p) && prefs.proteins[p]);
    };
    const minFilter = (r) => r.minutes <= prefs.maxMinutes;
    let candidates = HF_LIBRARY.filter(dietFilter).filter(proteinFilter).filter(minFilter);
    const userOnly = recipes.filter(r => !r.sourceId).map(r => ({ ...r, _user: true }));
    candidates = [...candidates, ...userOnly];
    if (candidates.length === 0) { alert("No recipes match your preferences."); return; }
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    const numMeals = Math.min(prefs.mealsPerWeek, 7, shuffled.length);
    const picked = shuffled.slice(0, numMeals);
    const chosenDays = [...DAYS].sort(() => Math.random() - 0.5).slice(0, numMeals).sort((a,b) => DAYS.indexOf(a) - DAYS.indexOf(b));
    const np = {}; DAYS.forEach(d => np[d] = null);
    const nr = [...recipes];
    picked.forEach((rec, idx) => {
      const day = chosenDays[idx];
      if (rec._user) np[day] = rec.id;
      else {
        const ex = nr.find(r => r.sourceId === rec.id);
        if (ex) np[day] = ex.id;
        else { const id = `lib-${rec.id}-${Date.now()}-${idx}`; nr.push({ ...rec, id, sourceId: rec.id }); np[day] = id; }
      }
    });
    setRecipes(nr); setWeekPlan(np); setActiveView("plan");
  };

  const shoppingList = () => {
    const map = {};
    Object.values(weekPlan).forEach((rid) => {
      if (!rid) return;
      const r = recipes.find((x) => x.id === rid);
      if (!r) return;
      const scale = people / (r.people || 2);
      r.ingredients.forEach((it) => {
        const key = `${it.name}|${it.unit}`;
        if (!map[key]) map[key] = { name: it.name, unit: it.unit, quantity: 0, price: it.price };
        map[key].quantity += it.quantity * scale;
      });
    });
    return Object.values(map);
  };

  // Weekly leftovers = packs you'd buy minus what recipes use, across all recipes
  // Returns list of leftovers in human-readable form
  const weeklyLeftovers = () => {
    // Helper: safely parse "1/2" or "0.5" or 0.5 to a number
    const toNumber = (val) => {
      if (typeof val === "number") return val;
      if (typeof val !== "string") return 0;
      if (val.includes("/")) {
        const [a, b] = val.split("/").map(s => parseFloat(s.trim()));
        if (b && !isNaN(a) && !isNaN(b)) return a / b;
        return 0;
      }
      const n = parseFloat(val);
      return isNaN(n) ? 0 : n;
    };

    const list = shoppingList();
    const leftovers = [];
    list.forEach((item) => {
      const u = (item.unit || "").toLowerCase().trim();
      // Skip pantry staples (oil, spices, salt)
      const pantryStaples = ["pinch", "tsp", "tbsp"];
      if (pantryStaples.includes(u)) return;
      // Skip tiny garlic/herb leftovers - they ruin the list
      if (["bulb", "bunch", "pot"].includes(u)) {
        const lo = calcLeftover(item, item.quantity);
        if (!lo) return;
        if (toNumber(lo.amount) < 0.5) return;
        leftovers.push({ name: item.name, ...lo });
        return;
      }

      const lo = calcLeftover(item, item.quantity);
      if (!lo) return;

      // Filter out tiny/insignificant leftovers
      if (lo.unit === "g" && lo.amount < 30) return;
      if (lo.unit === "kg" && parseFloat(lo.amount) < 0.05) return;
      if (lo.unit === "ml" && lo.amount < 50) return;
      if (lo.unit === "L" && parseFloat(lo.amount) < 0.1) return;
      // For pieces (each, kom): skip if less than 1/2
      if (["each", "kom", "stuk"].includes((lo.unit || "").toLowerCase())) {
        if (toNumber(lo.amount) < 0.5) return;
      }

      leftovers.push({ name: item.name, ...lo });
    });
    return leftovers;
  };

  const handleScanned = (s) => { setEditingRecipe(s); setShowScanModal(false); setShowRecipeModal(true); };

  if (loading) return (<div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}><Loader2 className="animate-spin" style={{ color: C.blue }} size={32} /></div>);

  return (
    <div className="min-h-screen pb-20" style={{ background: C.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        .ios-card { background: ${C.card}; border-radius: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .ios-btn { transition: opacity 0.15s ease; }
        .ios-btn:active { opacity: 0.5; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .slide-up { animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-in { animation: fadeIn 0.2s ease; }
      `}</style>

      {/* Top Bar */}
      <header className="sticky top-0 z-40" style={{ background: "rgba(242,242,247,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `0.5px solid ${C.separator}` }}>
        <div className="max-w-3xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: C.textTertiary }}>
              {activeView === "plan" ? t.thisWeek : activeView === "recipes" ? t.recipesShort : t.compareShort}
            </div>
            <h1 className="text-2xl font-bold mt-0.5">
              {activeView === "plan" ? t.weekPlan : activeView === "recipes" ? t.recipes : t.compare}
            </h1>
          </div>
          <button onClick={() => setShowPrefsModal(true)} className="ios-btn p-2 rounded-full" style={{ background: C.card }}>
            <Settings size={20} style={{ color: C.blue }} strokeWidth={2} />
          </button>
        </div>

        {/* Settings strip */}
        <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <Chip label={STORE_MULTIPLIERS[store].name} onClick={() => {
            const keys = Object.keys(STORE_MULTIPLIERS);
            const ix = keys.indexOf(store);
            setStore(keys[(ix + 1) % keys.length]);
          }} />
          <Chip label={`${people} ${people === 1 ? t.person : t.peopleW}`} onClick={() => setPeople(people === 6 ? 1 : people + 1)} />
          <Chip label={`${prefs.mealsPerWeek} ${t.mealsPerWeek}`} onClick={() => setPrefs({ ...prefs, mealsPerWeek: prefs.mealsPerWeek === 7 ? 3 : prefs.mealsPerWeek + 1 })} />
          <Chip label={lang === "en" ? "🇬🇧 EN" : "🇷🇸 SR"} onClick={() => setLang(lang === "en" ? "sr" : "en")} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4">
        {activeView === "plan" && <PlanView weekPlan={weekPlan} recipes={recipes} assignToDay={assignToDay} recipeStoreCost={recipeStoreCost} people={people} store={store} onRandomize={randomizeWeek} onView={setViewingRecipe} weekStoreCost={weekStoreCost()} weekHFCost={weekHFCost()} mealsPlanned={mealsPlanned} t={t} lang={lang} tRecipe={tRecipe} adjustedPrice={adjustedPrice} leftovers={weeklyLeftovers()} onAddBonusRecipe={(r) => { const newRecipe = { ...r, id: `bonus-${Date.now()}` }; setRecipes([...recipes, newRecipe]); setViewingRecipe(newRecipe); }} />}
        {activeView === "recipes" && <RecipesView recipes={recipes} recipeStoreCost={recipeStoreCost} onAdd={() => { setEditingRecipe(null); setShowRecipeModal(true); }} onScan={() => setShowScanModal(true)} onLibrary={() => setShowLibraryModal(true)} onView={setViewingRecipe} onDelete={deleteRecipe} onImport={importFromLibrary} adjustedPrice={adjustedPrice} people={people} t={t} lang={lang} tRecipe={tRecipe} />}
        {activeView === "compare" && <CompareView weekStoreCost={weekStoreCost()} weekHFCost={weekHFCost()} savings={savings} savingsPercent={savingsPercent} shoppingList={shoppingList()} adjustedPrice={adjustedPrice} store={store} people={people} mealsPlanned={mealsPlanned} t={t} lang={lang} weekPlan={weekPlan} recipes={recipes} tRecipe={tRecipe} recipeStoreCost={recipeStoreCost} />}
      </main>

      {/* iOS-style bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: `0.5px solid ${C.separator}` }}>
        <div className="max-w-3xl mx-auto px-4 py-2 flex justify-around">
          {[
            { id: "plan", label: t.week, Icon: Calendar },
            { id: "recipes", label: t.recipesShort, Icon: ChefHat },
            { id: "compare", label: t.compareShort, Icon: TrendingDown },
          ].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveView(id)} className="ios-btn flex flex-col items-center gap-0.5 px-6 py-1">
              <Icon size={24} strokeWidth={activeView === id ? 2.4 : 1.8} style={{ color: activeView === id ? C.blue : C.textTertiary }} />
              <span className="text-[10px] font-medium" style={{ color: activeView === id ? C.blue : C.textTertiary }}>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {showRecipeModal && <RecipeModal recipe={editingRecipe} onSave={addOrUpdateRecipe} onClose={() => { setShowRecipeModal(false); setEditingRecipe(null); }} adjustedPrice={adjustedPrice} people={people} t={t} lang={lang} />}
      {showScanModal && <ScanModal onClose={() => setShowScanModal(false)} onScanned={handleScanned} people={people} t={t} />}
      {showLibraryModal && <LibraryModal onClose={() => setShowLibraryModal(false)} recipes={recipes} onImport={importFromLibrary} adjustedPrice={adjustedPrice} people={people} t={t} lang={lang} tRecipe={tRecipe} />}
      {showPrefsModal && <PrefsModal prefs={prefs} setPrefs={setPrefs} store={store} setStore={setStore} people={people} setPeople={setPeople} lang={lang} setLang={setLang} onClose={() => setShowPrefsModal(false)} t={t} />}
      {viewingRecipe && <RecipeDetailModal recipe={tRecipe(viewingRecipe)} onClose={() => setViewingRecipe(null)} onEdit={(r) => { setViewingRecipe(null); setEditingRecipe(viewingRecipe); setShowRecipeModal(true); }} onUpdateSteps={updateRecipeSteps} adjustedPrice={adjustedPrice} people={people} store={store} t={t} lang={lang} />}
    </div>
  );
}

function Chip({ label, onClick, active }) {
  return (
    <button onClick={onClick} className="ios-btn flex-shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap"
      style={{ background: active ? C.blue : C.card, color: active ? "#fff" : C.text }}>
      {label}
    </button>
  );
}

function NutritionStat({ value, label, color, highlight }) {
  return (
    <div className="text-center py-2 rounded-xl" style={{ background: highlight ? C.greenSoft : C.bg }}>
      <div className="text-xl font-bold tabular-nums" style={{ color: highlight ? C.green : color }}>{value}</div>
      <div className="text-[10px] font-medium uppercase tracking-wider mt-0.5" style={{ color: C.textTertiary }}>{label}</div>
    </div>
  );
}

// ============ PLAN VIEW ============
function PlanView({ weekPlan, recipes, assignToDay, recipeStoreCost, people, store, onRandomize, onView, weekStoreCost, weekHFCost, mealsPlanned, t, lang, tRecipe, adjustedPrice, leftovers, onAddBonusRecipe }) {
  const [picker, setPicker] = useState(null); // day for which picker is open
  const total = weekStoreCost;
  const diff = weekHFCost - weekStoreCost;
  const isCheaper = diff > 0;
  const DAYS_FULL = lang === "sr" ? DAYS_FULL_SR : DAYS_FULL_EN;

  // Build per-recipe shopping breakdown for print
  const buildRecipeBreakdown = () => {
    const result = [];
    DAYS.forEach((day) => {
      const rid = weekPlan[day];
      if (!rid) return;
      const r = recipes.find(x => x.id === rid);
      if (!r) return;
      const scale = people / (r.people || 2);
      const items = r.ingredients.map((it) => {
        const scaledQty = it.quantity * scale;
        const pack = calcPackages(it, scaledQty, adjustedPrice);
        return {
          ...it,
          scaledQuantity: scaledQty,
          ...pack,
          cost: pack.isPartial ? pack.proRatedCost : pack.fullPackCost,
        };
      });
      result.push({ day, recipe: r, items, total: recipeStoreCost(r) });
    });
    return result;
  };

  const handlePrintWeek = () => {
    const breakdown = buildRecipeBreakdown();
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${t.weeklyShopping}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 720px; margin: 24px auto; padding: 0 24px; color: #1c1c1e; line-height: 1.5; }
  h1 { font-size: 26px; margin: 0 0 4px; font-weight: 800; letter-spacing: -0.02em; }
  .subtitle { color: #6e6e73; font-size: 13px; margin-bottom: 24px; }
  .recipe-block { margin-bottom: 24px; padding: 16px; border: 1px solid #e5e5ea; border-radius: 8px; page-break-inside: avoid; }
  .recipe-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .day-label { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #007AFF; background: #E8F0FE; padding: 2px 8px; border-radius: 10px; margin-right: 8px; vertical-align: middle; }
  .recipe-meta { font-size: 12px; color: #6e6e73; margin-bottom: 12px; }
  .recipe-meta .protein { color: #34C759; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 0; border-bottom: 1px solid #f2f2f7; font-size: 13px; }
  td.qty { width: 90px; font-weight: 700; color: #007AFF; }
  td.cost { text-align: right; width: 70px; font-weight: 600; }
  .total-row td { border-top: 2px solid #1c1c1e; border-bottom: none; padding-top: 8px; font-weight: 700; font-size: 14px; }
  .grand { margin-top: 32px; padding: 16px; background: #1c1c1e; color: #fff; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 700; }
  .footer { margin-top: 24px; font-size: 11px; color: #aeaeb2; text-align: center; }
  @media print { body { margin: 0; } .recipe-block { break-inside: avoid; } }
</style></head><body>
  <h1>${t.weeklyShopping}</h1>
  <div class="subtitle">${STORE_MULTIPLIERS[store].name} · ${people} ${people === 1 ? t.person : t.peopleW} · ${breakdown.length} ${t.meals}</div>
  ${breakdown.map(({ day, recipe, items, total: rtotal }) => {
    const lr = tRecipe(recipe);
    return `
    <div class="recipe-block">
      <div class="recipe-title">
        <span class="day-label">${DAYS_FULL[day]}</span>
        <span>${recipe.emoji || ""}</span>
        <span>${lr.name}</span>
      </div>
      <div class="recipe-meta">${recipe.minutes ? recipe.minutes + ' ' + t.min : ''}${recipe.nutrition ? ' · <span class="protein">' + recipe.nutrition.protein + 'g ' + t.protein + '</span> · ' + recipe.nutrition.kcal + ' ' + t.kcal : ''}</div>
      <table>
        ${items.map(it => `
          <tr>
            <td class="qty">${it.packsNeeded}× ${it.packLabel}</td>
            <td>${tIng(it.name, lang)}</td>
            <td class="cost">${fmt(it.cost)}</td>
          </tr>`).join('')}
        <tr class="total-row">
          <td colspan="2">${t.total}</td>
          <td class="cost">${fmt(rtotal)}</td>
        </tr>
      </table>
    </div>`;
  }).join('')}
  <div class="grand">
    <span>${t.grandTotal}</span>
    <span>${fmt(total)}</span>
  </div>
  <div class="footer">${t.printDateLabel}: ${new Date().toLocaleDateString(lang === "sr" ? "sr-RS" : "en-US")} · ${t.aboutText}</div>
</body></html>`;
    printHTML(html);
  };

  // Weekly nutrition totals
  const weekNutrition = Object.values(weekPlan).reduce((acc, rid) => {
    if (!rid) return acc;
    const r = recipes.find(x => x.id === rid);
    if (!r || !r.nutrition) return acc;
    const scale = people / (r.people || 2);
    acc.kcal += r.nutrition.kcal * people;
    acc.protein += r.nutrition.protein * people;
    acc.carbs += r.nutrition.carbs * people;
    acc.fat += r.nutrition.fat * people;
    return acc;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="space-y-4">
      {/* Hero stats */}
      {mealsPlanned > 0 && (
        <div className="ios-card p-5">
          <div className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: C.textTertiary }}>
            {t.weekTotalAt} {STORE_MULTIPLIERS[store].name}
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="text-4xl font-bold tracking-tight">{fmt(total)}</div>
            {weekHFCost > 0 && (
              <div className="px-2.5 py-1 rounded-full text-xs font-semibold mb-1.5"
                style={{ background: isCheaper ? C.greenSoft : C.orangeSoft, color: isCheaper ? C.green : C.orange }}>
                {isCheaper ? "−" : "+"}{fmt(Math.abs(diff))} vs HelloFresh
              </div>
            )}
          </div>
          <div className="text-sm mt-1" style={{ color: C.textSecondary }}>
            {mealsPlanned} {t.mealsPlanned}
          </div>

          {/* Weekly nutrition summary */}
          {weekNutrition.protein > 0 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: C.separator }}>
              <div className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: C.textTertiary }}>
                {t.nutritionWeek} ({mealsPlanned * people} {t.portions})
              </div>
              <div className="grid grid-cols-4 gap-2">
                <NutritionStat value={Math.round(weekNutrition.kcal)} label={t.kcal} color={C.text} />
                <NutritionStat value={Math.round(weekNutrition.protein) + "g"} label={t.protein} color={C.green} highlight />
                <NutritionStat value={Math.round(weekNutrition.carbs) + "g"} label={t.carbs} color={C.text} />
                <NutritionStat value={Math.round(weekNutrition.fat) + "g"} label={t.fat} color={C.text} />
              </div>
              <div className="text-[11px] mt-2 text-center" style={{ color: C.textTertiary }}>
                ≈ {Math.round(weekNutrition.kcal / mealsPlanned / people)} {t.kcal} · {Math.round(weekNutrition.protein / mealsPlanned / people)}g {t.protein} {t.perPortion}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Randomize + Print row */}
      <div className="flex gap-2">
        <button onClick={onRandomize} className="ios-btn flex-1 p-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white"
          style={{ background: C.blue }}>
          <Shuffle size={18} strokeWidth={2.4} />
          {t.randomizeWeek}
        </button>
        {mealsPlanned > 0 && (
          <button onClick={handlePrintWeek} className="ios-btn flex-shrink-0 px-4 rounded-2xl flex items-center justify-center gap-2 font-semibold"
            style={{ background: C.card, color: C.blue, border: `1px solid ${C.separator}` }} title={t.printList}>
            <Printer size={18} strokeWidth={2.2} />
          </button>
        )}
      </div>

      {/* Day list */}
      <div className="ios-card overflow-hidden">
        {DAYS.map((day, idx) => {
          const recipeId = weekPlan[day];
          const recipe = recipes.find((r) => r.id === recipeId);
          const isLast = idx === DAYS.length - 1;
          return (
            <div key={day}>
              <div onClick={() => recipe ? onView(recipe) : setPicker(day)}
                className="ios-btn flex items-center gap-3 px-4 py-3.5 cursor-pointer">
                <div className="w-12 flex-shrink-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textTertiary }}>{day}</div>
                  <div className="text-xs" style={{ color: C.textSecondary }}>{DAYS_FULL[day].slice(0,3)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  {recipe ? (
                    <>
                      <div className="font-semibold truncate flex items-center gap-2">
                        {recipe.emoji && <span>{recipe.emoji}</span>}
                        {tRecipe(recipe).name}
                      </div>
                      <div className="text-xs mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: C.textSecondary }}>
                        {recipe.minutes && <span className="flex items-center gap-1"><Clock size={11} />{recipe.minutes}m</span>}
                        {recipe.nutrition && (<>
                          <span>·</span>
                          <span className="font-bold" style={{ color: C.green }}>{recipe.nutrition.protein}g</span>
                          <span>·</span>
                          <span>{recipe.nutrition.kcal}kcal</span>
                        </>)}
                        <span>·</span>
                        <span>{fmt(recipeStoreCost(recipe))}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm" style={{ color: C.textTertiary }}>{t.tapToAdd}</div>
                  )}
                </div>
                {recipe ? (
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); assignToDay(day, null); }}
                      className="ios-btn p-2 rounded-full" style={{ background: C.bg }}>
                      <X size={14} style={{ color: C.textSecondary }} />
                    </button>
                    <ChevronRight size={18} style={{ color: C.textTertiary }} />
                  </div>
                ) : (
                  <Plus size={18} style={{ color: C.blue }} />
                )}
              </div>
              {!isLast && <div className="h-px ml-[72px]" style={{ background: C.separator }} />}
            </div>
          );
        })}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-8 px-4">
          <p className="text-sm" style={{ color: C.textSecondary }}>
            No recipes yet — try Randomize to fill your week from the library.
          </p>
        </div>
      )}

      {/* Leftovers + AI bonus recipe section */}
      {mealsPlanned > 0 && leftovers && leftovers.length > 0 && (
        <LeftoversSection leftovers={leftovers} t={t} lang={lang} people={people} onAddBonusRecipe={onAddBonusRecipe} onView={onView} />
      )}

      {picker && (
        <DayPickerSheet day={picker} recipes={recipes} onPick={(id) => { assignToDay(picker, id); setPicker(null); }} onClose={() => setPicker(null)} recipeStoreCost={recipeStoreCost} t={t} lang={lang} tRecipe={tRecipe} />
      )}
    </div>
  );
}

function LeftoversSection({ leftovers, t, lang, people, onAddBonusRecipe, onView }) {
  const [generating, setGenerating] = useState(false);
  const [bonusRecipe, setBonusRecipe] = useState(null);
  const [error, setError] = useState("");

  // Bonus recipe templates - each one specifies which leftover ingredients it can flexibly use
  // The matcher picks the template that covers the most leftovers
  const BONUS_TEMPLATES = [
    {
      id: "omelet",
      name_en: "Power omelet", name_sr: "Proteinski omlet",
      emoji: "🍳", minutes: 12,
      requires: ["Eggs"], // must have at least one of these
      uses: ["Eggs", "Egg whites (carton)", "Spinach", "Cherry tomatoes", "Mushrooms", "Bell pepper", "Onion", "Red onion", "Garlic", "Aged cheese", "Grated cheese", "Feta", "Parmesan", "Bacon strips", "Lean turkey mince"],
      nutrition: { kcal: 380, protein: 35, carbs: 8, fat: 22 },
      steps_en: [
        "Whisk 3 whole eggs (and any egg whites) with salt and pepper.",
        "Sauté any vegetables you have — onion, mushrooms, peppers, spinach — in a non-stick pan with a little oil for 3-4 minutes.",
        "Pour in the egg mixture, swirl pan to coat. Add any cheese on top.",
        "Cook 2-3 minutes until just set, fold in half. Serve immediately."
      ],
      steps_sr: [
        "Umuti 3 cela jaja (plus belanca ako imaš) sa solju i biberom.",
        "Propržiti povrće koje imaš — luk, pečurke, papriku, spanać — u tiganju bez lepljenja sa malo ulja, 3-4 min.",
        "Sipaj jaja, promešaj da prekrije dno tiganja. Dodaj sir na vrh.",
        "Kuvaj 2-3 minuta dok se ne stegne, presavij na pola i serviraj."
      ]
    },
    {
      id: "stir-fry",
      name_en: "Leftover stir-fry", name_sr: "Šara na brzaka",
      emoji: "🥢", minutes: 18,
      requires: ["Chicken breast", "Chicken thigh fillet", "Tofu", "Tempeh", "Lean turkey mince", "Lean beef mince 5%", "Beef mince", "Shrimp"], // any one
      uses: ["Chicken breast", "Chicken thigh fillet", "Tofu", "Tempeh", "Beef mince", "Lean turkey mince", "Lean beef mince 5%", "Shrimp", "Bell pepper", "Broccoli", "Carrots", "Spinach", "Mushrooms", "Garlic", "Ginger", "Soy sauce", "Cherry tomatoes", "Green beans", "Edamame (frozen)", "Brown rice", "Rice", "Quinoa"],
      nutrition: { kcal: 480, protein: 45, carbs: 40, fat: 12 },
      steps_en: [
        "Cube your protein (chicken/tofu/turkey). Cut vegetables into bite-size pieces.",
        "Heat a teaspoon of oil in a wok or large pan. Stir-fry protein until cooked, 5-6 min. Set aside.",
        "Add hard vegetables first (carrots, broccoli, peppers), stir-fry 3 min. Add softer ones (spinach, mushrooms), 2 more min.",
        "Return protein. Add soy sauce, minced garlic and ginger. Toss for 1 minute.",
        "Serve over rice/quinoa if you have any."
      ],
      steps_sr: [
        "Iseci protein na kockice (pile/tofu/ćuretina). Iseci povrće na zalogaj-veličine.",
        "Zagrej kašičicu ulja u tiganju. Propržiti protein dok se ne ispeče, 5-6 min. Skloni.",
        "Dodaj tvrđe povrće prvo (šargarepa, brokoli, paprika), 3 min. Onda meke (spanać, pečurke), još 2 min.",
        "Vrati protein. Dodaj soja sos, iseckani beli luk i đumbir. Promešaj 1 minut.",
        "Serviraj sa pirinčem/kvinojom ako imaš."
      ]
    },
    {
      id: "salad",
      name_en: "Power protein salad", name_sr: "Proteinska salata",
      emoji: "🥗", minutes: 10,
      requires: ["Tuna in water (can)", "Chicken breast", "Eggs", "Chickpeas", "Black beans", "Kidney beans", "Tofu", "Feta"],
      uses: ["Tuna in water (can)", "Chicken breast", "Eggs", "Chickpeas", "Black beans", "Kidney beans", "Tofu", "Feta", "Cherry tomatoes", "Tomatoes", "Cucumber", "Lettuce (head)", "Spinach", "Arugula", "Red onion", "Avocado", "Lemon", "Olive oil", "Fresh parsley", "Fresh basil"],
      nutrition: { kcal: 420, protein: 38, carbs: 25, fat: 18 },
      steps_en: [
        "Drain any canned protein (tuna, beans, chickpeas) and place in a large bowl.",
        "Chop vegetables: tomatoes, cucumber, lettuce, onion. Add to bowl.",
        "Cube any cooked protein you have (chicken, tofu, hard-boiled eggs).",
        "Dress with olive oil, lemon juice, salt, pepper. Toss gently.",
        "Top with crumbled feta or avocado if you have. Serve."
      ],
      steps_sr: [
        "Iscedi konzervirani protein (tunjevina, pasulj, leblebije) i stavi u veliku činiju.",
        "Iseckaj povrće: paradajz, krastavac, salatu, luk. Dodaj u činiju.",
        "Iseci protein koji imaš (pile, tofu, kuvana jaja) na kockice.",
        "Začini maslinovim uljem, sokom od limuna, soli, biberom. Lagano promešaj.",
        "Dodaj izmrvljeni feta ili avokado na vrh ako imaš. Serviraj."
      ]
    },
    {
      id: "soup",
      name_en: "Hearty leftover soup", name_sr: "Brza supa od ostataka",
      emoji: "🍲", minutes: 25,
      requires: ["Stock cube", "Chicken breast", "Lean turkey mince", "Red lentils", "Chickpeas", "Black beans"],
      uses: ["Chicken breast", "Lean turkey mince", "Red lentils", "Chickpeas", "Black beans", "Carrots", "Onion", "Garlic", "Spinach", "Tomatoes", "Tomato paste", "Bell pepper", "Mushrooms", "Stock cube", "Fresh parsley", "Ginger"],
      nutrition: { kcal: 400, protein: 40, carbs: 35, fat: 8 },
      steps_en: [
        "Dice onion, carrots, and any other firm vegetables. Mince garlic.",
        "Sauté in a soup pot with a teaspoon of oil for 5 minutes.",
        "Add cubed protein (chicken/turkey/lentils/beans) and brown lightly.",
        "Pour in 800ml water with crumbled stock cube. Add tomato paste if you have. Simmer 15 minutes.",
        "Add leafy greens (spinach) at the end. Season and serve hot."
      ],
      steps_sr: [
        "Iseci luk, šargarepu i drugo tvrđe povrće. Iseckaj beli luk.",
        "Propržiti u šerpi sa kašičicom ulja, 5 minuta.",
        "Dodaj protein (pile/ćureće/sočivo/pasulj) i lagano propržiti.",
        "Sipaj 800ml vode sa kockom bujona. Dodaj paradajz pire ako imaš. Krčkaj 15 min.",
        "Dodaj zelenje (spanać) na kraju. Začini i serviraj vruće."
      ]
    },
    {
      id: "wrap",
      name_en: "Protein wrap", name_sr: "Proteinski rolat",
      emoji: "🌯", minutes: 8,
      requires: ["Wraps", "Whole wheat wraps"],
      uses: ["Wraps", "Whole wheat wraps", "Tuna in water (can)", "Chicken breast", "Eggs", "Greek yogurt", "Skyr (0% fat)", "Hummus", "Cherry tomatoes", "Cucumber", "Lettuce (head)", "Spinach", "Arugula", "Red onion", "Bell pepper", "Avocado", "Feta"],
      nutrition: { kcal: 380, protein: 35, carbs: 35, fat: 11 },
      steps_en: [
        "Mix protein (tuna/chicken/eggs) with Greek yogurt or skyr, lemon, salt and pepper.",
        "Slice vegetables: cucumber, tomatoes, peppers, onion. Shred lettuce or spinach.",
        "Warm wrap briefly in a dry pan or microwave 15 seconds.",
        "Spread protein mixture down center, layer vegetables.",
        "Roll tightly and slice in half."
      ],
      steps_sr: [
        "Pomešaj protein (tunjevina/pile/jaja) sa grčkim jogurtom ili skyr-om, limunom, soli i biberom.",
        "Iseckaj povrće: krastavac, paradajz, papriku, luk. Iseckaj salatu ili spanać.",
        "Zagrej tortilju u suvom tiganju ili mikrotalasnoj 15 sekundi.",
        "Premaži protein po sredini, slaži povrće.",
        "Zarolaj čvrsto i preseci na pola."
      ]
    },
    {
      id: "bowl",
      name_en: "Power grain bowl", name_sr: "Proteinska činija",
      emoji: "🍱", minutes: 15,
      requires: ["Brown rice", "Quinoa", "Rice", "Couscous", "Bulgur"],
      uses: ["Brown rice", "Quinoa", "Rice", "Couscous", "Bulgur", "Chicken breast", "Tuna in water (can)", "Tofu", "Tempeh", "Eggs", "Chickpeas", "Black beans", "Edamame (frozen)", "Cherry tomatoes", "Cucumber", "Spinach", "Avocado", "Bell pepper", "Carrots", "Lemon", "Soy sauce", "Olive oil", "Fresh parsley"],
      nutrition: { kcal: 510, protein: 42, carbs: 55, fat: 13 },
      steps_en: [
        "Cook grain (rice/quinoa/couscous) according to package — usually 12-15 minutes.",
        "Prep protein: cube chicken/tofu and pan-sear, OR drain canned protein, OR boil eggs.",
        "Slice vegetables: cucumber, tomatoes, avocado. Quickly steam or sauté any greens.",
        "Build bowl: grain at base, protein on top, veggies arranged around.",
        "Drizzle with olive oil + lemon, or soy sauce. Sprinkle herbs."
      ],
      steps_sr: [
        "Skuvaj žitaricu (pirinač/kvinoja/kus-kus) prema uputstvu — obično 12-15 min.",
        "Pripremi protein: iseci pile/tofu na kockice i propržiti, ILI iscedi konzerve, ILI skuvaj jaja.",
        "Iseckaj povrće: krastavac, paradajz, avokado. Brzo prepari zelenje.",
        "Sastavi činiju: žitarica na dnu, protein gore, povrće okolo.",
        "Polij maslinovim uljem i limunom, ili soja sosom. Pospi začinima."
      ]
    },
    {
      id: "skyr-bowl",
      name_en: "High-protein yogurt bowl", name_sr: "Proteinska jogurt činija",
      emoji: "🥣", minutes: 5,
      requires: ["Skyr (0% fat)", "Greek yogurt", "Quark (low-fat)"],
      uses: ["Skyr (0% fat)", "Greek yogurt", "Quark (low-fat)", "Oats", "Eggs"],
      nutrition: { kcal: 360, protein: 38, carbs: 40, fat: 5 },
      steps_en: [
        "Spoon 250g of skyr/Greek yogurt/quark into a bowl.",
        "Top with 30g rolled oats for crunch.",
        "Add berries (frozen are great), a drizzle of honey or stevia.",
        "Sprinkle cinnamon. Eat cold — perfect post-workout meal."
      ],
      steps_sr: [
        "Sipaj 250g skyr/grčkog jogurta/kvarka u činiju.",
        "Dodaj 30g ovsenih pahuljica za hrskavost.",
        "Dodaj bobičasto voće (smrznuto savršeno odgovara), kap meda ili stevije.",
        "Pospi cimetom. Jedi hladno — savršen obrok posle treninga."
      ]
    }
  ];

  // Score templates by how many leftovers they cover
  const scoreTemplate = (template, leftoverNames) => {
    // Must have at least one required ingredient
    const hasRequired = template.requires.some(req => leftoverNames.includes(req));
    if (!hasRequired) return -1;
    // Count overlap with template.uses
    let score = 0;
    leftoverNames.forEach(name => {
      if (template.uses.includes(name)) score++;
    });
    return score;
  };

  const generateBonusRecipe = () => {
    setGenerating(true); setError(""); setBonusRecipe(null);

    setTimeout(() => {
      try {
        if (!leftovers || leftovers.length === 0) {
          throw new Error(lang === "sr" ? "Nema ostataka." : "No leftovers.");
        }

        const leftoverNames = leftovers.map(l => l.name);

        // Score all templates and pick the best (with some randomness for variety)
        const scored = BONUS_TEMPLATES
          .map(tpl => ({ tpl, score: scoreTemplate(tpl, leftoverNames) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score);

        if (scored.length === 0) {
          throw new Error(lang === "sr"
            ? "Tvoji ostaci nisu pogodni za bonus recept. Pokušaj sa više različitih namirnica."
            : "Your leftovers aren't suitable. Try with more variety.");
        }

        // Pick from top 3 randomly for variety
        const topN = Math.min(3, scored.length);
        const pickFrom = scored.slice(0, topN);
        const picked = pickFrom[Math.floor(Math.random() * pickFrom.length)].tpl;

        // Build ingredient list from leftovers that match the template's uses
        const matchedLeftovers = leftovers.filter(l => picked.uses.includes(l.name));

        const ingredients = matchedLeftovers.map(l => {
          // Find DB entry to get proper unit and price
          const db = INGREDIENT_DB.find(i => i.name === l.name);
          if (!db) return null;
          // Use the leftover amount as quantity but in DB units
          let qty;
          const u = (l.unit || "").toLowerCase();
          const du = db.unit.toLowerCase();
          // Convert leftover amount back to recipe quantity
          if (u === "g" && du === "kg") qty = l.amount / 1000;
          else if (u === "g" && du.includes("g") && du !== "kg") {
            const packG = parseInt(du.match(/\d+/)?.[0] || "100");
            qty = l.amount / packG;
          } else if (u === "ml" && (du === "liter" || du === "l")) qty = l.amount / 1000;
          else if (u === "ml" && du.includes("ml")) {
            const packMl = parseInt(du.match(/\d+/)?.[0] || "100");
            qty = l.amount / packMl;
          } else {
            // Handle "1/2", "1/4" etc strings
            if (typeof l.amount === "string" && l.amount.includes("/")) {
              const [a, b] = l.amount.split("/").map(parseFloat);
              qty = b ? a / b : 1;
            } else {
              qty = parseFloat(l.amount) || 1;
            }
          }
          return { name: db.name, unit: db.unit, price: db.price, quantity: Math.max(0.05, Math.round(qty * 100) / 100) };
        }).filter(Boolean);

        setBonusRecipe({
          id: `bonus-preview-${Date.now()}`,
          name: lang === "sr" ? picked.name_sr : picked.name_en,
          emoji: picked.emoji,
          people,
          minutes: picked.minutes,
          tags: ["high-protein", "lean", "quick"],
          nutrition: picked.nutrition,
          ingredients,
          steps: lang === "sr" ? picked.steps_sr : picked.steps_en,
        });
      } catch (err) {
        console.error("Bonus recipe error:", err);
        setError(err.message || (lang === "sr" ? "Greška" : "Error"));
      }
      setGenerating(false);
    }, 400); // tiny delay so spinner shows briefly for nice UX
  };


  return (
    <div className="ios-card p-5" style={{ background: "linear-gradient(135deg, #FFF8E7 0%, #FFE8D9 100%)", border: `1px solid ${C.orange}33` }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.orange + "22" }}>
          <Sparkles size={18} style={{ color: C.orange }} strokeWidth={2.2} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base">{t.leftovers}</h3>
          <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>{t.leftoversHint}</p>
        </div>
      </div>

      {/* Leftover list */}
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {leftovers.slice(0, 8).map((lo, i) => (
          <div key={i} className="flex items-baseline gap-1.5 text-xs">
            <span className="font-bold tabular-nums whitespace-nowrap" style={{ color: C.orange }}>
              {formatLeftover(lo, lang)}
            </span>
            <span className="truncate" style={{ color: C.text }}>{tIng(lo.name, lang)}</span>
          </div>
        ))}
      </div>
      {leftovers.length > 8 && (
        <p className="text-[11px] mb-3 text-center" style={{ color: C.textTertiary }}>
          +{leftovers.length - 8} {lang === "sr" ? "još" : "more"}
        </p>
      )}

      {!bonusRecipe ? (
        <button onClick={generateBonusRecipe} disabled={generating}
          className="ios-btn w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-white disabled:opacity-50"
          style={{ background: C.orange }}>
          {generating
            ? <><Loader2 size={16} className="animate-spin" /> {t.suggesting}</>
            : <><Sparkles size={16} strokeWidth={2.4} /> {t.suggestRecipe}</>
          }
        </button>
      ) : (
        <div className="mt-2 space-y-2">
          {/* Clickable recipe card - opens full detail like any other recipe */}
          <button onClick={() => onView(bonusRecipe)} className="ios-btn w-full ios-card p-4 flex items-center gap-3 text-left" style={{ background: C.card }}>
            <div className="text-4xl flex-shrink-0">{bonusRecipe.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate">{bonusRecipe.name}</div>
              <div className="text-xs flex items-center gap-2 flex-wrap mt-0.5" style={{ color: C.textSecondary }}>
                <span className="flex items-center gap-1"><Clock size={11} />{bonusRecipe.minutes}m</span>
                {bonusRecipe.nutrition && (<>
                  <span>·</span>
                  <span className="font-bold" style={{ color: C.green }}>{bonusRecipe.nutrition.protein}g {t.protein}</span>
                  <span>·</span>
                  <span>{bonusRecipe.nutrition.kcal} {t.kcal}</span>
                </>)}
              </div>
              <div className="text-[11px] mt-1 font-semibold" style={{ color: C.blue }}>
                {lang === "sr" ? "Dodirni za pun recept →" : "Tap for full recipe →"}
              </div>
            </div>
            <ChevronRight size={20} style={{ color: C.textTertiary }} />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setBonusRecipe(null); generateBonusRecipe(); }}
              className="ios-btn py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5"
              style={{ background: C.card, color: C.text, border: `1px solid ${C.separator}` }}>
              <Shuffle size={14} /> {t.regenerate}
            </button>
            <button onClick={() => { onAddBonusRecipe(bonusRecipe); setBonusRecipe(null); }}
              className="ios-btn py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-1.5"
              style={{ background: C.green }}>
              <Plus size={14} strokeWidth={2.4} /> {t.addBonusRecipe}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs mt-2 text-center" style={{ color: C.red }}>{error}</p>}
    </div>
  );
}

function DayPickerSheet({ day, recipes, onPick, onClose, recipeStoreCost, t, lang, tRecipe }) {
  const DAYS_FULL = lang === "sr" ? DAYS_FULL_SR : DAYS_FULL_EN;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center fade-in" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[80vh] flex flex-col rounded-t-3xl slide-up overflow-hidden" style={{ background: C.bg }} onClick={(e) => e.stopPropagation()}>
        <div className="px-5 pt-3 pb-4">
          <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: C.separator }} />
          <h3 className="text-xl font-bold">{t.pickMealFor} {DAYS_FULL[day]}</h3>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2">
          {recipes.length === 0 ? (
            <div className="text-center py-12" style={{ color: C.textSecondary }}>
              <ChefHat size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">{t.noRecipesSaved}</p>
              <p className="text-xs mt-1">{t.addFromRecipes}</p>
            </div>
          ) : recipes.map(r => (
            <button key={r.id} onClick={() => onPick(r.id)} className="ios-btn w-full ios-card p-3 flex items-center gap-3 text-left">
              <div className="text-2xl">{r.emoji || "🍽️"}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{tRecipe(r).name}</div>
                <div className="text-xs flex items-center gap-2" style={{ color: C.textSecondary }}>
                  {r.minutes && <span>{r.minutes} {t.min}</span>}
                  {r.minutes && <span>·</span>}
                  <span>{fmt(recipeStoreCost(r))}</span>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: C.textTertiary }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ RECIPES VIEW ============
function RecipesView({ recipes, recipeStoreCost, onAdd, onScan, onLibrary, onView, onDelete, onImport, adjustedPrice, people, t, lang, tRecipe }) {
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");

  const q = search.toLowerCase();
  const matchesSearch = (name) => !q || name.toLowerCase().includes(q);
  const matchesTag = (tags) => filterTag === "all" || (tags || []).includes(filterTag);

  // My saved recipes
  const myFiltered = recipes.filter(r => matchesSearch(tRecipe(r).name) && matchesTag(r.tags));

  // Library recipes not yet imported
  const importedSourceIds = new Set(recipes.filter(r => r.sourceId).map(r => r.sourceId));
  const libFiltered = HF_LIBRARY.filter(r => {
    const srName = RECIPE_SR[r.id]?.name || r.name;
    if (!matchesSearch(r.name) && !matchesSearch(srName)) return false;
    return matchesTag(r.tags);
  });

  const libCost = (r) => {
    const scale = people / (r.people || 2);
    return r.ingredients.reduce((sum, it) => {
      const p = calcPackages(it, it.quantity * scale, adjustedPrice);
      return sum + (p.isPartial ? p.proRatedCost : p.fullPackCost);
    }, 0);
  };

  return (
    <div className="space-y-4">
      {/* Action buttons row */}
      <div className="grid grid-cols-2 gap-2">
        <ActionTile icon={Sparkles} label={t.scan} onClick={onScan} color={C.purple} />
        <ActionTile icon={Plus} label={t.new} onClick={onAdd} color={C.green} />
      </div>

      {/* Search - always visible */}
      <div className="ios-card flex items-center gap-2 px-3 py-2.5">
        <Search size={16} style={{ color: C.textTertiary }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchRecipes}
          className="flex-1 bg-transparent outline-none text-[15px]" />
        {search && <button onClick={() => setSearch("")} className="ios-btn"><X size={16} style={{ color: C.textTertiary }} /></button>}
      </div>

      {/* Tag filter */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {["all", "high-protein", "lean", "meat", "fish", "vegetarian", "vegan", "quick", "no-cook"].map((tag) => (
          <Chip key={tag} label={tag} active={filterTag === tag} onClick={() => setFilterTag(tag)} />
        ))}
      </div>

      {/* My recipes section */}
      {myFiltered.length > 0 && (
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-wide mb-2 px-1" style={{ color: C.textSecondary }}>
            {lang === "sr" ? "Moji recepti" : "My recipes"} ({myFiltered.length})
          </div>
          <div className="space-y-2">
            {myFiltered.map((r) => {
              const localized = tRecipe(r);
              return (
                <button key={r.id} onClick={() => onView(r)} className="ios-btn w-full ios-card p-4 flex items-center gap-3 text-left">
                  <div className="text-3xl flex-shrink-0">{r.emoji || "🍽️"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{localized.name}</div>
                    <div className="text-xs mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: C.textSecondary }}>
                      {r.minutes && <span className="flex items-center gap-1"><Clock size={11} />{r.minutes}m</span>}
                      {r.nutrition && (<>
                        <span>·</span>
                        <span className="font-bold" style={{ color: C.green }}>{r.nutrition.protein}g {t.protein}</span>
                        <span>·</span>
                        <span>{r.nutrition.kcal} {t.kcal}</span>
                      </>)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-lg">{fmt(recipeStoreCost(r))}</div>
                    <div className="text-[10px]" style={{ color: C.textTertiary }}>{t.forN} {people}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Library section - all recipes with Add buttons */}
      {libFiltered.length > 0 && (
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-wide mb-2 px-1" style={{ color: C.textSecondary }}>
            {lang === "sr" ? "Biblioteka" : "Library"} ({libFiltered.length})
          </div>
          <div className="space-y-2">
            {libFiltered.map((r) => {
              const imported = importedSourceIds.has(r.id);
              const displayName = lang === "sr" ? (RECIPE_SR[r.id]?.name || r.name) : r.name;
              return (
                <div key={r.id} className="ios-card p-3 flex items-center gap-3">
                  <button onClick={() => onView({ ...r, id: `lib-preview-${r.id}`, sourceId: r.id })} className="ios-btn flex items-center gap-3 flex-1 min-w-0 text-left">
                    <div className="text-3xl flex-shrink-0">{r.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[15px] truncate">{displayName}</div>
                      <div className="text-xs flex items-center gap-1.5 flex-wrap mt-0.5" style={{ color: C.textSecondary }}>
                        <span>{r.minutes}m</span>
                        <span>·</span>
                        <span className="font-bold" style={{ color: C.green }}>{r.nutrition?.protein}g</span>
                        <span style={{ color: C.textTertiary }}>{t.protein}</span>
                        <span>·</span>
                        <span>{r.nutrition?.kcal} {t.kcal}</span>
                        <span>·</span>
                        <span className="font-semibold">{fmt(libCost(r))}</span>
                      </div>
                    </div>
                  </button>
                  <button onClick={() => onImport(r)} disabled={imported}
                    className="ios-btn px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 flex items-center gap-1"
                    style={{ background: imported ? C.greenSoft : C.blue, color: imported ? C.green : "#fff" }}>
                    {imported ? <><Check size={12} /> {t.added}</> : <><Plus size={12} /> {t.add}</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {myFiltered.length === 0 && libFiltered.length === 0 && (
        <div className="text-center py-8 text-sm" style={{ color: C.textSecondary }}>
          {t.noMatchesFor} "{search}"
        </div>
      )}
    </div>
  );
}

function ActionTile({ icon: Icon, label, onClick, color }) {
  return (
    <button onClick={onClick} className="ios-btn ios-card p-3 flex flex-col items-center gap-1.5">
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: color + "1A" }}>
        <Icon size={20} style={{ color }} strokeWidth={2.2} />
      </div>
      <div className="text-xs font-semibold">{label}</div>
    </button>
  );
}

// ============ COMPARE VIEW ============
function CompareView({ weekStoreCost, weekHFCost, savings, savingsPercent, shoppingList, adjustedPrice, store, people, mealsPlanned, t, lang, weekPlan, recipes, tRecipe, recipeStoreCost }) {
  const [shopMode, setShopMode] = useState("combined"); // "combined" or "byRecipe"

  // Build per-recipe shopping breakdown
  const buildRecipeBreakdown = () => {
    const result = [];
    DAYS.forEach((day) => {
      const rid = weekPlan[day];
      if (!rid) return;
      const r = recipes.find(x => x.id === rid);
      if (!r) return;
      const scale = people / (r.people || 2);
      const items = r.ingredients.map((it) => {
        const scaledQty = it.quantity * scale;
        const pack = calcPackages(it, scaledQty, adjustedPrice);
        return {
          ...it,
          scaledQuantity: scaledQty,
          ...pack,
          cost: pack.isPartial ? pack.proRatedCost : pack.fullPackCost,
        };
      });
      result.push({
        day,
        recipe: r,
        items,
        total: recipeStoreCost(r),
      });
    });
    return result;
  };

  const recipeBreakdown = buildRecipeBreakdown();

  const handlePrintWeekly = () => {
    const DAYS_FULL = lang === "sr" ? DAYS_FULL_SR : DAYS_FULL_EN;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${t.weeklyShopping}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 720px; margin: 24px auto; padding: 0 24px; color: #1c1c1e; line-height: 1.5; }
  h1 { font-size: 26px; margin: 0 0 4px; font-weight: 800; letter-spacing: -0.02em; }
  .subtitle { color: #6e6e73; font-size: 13px; margin-bottom: 24px; }
  h2 { font-size: 17px; margin: 28px 0 8px; padding-bottom: 6px; border-bottom: 2px solid #1c1c1e; font-weight: 700; }
  h3 { font-size: 14px; margin: 16px 0 6px; color: #6e6e73; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .recipe-block { margin-bottom: 24px; padding: 16px; border: 1px solid #e5e5ea; border-radius: 8px; page-break-inside: avoid; }
  .recipe-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
  .day-label { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #007AFF; background: #E8F0FE; padding: 2px 8px; border-radius: 10px; margin-right: 8px; vertical-align: middle; }
  .recipe-meta { font-size: 12px; color: #6e6e73; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 0; border-bottom: 1px solid #f2f2f7; font-size: 13px; }
  td.qty { width: 90px; font-weight: 700; color: #007AFF; }
  td.cost { text-align: right; width: 70px; font-weight: 600; }
  .total-row td { border-top: 2px solid #1c1c1e; border-bottom: none; padding-top: 8px; font-weight: 700; font-size: 14px; }
  .grand { margin-top: 32px; padding: 16px; background: #1c1c1e; color: #fff; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 700; }
  .footer { margin-top: 24px; font-size: 11px; color: #aeaeb2; text-align: center; }
  @media print { body { margin: 0; } .recipe-block { break-inside: avoid; } }
</style></head><body>
  <h1>${t.weeklyShopping}</h1>
  <div class="subtitle">${STORE_MULTIPLIERS[store].name} · ${people} ${people === 1 ? t.person : t.peopleW} · ${recipeBreakdown.length} ${t.meals}</div>

  ${recipeBreakdown.map(({ day, recipe, items, total }) => {
    const lr = tRecipe(recipe);
    return `
    <div class="recipe-block">
      <div class="recipe-title">
        <span class="day-label">${DAYS_FULL[day]}</span>
        <span>${recipe.emoji || ""}</span>
        <span>${lr.name}</span>
      </div>
      <div class="recipe-meta">${recipe.minutes ? recipe.minutes + ' ' + t.min : ''}${recipe.nutrition ? ' · ' + recipe.nutrition.protein + 'g ' + t.protein + ' · ' + recipe.nutrition.kcal + ' ' + t.kcal : ''}</div>
      <table>
        ${items.map(it => `
          <tr>
            <td class="qty">${it.packsNeeded}× ${it.packLabel}</td>
            <td>${tIng(it.name, lang)}</td>
            <td class="cost">${fmt(it.cost)}</td>
          </tr>`).join('')}
        <tr class="total-row">
          <td colspan="2">${t.total}</td>
          <td class="cost">${fmt(total)}</td>
        </tr>
      </table>
    </div>`;
  }).join('')}

  <div class="grand">
    <span>${t.grandTotal}</span>
    <span>${fmt(weekStoreCost)}</span>
  </div>

  <div class="footer">${t.printDateLabel}: ${new Date().toLocaleDateString(lang === "sr" ? "sr-RS" : "en-US")} · ${t.aboutText}</div>
</body></html>`;
    printHTML(html);
  };

  if (mealsPlanned === 0) {
    return (
      <div className="ios-card p-8 text-center">
        <div className="text-5xl mb-3">🛒</div>
        <p className="font-semibold text-lg">{t.nothingPlanned}</p>
        <p className="text-sm mt-1" style={{ color: C.textSecondary }}>{t.planSomeMeals}</p>
      </div>
    );
  }

  const isHFCheaper = savings < 0;
  const DAYS_FULL = lang === "sr" ? DAYS_FULL_SR : DAYS_FULL_EN;
  return (
    <div className="space-y-4">
      {/* Verdict hero */}
      <div className="ios-card p-5" style={{ background: isHFCheaper ? C.orangeSoft : C.greenSoft }}>
        <div className="flex items-center gap-2 mb-2">
          {isHFCheaper ? <TrendingUp size={16} style={{ color: C.orange }} /> : <TrendingDown size={16} style={{ color: C.green }} />}
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: isHFCheaper ? C.orange : C.green }}>
            {isHFCheaper ? t.helloFreshWins : t.cookingWins}
          </span>
        </div>
        <div className="text-5xl font-bold tracking-tight" style={{ color: isHFCheaper ? C.orange : C.green }}>
          {fmt(Math.abs(savings))}
        </div>
        <div className="text-sm mt-1" style={{ color: C.text }}>
          {isHFCheaper ? `${Math.abs(savingsPercent).toFixed(0)}${t.lessThanCooking}` : `${savingsPercent.toFixed(0)}${t.savedByCooking}`}
          {" · "}
          <span style={{ color: C.textSecondary }}>{fmt(Math.abs(savings * 52))}{t.perYear}</span>
        </div>
      </div>

      {/* Side-by-side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="ios-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <ShoppingCart size={14} style={{ color: C.textSecondary }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>{STORE_MULTIPLIERS[store].name}</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">{fmt(weekStoreCost)}</div>
          <div className="text-[11px] mt-0.5" style={{ color: C.textTertiary }}>{mealsPlanned} {t.meals} · {mealsPlanned * people} {t.portions}</div>
        </div>
        <div className="ios-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <ChefHat size={14} style={{ color: C.textSecondary }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>HelloFresh</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">{fmt(weekHFCost)}</div>
          <div className="text-[11px] mt-0.5" style={{ color: C.textTertiary }}>{t.inclShipping.replace("{shipping}", fmt(HF_SHIPPING))}</div>
        </div>
      </div>

      {/* Shopping list header w/ mode toggle + print */}
      <div className="ios-card overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between gap-2" style={{ borderColor: C.separator }}>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base truncate">{t.weeklyShopping}</h3>
            <p className="text-xs mt-0.5 truncate" style={{ color: C.textSecondary }}>{t.packsToBuy} {STORE_MULTIPLIERS[store].name}</p>
          </div>
          <button onClick={handlePrintWeekly} className="ios-btn flex-shrink-0 p-2 rounded-full flex items-center gap-1" style={{ background: C.blueSoft, color: C.blue }}>
            <Printer size={16} strokeWidth={2.2} />
            <span className="text-xs font-bold pr-1">{t.printList}</span>
          </button>
        </div>

        {/* Mode toggle */}
        <div className="px-3 py-2 flex gap-1" style={{ borderBottom: `0.5px solid ${C.separator}` }}>
          <button onClick={() => setShopMode("byRecipe")} className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition"
            style={{ background: shopMode === "byRecipe" ? C.blue : "transparent", color: shopMode === "byRecipe" ? "#fff" : C.text }}>
            {t.byRecipe}
          </button>
          <button onClick={() => setShopMode("combined")} className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition"
            style={{ background: shopMode === "combined" ? C.blue : "transparent", color: shopMode === "combined" ? "#fff" : C.text }}>
            {t.combined}
          </button>
        </div>

        {/* By recipe view */}
        {shopMode === "byRecipe" && (
          <div>
            {recipeBreakdown.map(({ day, recipe, items, total }, ridx) => {
              const lr = tRecipe(recipe);
              return (
                <div key={day} style={{ borderBottom: ridx < recipeBreakdown.length - 1 ? `4px solid ${C.bg}` : "none" }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: C.bg }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: C.blue, color: "#fff" }}>
                      {DAYS_FULL[day]}
                    </span>
                    <span className="text-xl">{recipe.emoji}</span>
                    <span className="font-semibold text-sm flex-1 truncate">{lr.name}</span>
                    <span className="text-sm font-bold">{fmt(total)}</span>
                  </div>
                  {items.map((it, iidx) => (
                    <div key={iidx} className="px-4 py-2 flex items-center gap-3" style={{ borderBottom: iidx < items.length - 1 ? `0.5px solid ${C.separator}` : "none" }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.blueSoft }}>
                        <span className="text-xs font-bold" style={{ color: C.blue }}>{it.packsNeeded}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{tIng(it.name, lang)}</div>
                        <div className="text-[11px]" style={{ color: C.textTertiary }}>{it.packLabel}</div>
                      </div>
                      <div className="text-sm font-semibold">{fmt(it.cost)}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* Combined view */}
        {shopMode === "combined" && (
          <div>
            {shoppingList.map((item, i) => {
              const pack = calcPackages(item, item.quantity, adjustedPrice);
              const cost = pack.isPartial ? pack.proRatedCost : pack.fullPackCost;
              return (
                <div key={i} className="px-4 py-2.5 flex items-center gap-3" style={{ borderBottom: i < shoppingList.length - 1 ? `0.5px solid ${C.separator}` : "none" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.blueSoft }}>
                    <span className="text-xs font-bold" style={{ color: C.blue }}>{pack.packsNeeded}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{tIng(item.name, lang)}</div>
                    <div className="text-[11px]" style={{ color: C.textTertiary }}>{pack.packLabel}</div>
                  </div>
                  <div className="font-semibold text-sm">{fmt(cost)}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Grand total */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: C.text, color: "#fff" }}>
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{t.grandTotal}</span>
          <span className="text-xl font-bold">{fmt(weekStoreCost)}</span>
        </div>
      </div>
    </div>
  );
}

// ============ RECIPE DETAIL MODAL ============
function RecipeDetailModal({ recipe, onClose, onEdit, onUpdateSteps, adjustedPrice, people, store, t, lang }) {
  const [tab, setTab] = useState("recipe"); // recipe | shop
  const [cooking, setCooking] = useState(false);
  if (!recipe) return null;

  const recipePeople = recipe.people || 2;
  const scale = people / recipePeople;
  const shopping = recipe.ingredients.map((it) => {
    const scaledQty = it.quantity * scale;
    return { ...it, scaledQuantity: scaledQty, ...calcPackages(it, scaledQty, adjustedPrice) };
  });
  const totalCost = shopping.reduce((sum, i) => sum + (i.isPartial ? i.proRatedCost : i.fullPackCost), 0);
  const hfPerPortion = getHFPricePerPortion(people, 5);
  const hfMealCost = hfPerPortion * people;
  const diff = hfMealCost - totalCost;
  const isCheaper = diff > 0;

  const fmtQty = (q) => q < 0.1 ? q.toFixed(2) : q % 1 === 0 ? q.toString() : q.toFixed(2).replace(/\.?0+$/, "");

  const handlePrintRecipe = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${recipe.name}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 720px; margin: 24px auto; padding: 0 24px; color: #1c1c1e; line-height: 1.5; }
  .header { text-align: center; padding-bottom: 16px; border-bottom: 2px solid #1c1c1e; margin-bottom: 24px; }
  .emoji { font-size: 56px; line-height: 1; margin-bottom: 8px; }
  h1 { font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.02em; }
  .meta { color: #6e6e73; font-size: 13px; margin-top: 8px; display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .nutrition { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 24px 0; padding: 16px; background: #f2f2f7; border-radius: 12px; }
  .nut-stat { text-align: center; }
  .nut-val { font-size: 22px; font-weight: 800; }
  .nut-val.protein { color: #34C759; }
  .nut-label { font-size: 10px; color: #6e6e73; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 24px; }
  h2 { font-size: 16px; margin: 0 0 12px; padding-bottom: 6px; border-bottom: 1.5px solid #1c1c1e; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .ingredient { padding: 6px 0; border-bottom: 1px solid #f2f2f7; font-size: 13px; display: flex; gap: 8px; }
  .ing-qty { font-weight: 700; color: #007AFF; min-width: 80px; }
  .step { padding: 8px 0 8px 36px; position: relative; font-size: 13px; line-height: 1.6; }
  .step-num { position: absolute; left: 0; top: 6px; width: 24px; height: 24px; border-radius: 50%; background: #007AFF; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5ea; font-size: 11px; color: #aeaeb2; text-align: center; }
  @media print { body { margin: 0; } .columns { display: block; } .columns > div:last-child { margin-top: 24px; } }
  @media (max-width: 600px) { .columns { display: block; } .columns > div:last-child { margin-top: 24px; } }
</style></head><body>
  <div class="header">
    <div class="emoji">${recipe.emoji || "🍽️"}</div>
    <h1>${recipe.name}</h1>
    <div class="meta">
      ${recipe.minutes ? `<span>⏱ ${recipe.minutes} ${t.min}</span>` : ''}
      <span>👥 ${people} ${people === 1 ? t.person : t.peopleW}</span>
      <span>🥘 ${recipe.ingredients.length} ${t.items}</span>
    </div>
    ${recipe.tags ? `<div style="margin-top:8px;font-size:11px;color:#6e6e73">${recipe.tags.join(" · ")}</div>` : ''}
  </div>

  ${recipe.nutrition ? `
  <div class="nutrition">
    <div class="nut-stat"><div class="nut-val">${recipe.nutrition.kcal}</div><div class="nut-label">${t.kcal}</div></div>
    <div class="nut-stat"><div class="nut-val protein">${recipe.nutrition.protein}g</div><div class="nut-label">${t.protein}</div></div>
    <div class="nut-stat"><div class="nut-val">${recipe.nutrition.carbs}g</div><div class="nut-label">${t.carbs}</div></div>
    <div class="nut-stat"><div class="nut-val">${recipe.nutrition.fat}g</div><div class="nut-label">${t.fat}</div></div>
  </div>` : ''}

  <div class="columns">
    <div>
      <h2>${t.ingredients}</h2>
      ${shopping.map(it => `
        <div class="ingredient">
          <span class="ing-qty">${fmtQty(it.scaledQuantity)} ${tUnit(it.unit, lang)}</span>
          <span>${tIng(it.name, lang)}</span>
        </div>`).join('')}
    </div>
    <div>
      <h2>${t.instructions}</h2>
      ${(recipe.steps && recipe.steps.length > 0
        ? recipe.steps.map((s, idx) => `<div class="step"><span class="step-num">${idx + 1}</span>${s}</div>`).join('')
        : `<p style="color:#6e6e73;font-size:13px">${t.noInstructions}</p>`)}
    </div>
  </div>

  <div class="footer">${t.printDateLabel}: ${new Date().toLocaleDateString(lang === "sr" ? "sr-RS" : "en-US")} · ${t.aboutText}</div>
</body></html>`;
    printHTML(html);
  };

  if (cooking) return <CookMode recipe={recipe} shopping={shopping} onClose={() => setCooking(false)} onUpdateSteps={onUpdateSteps} people={people} fmtQty={fmtQty} t={t} lang={lang} />;

  return (
    <div className="fixed inset-0 z-50 flex flex-col fade-in" style={{ background: C.bg }}>
      {/* Sticky compact header */}
      <header className="flex-shrink-0 sticky top-0 z-20" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `0.5px solid ${C.separator}` }}>
        <div className="max-w-3xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2">
          <button onClick={onClose} className="ios-btn px-2 py-1.5 rounded-full text-sm font-semibold flex items-center gap-0.5" style={{ color: C.blue }}>
            <ChevronLeft size={18} /> {t.back}
          </button>
          <div className="flex-1 min-w-0 text-center">
            <div className="text-sm font-bold truncate flex items-center justify-center gap-1.5">
              <span>{recipe.emoji || "🍽️"}</span>
              <span className="truncate">{recipe.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handlePrintRecipe} className="ios-btn p-2 rounded-full" style={{ color: C.blue, background: C.blueSoft }} title={t.printRecipe}>
              <Printer size={16} strokeWidth={2.2} />
            </button>
            <button onClick={() => onEdit(recipe)} className="ios-btn px-2 py-1.5 rounded-full text-sm font-semibold" style={{ color: C.blue }}>
              {t.edit}
            </button>
          </div>
        </div>
      </header>

      {/* SINGLE SCROLLABLE SURFACE — everything scrolls together */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-32 space-y-4">

          {/* Hero card */}
          <div className="ios-card p-6 text-center">
            <div className="text-7xl mb-3">{recipe.emoji || "🍽️"}</div>
            <h1 className="text-3xl font-bold tracking-tight">{recipe.name}</h1>
            <div className="flex items-center justify-center gap-4 mt-3 text-sm" style={{ color: C.textSecondary }}>
              {recipe.minutes && <span className="flex items-center gap-1"><Clock size={14} />{recipe.minutes} {t.min}</span>}
              <span className="flex items-center gap-1"><Users size={14} />{people}</span>
              <span className="flex items-center gap-1"><Flame size={14} />{recipe.ingredients.length} {t.items}</span>
            </div>
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {recipe.tags.map(tag => (
                  <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: C.bg, color: C.textSecondary }}>{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Nutrition card */}
          {recipe.nutrition && (
            <div className="ios-card p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: C.textSecondary }}>
                {t.perPortionLabel}
              </div>
              <div className="grid grid-cols-4 gap-2">
                <NutritionStat value={recipe.nutrition.kcal} label={t.kcal} color={C.text} />
                <NutritionStat value={recipe.nutrition.protein + "g"} label={t.protein} color={C.green} highlight />
                <NutritionStat value={recipe.nutrition.carbs + "g"} label={t.carbs} color={C.text} />
                <NutritionStat value={recipe.nutrition.fat + "g"} label={t.fat} color={C.text} />
              </div>
            </div>
          )}

          {/* Cost banner */}
          <div className="ios-card p-4 flex items-center justify-between"
            style={{ background: isCheaper ? C.greenSoft : C.orangeSoft }}>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: isCheaper ? C.green : C.orange }}>
                {isCheaper ? t.cheaperToCook : t.helloFreshCheaper}
              </div>
              <div className="text-2xl font-bold mt-0.5" style={{ color: isCheaper ? C.green : C.orange }}>
                {isCheaper ? t.save : t.costs}{fmt(Math.abs(diff))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                {t.yourCost}
              </div>
              <div className="text-2xl font-bold">{fmt(totalCost)}</div>
              <div className="text-[10px]" style={{ color: C.textSecondary }}>{t.vsHF} {fmt(hfMealCost)}</div>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="ios-card p-1 flex gap-1 sticky top-[52px] z-10" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)" }}>
            <button onClick={() => setTab("recipe")} className="flex-1 py-2 rounded-xl text-sm font-semibold transition"
              style={{ background: tab === "recipe" ? C.blue : "transparent", color: tab === "recipe" ? "#fff" : C.text }}>
              {t.recipe}
            </button>
            <button onClick={() => setTab("shop")} className="flex-1 py-2 rounded-xl text-sm font-semibold transition"
              style={{ background: tab === "shop" ? C.blue : "transparent", color: tab === "shop" ? "#fff" : C.text }}>
              {t.shoppingTab}
            </button>
          </div>

          {/* Tab content — flows naturally inside same scroll */}
          {tab === "recipe" && <RecipeStepsTab recipe={recipe} shopping={shopping} fmtQty={fmtQty} onUpdateSteps={onUpdateSteps} t={t} lang={lang} />}
          {tab === "shop" && <ShoppingListTab shopping={shopping} fmtQty={fmtQty} totalCost={totalCost} store={store} scale={scale} recipePeople={recipePeople} people={people} t={t} lang={lang} />}
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="flex-shrink-0 px-4 pt-3 pb-6" style={{ background: "rgba(242,242,247,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: `0.5px solid ${C.separator}` }}>
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setCooking(true)} className="ios-btn w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-white text-base"
            style={{ background: C.blue, boxShadow: "0 4px 14px rgba(0,122,255,0.3)" }}>
            <ChefHat size={20} strokeWidth={2.4} />
            {t.startCooking}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ RECIPE STEPS TAB ============
function RecipeStepsTab({ recipe, shopping, fmtQty, onUpdateSteps, t, lang }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const generateSteps = async () => {
    setGenerating(true); setError("");
    const ingredientsText = recipe.ingredients.map(i => `${fmtQty(i.quantity)} ${i.unit} ${i.name}`).join(", ");
    const langInstr = lang === "sr" ? "Write in Serbian (latinica). Use Serbian cooking terminology." : "Write in plain English.";
    const prompt = `Write clear, friendly cooking instructions for this recipe. Return ONLY valid JSON, no markdown:

{"steps": ["step 1", "step 2", "step 3", "step 4", "step 5"]}

Recipe: ${recipe.name}
Serves: ${recipe.people || 2}
Ingredients: ${ingredientsText}
${recipe.minutes ? `Total time: ${recipe.minutes} minutes` : ""}

Rules:
- 4-7 steps, each 1-2 sentences
- ${langInstr}
- Action-oriented (Heat... Add... Cook for X minutes...)
- Include timing where relevant ("simmer 5 minutes")
- Don't repeat ingredient amounts in steps unless critical
- Group prep/cook tasks logically
Return ONLY the JSON.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.steps && parsed.steps.length > 0) {
        onUpdateSteps(recipe.id, parsed.steps);
      } else {
        setError(t.didntWork);
      }
    } catch (err) {
      setError(err.message || t.didntWork);
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-4">
      {/* Ingredients block */}
      <div className="ios-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={16} style={{ color: C.orange }} />
          <h3 className="font-bold">{t.ingredients}</h3>
        </div>
        <div className="space-y-2">
          {shopping.map((it, idx) => {
            const human = humanizeAmount(it.scaledQuantity, it.unit, lang);
            const leftover = calcLeftover(it, it.scaledQuantity);
            return (
              <div key={idx} className="flex items-baseline gap-3 text-sm">
                <span className="font-bold tabular-nums whitespace-nowrap" style={{ color: C.blue, minWidth: 80 }}>
                  {human.amount} {human.unit}
                </span>
                <div className="flex-1 min-w-0">
                  <div style={{ color: C.text }}>{tIng(it.name, lang)}</div>
                  {leftover && (
                    <div className="text-[11px] mt-0.5" style={{ color: C.textTertiary }}>
                      {lang === "sr" ? "ostaje" : "leftover"}: {formatLeftover(leftover, lang)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Steps */}
      <div className="ios-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ListChecks size={16} style={{ color: C.green }} />
            <h3 className="font-bold">{t.instructions}</h3>
          </div>
          {recipe.steps && recipe.steps.length > 0 && (
            <button onClick={generateSteps} disabled={generating} className="ios-btn text-xs font-semibold px-2 py-1 rounded-full disabled:opacity-50"
              style={{ color: C.blue, background: C.blueSoft }}>
              {generating ? <Loader2 size={12} className="animate-spin inline" /> : t.regenerate}
            </button>
          )}
        </div>

        {!recipe.steps || recipe.steps.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm mb-3" style={{ color: C.textSecondary }}>
              {t.noInstructions}
            </p>
            <button onClick={generateSteps} disabled={generating} className="ios-btn px-4 py-2 rounded-full font-semibold text-sm text-white disabled:opacity-50 flex items-center gap-2 mx-auto"
              style={{ background: C.blue }}>
              {generating ? <><Loader2 size={14} className="animate-spin" /> {t.generating}</> : <><Sparkles size={14} /> {t.generateAI}</>}
            </button>
            {error && <p className="text-xs mt-2" style={{ color: C.red }}>{error}</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: C.blue }}>
                  <span className="text-xs font-bold text-white">{idx + 1}</span>
                </div>
                <div className="flex-1 text-sm leading-relaxed" style={{ color: C.text }}>{step}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ SHOPPING LIST TAB ============
function ShoppingListTab({ shopping, fmtQty, totalCost, store, scale, recipePeople, people, t, lang }) {
  const [checked, setChecked] = useState({});
  return (
    <div className="space-y-4">
      {scale !== 1 && (
        <div className="ios-card p-3 flex items-center gap-2 text-xs" style={{ background: C.blueSoft }}>
          <span style={{ color: C.blue }}>ℹ️</span>
          <span style={{ color: C.text }}>{t.scaledFrom} {recipePeople} {t.to} {people}</span>
        </div>
      )}

      <div className="ios-card overflow-hidden">
        <div className="px-4 py-3 border-b" style={{ borderColor: C.separator }}>
          <h3 className="font-bold text-base">{t.whatToBuy}</h3>
          <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>{t.tapToCheck}</p>
        </div>
        {shopping.map((it, idx) => {
          const isChecked = checked[idx];
          return (
            <button key={idx} onClick={() => setChecked({ ...checked, [idx]: !isChecked })}
              className="ios-btn w-full px-4 py-3 flex items-center gap-3 text-left"
              style={{ borderBottom: idx < shopping.length - 1 ? `0.5px solid ${C.separator}` : "none" }}>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: isChecked ? C.green : C.textTertiary, background: isChecked ? C.green : "transparent" }}>
                {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-bold tabular-nums" style={{ color: isChecked ? C.textTertiary : C.blue }}>
                    {it.packsNeeded}× {it.packLabel}
                  </span>
                </div>
                <div className={`text-sm ${isChecked ? "line-through" : ""}`} style={{ color: isChecked ? C.textTertiary : C.text }}>
                  {tIng(it.name, lang)}
                </div>
                {(() => {
                  const human = humanizeAmount(it.scaledQuantity, it.unit, lang);
                  const leftover = calcLeftover(it, it.scaledQuantity);
                  return (
                    <div className="text-[11px] mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: C.textTertiary }}>
                      <span>{t.recipeNeeds} <span className="font-semibold" style={{ color: C.text }}>{human.amount} {human.unit}</span></span>
                      {leftover && (
                        <span style={{ color: C.green }}>· {lang === "sr" ? "ostaje" : "leftover"} {formatLeftover(leftover, lang)}</span>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`font-semibold text-sm ${isChecked ? "line-through" : ""}`} style={{ color: isChecked ? C.textTertiary : C.text }}>
                  {fmt(it.isPartial ? it.proRatedCost : it.fullPackCost)}
                </div>
              </div>
            </button>
          );
        })}
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: C.bg }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>{t.totalCheckout}</span>
          <span className="text-xl font-bold">{fmt(totalCost)}</span>
        </div>
      </div>

      <p className="text-xs text-center px-4" style={{ color: C.textTertiary }}>
        {t.freshNote}
      </p>
    </div>
  );
}

// ============ COOK MODE (full screen, step by step) ============
function CookMode({ recipe, shopping, onClose, onUpdateSteps, people, fmtQty, t, lang }) {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);

  const steps = recipe.steps || [];

  // Auto-generate if no steps
  useEffect(() => {
    if (steps.length === 0 && !generating) {
      (async () => {
        setGenerating(true);
        const ingredientsText = recipe.ingredients.map(i => `${fmtQty(i.quantity)} ${i.unit} ${i.name}`).join(", ");
        const langInstr = lang === "sr" ? "Write in Serbian (latinica)." : "Write in English.";
        const prompt = `Write clear cooking instructions. Return ONLY JSON: {"steps": ["...", "..."]}. Recipe: ${recipe.name}, serves ${recipe.people || 2}, ingredients: ${ingredientsText}. 4-7 steps, action-oriented, with timing. ${langInstr}`;
        try {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
          });
          const data = await res.json();
          const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
          const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
          if (parsed.steps) onUpdateSteps(recipe.id, parsed.steps);
        } catch (e) { console.error(e); }
        setGenerating(false);
      })();
    }
  }, [steps.length]);

  if (generating || steps.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: C.bg }}>
        <Loader2 className="animate-spin mb-4" size={32} style={{ color: C.blue }} />
        <p className="text-lg font-semibold">{t.preparingRecipe}</p>
        <p className="text-sm mt-1" style={{ color: C.textSecondary }}>{t.generatingSteps}</p>
      </div>
    );
  }

  const progress = ((step + 1) / steps.length) * 100;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col slide-up" style={{ background: C.bg }}>
      {/* Top bar */}
      <header className="flex-shrink-0 px-4 pt-3 pb-2 flex items-center justify-between" style={{ background: C.card, borderBottom: `0.5px solid ${C.separator}` }}>
        <button onClick={onClose} className="ios-btn p-2 rounded-full" style={{ background: C.bg }}>
          <X size={20} style={{ color: C.text }} />
        </button>
        <div className="text-center">
          <div className="text-sm font-bold">{recipe.name}</div>
          <div className="text-[11px]" style={{ color: C.textSecondary }}>{t.step} {step + 1} {t.of} {steps.length}</div>
        </div>
        <div className="w-9" />
      </header>

      {/* Progress bar */}
      <div className="h-1 flex-shrink-0" style={{ background: C.separator }}>
        <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, background: C.blue }} />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center text-center">
        <div className="text-7xl mb-6">{recipe.emoji || "👨‍🍳"}</div>
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.blue }}>
          {t.step} {step + 1}
        </div>
        <p className="text-2xl leading-relaxed font-medium" style={{ color: C.text }}>
          {steps[step]}
        </p>
      </div>

      {/* Bottom controls */}
      <div className="flex-shrink-0 p-4 pb-8 flex gap-3" style={{ background: C.card, borderTop: `0.5px solid ${C.separator}` }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          className="ios-btn px-5 py-3.5 rounded-2xl font-semibold disabled:opacity-30"
          style={{ background: C.bg, color: C.text }}>
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => isLast ? onClose() : setStep(step + 1)}
          className="ios-btn flex-1 py-3.5 rounded-2xl font-bold text-white"
          style={{ background: isLast ? C.green : C.blue }}>
          {isLast ? t.doneCooking : t.nextStep}
        </button>
      </div>
    </div>
  );
}

// ============ LIBRARY MODAL ============
function LibraryModal({ onClose, recipes, onImport, adjustedPrice, people, t, lang, tRecipe }) {
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const importedSourceIds = new Set(recipes.filter(r => r.sourceId).map(r => r.sourceId));
  const filtered = HF_LIBRARY.filter((r) => {
    const localizedName = (RECIPE_SR[r.id]?.name || r.name).toLowerCase();
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !localizedName.includes(search.toLowerCase())) return false;
    if (filterTag !== "all" && !r.tags.includes(filterTag)) return false;
    return true;
  });

  const recipeCost = (r) => {
    const recipePeople = r.people || 2;
    const scale = people / recipePeople;
    return r.ingredients.reduce((sum, it) => {
      const sq = it.quantity * scale;
      const p = calcPackages(it, sq, adjustedPrice);
      return sum + (p.isPartial ? p.proRatedCost : p.fullPackCost);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="w-full max-w-3xl mx-auto h-[92vh] flex flex-col rounded-t-3xl slide-up overflow-hidden" style={{ background: C.bg }} onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 px-4 pt-3 pb-3" style={{ background: C.card }}>
          <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ background: C.separator }} />
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">{t.recipeLibrary}</h2>
            <button onClick={onClose} className="ios-btn p-2 rounded-full" style={{ background: C.bg }}>
              <X size={18} style={{ color: C.text }} />
            </button>
          </div>
          <div className="ios-card flex items-center gap-2 px-3 py-2.5 mb-3" style={{ background: C.bg }}>
            <Search size={16} style={{ color: C.textTertiary }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search25}
              className="flex-1 bg-transparent outline-none text-[15px]" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {["all", "high-protein", "lean", "meat", "fish", "vegetarian", "vegan", "quick", "no-cook"].map((tag) => (
              <Chip key={tag} label={tag} active={filterTag === tag} onClick={() => setFilterTag(tag)} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-8">
          {filtered.map((r) => {
            const imported = importedSourceIds.has(r.id);
            const displayName = lang === "sr" ? (RECIPE_SR[r.id]?.name || r.name) : r.name;
            return (
              <div key={r.id} className="ios-card p-3 flex items-center gap-3">
                <div className="text-3xl flex-shrink-0">{r.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] truncate">{displayName}</div>
                  <div className="text-xs flex items-center gap-1.5 flex-wrap mt-0.5" style={{ color: C.textSecondary }}>
                    <span>{r.minutes}m</span>
                    <span>·</span>
                    <span className="font-bold" style={{ color: C.green }}>{r.nutrition?.protein}g</span>
                    <span style={{ color: C.textTertiary }}>{t.protein}</span>
                    <span>·</span>
                    <span>{r.nutrition?.kcal} {t.kcal}</span>
                    <span>·</span>
                    <span className="font-semibold">{fmt(recipeCost(r))}</span>
                  </div>
                </div>
                <button onClick={() => onImport(r)} disabled={imported}
                  className="ios-btn px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 flex items-center gap-1"
                  style={{ background: imported ? C.greenSoft : C.blue, color: imported ? C.green : "#fff" }}>
                  {imported ? <><Check size={12} /> {t.added}</> : <><Plus size={12} /> {t.add}</>}
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: C.textSecondary }}>{t.noRecipesMatch}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ PREFS MODAL ============
function PrefsModal({ prefs, setPrefs, store, setStore, people, setPeople, lang, setLang, onClose, t }) {
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      onClose();
    }, 800);
  };

  const Pill = ({ active, onClick, children }) => (
    <button onClick={onClick} className="ios-btn px-3.5 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5"
      style={{ background: active ? C.blue : C.card, color: active ? "#fff" : C.text, border: active ? "none" : `1px solid ${C.separator}` }}>
      {active && <Check size={12} strokeWidth={3} />}{children}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="w-full max-w-3xl mx-auto max-h-[92vh] flex flex-col rounded-t-3xl slide-up overflow-hidden" style={{ background: C.bg }} onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 px-4 pt-3 pb-2" style={{ background: C.card, borderBottom: `0.5px solid ${C.separator}` }}>
          <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ background: C.separator }} />
          <div className="flex items-center justify-between pb-2">
            <button onClick={onClose} className="ios-btn px-3 py-1 text-sm font-semibold" style={{ color: C.textSecondary }}>{t.cancel}</button>
            <h2 className="text-xl font-bold">{t.preferences}</h2>
            <button onClick={handleSave} className="ios-btn px-3 py-1 rounded-full text-sm font-bold" style={{ color: C.blue }}>{t.saveBtn}</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
          {/* Language */}
          <Section title={t.language}>
            <div className="flex gap-2">
              <Pill active={lang === "en"} onClick={() => setLang("en")}>🇬🇧 {t.english}</Pill>
              <Pill active={lang === "sr"} onClick={() => setLang("sr")}>🇷🇸 {t.serbian}</Pill>
            </div>
          </Section>

          {/* Settings card */}
          <div className="ios-card overflow-hidden">
            <SettingsRow label={t.store} value={STORE_MULTIPLIERS[store].name}>
              <select value={store} onChange={(e) => setStore(e.target.value)} className="bg-transparent outline-none font-medium text-[15px]" style={{ color: C.blue }}>
                {Object.entries(STORE_MULTIPLIERS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </SettingsRow>
            <SettingsRow label={t.people} last>
              <select value={people} onChange={(e) => setPeople(Number(e.target.value))} className="bg-transparent outline-none font-medium text-[15px]" style={{ color: C.blue }}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </SettingsRow>
          </div>

          <Section title={t.diet}>
            <div className="flex flex-wrap gap-2">
              {[{ k: "any", l: t.anything }, { k: "pescatarian", l: t.pescatarian }, { k: "vegetarian", l: t.vegetarian }, { k: "vegan", l: t.vegan }].map(({k,l}) => (
                <Pill key={k} active={prefs.diet === k} onClick={() => setPrefs({ ...prefs, diet: k })}>{l}</Pill>
              ))}
            </div>
          </Section>

          {prefs.diet === "any" && (
            <Section title={t.includeProteins}>
              <div className="flex flex-wrap gap-2">
                {Object.entries({ meat: t.meat, fish: t.fish, vegetarian: t.vegetarianP, vegan: t.veganP }).map(([k,l]) => (
                  <Pill key={k} active={prefs.proteins[k]} onClick={() => setPrefs({ ...prefs, proteins: { ...prefs.proteins, [k]: !prefs.proteins[k] } })}>{l}</Pill>
                ))}
              </div>
            </Section>
          )}

          <Section title={t.style}>
            <div className="flex flex-wrap gap-2">
              {Object.entries({ quick: t.quickFilter, "high-protein": t.highProtein, lean: t.lean, "no-cook": t.noCook }).map(([k,l]) => (
                <Pill key={k} active={prefs.cuisines[k]} onClick={() => setPrefs({ ...prefs, cuisines: { ...prefs.cuisines, [k]: !prefs.cuisines[k] } })}>{l}</Pill>
              ))}
            </div>
          </Section>

          <Section title={`${t.mealsPerWeekTitle} · ${prefs.mealsPerWeek}`}>
            <input type="range" min="3" max="7" value={prefs.mealsPerWeek} onChange={(e) => setPrefs({ ...prefs, mealsPerWeek: Number(e.target.value) })}
              className="w-full" style={{ accentColor: C.blue }} />
          </Section>

          <Section title={`${t.maxCookingTime} · ${prefs.maxMinutes} ${t.min}`}>
            <input type="range" min="15" max="90" step="5" value={prefs.maxMinutes} onChange={(e) => setPrefs({ ...prefs, maxMinutes: Number(e.target.value) })}
              className="w-full" style={{ accentColor: C.blue }} />
          </Section>
        </div>

        {/* Sticky save bar */}
        <div className="flex-shrink-0 px-4 pt-3 pb-6" style={{ background: C.card, borderTop: `0.5px solid ${C.separator}` }}>
          <button onClick={handleSave} className="ios-btn w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-white text-base"
            style={{ background: C.blue, boxShadow: "0 4px 14px rgba(0,122,255,0.3)" }}>
            <Check size={18} strokeWidth={2.6} /> {t.saveBtn}
          </button>
        </div>

        {/* Saved toast */}
        {showSaved && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="px-5 py-3 rounded-2xl flex items-center gap-2 fade-in shadow-2xl"
              style={{ background: C.green, color: "#fff" }}>
              <Check size={18} strokeWidth={3} />
              <span className="font-semibold">{t.settingsSaved}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: C.textSecondary }}>{title}</h3>
      <div className="ios-card p-3">{children}</div>
    </div>
  );
}

function SettingsRow({ label, value, children, last }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: last ? "none" : `0.5px solid ${C.separator}` }}>
      <span className="text-[15px]">{label}</span>
      <div className="text-[15px]" style={{ color: C.textSecondary }}>{children || value}</div>
    </div>
  );
}

// ============ SCAN MODAL ============
function ScanModal({ onClose, onScanned, people, t }) {
  const [stage, setStage] = useState("pick");
  const [imageData, setImageData] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please pick an image"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageData(e.target.result.split(",")[1]);
      setImageType(file.type);
      setStage("preview");
    };
    reader.readAsDataURL(file);
  };

  const scan = async () => {
    setStage("scanning"); setError("");
    const ingredientList = INGREDIENT_DB.map(i => i.name).join(", ");
    const prompt = `Extract recipe info from this image (Dutch or English). Return ONLY valid JSON, no markdown:

{
  "name": "Recipe name in English",
  "emoji": "single food emoji",
  "people": 2,
  "minutes": 30,
  "tags": ["meat" or "fish" or "vegetarian" or "vegan", optionally "quick", "high-protein", "lean"],
  "nutrition": {"kcal": 480, "protein": 45, "carbs": 40, "fat": 12},
  "ingredients": [{"name": "name in English", "amount": "200", "unit": "g"}],
  "steps": ["step 1", "step 2", "..."]
}

- Translate Dutch to English
- Match ingredient names to: ${ingredientList}
- For nutrition: use values shown on recipe if visible; otherwise estimate per portion based on ingredients (kcal, protein, carbs, fat in grams)
- Add "high-protein" tag if protein >= 30g; "lean" if kcal <= 500 AND fat <= 15g
- Include cooking steps if visible (otherwise omit "steps")
- Return ONLY JSON. If unreadable: {"error": "reason"}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 2000,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: imageType, data: imageData } },
            { type: "text", text: prompt },
          ]}],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.error) { setError(parsed.error); setStage("error"); return; }

      const ingredients = (parsed.ingredients || []).map((it) => {
        const matched = matchIngredient(it.name);
        const amount = parseFloat((it.amount || "1").toString().replace(",", ".")) || 1;
        if (matched) {
          let q = 1;
          const du = matched.unit.toLowerCase();
          const iu = (it.unit || "").toLowerCase();
          if (iu.includes("g") && !iu.includes("kg") && du.includes("kg")) q = amount / 1000;
          else if (iu.includes("ml") && (du === "liter" || du.includes("l"))) q = amount / 1000;
          else q = amount;
          return { name: matched.name, unit: matched.unit, price: matched.price, quantity: Math.max(0.1, Math.round(q * 10) / 10), _scanned: true };
        }
        return { name: it.name, unit: it.unit || "each", price: 1.00, quantity: amount, _custom: true, _scanned: true };
      });

      onScanned({
        name: parsed.name || "Scanned recipe",
        emoji: parsed.emoji || "🍽️",
        people: parsed.people || people,
        minutes: parsed.minutes || 30,
        tags: parsed.tags || ["meat"],
        nutrition: parsed.nutrition || null,
        ingredients,
        steps: parsed.steps || null, // null means use AI-generated default
      });
    } catch (err) {
      setError(err.message || "Failed to read recipe");
      setStage("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(0,0,0,0.5)" }} onClick={stage !== "scanning" ? onClose : undefined}>
      <div className="w-full max-w-3xl mx-auto rounded-t-3xl slide-up overflow-hidden" style={{ background: C.bg }} onClick={(e) => e.stopPropagation()}>
        <div className="px-4 pt-3 pb-3" style={{ background: C.card, borderBottom: `0.5px solid ${C.separator}` }}>
          <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ background: C.separator }} />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles size={18} style={{ color: C.purple }} /> {t.scanRecipe}</h2>
            {stage !== "scanning" && (
              <button onClick={onClose} className="ios-btn p-2 rounded-full" style={{ background: C.bg }}>
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          {stage === "pick" && (
            <>
              <p className="text-sm mb-4 text-center" style={{ color: C.textSecondary }}>
                {t.scanHint}
              </p>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => cameraInputRef.current?.click()} className="ios-btn ios-card p-6 flex flex-col items-center gap-2" style={{ background: C.blue, color: "#fff" }}>
                  <Camera size={28} strokeWidth={2} />
                  <span className="text-sm font-semibold">{t.camera}</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="ios-btn ios-card p-6 flex flex-col items-center gap-2">
                  <Upload size={28} strokeWidth={2} style={{ color: C.blue }} />
                  <span className="text-sm font-semibold">{t.upload}</span>
                </button>
              </div>
              {error && <p className="text-xs mt-3 text-center" style={{ color: C.red }}>{error}</p>}
            </>
          )}

          {stage === "preview" && (
            <>
              <div className="rounded-2xl overflow-hidden mb-4" style={{ background: C.card }}>
                <img src={`data:${imageType};base64,${imageData}`} alt="Recipe" className="w-full max-h-72 object-contain" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setStage("pick"); setImageData(null); }} className="ios-btn flex-1 py-3 rounded-2xl font-semibold" style={{ background: C.card, color: C.text, border: `1px solid ${C.separator}` }}>
                  {t.retake}
                </button>
                <button onClick={scan} className="ios-btn flex-1 py-3 rounded-2xl font-semibold text-white flex items-center justify-center gap-1.5" style={{ background: C.blue }}>
                  <Sparkles size={14} /> {t.extract}
                </button>
              </div>
            </>
          )}

          {stage === "scanning" && (
            <div className="py-12 text-center">
              <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: C.blue }} />
              <p className="font-semibold">{t.readingRecipe}</p>
              <p className="text-xs mt-1" style={{ color: C.textSecondary }}>{t.extractingHint}</p>
            </div>
          )}

          {stage === "error" && (
            <div className="py-6 text-center">
              <div className="text-3xl mb-2">😕</div>
              <p className="font-semibold mb-1">{t.didntWork}</p>
              <p className="text-xs mb-4" style={{ color: C.textSecondary }}>{error}</p>
              <button onClick={() => { setStage("pick"); setImageData(null); setError(""); }} className="ios-btn px-5 py-2 rounded-full font-semibold text-white" style={{ background: C.blue }}>
                {t.tryAgain}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ RECIPE EDIT MODAL ============
function RecipeModal({ recipe, onSave, onClose, adjustedPrice, people, t, lang }) {
  const [name, setName] = useState(recipe?.name || "");
  const [emoji, setEmoji] = useState(recipe?.emoji || "🍽️");
  const [ingredients, setIngredients] = useState(recipe?.ingredients || []);
  const [recipePeople, setRecipePeople] = useState(recipe?.people || people);
  const [minutes, setMinutes] = useState(recipe?.minutes || 30);
  const [tags, setTags] = useState(recipe?.tags || []);
  const [steps, setSteps] = useState(recipe?.steps || []);
  const [nutrition, setNutrition] = useState(recipe?.nutrition || { kcal: "", protein: "", carbs: "", fat: "" });
  const [search, setSearch] = useState("");

  const filtered = INGREDIENT_DB.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  const addIng = (it) => {
    const ex = ingredients.find((i) => i.name === it.name && i.unit === it.unit);
    if (ex) {
      setIngredients(ingredients.map((i) => i.name === it.name && i.unit === it.unit ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setIngredients([...ingredients, { ...it, quantity: 1 }]);
    }
    setSearch("");
  };
  const updateQty = (idx, qty) => {
    const arr = [...ingredients];
    arr[idx].quantity = Math.max(0.1, parseFloat(qty) || 0.1);
    setIngredients(arr);
  };
  const updatePrice = (idx, price) => {
    const arr = [...ingredients];
    arr[idx].price = Math.max(0, parseFloat(price.replace(",", ".")) || 0);
    delete arr[idx]._custom;
    setIngredients(arr);
  };
  const removeIng = (idx) => setIngredients(ingredients.filter((_, i) => i !== idx));
  const toggleTag = (t) => setTags(tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t]);

  const handleSave = () => {
    if (!name || ingredients.length === 0) return;
    const clean = ingredients.map(({ _custom, _scanned, ...rest }) => rest);
    const nutritionClean = nutrition.kcal || nutrition.protein
      ? { kcal: Number(nutrition.kcal) || 0, protein: Number(nutrition.protein) || 0, carbs: Number(nutrition.carbs) || 0, fat: Number(nutrition.fat) || 0 }
      : null;
    onSave({ id: recipe?.id, name, emoji, ingredients: clean, people: recipePeople, minutes, tags: tags.length > 0 ? tags : ["meat"], steps: steps.length > 0 ? steps : (recipe?.steps || null), nutrition: nutritionClean });
  };

  const ALL_TAGS = ["meat", "fish", "vegetarian", "vegan", "high-protein", "lean", "quick", "no-cook", "asian", "spicy"];
  const EMOJI_OPTIONS = ["🍽️","🍗","🐟","🥩","🍝","🍕","🍔","🌮","🥘","🍛","🍜","🥗","🍲","🍳","🥙","🌯","🍚","🥦","🍄","🧀"];
  const totalCost = ingredients.reduce((sum, i) => sum + adjustedPrice(i.price) * i.quantity, 0);
  const hasCustom = ingredients.some(i => i._custom);

  return (
    <div className="fixed inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="w-full max-w-3xl mx-auto h-[92vh] flex flex-col rounded-t-3xl slide-up overflow-hidden" style={{ background: C.bg }} onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 px-4 pt-3 pb-2 flex items-center justify-between" style={{ background: C.card, borderBottom: `0.5px solid ${C.separator}` }}>
          <button onClick={onClose} className="ios-btn px-2 py-1 text-sm font-semibold" style={{ color: C.blue }}>{t.cancel}</button>
          <h2 className="font-bold">{recipe?._scanned ? t.reviewScanned : (recipe?.id ? t.editRecipe : t.newRecipe)}</h2>
          <button onClick={handleSave} disabled={!name || ingredients.length === 0} className="ios-btn px-2 py-1 text-sm font-bold disabled:opacity-30" style={{ color: C.blue }}>{t.saveBtn}</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
          {hasCustom && (
            <div className="ios-card p-3 flex items-start gap-2 text-sm" style={{ background: C.orangeSoft }}>
              <Sparkles size={14} style={{ color: C.orange }} className="mt-0.5 flex-shrink-0" />
              <span style={{ color: C.text }}>{t.customNote}</span>
            </div>
          )}

          {/* Name + emoji */}
          <div className="ios-card p-4">
            <div className="flex gap-3 items-center">
              <select value={emoji} onChange={(e) => setEmoji(e.target.value)} className="text-3xl bg-transparent outline-none cursor-pointer w-14 text-center">
                {EMOJI_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.newRecipe}
                className="flex-1 text-lg font-bold bg-transparent outline-none" />
            </div>
          </div>

          {/* People + time */}
          <div className="ios-card overflow-hidden">
            <SettingsRow label={t.serves}>
              <select value={recipePeople} onChange={(e) => setRecipePeople(Number(e.target.value))} className="bg-transparent outline-none font-medium" style={{ color: C.blue }}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? t.person : t.peopleW}</option>)}
              </select>
            </SettingsRow>
            <SettingsRow label={t.time} last>
              <input type="number" min="5" max="240" value={minutes} onChange={(e) => setMinutes(Number(e.target.value) || 30)}
                className="bg-transparent outline-none font-medium w-12 text-right" style={{ color: C.blue }} />
              <span style={{ color: C.textSecondary }} className="ml-1">{t.min}</span>
            </SettingsRow>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: C.textSecondary }}>{t.tags}</h3>
            <div className="ios-card p-3 flex flex-wrap gap-1.5">
              {ALL_TAGS.map(t => (
                <button key={t} onClick={() => toggleTag(t)} className="ios-btn px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: tags.includes(t) ? C.blue : C.bg, color: tags.includes(t) ? "#fff" : C.text }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Nutrition (per portion) */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: C.textSecondary }}>
              {t.nutritionPerPortion} <span style={{ color: C.textTertiary }}>{t.optional}</span>
            </h3>
            <div className="ios-card p-3 grid grid-cols-4 gap-2">
              {[
                { key: "kcal", label: t.kcal, placeholder: "480" },
                { key: "protein", label: t.protein + " g", placeholder: "45" },
                { key: "carbs", label: t.carbs + " g", placeholder: "40" },
                { key: "fat", label: t.fat + " g", placeholder: "12" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="text-center">
                  <input type="number" min="0" value={nutrition[key] || ""}
                    onChange={(e) => setNutrition({ ...nutrition, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full text-center text-lg font-bold rounded-lg py-1.5 outline-none"
                    style={{ background: C.bg, color: key === "protein" ? C.green : C.text }} />
                  <div className="text-[10px] font-medium uppercase tracking-wider mt-0.5" style={{ color: C.textTertiary }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: C.textSecondary }}>
              {t.ingredientsCount} ({ingredients.length})
            </h3>
            <div className="ios-card overflow-hidden">
              {ingredients.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm" style={{ color: C.textSecondary }}>
                  {t.searchAndAdd}
                </div>
              ) : (
                ingredients.map((it, idx) => (
                  <div key={idx} className="px-3 py-2.5 flex items-center gap-2" style={{ borderBottom: idx < ingredients.length - 1 ? `0.5px solid ${C.separator}` : "none" }}>
                    <input type="number" step="0.1" min="0.1" value={it.quantity} onChange={(e) => updateQty(idx, e.target.value)}
                      className="w-14 text-center bg-transparent rounded-md py-1 text-sm font-semibold" style={{ background: C.bg, color: C.text }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm flex items-center gap-1.5">
                        {tIng(it.name, lang)}
                        {it._custom && <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded" style={{ background: C.orange, color: "#fff" }}>{t.setPrice}</span>}
                      </div>
                      <div className="text-[10px]" style={{ color: C.textTertiary }}>{tUnit(it.unit, lang)}</div>
                    </div>
                    {it._custom ? (
                      <input type="text" defaultValue={it.price.toFixed(2)} onBlur={(e) => updatePrice(idx, e.target.value)} placeholder="€"
                        className="w-16 text-right rounded-md px-2 py-1 text-sm font-semibold" style={{ background: C.orangeSoft, color: C.text }} />
                    ) : (
                      <span className="text-sm font-semibold w-16 text-right">{fmt(adjustedPrice(it.price) * it.quantity)}</span>
                    )}
                    <button onClick={() => removeIng(idx)} className="ios-btn p-1"><X size={14} style={{ color: C.textTertiary }} /></button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Search */}
          <div>
            <div className="ios-card flex items-center gap-2 px-3 py-2.5">
              <Search size={16} style={{ color: C.textTertiary }} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchIngredient}
                className="flex-1 bg-transparent outline-none text-[15px]" />
            </div>
            {search && (
              <div className="ios-card mt-2 max-h-56 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="p-3 text-sm text-center" style={{ color: C.textSecondary }}>{t.noMatches}</div>
                ) : filtered.slice(0, 10).map(it => (
                  <button key={it.name} onClick={() => addIng(it)} className="ios-btn w-full px-4 py-2.5 flex items-center justify-between text-left text-sm"
                    style={{ borderBottom: `0.5px solid ${C.separator}` }}>
                    <span>{tIng(it.name, lang)} <span style={{ color: C.textTertiary }} className="text-xs">/ {tUnit(it.unit, lang)}</span></span>
                    <span className="font-semibold">{fmt(adjustedPrice(it.price))}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="ios-card p-4 flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: C.textSecondary }}>{t.totalFor} {recipePeople} {recipePeople === 1 ? t.person : t.peopleW}</span>
            <span className="text-2xl font-bold">{fmt(totalCost)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
