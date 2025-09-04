package org.huellas.salud.repositories;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.pet.PetMsg;
import org.huellas.salud.services.PetService;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class PetRepository implements PanacheMongoRepository<PetMsg> {

    private static final Logger LOG = Logger.getLogger(PetService.class);

    public Optional<PetMsg> findPetByNameAndOwner(String ownerDocument, String petName) {

        LOG.debugf("@findPetByNameAndOwner REPO > Inicia busqueda del registro de la mascota con el nombre: " +
                "%s del propietario con numero de documento: %s", petName, ownerDocument);

        return find("data.nombre = ?1 and data.idPropietario = ?2", petName, ownerDocument)
                .firstResultOptional();
    }

    public Optional<PetMsg> findPetById(String petId) {

        LOG.debugf("@findPetById REPO > Inicia busqueda del registro de la mascota con identificador: %s", petId);

        return find("data.identificador = ?1", petId).firstResultOptional();
    }

    public List<PetMsg> getListPetsFromMongo() {

        LOG.debug("@getListPetsFromMongo REPO > Inicia obtencion del listado de mascotas registradas en mongo");

        return listAll(Sort.descending("meta.fechaCreacion"));
    }

    public List<PetMsg> getListPetsByOwner(String idOwner) {

        LOG.debugf("@getListPetsByOwner REPO > Inicia busqueda de las mascotas relacionadas al propietario " +
                "con numero de documento: %s", idOwner);

        return list("data.idPropietario = ?1", idOwner);
    }

    public long deletePetDataMongo(String identifierPet, String idOwner) {

        LOG.debugf("@deletePetDataMongo REPO > Inicia eleminacion del registro de la mascota con id: %s " +
                "asociado al propietario con numero de documento: %s", identifierPet, idOwner);

        return delete("data.identificador = ?1 and data.idPropietario = ?2", identifierPet, idOwner);
    }


}
