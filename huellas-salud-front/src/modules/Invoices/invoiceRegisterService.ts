import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreateInvoiceModalProps, Invoice, InvoiceData } from "../../helper/typesHS";
import axiosInstance from "../../context/axiosInstance";
import axios from "axios";
import Swal from "sweetalert2";

export const useInvoiceRegister = ({ setModalInvoice, setInvoicesData, invoiceSelected }: CreateInvoiceModalProps) => {

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Invoice>({ defaultValues: { status: "PAGADA" } })

    useEffect(() => {
        if (invoiceSelected?.data) {
            reset(invoiceSelected.data);
        }
    }, [invoiceSelected, reset]);


    const createInvoice = async (invoiceData: Invoice) => {
        const payload = { data: invoiceData };
        toast.info(`Creando registro de la factura por un total de $${invoiceData.total}... ⌛`, { autoClose: 1200 });

        const { data: createdInvoice } = await axiosInstance.post<InvoiceData>("invoice/create", payload);

        setInvoicesData && setInvoicesData(prev => [...(prev ?? []), createdInvoice]);
        return createdInvoice;
    };

    const handleError = (error: unknown) => {
        setErrorMsg("Error en servicio de creación de factura");
        let errorMessage = "Error desconocido al crear factura nueva";

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.title
                ? `${error.response.data.title}. ${error.response.data.detail || ''}`
                : error.message || 'Error en la comunicación con el servidor';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast.error(`${errorMessage} ❌`);
    }

    const onSubmit = async (invoice: Invoice) => {
        setLoading(true);

        try {
            await createInvoice(invoice);
            toast.success("Factura registrada con éxito! 🎉");
            setErrorMsg("");
            reset();
            setModalInvoice && setModalInvoice(false);
        } catch (error) { handleError(error); }
        finally { setLoading(false); }
    }

    const handleUpdateInvoice = async (invoice: Invoice) => {
        const payload = { data: invoice };
        setLoading(true);
        toast.info("Actualizando factura... ⌛", { autoClose: 1000 });

        try {
            const { data: invoiceUpdated } = await axiosInstance.put(`/invoice/update`, payload);

            setInvoicesData &&
                setInvoicesData(prev =>
                    prev?.map(s =>
                        s.data.idInvoice === invoiceUpdated.data.idInvoice ? invoiceUpdated : s
                    )
                );

            toast.success("Factura actualizada con éxito! 🎉", { autoClose: 1500 });
            setModalInvoice && setModalInvoice(false);
            return payload.data;
        } catch (error) {
            handleError("Error al actualizar la factura");
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const confirmUpdate = async (invoice: Invoice): Promise<boolean> => {
        if (
            invoiceSelected?.data &&
            JSON.stringify(invoiceSelected.data) === JSON.stringify(invoice)
        ) {
            toast.info("No realizaste ningún cambio en la factura.");
            return false;
        }

        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas actualizar la factura?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Actualizar Factura`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            handleUpdateInvoice(invoice);
            return true;
        }
        return false;
    }


    return {
        confirmUpdate,
        errorMsg,
        handleCreateInvoiceSubmit: onSubmit,
        loading,
        register,
        errors,
        handleSubmit,
        reset
    }
}