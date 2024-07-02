package io.sneaker.SneakerManagment.repo;

import io.sneaker.SneakerManagment.domain.Sneaker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SneakerRepo extends JpaRepository<Sneaker, String> {
    Optional<Sneaker> findById(String id);


}
