let lstProveedores;

function formatoCombo (state) {
    if (!state.id) { return state.text; }
    var text = state.text.split("(");
    if(text[1]!=undefined){
        var $state = $(
            '<div class="row"><div class="col-sm-6">'+text[0]+'</div><div class="col-sm-4">('+text[1]+'</div></div>'
            //'<span>' + text[0] + '</span><br><span>(' + text[1] + '</span>'
        );
    }else{
        var $state = $(
            '<span>' + state.text+ '</span>'
        );
    }

    return $state;
};


$(function () {
    $("#_cedula").on("keypress",function(e){
        if(e.keyCode == 13) {
            Buscar();
        }
    });

    $(".btnvolverentrada").click(function(){
        $("#opciones").show();
        $("#panelentrada").hide();
        $("#panellista").hide();
        $("#panelregistro").hide();
    });
    $(".btnvolverentrada2").click(function(){
        $("#opciones").hide();
        $("#panelentrada").show();
        $("#panellista").hide();
        $("#panelregistro").hide();
    });
});



function ActivarBuscar(){
    $("#_bxBuscar").show();
    $("#panelentrada").hide();
    $("#panellista").hide();
    $("#panelregistro").hide();
    $("#paneldatos").hide();
}

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
    var url = Conn.URL + "militar/crud/" + $("#_cedula").val();
    var request = CargarAPI({
        sURL: url,
        metodo: 'GET',
        valores: '',
        Objeto:militar
    });
    request.then(function(xhRequest) {

        militar = JSON.parse(xhRequest.responseText);
        ficha();
    });
    var request2 = CargarAPI({
        sURL: 'js/proveedores.js',
        metodo: 'GET',
        valores: '',
    });
    request2.then(function(xhRequest) {
        lstProveedores = JSON.parse(xhRequest.responseText);
        console.log(lstProveedores);
    });
}

function ficha(){
    console.log(militar);
    $("#_cargando").hide();
    if(militar.Persona != undefined){
        var ncompleto = militar.Persona.DatoBasico.nombreprimero +" "+militar.Persona.DatoBasico.apellidoprimero;
        $("#lblnombre").text(ncompleto);
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

        $("#lblcomponente").text(militar.Componente.descripcion);

        $("#lblgrado").text(militar.Grado.descripcion);

        $("#lblcedula").text(militar.Persona.DatoBasico.cedula);

        $("#lblfnacimiento").val(Util.ConvertirFechaHumana(militar.Persona.DatoBasico.fechanacimiento));

        var estcivil = Util.GenerarEstadoCivil(militar.Persona.DatoBasico.estadocivil,militar.Persona.DatoBasico.sexo);

        $("#lblestcivil").text(estcivil);

        $("#lblsituacion").text(Util.ConvertirSitucacion(militar.situacion));

        $("#paneldatos").show();
        $("#panelperfil").show();
        $("#opciones").show();
        $("#_bxBuscar").hide();
    }else{
        alert("Cedula no se encuentra registrada como militar dentro del sistema");
        $("#paneldatos").hide();
    }
}

function cargaPrograma(tipo){
    switch (tipo){
        case "r":
            CargarUrl("modalgeneral","inc/modals");
            CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearReembolso");
            titulos("reembolso")
            break;
        case "a":
            CargarUrl("modalgeneral","inc/modalsapoyo");
            CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearApoyoEconomico");
            titulos("Apoyo <br> Economico");
            break;
        case "pen":
            CargarUrl("modalgeneral","inc/modals");
            CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearPension");
            titulos("Pension");
            break;
        case "far":
            CargarUrl("modalgeneral","inc/modalsfarmacia");
            CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearFarmacia");
            titulos("Farmacia");
            break;
        case "invs":
            CargarUrl("modalgeneral","inc/modals");
            CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearInvSocial");
            titulos("Investigacion </br> Social");
            break;
        case "fdv":
            CargarUrl("panelentrada", "inc/opcionesFedevida");
            CargarUrl("modalgeneral","inc/modals");
            CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearFedeVida");
            //titulos("Fe de vida");
            break;
        case "ca":
            CargarUrl("modalgeneral","inc/modalscarta");
            CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearCartaAval");
            titulos("Carta Aval");
            break;

         case "badan":
            CargarUrl("modalgeneral","inc/modalscarta");
            CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearCartaAval");
            titulos("Medicina de Alto Costo");
            break;
    }
    $("#opciones").slideToggle();
    $("#panelentrada").slideToggle();
}

function titulos(t){
    $(".lbltituloopt").html(t);
}

function verificarNuevo(val){
    if(val == false){
        crearPrograma();
    }else{
        $("#requisitos").modal("show");
    }

    //crearReembolso();
}

function verificaCheckModal(mdl,btn){
    var falta=false;
    $("#"+mdl+" :input[type=checkbox]").each(function(){
        if($(this)[0].checked == false){
            falta = true;
        }
    });
    if(falta == true){
        $("#"+mdl+" button.btnrequisitos").attr("disabled",true);
        $("#"+btn).attr("disabled",true);
    }else{
        $("#"+mdl+" button.btnrequisitos").attr("disabled",false);
        $("#"+btn).attr("disabled",false);
    }
}

function inactivarCheck(mdl){
    $("#"+mdl+" :input[type=checkbox]").each(function(){
        $(this)[0].checked = false;
        $("#"+mdl+" button.btnrequisitos").attr("disabled",true);
    });
    $("#"+mdl).modal("hide");
}

function crearPrograma(){
    $("#panellista").hide();
    $("#paneldatos").show();
    $("#panelentrada").slideUp();
    $("#panelregistro").slideDown();

    //$("#btnnreembolso").hide();
    //$("#btnlreembolso").show();
}

function verPrograma(){
    $("#panelregistro").hide();
    $("#paneldatos").show();
    $("#panelentrada").slideUp();
    $("#panellista").slideDown();
    //$("#btnnreembolso").show();
    //$("#btnlreembolso").hide();
}