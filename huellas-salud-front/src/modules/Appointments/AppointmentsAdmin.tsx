import { useContext, useEffect, useMemo, useState } from "react";
import { AppointmentData, AuthContext, PetData, ServiceData, UserData } from "../../helper/typesHS";
import { useAppointmentService } from "./appointmentsService";
import { AppointmentsFilters, AppointmentModal, AppointmentTable } from "./appointmentComponents";
import styles from './appointmentsAdmin.module.css';
import Spinner from "../../components/spinner/Spinner";
import { useUserService } from "../Users/UserManagement/usersService";
import { usePetService } from "../Pets/petService";
import { useServiceService } from "../Services/servicesService";
import { metaEmpty } from "../Pets/petsUtils";

const AppointmentsAdmin = () => {
  const { user } = useContext(AuthContext);
  const [isModalCreateAppointment, setIsModalCreateAppointment] = useState<boolean>(false);
  const [appointmentsData, setAppointmentsData] = useState<AppointmentData[] | undefined>([]);
  const [usersData, setUsersData] = useState<UserData[] | undefined>([]);
  const [vetsData, setVetsData] = useState<UserData[] | undefined>([]);
  const [petsData, setPetsData] = useState<PetData[] | undefined>([]);
  const [servicesData, setServicesData] = useState<ServiceData[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { handleGetAppointments, handleGetAppointmentsUser, handleGetAppointmentsVet } = useAppointmentService();
  const { handleGetUsers, handleGetVeterinarians } = useUserService();
  const { handleGetPets, handleGetPetsOwner } = usePetService();
  const { handleGetServices } = useServiceService();

  useEffect(() => {
  if (!user) return;

  const fetchAppointmentData = async () => {
    setLoading(true);

    let dataAppointments; 
    let dataUser;
    let dataPets;
    let dataService;
    let dataVet;

    if (user.role === "ADMINISTRADOR") {
      // ADMIN carga todo
      dataAppointments = await handleGetAppointments();
      dataUser = await handleGetUsers();
      dataPets = await handleGetPets();
      dataService = await handleGetServices();
      dataVet = await handleGetVeterinarians();
    } 
    else if (user.role === "VETERINARIO") {
      // VETERINARIO solo las suyas
      dataAppointments = await handleGetAppointmentsVet(user.documentNumber);

      // Necesita sus clientes y mascotas asociadas
      dataUser = await handleGetUsers(); 
      dataPets = await handleGetPets();
      dataService = await handleGetServices();
      dataVet = [{
        data: user,
        meta: metaEmpty
      }];
    } 
    else {
      // CLIENTE solo carga lo suyo
      dataAppointments = await handleGetAppointmentsUser(user.documentNumber);

      dataUser = [{
        data: user,
        meta: metaEmpty
      }];
      dataPets = await handleGetPetsOwner(user.documentNumber); // mascotas del cliente
      dataService = await handleGetServices();
      dataVet = await handleGetVeterinarians();
    }

    setAppointmentsData(dataAppointments);
    setUsersData(dataUser);
    setPetsData(dataPets);
    setServicesData(dataService);
    setVetsData(dataVet);

    setLoading(false);
  };

  fetchAppointmentData();
}, [user]);


  const filteredAppointment = useMemo(() => {
    if (!appointmentsData) return [];

    return appointmentsData.filter(({ data: appointment }) => {

      const pet = petsData?.find(p => p.data.idPet === appointment.idPet);
      const owner = usersData?.find(u => u.data.documentNumber === appointment.idOwner);
      const vet = vetsData?.find(v => v.data.documentNumber === appointment.idVeterinarian);


      const petName = pet?.data.name?.toLowerCase() || "";
      const ownerName = `${owner?.data.name || ""} ${owner?.data.lastName || ""}`.toLowerCase();
      const vetName = `${vet?.data.name || ""} ${vet?.data.lastName || ""}`.toLowerCase();
      const appointmentId = appointment.idAppointment.toLowerCase();

      const matchesSearch =
        petName.includes(searchTerm.toLowerCase()) ||
        ownerName.includes(searchTerm.toLowerCase()) ||
        vetName.includes(searchTerm.toLowerCase()) ||
        appointmentId.includes(searchTerm.toLowerCase());

      // Filtro por estado
      const matchesStatus =
        statusFilter === "ALL" ||
        appointment.status.toLowerCase() === statusFilter.toLowerCase();
      
      const matchesDate =
        !dateFilter ||
        new Date(appointment.dateTime).toISOString().split('T')[0] === dateFilter;


      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointmentsData, petsData, usersData, vetsData, searchTerm, statusFilter, dateFilter]);


  if (loading) return (<Spinner />);

  return (
    <main >
      <section className={styles.servicesSection}>
        {user?.role === "ADMINISTRADOR" ? (
          <h1 className={styles.headerTitle}>Panel de administración - Citas</h1>
        ) : (
          <h1 className={styles.headerTitle}>Historial de Citas</h1>
        )}
        <AppointmentsFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          setModalCreateAppointment={setIsModalCreateAppointment}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onDateFilterChange={setDateFilter}
        />
        {(!appointmentsData || appointmentsData.length === 0) ? (
          <h2>No hay citas registradas</h2>
        ) : (
          <AppointmentTable appointments={filteredAppointment} setAppointmentsData={setAppointmentsData} users={usersData} services={servicesData} pets={petsData} vets={vetsData} />
        )}

        {isModalCreateAppointment && (<AppointmentModal setModalAppointment={setIsModalCreateAppointment} setAppointmentsData={setAppointmentsData} users={usersData} services={servicesData} pets={petsData} vets={vetsData} />)}
      </section>
    </main>
  )
}

export default AppointmentsAdmin;