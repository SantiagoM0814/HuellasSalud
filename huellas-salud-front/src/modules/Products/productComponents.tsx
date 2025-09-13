import { useState } from "react";
import { Product, ProductFiltersProps, ProductTableProps, SearchBarProps } from "../../helper/typesHS";
import styles from './productsAdmin.module.css';
import { categorys, statusOptions, tableProductColumns } from "../Users/UserManagement/usersUtils";
import { formatCurrencyCOP } from "../../helper/formatter";

export const ProductFilters = ({
    searchTerm,
    categoryFilter,
    statusFilter,
    setModalCreateProduct,
    onSearchChange,
    onCategoryFilterChange,
    onStatusFilterChange
}: ProductFiltersProps) => (
    <section className={styles.filters}>
        <SearchBar
            placeholder="Buscar por nombre..."
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
        />

        <aside className={styles.selectFilters}>
            <button className={styles.btnCreateProduct} onClick={() => setModalCreateProduct(true)}>Registrar Producto</button>
            <select 
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className={styles.filterSelect}
            >
                <option value="ALL">Todas las categorias</option>
                {categorys.filter(category => category !== 'ALL').map(category => (
                    <option key={category} value={category}>
                        {category.charAt(0) + category.slice(1).toLowerCase()}
                    </option>
                ))}
            </select>

            <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className={styles.filterSelect}
            >
                {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </aside>
    </section>
);

export const SearchBar = ({ placeholder, searchTerm, onSearchChange }: SearchBarProps) => (
    <aside className={styles.searchBar}>
        <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
        <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
        />
    </aside>
);

export const ProductTable = ({ products, setProductsData}: ProductTableProps) => {
    if (!products || products.length === 0) return (<h2>No hay productos registrados</h2>);

    return (
        <section className={styles.tableContainer}>
            <table className={styles.productTable}>
                <thead>
                    <tr>
                        {tableProductColumns.map(column => (<th key={column}>{column}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {products?.map(({ data: product, meta}) => (
                        <tr key={product.idProduct}>
                            <td>
                                <aside className={styles.productInfo}>
                                    <span className={styles.imgProduct}>
                                        <ProductImg product={product} />
                                    </span>
                                    <div className={styles.productDetails}>
                                        <span className={styles.productName}>
                                            {product.name}
                                        </span>
                                        <span className={styles.productDate}>
                                            Registro: {new Date(meta.creationDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </aside>
                            </td>
                            <td>{product.brand}</td>
                            <td>{formatCurrencyCOP(product.price)}</td>
                            <td>{product.quantityAvailable}</td>
                            <td>{product.category}</td>
                            <td>
                                <aside className={styles.actions}>
                                    <button
                                        title="Editar"
                                        className={`${styles.btn} ${styles.edit}`}
                                    >
                                        <i className="fa-regular fa-pen-to-square" />
                                    </button>
                                    <button
                                        title="Eliminar"
                                        className={`${styles.btn} ${styles.delete}`}
                                    >
                                        <i className="fa-regular fa-trash-can" />
                                    </button>
                                    <button
                                        title="Cambiar Estado"
                                        className={`${styles.btn} ${styles.toggleStatus}`}
                                    >
                                        <i className="fa-solid fa-power-off" />
                                    </button>
                                </aside>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export const ProductImg = ({ product }: {product: Product}) => {
    if (product.mediaFile) {
        return (<img src={`data:${product.mediaFile.contentType};base64,${product.mediaFile.attachment}`} alt={product.category} />);
    }

    const initials = product.name.charAt(0).toUpperCase();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA07A'];
    const color = colors[initials.charCodeAt(0) % colors.length];

    return (
        <div className={`${styles.initialsAvatar}`} style={{ backgroundColor: color }}>
            {initials}
        </div>
    );
}