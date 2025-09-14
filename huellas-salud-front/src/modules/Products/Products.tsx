import { carrito, categorias, marcas, productos } from './data.ts';
import styles from './products.module.css';
import imgComida from '../../assets/dogchow.webp';
import defaultPetImage from "../../assets/simba.webp";
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductCardProps, ProductData } from '../../helper/typesHS';
import { useProductService } from './productsService';

const Products = () => {

  const [showCart, setShowCart] = useState<boolean>(false);
  const [productCounter, setProductCounter] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [productsData, setProductsData] = useState<ProductData[] | undefined>([]);

  const { loading, handleGetProducts } = useProductService();

  useEffect(() => {
    const fetchProductData = async () => {
      let data = await handleGetProducts();
      setProductsData(data);
    }
    fetchProductData();
  }, []);

  const handlerFormatCoin = (precio: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(precio);
  }

  const filteredProducts = useMemo(() => {
    return productsData?.filter(({ data: product}) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        || product.category.includes(searchTerm.toLowerCase());

      return matchesSearch;
    })
  }, [productsData, searchTerm])

  if (loading) return (<div style={{ marginTop: "125px" }}>Cargando productos...</div>);

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
        <ProductCard products={filteredProducts} setProductsData={setProductsData}/>
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

const ProductCard = ({ products, setProductsData}: ProductCardProps) => {

  if (!products || products.length === 0) return (<h2>No hay productos registrados</h2>);

  return (
    <main className={styles.cardProductsContainer}>
      {products?.map(({ data: product, meta }) => (
        <section className={styles.cardProduct} key={product.idProduct}>
          <aside className={styles.imgCardProduct}>
            <img src={getProductImage(product)} alt={product.name} className={styles.cardImage}/> 
          </aside>
          <h3 key={product.idProduct}>{product.name}</h3>
        </section>
      ))}
    </main>
  );
}

const getProductImage = (product: Product) => {
  if (product.mediaFile) {
    return `data:${product.mediaFile.contentType};base64,${product.mediaFile.attachment}`;
  }
  return defaultPetImage;
}

export default Products;