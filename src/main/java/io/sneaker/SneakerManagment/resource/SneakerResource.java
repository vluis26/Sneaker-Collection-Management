package io.sneaker.SneakerManagment.resource;

import io.sneaker.SneakerManagment.domain.Sneaker;
import io.sneaker.SneakerManagment.service.SneakerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;

import static io.sneaker.SneakerManagment.constant.Constant.PHOTO_DIRECTORY;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/sneakers")
@RequiredArgsConstructor
public class SneakerResource {
    private final SneakerService sneakerService;

    @PostMapping
    public ResponseEntity<Sneaker> createSneaker(@RequestBody Sneaker sneaker) {
        return ResponseEntity.created(URI.create("/sneakers/" + sneaker.getId())).body(sneakerService.createSneaker(sneaker));
    }

    @GetMapping
    public ResponseEntity<Page<Sneaker>> getSneakers(@RequestParam(value = "page", defaultValue = "0") int page,
                                                     @RequestParam(value = "size", defaultValue = "8") int size) {
        return ResponseEntity.ok().body(sneakerService.getAllSneakers(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sneaker> getSneaker(@PathVariable(value = "id") String id) {
        return ResponseEntity.ok().body(sneakerService.getSneaker(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSneaker(@PathVariable(value = "id") String id) {
        sneakerService.deleteSneaker(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("id") String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok().body(sneakerService.uploadPhoto(id, file));
    }

    @GetMapping(path = "/image/{filename}", produces = { IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE })
    public byte[] getPhoto(@PathVariable("filename") String filename) throws IOException {
        return Files.readAllBytes(Paths.get(PHOTO_DIRECTORY + filename));
    }
}
