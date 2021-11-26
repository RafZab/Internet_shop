package pl.internet_shop.service;

import pl.internet_shop.entity.Product;

import java.util.List;

public interface ProductService {
    List<Product> fetchAllProducts();

    Product saveProduct(Product aProduct);
}
