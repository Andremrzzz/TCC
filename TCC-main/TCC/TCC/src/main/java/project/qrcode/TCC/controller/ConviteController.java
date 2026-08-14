package project.qrcode.TCC.controller;

import project.qrcode.TCC.model.Convite;
import project.qrcode.TCC.service.ConviteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/convites")
public class ConviteController {

    private final ConviteService conviteService;

    public ConviteController(ConviteService conviteService) {
        this.conviteService = conviteService;
    }

    @PostMapping("/gerar")
    public ResponseEntity<Convite> gerar(@RequestParam String nome) {
        Convite convite = conviteService.gerarConvite(nome);
        return ResponseEntity.status(HttpStatus.OK).body(convite);
    }

    @PostMapping("/validar")
    public ResponseEntity<String> validar(@RequestParam String token) {
        ConviteService.ResultadoValidacao resultado = conviteService.validarAcesso(token);

        if (resultado.isSucesso()) {
            return ResponseEntity.status(HttpStatus.OK).body(resultado.getMensagem());
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(resultado.getMensagem());
    }
}