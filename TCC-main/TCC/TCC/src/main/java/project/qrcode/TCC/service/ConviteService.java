package project.qrcode.TCC.service;

import project.qrcode.TCC.model.Convite;
import project.qrcode.TCC.repository.ConviteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ConviteService {

    private final ConviteRepository conviteRepository;

    public ConviteService(ConviteRepository conviteRepository) {
        this.conviteRepository = conviteRepository;
    }

    public Convite gerarConvite(String nome) {
        Convite convite = new Convite();
        convite.setVisitanteNome(nome);
        convite.setToken(UUID.randomUUID().toString());
        convite.setDataExpiracao(LocalDateTime.now().plusMinutes(5));
        convite.setAtivo(true);
        return conviteRepository.save(convite);
    }

    public ResultadoValidacao validarAcesso(String token) {
        Optional<Convite> conviteOpt = conviteRepository.findByToken(token);

        if (conviteOpt.isEmpty()) {
            return new ResultadoValidacao(false, "Token inválido: convite não encontrado.");
        }

        Convite convite = conviteOpt.get();

        if (!convite.isAtivo()) {
            return new ResultadoValidacao(false, "Acesso negado: este QR Code já foi utilizado.");
        }

        if (convite.getDataExpiracao().isBefore(LocalDateTime.now())) {
            return new ResultadoValidacao(false, "Acesso negado: este QR Code expirou.");
        }

        convite.setAtivo(false);
        conviteRepository.save(convite);

        return new ResultadoValidacao(true, "Acesso liberado com sucesso.");
    }

    public static class ResultadoValidacao {
        private final boolean sucesso;
        private final String mensagem;

        public ResultadoValidacao(boolean sucesso, String mensagem) {
            this.sucesso = sucesso;
            this.mensagem = mensagem;
        }

        public boolean isSucesso() {
            return sucesso;
        }

        public String getMensagem() {
            return mensagem;
        }
    }
}