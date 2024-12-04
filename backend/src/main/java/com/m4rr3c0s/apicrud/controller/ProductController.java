package com.m4rr3c0s.apicrud.controller;

import com.m4rr3c0s.apicrud.dtos.ProductDto;
import com.m4rr3c0s.apicrud.model.Product;
import com.m4rr3c0s.apicrud.repository.ProductRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAll(
            @RequestParam(value = "limit", required = false) String limitParam,
            @RequestParam(value = "name", required = false) String name) {

        List<Product> products = productRepository.findAll();

        if (name != null && !name.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getName().toLowerCase().contains(name.toLowerCase()))
                    .toList();
        }

        if (limitParam != null) {
            int limit;
            try {
                limit = Integer.parseInt(limitParam);
            } catch (NumberFormatException e) {
                limit = 10;
            }
            if (limit > products.size()) {
                limit = products.size();
            }
            return ResponseEntity.status(HttpStatus.OK).body(products.subList(0, limit));
        }

        return ResponseEntity.status(HttpStatus.OK).body(products);
    }


    @GetMapping("/{id}")
    public ResponseEntity getById(@PathVariable(value = "id") Integer id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(product.get());
    }

    @PostMapping
    public ResponseEntity saveProduct(@RequestBody ProductDto dto) {
        var product = new Product();
        BeanUtils.copyProperties(dto, product);
        return ResponseEntity.status(HttpStatus.CREATED).body(productRepository.save(product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteProduct(@PathVariable(value = "id") Integer id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        productRepository.delete(product.get());
        return ResponseEntity.status(HttpStatus.OK).body("Product deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity updateProduct(@PathVariable(value = "id") Integer id, @RequestBody ProductDto dto) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        var productModel = product.get();
        BeanUtils.copyProperties(dto, productModel);
        return ResponseEntity.status(HttpStatus.OK).body(productRepository.save(productModel));
    }
}
