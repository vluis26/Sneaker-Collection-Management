package io.sneaker.SneakerManagment.service;


import io.sneaker.SneakerManagment.domain.Sneaker;
import io.sneaker.SneakerManagment.repo.SneakerRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static io.sneaker.SneakerManagment.constant.Constant.PHOTO_DIRECTORY;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;


@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class SneakerService {
    private final SneakerRepo sneakerRepo;

    @Value("${node.server.url}")
    private String nodeServerUrl;

    public Page<Sneaker> getAllSneakers(int page, int size) {
        return sneakerRepo.findAll(PageRequest.of(page, size, Sort.by("name")));
    }

    public Sneaker getSneaker(String id) {
        log.info("Fetching sneaker with id: {}", id);
        return sneakerRepo.findById(id).orElseThrow(() -> new RuntimeException("Sneaker not found"));
    }

    public Sneaker createSneaker(Sneaker sneaker) {
        log.info("Creating sneaker: {}", sneaker);
        double lowestResellPrice = getLowestResellPrice(sneaker.getStyleId());
        sneaker.setStockxPrice(lowestResellPrice);
        return sneakerRepo.save(sneaker);
    }

    public void deleteSneaker(String id) {
        log.info("Deleting Sneaker: {}", id);
        Sneaker sneaker = getSneaker(id);
        sneakerRepo.delete(sneaker);
    }

    public String uploadPhoto(String id, MultipartFile file) {
        Sneaker sneaker = getSneaker(id);
        String photoUrl = photoFunction.apply(id, file);
        sneaker.setPhotoUrl(photoUrl);
        sneakerRepo.save(sneaker);
        return photoUrl;
    }

    public double getLowestResellPrice(String styleId) {
        String url = nodeServerUrl + "/product/" + styleId;
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> product = response.getBody();
                if (product.containsKey("price")) {
                    return Double.parseDouble(product.get("price").toString());
                }
            }
        } catch (HttpStatusCodeException e) {
            log.error("Failed to fetch price from node server: {}", e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Unexpected error occurred while fetching price: {}", e.getMessage());
        }

        return 0.0;
    }

    private final Function<String, String> fileExtension = filename -> Optional.of(filename).filter(name -> name.contains("."))
            .map(name -> "." + name.substring(filename.lastIndexOf(".") + 1)).orElse(".png");

    private final BiFunction<String, MultipartFile, String> photoFunction = (id, image) -> {
        String filename = id + fileExtension.apply(image.getOriginalFilename());
        try {
            Path fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if(!Files.exists(fileStorageLocation)) { Files.createDirectories(fileStorageLocation); }
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(filename), REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/sneakers/image/" + filename).toUriString();
        }catch (Exception exception) {
            throw new RuntimeException("Unable to save image");
        }
    };
}
