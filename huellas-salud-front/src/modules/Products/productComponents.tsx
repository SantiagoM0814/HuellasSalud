import { useContext, useEffect, useState } from "react";
import { AuthContext, CreateProductModalProps, FormProductProps, InputFieldProductRegister, Meta, Product, ProductData, ProductFiltersProps, ProductTableProps, SearchBarProps } from "../../helper/typesHS";
import styles from './productsAdmin.module.css';
import { categorys, species, statusOptions, tableProductColumns, unitOfMeasure } from "../Users/UserManagement/usersUtils";
import { formatCurrencyCOP } from "../../helper/formatter";
import defaultProductImg from "../../assets/default_product.webp";
import { useProductRegister } from "./productRegisterService";
import { productValidationRules } from "./validationRulesProductRegister";
import { RegisterOptions } from "react-hook-form";
import ButtonComponent from "../../components/Button/Button";
import { useProductService } from "./productsService";

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
        {categorys.map(category => (
          <option key={category.value} value={category.value}>
            {category.label}
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

export const ProductTable = ({ products, setProductsData }: ProductTableProps) => {
  const [productSelected, setProductSelected] = useState<ProductData | undefined>(undefined)
  const [isModalEditProduct, setIsModalEditProduct] = useState<boolean>(false);
  const { confirmUpdate, confirmDelete } = useProductService();


  const handleEditProduct = (product: Product, meta: Meta) => {
    setIsModalEditProduct(prev => !prev);
    setProductSelected({ data: product, meta })
  }

  if (!products || products.length === 0) return (<h2>No hay productos registrados</h2>);

  const changeProductStatus = async (product: Product, meta: Meta) => {
    if (await confirmUpdate(product)) meta.lastUpdate = new Date().toString();
  }

  const deleteProduct = async (product: Product) => {
      const idProduct = await confirmDelete(product);
      if (idProduct) setProductsData(prev => prev?.filter(p => p.data.idProduct !== idProduct));
    };

  return (
    <section className={styles.tableContainer}>
      <table className={styles.productTable}>
        <thead>
          <tr>
            {tableProductColumns.map(column => (<th key={column}>{column}</th>))}
          </tr>
        </thead>
        <tbody>
          {products?.map(({ data: product, meta }) => (
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
              <td>{product.category.charAt(0).toUpperCase() + product.category.slice(1).toLowerCase()}</td>
              <td>
                <span className={`${styles.status} ${product.active ? styles.active : styles.inactive}`}>
                  {product.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <aside className={styles.actions}>
                  <button
                    title="Editar"
                    className={`${styles.btn} ${styles.edit}`}
                    onClick={() => handleEditProduct(product, meta)}
                  >
                    <i className="fa-regular fa-pen-to-square" />
                  </button>
                  <button
                    title="Eliminar"
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => deleteProduct(product)}
                  >
                    <i className="fa-regular fa-trash-can" />
                  </button>
                  <button
                    title="Cambiar Estado"
                    className={`${styles.btn} ${styles.toggleStatus}`}
                    onClick={() => changeProductStatus(product, meta)}
                  >
                    <i className="fa-solid fa-power-off" />
                  </button>
                </aside>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalEditProduct && (
        <main className={styles.overlay}>
          <section className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setIsModalEditProduct && setIsModalEditProduct(false)}>x</button>
            <section className={styles.backgroundModalEdit} />
            <FormProduct setModalProduct={setIsModalEditProduct} setProductsData={setProductsData} productSelected={productSelected} />
          </section>
        </main>
      )}
    </section>
  );
}

export const ProductImg = ({ product }: { product: Product }) => {
  if (product.mediaFile) {
    return (<img src={`data:${product.mediaFile.contentType};base64,${product.mediaFile.attachment}`} alt={product.category} />);
  }

  const initials = product.name.charAt(0).toUpperCase();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA07A'];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div className={`${styles.imgDefault}`} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

export const FormProduct = ({ setModalProduct, setProductsData, productSelected }: FormProductProps) => {
  const { user } = useContext(AuthContext);

  const {
    errorMsg, handleCreateProductSubmit, confirmUpdate, loading, register, errors,
    handleSubmit, fileName, fileInput, previewImg, handleChangeImg, reset
  } = useProductRegister({ setModalProduct, setProductsData, productSelected });

  return (
    <form
      className={styles.formRegisterProduct}
      onSubmit={handleSubmit(productSelected ? confirmUpdate : handleCreateProductSubmit)}
    >
      <section className={styles.selectImg}>
        <label
          htmlFor="loadImg"
          className={styles.initialsAvatar}
          style={
            previewImg
              ? { backgroundImage: `url(${previewImg})`, backgroundSize: "cover", backgroundPosition: "center" }
              : {}
          }
        >
          {!previewImg && (<i className="fa-solid fa-box-open"></i>)}
        </label>
        <input
          type="file"
          name="image"
          id="loadImg"
          ref={fileInput}
          onChange={handleChangeImg}
          style={{ display: "none" }}
        />
        <span>{fileName}</span>
      </section>
      <InputField label="Nombre del producto" idInput="name" register={register} errors={errors} />
      <aside className={styles.inputField}>
        <label>Categoria<span className={styles.required}>*</span></label>
        <select id="category" className={`${errors.category ? styles.errorInput : ''}`} {...register("category", { required: "La categoria es obligatoria" })}>
          <option value="">Seleccione una categoria</option>
          {categorys.map(category =>
            (<option key={category.value} value={category.value}>{category.label}</option>)
          )}
        </select>
        {errors.category && (
          <p className={styles.errorMsg}>{errors.category.message}</p>
        )}
      </aside>
      <aside className={styles.inputField}>
        <label>SubCategoria<span className={styles.required}>*</span></label>
        <select id="animalType" className={`${errors.animalType ? styles.errorInput : ''}`} {...register("animalType", { required: "La SubCategoria es obligatoria" })}>
          <option value="">Seleccione una subcategoria</option>
          {species.map(specie =>
            (<option key={specie.value} value={specie.value}>{specie.label}</option>)
          )}
        </select>
        {errors.animalType && (
          <p className={styles.errorMsg}>{errors.animalType.message}</p>
        )}
      </aside>
      <InputField label="Precio" idInput="price" type="number" register={register} errors={errors} />
      <aside className={styles.inputField}>
        <label>Unidad de medida<span className={styles.required}>*</span></label>
        <select id="unitOfMeasure" className={`${errors.unitOfMeasure ? styles.errorInput : ''}`} {...register("unitOfMeasure", { required: "La u. medida es obligatoria" })}>
          <option value="">Seleccione una u. de medida</option>
          {unitOfMeasure.map(u =>
            (<option key={u.value} value={u.value}>{u.label}</option>)
          )}
        </select>
        {errors.unitOfMeasure && (
          <p className={styles.errorMsg}>{errors.unitOfMeasure.message}</p>
        )}
      </aside>
      <InputField label="Unidades" idInput="quantityAvailable" type="number" register={register} errors={errors} />
      <InputField label="Marca" idInput="brand" register={register} errors={errors} />
      <InputField label="Fecha de expiración" idInput="expirationDate" type="date" register={register} errors={errors} />
      <InputField label="Código de barras" idInput="barcode" type="number" register={register} errors={errors} />
      <aside className={styles.inputField}>
        <label htmlFor="description">Descripción<span className={styles.required}>*</span></label>
        <textarea
          id="description"
          {...register("description", {
            required: "La descripción es obligatoria",
            minLength: {
              value: 10,
              message: "Minimo 10 caracteres"
            },
            maxLength: {
              value: 200,
              message: "Máximo 200 caracteres",
            },
          })}
        />
        {errors.description && (
          <p className={styles.errorMsg}>{errors.description.message}</p>
        )}
      </aside>
      <aside className={`${styles.containerButtons} ${styles.inputFull}`}>
        <ButtonComponent type="submit" contain={productSelected ? "Actualizar Producto" : "Crear Producto"} loading={loading} />
      </aside>
    </form>
  )
}

export const ProductModal = ({ setModalProduct, setProductsData }: CreateProductModalProps) => {
  return (
    <main className={styles.overlay}>
      <section className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setModalProduct && setModalProduct(false)}>x</button>
        <section className={styles.backgroundModalEdit} />
        <FormProduct setModalProduct={setModalProduct} setProductsData={setProductsData} />
      </section>
    </main>
  )
}

const InputField = ({
  label,
  type = "text",
  idInput,
  required = true,
  inputFull = false,
  register,
  errors
}: InputFieldProductRegister) => {

  const fieldValidation = productValidationRules[idInput] as RegisterOptions<Product, typeof idInput>;

  return (
    <section className={styles.inputField}>
      <label htmlFor={idInput}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        className={`${errors[idInput] ? styles.errorInput : ''}`}
        id={idInput}
        type={type}
        required={required}
        {...register(idInput, fieldValidation)}
      />
      <span className={styles.validationError}>
        {errors[idInput]?.message as string}
      </span>
    </section >
  );
};