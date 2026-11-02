import { useCart } from '../hooks/useCart.js'

function OrdersPage() {
  const { orders } = useCart()

  if (orders.length === 0) {
    return <p className="muted">No orders yet.</p>
  }

  return (
    <section>
      <h2 className="section-title">My orders</h2>
      {orders.map((order) => (
        <div className="card" key={order.id} style={{ marginBottom: '1rem' }}>
          <h3>Order placed</h3>
          <p>Name: {order.name}</p>
          <p>Mahallah: {order.mahallah}</p>
          <p>Pickup time: {order.pickupTime}</p>
          <ul>
            {order.lines.map((line) => (
              <li key={line.item.id}>
                {line.qty} × {line.item.name}
              </li>
            ))}
          </ul>
          <p className="cart-total">Total: RM {order.total.toFixed(2)}</p>
        </div>
      ))}
    </section>
  )
}

export default OrdersPage