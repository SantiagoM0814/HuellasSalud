import { fieldsForm, productosAdmin } from "./data";
import styles from "./productsAdmin.module.css";
import imgPrd from "../../assets/Comida_Gato.webp";
import { useState } from "react";
import { Product } from "../../helper/typesHS";

const ProductsAdmin = () => {

  const [prdSelected, setPrdSelected] = useState<Product>({
    id: "0", image: "", name: "", price: 0, stock: 0, supplier: "", description: "",
    unitMeasure: "l", barcode: 0, category: "", expiration: new Date(), status: "activo"
  });

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(false);

  const handlerFormatCoin = (precio: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(precio);
  }

  const handlerCloseModal = () => {
    setShowEdit(false);
    setShowDelete(false);
    setShowAdd(false);
  }

  return (
    <main>
      <section className={styles.productsSection}>
        <div className={styles.title}>
          <h2>Panel de administración - Productos</h2>
        </div>
        <button className={styles.addBtn} onClick={() => { setShowAdd(true); }}>
          Agregar Producto <i className="fa-solid fa-cart-plus" />
        </button>
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Valor</th>
              <th>Unidades</th>
              <th>Categoría</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody id="productos">
            {productosAdmin.map((prod) => (
              <tr key={prod.id}>
                <td>
                  <img src={imgPrd} alt={prod.name} />
                </td>
                <td>{prod.name}</td>
                <td>{handlerFormatCoin(prod.price)}</td>
                <td>{prod.stock}</td>
                <td>{prod.category}</td>
                <td className={styles.options}>
                  <button
                    className={styles.editBtn}
                    onClick={() => { setPrdSelected(prod); setShowEdit(true); }}
                    title="Editar producto"
                  >
                    <i className="fa-solid fa-pencil" />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => { setShowDelete(true); }}
                    title="Eliminar producto">
                    <i className="fa-solid fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className={(showEdit || showDelete || showAdd) ? styles.modalEdit : ""}>
        {showEdit && <CompForm title="Modificación del producto" nameBtn="Actualizar producto" product={prdSelected} handlerCloseModal={handlerCloseModal} />}
        {showDelete && <div className={styles.deleteProduct} >
          <h1>Eliminar producto</h1>
          <h3 className={styles.deleteMsg}>¿Seguro que quieres eliminar el producto Comida de perro?</h3>
          <div className={styles.buttons}>
            <button className={styles.btnConfirmDelete}>Sí, eliminar</button>
            <button className={styles.btnCancelDelete} onClick={() => { setShowDelete(prev => !prev) }} >
              No, cancelar
            </button>
          </div>
        </div>}
        {showAdd && <CompForm title="Agregar producto" nameBtn="Agregar producto" handlerCloseModal={handlerCloseModal} />}
      </section>
    </main>
  );
}

interface CompFormProps {
  title: string;
  nameBtn: string;
  product?: Product;
  handlerCloseModal?: () => void;
}

const CompForm = ({ title, nameBtn, product, handlerCloseModal }: CompFormProps) => {

  return (
    <div className={styles.editProduct}>
      <h1 className={styles.editionTitle}>{title}</h1>
      <div className={styles.image}>
        <div className={styles.imageProd}>
          <img src={imgPrd} alt="ImageProduct" />
        </div>
        <button>Cargar imagen</button>
      </div>
      <div className={styles.information}>
        {
          fieldsForm.map((field) => (
            <div key={field.id} className={styles.dataForm}>
              <label htmlFor={field.id}>{field.label}</label>
              {(field.type === "textarea") ? (
                <textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={product ? product[field.id as keyof Product] as string : ""} />
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  placeholder={field.placeholder}
                  value={product ? product[field.id as keyof Product] as string : ""} />
              )}
            </div>
          ))
        }
      </div>
      <div className={styles.button}>
        <button className={styles.updateBtn}>{nameBtn}</button>
      </div>
      <div className={styles.modalClose} onClick={handlerCloseModal} >
        <i className={`fa-solid fa-square-xmark ${styles.btnClose}`}></i>
      </div>
    </div>
  );
}

export default ProductsAdmin;