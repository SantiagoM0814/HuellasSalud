import { useEffect, useMemo, useState } from "react";
import { AppointmentData, ProductData, ServiceData } from "../../helper/typesHS";
import { useAppointmentService } from "./appointmentsService";
import { AppointmentsFilters, AppointmentModal, AppointmentTable } from "./appointmentComponents";
import styles from './appointmentsAdmin.module.css';
import Spinner from "../../components/spinner/Spinner";

const AppointmentsAdmin = () => {
  const [isModalCreateAppointment, setIsModalCreateAppointment] = useState<boolean>(false);
  const [appointmentsData, setAppointmentsData] = useState<AppointmentData[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { handleGetAppointments, loading } = useAppointmentService();

  useEffect(() => {
    const fetchAppointmentData = async () => {
      const data = await handleGetAppointments();
      setAppointmentsData(data)
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
        <AppointmentTable appointments={filteredAppointment} setAppointmentsData={setAppointmentsData} />
        {isModalCreateAppointment && (<AppointmentModal setModalAppointment={setIsModalCreateAppointment} setAppointmentsData={setAppointmentsData} />)}
      </section>
    </main>
  )
}

export default AppointmentsAdmin;