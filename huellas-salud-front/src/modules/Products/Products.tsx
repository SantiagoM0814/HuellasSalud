import { carrito, categorias, marcas, productos } from './data.ts';
import styles from './products.module.css';
import imgComida from '../../assets/dogchow.webp';
import defaultPetImage from "../../assets/simba.webp";
import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductCardProps, ProductData } from '../../helper/typesHS';
import { useProductService } from './productsService';
import { formatCurrencyCOP } from '../../helper/formatter.ts';
import ButtonComponent from '../../components/Button/Button.tsx';
import { CartContext } from '../Cart/types/cart.types.ts';
import { CartProvider } from '../Cart/context/CartContext.tsx';
import CartPage from '../Cart/page/CartPage.tsx';

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
    <CartProvider>
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
            <CartPage/>
          </section>
        )}
      </main>
    </CartProvider>
  );
}

const ProductCard = ({ products, setProductsData}: ProductCardProps) => {
   const { addItem } = useContext(CartContext);

  if (!products || products.length === 0) return (<h2>No hay productos registrados</h2>);

  return (
    <main className={styles.cardProductsContainer}>
      {products?.map(({ data: product, meta }) => (
        <section className={styles.cardProduct} key={product.idProduct}>
          <aside className={styles.imgCardProduct}>
            <img src={getProductImage(product)} alt={product.name} className={styles.cardImage}/> 
          </aside>
          <aside className={styles.nameProduct}>
            <h3 key={product.idProduct}>{product.name}</h3>
          </aside>
          <span className={styles.price}>{formatCurrencyCOP(product.price)}</span>
          <input type="number" defaultValue={1} max={product.quantityAvailable} min={1}/>
          <button className={styles.addCard}
          onClick={() => addItem( product,  1)}>Añadir al carrito</button>
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