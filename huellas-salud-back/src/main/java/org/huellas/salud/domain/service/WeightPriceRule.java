package org.huellas.salud.domain.service;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import org.bson.codecs.pojo.annotations.BsonProperty;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeightPriceRule {
    private double minWeight;
    private double maxWeight;
    private double price;
}