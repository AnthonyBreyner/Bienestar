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

    /*request.then(function(xhRequest) {

        console.log('Estado: ', xhRequest.status);
    });*/

    request.then(function(xhRequest) {

        militar = JSON.parse(xhRequest.responseText);
        llenar();
        //console.log('Resultado: ', JSON.parse(xhRequest.responseText));
    });

    //CargarAPI(url, "GET", "", militar);


}

function llenar(){
    console.log(militar);
}

function bien(){
    alert("Mal");
    console.log(militar);
}