import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext, ScheduleData, UserData } from "../../helper/typesHS";
import styles from './schedule.module.css';
import Spinner from "../../components/spinner/Spinner";
import { useUserService } from "../Users/UserManagement/usersService";
import { ScheduleModal, SchedulesFilters, ScheduleTable } from "./scheduleComponents";
import { useScheduleService } from "./schedulesService";

const SchedulesAdmin = () => {
  const { user } = useContext(AuthContext);
  const [isModalCreateSchedule, setIsModalCreateSchedule] = useState<boolean>(false);
  const [schedulesData, setSchedulesData] = useState<ScheduleData[] | undefined>([]);
  const [vetsData, setVetsData] = useState<UserData[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dayFilter, setDayFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  const { handleGetSchedules } = useScheduleService();
  const { handleGetVeterinarians } = useUserService();

  useEffect(() => {
    if (!user) return;

    const fetchScheduleData = async () => {
      setLoading(true);

      const dataSchedules = await handleGetSchedules();
      console.log(dataSchedules)
      const dataVets = await handleGetVeterinarians();
      setSchedulesData(dataSchedules);
      setVetsData(dataVets);

      setLoading(false);
    };

    fetchScheduleData();
  }, [user]);


  const filteredSchedule = useMemo(() => {
    if (!schedulesData) return [];

    return schedulesData.filter(({ data: schedule }) => {

      const vet = vetsData?.find(v => v.data.documentNumber === schedule.idVeterinarian);

      const vetName = `${vet?.data.name || ""} ${vet?.data.lastName || ""}`.toLowerCase();

      const matchesSearch =
        vetName.includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL'
        || (statusFilter === 'ACTIVE' && schedule.active)
        || (statusFilter === 'INACTIVE' && !schedule.active);

      const matchesDay = dayFilter === 'ALL' || schedule.dayOfWeek === dayFilter;


      return matchesSearch && matchesStatus && matchesDay;
    });
  }, [schedulesData, vetsData, searchTerm, statusFilter, dayFilter]);


  if (loading) return (<Spinner />);

  return (
    <main >
      <section className={styles.servicesSection}>
        <h1 className={styles.headerTitle}>Panel de administración - Horarios</h1>
        <SchedulesFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          dayFilter={dayFilter}
          setModalCreateSchedule={setIsModalCreateSchedule}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onDayFilterChange={setDayFilter}
        />
        {(!schedulesData || schedulesData.length === 0) ? (
          <h2>No hay horarios registrados</h2>
        ) : (
          <ScheduleTable schedules={filteredSchedule} setSchedulesData={setSchedulesData} vets={vetsData} />
        )}

        {isModalCreateSchedule && (<ScheduleModal setModalSchedule={setIsModalCreateSchedule} setSchedulesData={setSchedulesData} vets={vetsData} />)}
      </section>
    </main>
  )
}

export default SchedulesAdmin;