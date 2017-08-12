$(function () {
    $("#_cedula").on("keypress",function(e){
        if(e.keyCode == 13) {
            Buscar();
        }
    });
})

function Buscar(id) {
    if (id != undefined) {
        $("#_cedula").val(id);
    }
    if ($("#_cedula").val() == "") {
        $("#_contenido").html("Debe introducir una cédula");
        $("#_botonesmsj").html('<button type="button" class="btn btn-default" data-dismiss="modal" id="_aceptar" onClick="IrCedula()">Aceptar</button>');
        $("#modMsj").modal("show");
        return false;
    }
    $("#_cargando").show();
    $("#_lblConstanciaPension").hide();
    $("#_imgfamiliar").attr("src", "images/ndisponible.jpg");
    var url = Conn.URL + "militar/crud/" + $("#_cedula").val();
    console.log(militar);


    var request = CargarAPI({
        sURL: url,
        metodo: 'GET',
        valores: '',
        Objeto:militar
    });

    request.then(function(xhRequest) {

        militar = JSON.parse(xhRequest.responseText);
        llenar();

    });

    //CargarAPI(url, "GET", "", militar);


}

function llenar(){
    console.log(militar);
    $("#_cargando").hide();
    if(militar.Persona != undefined){
        console.log(militar.Persona.DatoBasico.nombreprimero);
        $("#lblnombre").text(militar.Persona.DatoBasico.nombreprimero);
        url = "images/grados/" + militar.Grado.abreviatura + ".png";
        url = url.toLowerCase();
        $("#imgrango").attr("src", url);

        var rutaimg = Conn.URLIMG;
        url = rutaimg + $("#_cedula").val() + ".jpg";
        if (militar.Persona.foto  != undefined){
            rutaimg = Conn.URLTEMP;
            url = rutaimg + $("#_cedula").val() + "/foto.jpg";
        }
        $("#fotoperfil").attr("src", url);

        $("#lblrango").text(militar.Grado.descripcion);
        crearLista();
        $("#paneldatos").show();
    }else{
        alert("Cedula no se encuentra registrada con militar dentro del sistema");
        $("#paneldatos").hide();
    }

}

function crearLista(){
    if(militar.Familiar.length > 0){
        var html = "";
        var i = 0;
        $.each(militar.Familiar,function(){
            i++;
            html += "<tr>\n" +
                "                            <td class=\"mailbox-star\"><a href=\"#\" onclick=\"detalleVisible('fila"+i+"')\"><i\n" +
                "                                    class=\"fa fa-plus text-blue\"></i></a></td>\n" +
                "                            <td class=\"mailbox-name\">"+this.Persona.DatoBasico.nombreprimero+"\n" +
                "                                Pierce</a></td>\n" +
                "                            <td class=\"mailbox-subject\"><b>"+this.Persona.DatoBasico.apellidoprimero+"</b> -\n" +
                "                            </td>\n" +
                "                            <td class=\"mailbox-attachment\">"+this.parentesco+"</td>\n" +
                "                            <td class=\"mailbox-date\"></td>\n" +
                "                        </tr>\n" +
                "<tr style=\"display: none\" visible=\"fila"+i+"\">\n" +
                "<td colspan=\"5\"><div class=\"row\">ACA VA IR  TODO</div> </td>\n" +
                "</tr>\n";
        });
        $("#cuerporeembolsos").html(html);
    }else{
        $("#cuerporeembolsos").html("<tr><td>No posee reembolsos registrados</td></tr>");
    }
}

function detalleVisible(id){
    $("#cuerporeembolsos tr[visible='"+id+"']").toggle();
}

function crearReembolso(){
    $("#panellista").hide();
    $("#panelregistro").show();
    $("#btnnreembolso").hide();
    $("#btnlreembolso").show();
}

function verReembolsos(){
    $("#panellista").show();
    $("#panelregistro").hide();
    $("#btnnreembolso").show();
    $("#btnlreembolso").hide();
}