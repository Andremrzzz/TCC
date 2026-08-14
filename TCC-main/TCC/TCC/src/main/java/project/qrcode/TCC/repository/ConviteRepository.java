package project.qrcode.TCC.repository;

import project.qrcode.TCC.model.Convite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConviteRepository extends JpaRepository<Convite, Long> {

    Optional<Convite> findByToken(String token);
}