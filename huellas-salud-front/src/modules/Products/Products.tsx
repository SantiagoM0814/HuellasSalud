import { carrito, categorias, marcas, productos } from './data';
import styles from './products.module.css';
import imgComida from '../../assets/dogchow.webp';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {

  const [showCart, setShowCart] = useState<boolean>(false);
  const [productCounter, setProductCounter] = useState<number>(0);

  const handlerFormatCoin = (precio: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(precio);
  }

  return (
    <main className={styles.containProducts}>
      <section className={styles.containFilter}>
        <div className={styles.sectionFilter}>
          {/* <div className="tituloFiltro" onclick="cambiarFiltro('categoria')"> */}
          <div className={styles.titleFilter}>
            Categoría<span><i className="fa-solid fa-square-caret-down"></i></span>
          </div>
          <div className={styles.filterContain}>
            {/* <input type="text" className="buscar" placeholder="Buscar..." onkeyup="filtrarLista('listaCategoria', this.value)"> */}
            <input type="text" className={styles.search} placeholder="Buscar..." />
            <div className={styles.listCheckbox}>
              {categorias.map(category => (
                <label key={category.nombre}><input type="checkbox" value={category.nombre} /> {category.nombre}</label>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.sectionFilter}>
          {/* <div className="tituloFiltro" onclick="cambiarFiltro('marca')"> */}
          <div className={styles.titleFilter}>
            Marca<span><i className="fa-solid fa-square-caret-down"></i></span>
          </div>
          <div className={styles.filterContain}>
            {/* <input type="text" className="buscar" placeholder="Buscar..." onkeyup="filtrarLista('listaMarca', this.value)"> */}
            <input type="text" className={styles.search} placeholder="Buscar..." />
            <div className={styles.listCheckbox}>
              {marcas.map(marca => (
                <label key={marca.nombre}><input type="checkbox" value={marca.nombre} /> {marca.nombre}</label>
              ))}
            </div>
          </div>
        </div>
        <Link to={"/productos-admin"}>
          <button className={styles.managmentPrdBtn}>Gestión de productos</button>
        </Link>
      </section>
      <section className={styles.productCardContainer}>
        {productos.map((prod, index) => (
          <div className={styles.cardProduct} key={prod.name + index}>
            <img src={imgComida} alt={prod.name} />
            <div className={styles.productName}><h1>{prod.name}</h1></div>
            <h3 className={styles.productPrice}>Precio: {handlerFormatCoin(prod.price)}</h3>
            <h4>Cantidad:
              <input min="1" type="number" />
            </h4>
            {/* <button className="boton" onclick="agregarCarrito('${nombre}', '${precio}', '${imagen}', 'cantidad-${nombre}')"> */}
            <button className={styles.productBtn} onClick={() => setProductCounter(prev => prev + 1)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </section>
      {/* <div className="iconoCarrito" id="iconoCarrito" onclick="abrirCarrito()"> */}
      <div className={styles.cartIcon} onClick={() => setShowCart(prev => !prev)}>
        <div className={styles.amount}>{productCounter}</div>
        <i className="fa-solid fa-cart-shopping"></i>
      </div>
      {showCart && (
        <section className={styles.cartSection} >
          <h2>Productos en el carrito <i className="fa-solid fa-bone"></i></h2>
          <div>
            {carrito.map((prod, index) => (
              <div className={styles.cartItem} key={prod.name + index}>
                <img src={imgComida} alt={prod.name} />
                <p>{prod.name}<br />{handlerFormatCoin(prod.price)} x
                  {/* <input className="cantCarrito" type="number" min="1" value="${cantidad}" onchange="actualizarCantidad('${nombre}', this.value)" /> */}
                  <input className={styles.amountCart} type="number" min="1" value={prod.amount} />
                </p>
                {/* <button className="botonProducto" onclick="eliminarDelCarrito('${nombre}')"> */}
                <button className={styles.productBtnCart}>
                  <i className="fa-solid fa-trash-can" />
                </button>
              </div>
            ))}
          </div>
          <h3 style={{ padding: "10px" }}>Total compra: {handlerFormatCoin(25000)}</h3>
          <button className={styles.buyBtn}>Comprar</button>
          {/* <button className="cerrarCarrito" onclick="cerrarCarrito()"><i class="fa-solid fa-rectangle-xmark"></i></button> */}
          <button className={styles.closeCart} onClick={() => setShowCart(false)}>
            <i className="fa-solid fa-rectangle-xmark" />
          </button>
        </section>
      )}
    </main>
  );
}

export default Products;