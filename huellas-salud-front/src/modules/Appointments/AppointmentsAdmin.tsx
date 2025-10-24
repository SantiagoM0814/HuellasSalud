import { useEffect, useMemo, useState } from "react";
import { AppointmentData, PetData, ProductData, ServiceData, User, UserData } from "../../helper/typesHS";
import { useAppointmentService } from "./appointmentsService";
import { AppointmentsFilters, AppointmentModal, AppointmentTable } from "./appointmentComponents";
import styles from './appointmentsAdmin.module.css';
import Spinner from "../../components/spinner/Spinner";
import { useUserService } from "../Users/UserManagement/usersService";
import { usePetService } from "../Pets/petService";
import { useServiceService } from "../Services/servicesService";

const AppointmentsAdmin = () => {
  const [isModalCreateAppointment, setIsModalCreateAppointment] = useState<boolean>(false);
  const [appointmentsData, setAppointmentsData] = useState<AppointmentData[] | undefined>([]);
  const [usersData, setUsersData] = useState<UserData[] | undefined>([]);
  const [vetsData, setVetsData] = useState<UserData[] | undefined>([]);
  const [petsData, setPetsData] = useState<PetData[] | undefined>([]);
  const [servicesData, setServicesData] = useState<ServiceData[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { handleGetAppointments, loading } = useAppointmentService();
  const { handleGetUsers, handleGetVeterinarians } = useUserService();
  const { handleGetPets } = usePetService();
  const { handleGetServices } = useServiceService();

  useEffect(() => {
    const fetchAppointmentData = async () => {
      const data = await handleGetAppointments();
      const dataUser = await handleGetUsers();
      const dataPet = await handleGetPets();
      const dataService = await handleGetServices();
      const dataVet = await handleGetVeterinarians();

      setAppointmentsData(data);
      setUsersData(dataUser);
      setPetsData(dataPet);
      setServicesData(dataService);
      setVetsData(dataVet);
    };

    fetchAppointmentData();
  }, []);

  const filteredAppointment = useMemo(() => {
    return appointmentsData?.filter(({ data: appointment }) => {
      const matchesSearch = appointment.idAppointment.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'ALL'
        || (statusFilter === 'PENDIENTE' && appointment.status)
        || (statusFilter === 'FINALIZADA' && !appointment.status);

      return matchesSearch && matchesStatus;
    })
  }, [appointmentsData, searchTerm, statusFilter]);

  if (loading) return (<Spinner/>);

  return (
    <main >
      <section className={styles.servicesSection}>
        <h1 className={styles.headerTitle}>Panel de administración - Citas</h1>
        <AppointmentsFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          setModalCreateAppointment={setIsModalCreateAppointment}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />
        <AppointmentTable appointments={filteredAppointment} setAppointmentsData={setAppointmentsData} users={usersData} services={servicesData} pets={petsData} vets={vetsData}/>
        {isModalCreateAppointment && (<AppointmentModal setModalAppointment={setIsModalCreateAppointment} setAppointmentsData={setAppointmentsData} users={usersData} services={servicesData} pets={petsData} vets={vetsData}/>)}
      </section>
    </main>
  )
}

export default AppointmentsAdmin;