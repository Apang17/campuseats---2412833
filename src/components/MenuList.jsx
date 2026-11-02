import { useState } from 'react'
import MenuItemCard from './MenuItemCard.jsx'
import { useCart } from '../hooks/useCart.js'

function MenuList({ items }) {
  const { favourites } = useCart()
  const [favouritesOnly, setFavouritesOnly] = useState(false)

  if (items.length === 0) {
    return <p className="muted">No items on this menu yet.</p>
  }

  const visible = favouritesOnly
    ? items.filter((item) => favourites.includes(item.id))
    : items

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={favouritesOnly}
          onChange={(e) => setFavouritesOnly(e.target.checked)}
        />{' '}
        Favourites only
      </label>

      {visible.length === 0 ? (
        <p className="muted">No favourites on this menu yet.</p>
      ) : (
        <div className="grid">
          {visible.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  )
}

export default MenuList