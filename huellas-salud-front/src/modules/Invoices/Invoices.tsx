import { useContext, useEffect, useMemo, useState } from "react";
import { AppointmentData, AuthContext, InvoiceData, PetData, ProductData, ServiceData, User, UserData } from "../../helper/typesHS";
import { useInvoiceService } from "./invoiceService";
import { InvoicesFilters, InvoiceTable } from "./invoiceComponents";
import styles from './invoice.module.css';
import Spinner from "../../components/spinner/Spinner";
import { useUserService } from "../Users/UserManagement/usersService";
import { usePetService } from "../Pets/petService";
import { useServiceService } from "../Services/servicesService";
import { useProductService } from "../Products/productsService";
import { metaEmpty } from "../Pets/petsUtils";

const Invoice = () => {
  const { user } = useContext(AuthContext);

  const [isModalCreateInvoice, setIsModalCreateInvoice] = useState<boolean>(false);
  const [invoicesData, setInvoicesData] = useState<InvoiceData[] | undefined>([]);
  const [usersData, setUsersData] = useState<UserData[] | undefined>([]);
  const [prodsData, setProdsData] = useState<ProductData[] | undefined>([]);
  const [petsData, setPetsData] = useState<PetData[] | undefined>([]);
  const [servicesData, setServicesData] = useState<ServiceData[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  const { handleGetInvoices, handleGetInvoicesUser } = useInvoiceService();
  const { handleGetUsers } = useUserService();
  const { handleGetPets, handleGetPetsOwner } = usePetService();
  const { handleGetServices } = useServiceService();
  const { handleGetProducts } = useProductService();

  useEffect(() => {
    if (!user) return;

    const fetchAppointmentData = async () => {
      let dataInvoices;
      let dataUser;
      let dataPet;
      let dataService;
      let dataProduct;

      if (user?.role === "ADMINISTRADOR" || user.role === "VETERINARIO") {
        dataInvoices = await handleGetInvoices();
        dataUser = await handleGetUsers();
        dataPet = await handleGetPets();
      } else {
        dataInvoices = await handleGetInvoicesUser(user.documentNumber);
        dataPet = await handleGetPetsOwner(user.documentNumber);
        dataUser = [{
          data: user,
          meta: metaEmpty
        }];
      }

      dataService = await handleGetServices();
      dataProduct = await handleGetProducts();

      setInvoicesData(dataInvoices);
      setUsersData(dataUser);
      setPetsData(dataPet);
      setServicesData(dataService);
      setProdsData(dataProduct);

      setLoading(false);
    };

    fetchAppointmentData();
  }, [user]);

  const invoicesWithNames = useMemo(() => {
    if (!invoicesData) return [];

    return invoicesData.map(invoiceMsg => {
      const invoice = invoiceMsg.data;

      const itemsWithNames = invoice.itemInvoice.map(item => {
        let name = "";

        if (item.idProduct) {
          const product = prodsData?.find(p => p.data.idProduct === item.idProduct);
          name = product ? product.data.name : "Producto no encontrado";
        } else if (item.idService) {
          const service = servicesData?.find(s => s.data.idService === item.idService);
          name = service ? service.data.name : "Servicio no encontrado";
        }

        return { ...item, name };
      });

      return {
        ...invoiceMsg,
        data: { ...invoice, itemInvoice: itemsWithNames }
      };
    });
  }, [invoicesData, setProdsData, setServicesData]);

  const filteredInvoices = useMemo(() => {
    return invoicesWithNames?.filter(({ data: invoice }) => {
      const matchesSearch =
        invoice.idInvoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.itemInvoice.some(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus = statusFilter === 'ALL' || invoice.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
  }, [invoicesData, searchTerm, statusFilter]);


  if (loading) return (<Spinner />);

  return (
    <main >
      <section className={styles.servicesSection}>
        {user?.role == "CLIENTE" ? (
          <h1 className={styles.headerTitle}>Historial de facturación</h1>
        ) : (
          <h1 className={styles.headerTitle}>Panel de administración - Facturas</h1>
        )}
        <InvoicesFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          setModalCreateInvoice={setIsModalCreateInvoice}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />
        {(!invoicesData || invoicesData.length === 0) ? (
          <h2>No hay facturas registradas</h2>
        ) : (
          <InvoiceTable invoices={filteredInvoices} setInvoicesData={setInvoicesData} users={usersData} services={servicesData} pets={petsData} prods={prodsData} />
        )}
        {/* {isModalCreateAppointment && (<AppointmentModal setModalAppointment={setIsModalCreateAppointment} setAppointmentsData={setAppointmentsData} users={usersData} services={servicesData} pets={petsData} vets={vetsData}/>)} */}
      </section>
    </main>
  )
}

export default Invoice;