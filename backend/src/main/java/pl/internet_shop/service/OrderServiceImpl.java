package pl.internet_shop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.internet_shop.entity.Order;
import pl.internet_shop.repository.OrderRepository;

import java.util.List;
import java.util.Objects;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Override
    public List<Order> fetchAllOrder() {
        List<Order> orders = orderRepository.findAllOrdersWithProductsWithGalleriesInIt();
        return orders;
    }

    @Override
    public Order saveOrder(Order aOrder) {
        Order orderWithId = orderRepository.save(aOrder);
        Order resultOrderWithProductsWithGalleries = orderRepository.findOrderWithProductsAndGalleriesInIt(orderWithId.getOrderId());
        resultOrderWithProductsWithGalleries.setName("Zamówienie " + resultOrderWithProductsWithGalleries.getOrderId());
        resultOrderWithProductsWithGalleries.getDelivery().setName("Przesyłka nr "+ resultOrderWithProductsWithGalleries.getDelivery().getDelivery_id());
        return orderRepository.save(resultOrderWithProductsWithGalleries);
    }

    @Override
    public void deleteOrderById(Long aOrderId) {
        orderRepository.deleteById(aOrderId);
    }

    @Override
    public Order fetchOrderById(Long aOrderId) {
        return orderRepository.findOrderWithProductsAndGalleriesInIt(aOrderId);
    }

    @Override
    public Order updateStatusInOrderById(Order aOrder, Long aOrderId) {
        Order orderToUpdate = orderRepository.findById(aOrderId).get();

        if (Objects.nonNull(aOrder.getStatus()) && !aOrder.getStatus().equalsIgnoreCase("")) {
            orderToUpdate.setStatus(aOrder.getStatus());
        }

        return orderRepository.save(orderToUpdate);
    }
}
