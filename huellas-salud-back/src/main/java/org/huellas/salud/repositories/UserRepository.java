package org.huellas.salud.repositories;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.user.UserMsg;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserRepository implements PanacheMongoRepository<UserMsg> {

    private final Logger LOG = Logger.getLogger(UserRepository.class);

    public List<UserMsg> getRegisteredUsersMongo() {

        LOG.info("@getRegisteredUsersMongo REPO > Inicia obtencion de los usuarios registrados en mongo. estos se " +
                "retornaran ordenados de manera descendente por el campo de fecha de creacion");

        return listAll(Sort.descending("meta.fechaCreacion"));
    }

    public Optional<UserMsg> findUserByDocumentNumber(String documentNumber) {

        LOG.infof("@findUserByDocumentNumber REPO > Inicia busqueda del registro del usuario con numero de " +
                "documento: %s en mongo", documentNumber);

        return find("data.numeroDocumento = ?1", documentNumber).firstResultOptional();
    }

    public Optional<UserMsg> findUserDataByEmail(String emailUser) {

        LOG.infof("@findUserDataByEmail REPO > Inicia busqueda del registro del usuario con email: %s", emailUser);

        return find("data.correo = ?1", emailUser).firstResultOptional();
    }

    public Optional<UserMsg> findUserByEmailOrDocument(String documentNumber, String email) {

        LOG.infof("@findUserByEmailOrDocument REPO > Inicia busqueda del registro del usuario con numero de " +
                "documento: %s y correo: %s en mongo", documentNumber, email);

        return find("data.numeroDocumento = ?1 or data.correo = ?2", documentNumber, email).firstResultOptional();
    }

    public long deleteUserDataMongo(String documentNumber, String emailUser) {

        LOG.infof("@deleteUserDataMongo REPO > Inicia servicio de eliminacion del usuario con el numero de " +
                "documento: %s y correo: %s en mongo", documentNumber, emailUser);

        return delete("data.numeroDocumento = ?1 and data.correo = ?2", documentNumber, emailUser);
    }
}
