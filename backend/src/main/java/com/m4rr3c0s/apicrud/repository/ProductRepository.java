package com.m4rr3c0s.apicrud.repository;

import com.m4rr3c0s.apicrud.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
}
