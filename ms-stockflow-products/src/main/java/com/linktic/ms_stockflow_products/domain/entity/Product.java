package com.linktic.ms_stockflow_products.domain.entity;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Data
@EqualsAndHashCode(callSuper = false)
@Builder(toBuilder = true)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
@NoArgsConstructor(access = AccessLevel.PACKAGE)
@Table(name = "products", schema = "public")
public class Product extends  GeneralEntityAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_code", updatable = false)
    private Integer productCode;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private Integer price;

    @Column(name = "active")
    private Boolean active;
}
