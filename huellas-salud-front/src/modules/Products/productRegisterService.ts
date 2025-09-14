import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreateProductModalProps, MediaFile, Product, ProductData } from "../../helper/typesHS";
import axiosInstance from "../../context/axiosInstance";
import axios from "axios";
import Swal from "sweetalert2";

export const useProductRegister = ({ setModalProduct, setProductsData, productSelected }: CreateProductModalProps) => {
    const fileInput = useRef<HTMLInputElement>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [previewImg, setPreviewImg] = useState<string | undefined>();
    const [fileName, setFileName] = useState<string>("Cargar imagen del producto");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<Product>({ defaultValues: { status: "activo" } })

    useEffect(() => {
        if (productSelected?.data.mediaFile) {
            setPreviewImg(`data:${productSelected.data.mediaFile.contentType};base64,${productSelected.data.mediaFile.attachment}`); // Base64 si lo tienes
            setFileName(productSelected.data.mediaFile.fileName);
        }
        if (productSelected?.data) {
            reset(productSelected.data);
        }
    }, [productSelected, reset]);


    const createProduct = async (productData: Product) => {
        const payload = { data: productData };
        console.log(payload);
        toast.info(`Creando registro del producto ${productData.name.toUpperCase()}... ⌛`, { autoClose: 1200 });

        const file = fileInput.current?.files?.[0];
        console.log(file);
        const { data: createdProduct } = await axiosInstance.post<ProductData>("product/register", payload);
        console.log(createdProduct);
        if (file && createdProduct?.data?.idProduct) {

            const formData = new FormData();
            formData.append("file", file);

            console.log(formData);
            try {
                const { data: mediaFile } = await axiosInstance.post<MediaFile>(
                    `/avatar-user/PRODUCT/${createdProduct.data.idProduct}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                createdProduct.data.mediaFile = mediaFile;
                console.log(createdProduct);
            } catch (err) {
                toast.error("Producto creado, pero falló el envío de imagen");
            }
        }

        setProductsData && setProductsData(prev => [...(prev ?? []), createdProduct]);
        return createdProduct;
    };

    const handleError = (error: unknown) => {
        setErrorMsg("Error en servicio de creación de producto");
        let errorMessage = "Error desconocido al crear producto nuevo";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    }

    const onSubmit = async (product: Product) => {
        const file = fileInput.current?.files?.[0];
        if (!file) {
            toast.error("¡Debe subir una imagen del producto!");
            return;
        }

        setLoading(true);

        try {
            await createProduct(product);
            toast.success("Producto registrado con éxito! 🎉");
            setErrorMsg("");
            reset();
            setModalProduct && setModalProduct(false);
        } catch (error) { handleError(error); }
        finally { setLoading(false); }
    }

    const handleChangeImg = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const maxSize = 4 * 1024 * 1024;
        const validTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!validTypes.includes(file.type)) {
            toast.info('Sólo se permiten imágenes en formato JPG, PNG o WEBP');
            return;
        }

        if (file.size > maxSize) {
            toast.error('La imagen no debe pesar más de 4 MB');
            return;
        }

        setPreviewImg(URL.createObjectURL(file));
        setFileName(file.name);
    }

    const handleUpdatePet = async (product: Product) => {
        const payload = { data: product };
        setLoading(true);
        toast.info("Actualizando producto... ⌛", { autoClose: 1000 });

        try {
            const file = fileInput.current?.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    await axiosInstance.put<MediaFile>(
                        `/avatar-user/update/PRODUCT/${payload.data.idProduct}`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                } catch (err) {
                    toast.error("Producto actualizado, pero falló el envío de imagen");
                }
            }
            const { data: productUpdated } = await axiosInstance.put(`/product/update`, payload);

            setProductsData &&
                setProductsData(prev =>
                    prev?.map(p =>
                        p.data.idProduct === productUpdated.data.idProduct ? productUpdated : p
                    )
                );

            toast.success("Producto actualizado con éxito! 🎉", { autoClose: 1500 });
            setModalProduct && setModalProduct(false);
            return payload.data;
        } catch (error) {
            handleError("Error al actualizar el producto");
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const confirmUpdate = async (product: Product): Promise<boolean> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas actualizar la mascota ${product.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Actualizar mascota`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            handleUpdatePet(product);
            return true;
        }
        return false;
    }


    return {
        confirmUpdate,
        errorMsg,
        handleCreateProductSubmit: onSubmit,
        loading,
        register,
        errors,
        handleSubmit,
        fileName,
        fileInput,
        previewImg,
        handleChangeImg,
        reset
    }
}