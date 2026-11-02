import { Link } from 'react-router'
import { useVendors } from '../hooks/useVendors.js'
import { useCart } from '../hooks/useCart.js'
import MenuItemCard from '../components/MenuItemCard.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'

function FavouritesPage() {
  const { vendors, loading, error, reload } = useVendors()
  const { favourites } = useCart()

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  // gather every menu item across all vendors, then keep the favourited ones
  const allItems = vendors.flatMap((vendor) => vendor.menu)
  const favouriteItems = allItems.filter((item) => favourites.includes(item.id))

  return (
    <section>
      <h2 className="section-title">My favourites</h2>
      {favouriteItems.length === 0 ? (
        <p className="muted">
          No favourites yet. Tap the heart on a menu item, or <Link to="/">browse vendors</Link>.
        </p>
      ) : (
        <div className="grid">
          {favouriteItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}

export default FavouritesPage