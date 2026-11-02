import { CartContext } from './cart-context.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

export default function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('campuseats-cart', []) // lines of { item, qty }
  const [orders, setOrders] = useLocalStorage('campuseats-orders', [])

  // derived values, never stored
  const count = cart.reduce((sum, line) => sum + line.qty, 0)
  const total = cart.reduce((sum, line) => sum + line.item.price * line.qty, 0)

  function addToCart(item) {
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

  function changeQty(itemId, delta) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.item.id === itemId ? { ...line, qty: line.qty + delta } : line
        )
        .filter((line) => line.qty > 0)
    )
  }

  function removeFromCart(itemId) {
    setCart((prev) => prev.filter((line) => line.item.id !== itemId))
  }

  function placeOrder(details) {
    const order = {
      id: Date.now(),
      ...details,
      lines: cart,
      total,
      placedAt: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])
    setCart([])
  }

  const [favourites, setFavourites] = useLocalStorage('campuseats-favourites', [])

function toggleFavourite(itemId) {
  setFavourites((prev) =>
    prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
  )
}

  const value = { cart, orders, count, total, addToCart, changeQty, removeFromCart, placeOrder, favourites, toggleFavourite }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}