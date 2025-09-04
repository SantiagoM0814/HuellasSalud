package org.huellas.salud.repositories;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.huellas.salud.domain.mail.EmailDelivery;

@ApplicationScoped
public class EmailDeliveryRepository implements PanacheMongoRepository<EmailDelivery> {
}
