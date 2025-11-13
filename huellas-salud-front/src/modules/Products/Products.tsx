import styles from './products.module.css';
import defaultPetImage from "../../assets/default_pet.webp";
import { useContext, useEffect, useMemo, useState } from 'react';
import { Product, ProductCardProps, ProductData } from '../../helper/typesHS';
import { useProductService } from './productsService';
import { formatCurrencyCOP } from '../../helper/formatter.ts';
import { CartContext } from '../Cart/types/cart.types.ts';
import Cart from '../Cart/Cart.tsx';
import Spinner from '../../components/spinner/Spinner.tsx';

const Products = () => {

  const { items } = useContext(CartContext);
  const [showCart, setShowCart] = useState<boolean>(false);
  const productCounter = items.reduce((acc, item) => acc + item.quantity, 0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [productsData, setProductsData] = useState<ProductData[] | undefined>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const { loading, handleGetProducts } = useProductService();

  // ✅ Cargar productos al montar
  useEffect(() => {
    const fetchProductData = async () => {
      const data = await handleGetProducts();
      setProductsData(data);
    };
    fetchProductData();
  }, []);

  // ✅ Categorías dinámicas
  const categories = useMemo(() => {
    const unique = new Set<string>();
    productsData?.forEach(({ data }) => {
      if (data.category) unique.add(data.category);
    });
    return Array.from(unique);
  }, [productsData]);

  // ✅ Subcategorías dinámicas (todas las que existan)
  const subcategories = useMemo(() => {
    const unique = new Set<string>();
    productsData?.forEach(({ data }) => {
      if (data.animalType) unique.add(data.animalType);
    });
    return Array.from(unique);
  }, [productsData]);

  // ✅ Manejar selección de categorías
  const handleCategoryChange = (value: string) => {
    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  };

  // ✅ Manejar selección de subcategorías
  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value]
    );
  };

  // ✅ Filtrar productos
  const filteredProducts = useMemo(() => {
    return productsData?.filter(({ data: product }) => {
      const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const subcategoryMatch =
        selectedSubcategories.length === 0 ||
        selectedSubcategories.includes(product.animalType);
      return nameMatch && categoryMatch && subcategoryMatch;
    });
  }, [productsData, searchTerm, selectedCategories, selectedSubcategories]);

  if (loading) return <Spinner />;

  return (
    <main className={styles.containProducts}>
      {/* PANEL DE FILTROS */}
      <section className={styles.containFilter}>
        {/* 🔍 Buscar producto */}
        <div className={styles.sectionFilter}>
          <div className={styles.titleFilter}>
            Buscar producto<span><i className="fa-solid fa-magnifying-glass"></i></span>
          </div>
          <div className={styles.filterContain}>
            <input
              type="text"
              className={styles.search}
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 🧩 Categorías */}
        <div className={styles.sectionFilter}>
          <div className={styles.titleFilter}>
            Categorías<span><i className="fa-solid fa-square-caret-down"></i></span>
          </div>
          <div className={styles.filterContain}>
            <div className={styles.listCheckbox}>
              {categories.map(cat => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    value={cat}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />{" "}
                  {cat}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 🐾 Subcategorías */}
        <div className={styles.sectionFilter}>
          <div className={styles.titleFilter}>
            Subcategorías<span><i className="fa-solid fa-square-caret-down"></i></span>
          </div>
          <div className={styles.filterContain}>
            <div className={styles.listCheckbox}>
              {subcategories.map(sub => (
                <label key={sub}>
                  <input
                    type="checkbox"
                    value={sub}
                    checked={selectedSubcategories.includes(sub)}
                    onChange={() => handleSubcategoryChange(sub)}
                  />{" "}
                  {sub}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ♻️ Botón limpiar filtros */}
        <div className={styles.sectionFilter}>
          <button
            className={styles.cleanBtn}
            onClick={() => {
              setSearchTerm("");
              setSelectedCategories([]);
              setSelectedSubcategories([]);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </section>


      {/* 🧩 LISTADO DE PRODUCTOS */}
      <section className={styles.productCardContainer}>
        <ProductCard products={filteredProducts} setProductsData={setProductsData} />
      </section>

      {/* 🛒 ICONO DEL CARRITO */}
      <div className={styles.cartIcon} onClick={() => setShowCart(prev => !prev)}>
        <div className={styles.amount}>{productCounter}</div>
        <i className="fa-solid fa-cart-shopping"></i>
      </div>

      {showCart && (
        <section className={styles.cartSection}>
          <Cart />
        </section>
      )}
    </main>
  );
};

/* 🧩 Tarjetas de producto */
const ProductCard = ({ products }: ProductCardProps) => {
  const { addItem } = useContext(CartContext);
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = (product: Product) => {
    const quantity = quantities[product.idProduct] || 1;
    addItem(product, quantity);
  };

  if (!products || products.length === 0)
    return <h2 className={styles.noProducts}>No hay productos registrados</h2>;

  return (
    <main className={styles.cardProductsContainer}>
      {products.filter(({ data: p }) => p.active).map(({ data: product }) => (
        <section className={styles.cardProduct} key={product.idProduct}>
          <aside className={styles.imgCardProduct}>
            <img
              src={getProductImage(product)}
              alt={product.name}
              className={styles.cardImage}
            />
          </aside>
          <aside className={styles.nameProduct}>
            <h3>{product.name}</h3>
          </aside>
          <span className={styles.price}>{formatCurrencyCOP(product.price)}</span>
          <input
            type="number"
            defaultValue={1}
            max={product.quantityAvailable}
            min={1}
            onChange={(e) =>
              handleQuantityChange(product.idProduct, Number(e.target.value))
            }
          />
          <button
            className={styles.addCard}
            onClick={() => handleAdd(product)}
          >
            Añadir al carrito
          </button>
        </section>
      ))}
    </main>
  );
};

const getProductImage = (product: Product) => {
  if (product.mediaFile) {
    return `data:${product.mediaFile.contentType};base64,${product.mediaFile.attachment}`;
  }
  return defaultPetImage;
};

export default Products;
