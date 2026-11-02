import { useCart } from '../hooks/useCart.js'

function MenuItemCard({ item }) {
  const { addToCart, favourites, toggleFavourite } = useCart()
  const isFavourite = favourites.includes(item.id)

  return (
    <article className="card menu-card">
      <div className="thumb" aria-hidden="true">
        {item.name.charAt(0)}
      </div>

      <p className="tag">{item.category}</p>
      <h3>{item.name}</h3>
      <p className="muted">{item.description}</p>
      <p className="price">RM {item.price.toFixed(2)}</p>

      {/* B6: Favourite button */}
      <button className="btn" onClick={() => toggleFavourite(item.id)}>
        {isFavourite ? '♥ Favourited' : '♡ Favourite'}
      </button>

      <button
        className="btn"
        disabled={!item.available}
        onClick={() => addToCart(item)}
      >
        {item.available ? 'Add to cart' : 'Sold out'}
      </button>
    </article>
  )
}

export default MenuItemCard
