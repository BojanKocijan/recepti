import { supabase } from "./supabase";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Map a DB row → app recipe object */
const fromRow = (row) => ({
  id: row.id,
  name: row.name,
  emoji: row.emoji,
  people: row.people,
  minutes: row.minutes,
  tags: row.tags ?? [],
  nutrition: row.nutrition ?? null,
  ingredients: row.ingredients ?? [],
  steps: row.steps ?? [],
  sourceId: row.source_id ?? undefined,
  category: row.category ?? 'dinner',
});

/** Map an app recipe object → DB row */
const toRow = (recipe) => ({
  id: recipe.id,
  name: recipe.name,
  emoji: recipe.emoji ?? "🍽️",
  people: recipe.people ?? 2,
  minutes: recipe.minutes ?? null,
  tags: recipe.tags ?? [],
  nutrition: recipe.nutrition ?? null,
  ingredients: recipe.ingredients ?? [],
  steps: recipe.steps ?? [],
  source_id: recipe.sourceId ?? null,
  category: recipe.category ?? 'dinner',
});

// ── public API ────────────────────────────────────────────────────────────────

/** Fetch all recipes. Returns [] if Supabase is unavailable. */
export const getRecipes = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("getRecipes error:", error.message);
    return [];
  }
  return data.map(fromRow);
};

/** Insert or update a recipe. Returns the saved recipe or null on error. */
export const upsertRecipe = async (recipe) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("recipes")
    .upsert(toRow(recipe), { onConflict: "id" })
    .select()
    .single();
  if (error) {
    console.error("upsertRecipe error:", error.message);
    return null;
  }
  return fromRow(data);
};

/** Delete a recipe by id. Returns true on success. */
export const deleteRecipe = async (id) => {
  if (!supabase) return false;
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) {
    console.error("deleteRecipe error:", error.message);
    return false;
  }
  return true;
};

/**
 * One-time migration: push all recipes from localStorage into Supabase.
 * Skips any IDs already present in the DB.
 */
export const migrateFromLocalStorage = async (localRecipes) => {
  if (!supabase || !localRecipes || localRecipes.length === 0) return;

  const { data: existing } = await supabase
    .from("recipes")
    .select("id");

  const existingIds = new Set((existing ?? []).map((r) => r.id));
  const toMigrate = localRecipes.filter((r) => !existingIds.has(r.id));

  if (toMigrate.length === 0) return;

  const { error } = await supabase
    .from("recipes")
    .insert(toMigrate.map(toRow));

  if (error) {
    console.error("migrateFromLocalStorage error:", error.message);
  } else {
    console.info(`Migrated ${toMigrate.length} recipe(s) to Supabase.`);
  }
};
