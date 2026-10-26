function Header() {
  const cartCount = 0

  return (
    <header className="header">
      <h1 className="logo">CampusEats</h1>
      <nav className="nav">
        <a href="#">Vendors</a>
        <a href="#">My Orders</a>
        <a href="#">
          Cart <span className="badge">{cartCount}</span>
        </a>
      </nav>
    </header>
  )
}

export default Header