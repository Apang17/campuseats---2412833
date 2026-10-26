import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'
import MenuList from './components/MenuList.jsx'
import Footer from './components/Footer.jsx'
import CartPage from './components/CartPage.jsx'
import { Loading, ErrorMessage } from './components/Status.jsx'

function App() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [cart, setCart] = useState([]) // lines of { item, qty }
  const [view, setView] = useState('menu') // 'menu' | 'cart' | 'done'
  const [lastOrder, setLastOrder] = useState(null)
  const [favourites, setFavourites] = useState([])
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch('/api/vendors.json', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setVendors(data)
        setSelectedVendorId(data[0].id)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  function handleAddToCart(item) {
    setCart((prev) => {
      const exists = prev.some((line) => line.item.id === item.id)
      if (exists) {
        return prev.map((line) =>
          line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line
        )
      }
      return [...prev, { item, qty: 1 }]
    })
  }

  function handleToggleFavourite(itemId) {
    setFavourites((prev) => {
    if (prev.includes(itemId)) {
      return prev.filter((id) => id !== itemId)
    }
      return [...prev, itemId]
    })
  }

  function handleChangeQty(itemId, delta) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.item.id === itemId ? { ...line, qty: line.qty + delta } : line
        )
        .filter((line) => line.qty > 0)
    )
  }

  function handleRemove(itemId) {
    setCart((prev) => prev.filter((line) => line.item.id !== itemId))
  }

function handlePlaceOrder(details) {
  const total = cart.reduce(
    (sum, line) => sum + line.item.price * line.qty,
    0
  )

  setLastOrder({ ...details, total })
  setCart([])
  setView('done')
}

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0)
  const selectedVendor = vendors.find((v) => v.id === selectedVendorId)
  // B6: Display all items or favourite items only
  const visibleMenuItems = selectedVendor
  ? selectedVendor.menu.filter((item) =>
      !showFavouritesOnly || favourites.includes(item.id)
    )
  : []

  let content
  if (view === 'cart') {
    content = (
      <CartPage
        cart={cart}
        onChangeQty={handleChangeQty}
        onRemove={handleRemove}
        onPlaceOrder={handlePlaceOrder}
      />
    )
  } else if (view === 'done') {
  content = (
    <div className="card">
      <h2>Order placed successfully!</h2>

      <p>Name: {lastOrder.name}</p>

      <p>Mahallah: {lastOrder.mahallah}</p>

      <p>Pickup Time: {lastOrder.pickupTime}</p>

      <p>Total: RM {lastOrder.total.toFixed(2)}</p>
    </div>
  )
  } else if (loading) {
    content = <Loading />
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
  } else {
    content = (
      <>
        <section>
          <h2 className="section-title">Choose a vendor</h2>
          <div className="vendor-grid">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isSelected={vendor.id === selectedVendorId}
                onSelect={setSelectedVendorId}
              />
            ))}
          </div>
        </section>
        {selectedVendor && (
          <section>
            <h2 className="section-title">Menu: {selectedVendor.name}</h2>

            {/* B6: Favourites Only toggle */}
            <label>
              <input
                type="checkbox"
                checked={showFavouritesOnly}
                onChange={(e) => setShowFavouritesOnly(e.target.checked)}
              />
              Favourites Only
            </label>

            <MenuList
              items={visibleMenuItems}
              onAdd={handleAddToCart}
              favourites={favourites}
              onToggleFavourite={handleToggleFavourite}
            />
          </section>
        )}
      </>
    )
  }

  return (
    <>
      <Header
        cartCount={cartCount}
        onShowMenu={() => setView('menu')}
        onShowCart={() => setView('cart')}
      />
      <main className="container">{content}</main>
      <Footer />
    </>
  )
}

export default App