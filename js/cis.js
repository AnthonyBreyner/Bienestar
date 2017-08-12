

var Conn = new Conexion();
let militar = new Militar();
$(function () {
   CargarUrl("_bxBuscar","buscar");
   CargarUrl("panelperfil","inc/perfil");
    CargarUrl("panellista","inc/lstReembolsos");
    CargarUrl("panelregistro","inc/crearReembolso");
});