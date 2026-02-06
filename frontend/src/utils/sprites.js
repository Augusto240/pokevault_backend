/**
 * ═══════════════════════════════════════════════════════
 *  PokéVault — Sprite Mapping System
 *  Maps items & categories to PokeAPI game sprites
 *  Sprites: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/
 * ═══════════════════════════════════════════════════════
 */

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items'

/**
 * Mapping of item names (lowercase, normalized) to PokeAPI sprite filenames
 */
const ITEM_SPRITE_MAP = {
  // Pokébolas
  'poke ball': 'poke-ball',
  'poké ball': 'poke-ball',
  'pokeball': 'poke-ball',
  'pokébola': 'poke-ball',
  'great ball': 'great-ball',
  'ultra ball': 'ultra-ball',
  'master ball': 'master-ball',
  'premier ball': 'premier-ball',
  'heal ball': 'heal-ball',
  'net ball': 'net-ball',
  'nest ball': 'nest-ball',
  'repeat ball': 'repeat-ball',
  'timer ball': 'timer-ball',
  'luxury ball': 'luxury-ball',
  'dusk ball': 'dusk-ball',
  'quick ball': 'quick-ball',
  'dive ball': 'dive-ball',
  'safari ball': 'safari-ball',
  'level ball': 'level-ball',
  'lure ball': 'lure-ball',
  'moon ball': 'moon-ball',
  'friend ball': 'friend-ball',
  'love ball': 'love-ball',
  'heavy ball': 'heavy-ball',
  'fast ball': 'fast-ball',
  'dream ball': 'dream-ball',
  'beast ball': 'beast-ball',
  'cherish ball': 'cherish-ball',

  // Poções
  'potion': 'potion',
  'super potion': 'super-potion',
  'hyper potion': 'hyper-potion',
  'max potion': 'max-potion',
  'full restore': 'full-restore',
  'revive': 'revive',
  'max revive': 'max-revive',
  'antidote': 'antidote',
  'burn heal': 'burn-heal',
  'ice heal': 'ice-heal',
  'awakening': 'awakening',
  'paralyze heal': 'paralyze-heal',
  'full heal': 'full-heal',
  'elixir': 'elixir',
  'max elixir': 'max-elixir',
  'ether': 'ether',
  'max ether': 'max-ether',
  'fresh water': 'fresh-water',
  'soda pop': 'soda-pop',
  'lemonade': 'lemonade',
  'moomoo milk': 'moomoo-milk',
  'energy powder': 'energy-powder',
  'energy root': 'energy-root',
  'heal powder': 'heal-powder',
  'revival herb': 'revival-herb',
  'sacred ash': 'sacred-ash',

  // Berries
  'oran berry': 'oran-berry',
  'lum berry': 'lum-berry',
  'sitrus berry': 'sitrus-berry',
  'leppa berry': 'leppa-berry',
  'cheri berry': 'cheri-berry',
  'chesto berry': 'chesto-berry',
  'pecha berry': 'pecha-berry',
  'rawst berry': 'rawst-berry',
  'aspear berry': 'aspear-berry',
  'persim berry': 'persim-berry',
  'razz berry': 'razz-berry',
  'bluk berry': 'bluk-berry',
  'nanab berry': 'nanab-berry',
  'wepear berry': 'wepear-berry',
  'pinap berry': 'pinap-berry',
  'figy berry': 'figy-berry',
  'wiki berry': 'wiki-berry',
  'mago berry': 'mago-berry',
  'aguav berry': 'aguav-berry',
  'iapapa berry': 'iapapa-berry',
  'liechi berry': 'liechi-berry',
  'ganlon berry': 'ganlon-berry',
  'salac berry': 'salac-berry',
  'petaya berry': 'petaya-berry',
  'apicot berry': 'apicot-berry',
  'lansat berry': 'lansat-berry',
  'starf berry': 'starf-berry',

  // TMs / HMs
  'tm normal': 'tm-normal',
  'tm fire': 'tm-fire',
  'tm water': 'tm-water',
  'tm electric': 'tm-electric',
  'tm grass': 'tm-grass',
  'tm ice': 'tm-ice',
  'tm fighting': 'tm-fighting',
  'tm poison': 'tm-poison',
  'tm ground': 'tm-ground',
  'tm flying': 'tm-flying',
  'tm psychic': 'tm-psychic',
  'tm bug': 'tm-bug',
  'tm rock': 'tm-rock',
  'tm ghost': 'tm-ghost',
  'tm dragon': 'tm-dragon',
  'tm dark': 'tm-dark',
  'tm steel': 'tm-steel',
  'tm fairy': 'tm-fairy',

  // Battle items
  'x attack': 'x-attack',
  'x defense': 'x-defense',
  'x speed': 'x-speed',
  'x sp. atk': 'x-sp-atk',
  'x sp. def': 'x-sp-def',
  'x accuracy': 'x-accuracy',
  'dire hit': 'dire-hit',
  'guard spec.': 'guard-spec',
  'guard spec': 'guard-spec',

  // Hold items
  'leftovers': 'leftovers',
  'shell bell': 'shell-bell',
  'focus sash': 'focus-sash',
  'life orb': 'life-orb',
  'choice band': 'choice-band',
  'choice specs': 'choice-specs',
  'choice scarf': 'choice-scarf',
  'eviolite': 'eviolite',
  'assault vest': 'assault-vest',
  'rocky helmet': 'rocky-helmet',
  'weakness policy': 'weakness-policy',
  'scope lens': 'scope-lens',
  'muscle band': 'muscle-band',
  'wise glasses': 'wise-glasses',
  'expert belt': 'expert-belt',
  'bright powder': 'bright-powder',
  'quick claw': 'quick-claw',
  'kings rock': 'kings-rock',
  'mental herb': 'mental-herb',
  'power herb': 'power-herb',
  'white herb': 'white-herb',
  'focus band': 'focus-band',
  'air balloon': 'air-balloon',
  'soothe bell': 'soothe-bell',
  'cleanse tag': 'cleanse-tag',
  'smoke ball': 'smoke-ball',
  'everstone': 'everstone',
  'lucky egg': 'lucky-egg',
  'amulet coin': 'amulet-coin',
  'exp. share': 'exp-share',
  'exp share': 'exp-share',

  // Evolution items
  'fire stone': 'fire-stone',
  'water stone': 'water-stone',
  'thunder stone': 'thunder-stone',
  'leaf stone': 'leaf-stone',
  'moon stone': 'moon-stone',
  'sun stone': 'sun-stone',
  'shiny stone': 'shiny-stone',
  'dusk stone': 'dusk-stone',
  'dawn stone': 'dawn-stone',
  'ice stone': 'ice-stone',
  'oval stone': 'oval-stone',
  'kings rock evo': 'kings-rock',
  'metal coat': 'metal-coat',
  'dragon scale': 'dragon-scale',
  'upgrade': 'up-grade',
  'dubious disc': 'dubious-disc',
  'protector': 'protector',
  'electirizer': 'electirizer',
  'magmarizer': 'magmarizer',
  'razor fang': 'razor-fang',
  'razor claw': 'razor-claw',
  'deep sea tooth': 'deep-sea-tooth',
  'deep sea scale': 'deep-sea-scale',
  'prism scale': 'prism-scale',
  'reaper cloth': 'reaper-cloth',
  'sachet': 'sachet',
  'whipped dream': 'whipped-dream',
  'sweet apple': 'sweet-apple',
  'tart apple': 'tart-apple',
  'cracked pot': 'cracked-pot',
  'galarica cuff': 'galarica-cuff',
  'galarica wreath': 'galarica-wreath',

  // Key items / misc
  'rare candy': 'rare-candy',
  'pp up': 'pp-up',
  'pp max': 'pp-max',
  'protein': 'protein',
  'iron': 'iron',
  'calcium': 'calcium',
  'zinc': 'zinc',
  'carbos': 'carbos',
  'hp up': 'hp-up',
  'repel': 'repel',
  'super repel': 'super-repel',
  'max repel': 'max-repel',
  'escape rope': 'escape-rope',
  'poke doll': 'poke-doll',
  'fluffy tail': 'fluffy-tail',
  'nugget': 'nugget',
  'big nugget': 'big-nugget',
  'pearl': 'pearl',
  'big pearl': 'big-pearl',
  'stardust': 'stardust',
  'star piece': 'star-piece',
  'comet shard': 'comet-shard',
  'heart scale': 'heart-scale',
  'honey': 'honey',
  'ability capsule': 'ability-capsule',
  'ability patch': 'ability-patch',
  'bottle cap': 'bottle-cap',
  'gold bottle cap': 'gold-bottle-cap',
  'exp. candy xs': 'exp-candy-xs',
  'exp. candy s': 'exp-candy-s',
  'exp. candy m': 'exp-candy-m',
  'exp. candy l': 'exp-candy-l',
  'exp. candy xl': 'exp-candy-xl',
  'dynamax candy': 'dynamax-candy',
  'tera shard': 'tera-shard',
}

/**
 * Category → representative sprite mapping
 */
const CATEGORY_SPRITE_MAP = {
  'pokébolas': 'poke-ball',
  'pokebolas': 'poke-ball',
  'poções': 'potion',
  'pocoes': 'potion',
  'berries': 'oran-berry',
  'tms/hms': 'tm-normal',
  'tms': 'tm-normal',
  'hms': 'tm-normal',
  'itens de batalha': 'x-attack',
  'itens de evolução': 'fire-stone',
  'held items': 'leftovers',
  'itens segurados': 'leftovers',
  'key items': 'rare-candy',
  'vitaminas': 'protein',
  'pedras': 'fire-stone',
  'medicina': 'potion',
  'repelentes': 'repel',
  'tesouros': 'nugget',
}

/**
 * Category → color theme mapping
 */
export const CATEGORY_COLORS = {
  'pokébolas': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: '#DC2626' },
  'pokebolas': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: '#DC2626' },
  'poções': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: '#7C3AED' },
  'pocoes': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: '#7C3AED' },
  'berries': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', accent: '#059669' },
  'tms/hms': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', accent: '#4338CA' },
  'itens de batalha': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', accent: '#EA580C' },
}

/**
 * Get the sprite URL for an item by name
 * @param {string} itemName
 * @returns {string|null}
 */
export function getItemSprite(itemName) {
  if (!itemName) return null
  const normalized = itemName.toLowerCase().trim()
  const slug = ITEM_SPRITE_MAP[normalized]
  if (slug) return `${SPRITE_BASE}/${slug}.png`

  // Fuzzy match: try to find a partial match
  for (const [key, val] of Object.entries(ITEM_SPRITE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return `${SPRITE_BASE}/${val}.png`
    }
  }

  return null
}

/**
 * Get the sprite URL for a category by name
 * @param {string} categoryName
 * @returns {string|null}
 */
export function getCategorySprite(categoryName) {
  if (!categoryName) return null
  const normalized = categoryName.toLowerCase().trim()
  const slug = CATEGORY_SPRITE_MAP[normalized]
  if (slug) return `${SPRITE_BASE}/${slug}.png`

  for (const [key, val] of Object.entries(CATEGORY_SPRITE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return `${SPRITE_BASE}/${val}.png`
    }
  }

  return null
}

/**
 * Get color classes for a category
 * @param {string} categoryName
 * @returns {object}
 */
export function getCategoryColor(categoryName) {
  if (!categoryName) return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', accent: '#6B7280' }
  const normalized = categoryName.toLowerCase().trim()
  
  for (const [key, colors] of Object.entries(CATEGORY_COLORS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return colors
    }
  }

  return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', accent: '#0284C7' }
}

/**
 * Get a fallback Pokéball-style sprite for unknown items
 * @returns {string}
 */
export function getFallbackSprite() {
  return `${SPRITE_BASE}/poke-ball.png`
}

/**
 * Get sprite URL by direct slug name
 * @param {string} slug 
 * @returns {string}
 */
export function getSpriteBySlug(slug) {
  return `${SPRITE_BASE}/${slug}.png`
}

export default {
  getItemSprite,
  getCategorySprite,
  getCategoryColor,
  getFallbackSprite,
  getSpriteBySlug,
}
