package project.qrcode.TCC.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "convites")
public class Convite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String visitanteNome;

    private String token;

    private LocalDateTime dataExpiracao;

    private boolean ativo;

    public Convite() {
    }

    public Convite(String visitanteNome, String token, LocalDateTime dataExpiracao, boolean ativo) {
        this.visitanteNome = visitanteNome;
        this.token = token;
        this.dataExpiracao = dataExpiracao;
        this.ativo = ativo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVisitanteNome() {
        return visitanteNome;
    }

    public void setVisitanteNome(String visitanteNome) {
        this.visitanteNome = visitanteNome;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getDataExpiracao() {
        return dataExpiracao;
    }

    public void setDataExpiracao(LocalDateTime dataExpiracao) {
        this.dataExpiracao = dataExpiracao;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}