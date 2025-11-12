package com.linktic.ms_stockflow_products.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import java.util.Date;

@MappedSuperclass
@Data
public class GeneralEntityAudit {
    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;
}
