import { useEffect, useMemo, useState } from "react";
import { ProductData } from "../../helper/typesHS";
import { useProductService } from "./productsService";
import { ProductFilters, ProductModal, ProductTable } from "./productComponents";
import styles from './productsAdmin.module.css';

const ProductsAdmin = () => {
  const [isModalCreateProduct, setIsModalCreateProduct] = useState<boolean>(false);
  const [productsData, setProductsData] = useState<ProductData[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { handleGetProducts, loading} = useProductService();
  
  useEffect(() => {
    const fetchProductData = async () => {
      const data = await handleGetProducts();
      setProductsData(data)
    };

    fetchProductData();
  }, []);

  const filteredProducts = useMemo(() => {
    return productsData?.filter(({ data: product}) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === 'ALL' || product.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStatus = statusFilter === 'ALL'
        || (statusFilter === 'ACTIVE' && product.active)
        || (statusFilter === 'INACTIVE' && !product.active);

      return matchesSearch && matchesCategory && matchesStatus;
    })
  }, [productsData, searchTerm, categoryFilter, statusFilter]);

  if (loading) return (<div style={{ marginTop: "125px" }}>Cargando productos...</div>);

  return (
    <main >
      <section className={styles.productsSection}>
        <h1 className={styles.headerTitle}>Panel de administración - Productos</h1>
        <ProductFilters
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          setModalCreateProduct={setIsModalCreateProduct}
          onSearchChange={setSearchTerm}
          onCategoryFilterChange={setCategoryFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <ProductTable products={filteredProducts} setProductsData={setProductsData}/>
        {isModalCreateProduct && (<ProductModal setModalProduct={setIsModalCreateProduct} setProductsData={setProductsData} />)}
      </section>
    </main>
  )
}

export default ProductsAdmin;