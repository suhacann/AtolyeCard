import { ALL_CATEGORIES, ALL_CATEGORIES_LABEL, CATEGORIES, CATEGORY_LABELS } from '../data/categories.js'

// Ürün listesinin üstünde kategori düğmeleri. selected: 'tumu' ya da bir kategori anahtarı.
export default function CategoryFilter({ selected, onSelect }) {
  const options = [{ value: ALL_CATEGORIES, label: ALL_CATEGORIES_LABEL }, ...CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value] }))]

  return (
    <div className="category-filter" role="group" aria-label="Kategoriye göre süz">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`category-filter__option${selected === option.value ? ' category-filter__option--active' : ''}`}
          aria-pressed={selected === option.value}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
