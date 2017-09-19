$(function () {

    $("#btnvolverlista").click(function(){
        $("#tblcarta").slideDown();
        $("#lstDetalle").slideUp();
    });

    $("#concepto").select2();

    $(".mdl-requisitos").on("change",function () {
        verificaCheckModal("requisitos","btnAgconcepto");
    });

    $(".mdl-requisitos").on("change",function () {
        verificaCheckModal("requisitosprotesis","btnAgconcepto");
    });

    $(".mdl-requisitos").on("change",function () {
        verificaCheckModal("requisitosmastologia","btnAgconcepto");
    });

   /* llenarCarta();
        $(".btnvolverentrada2").click(function(){
        $("#opciones").hide();
        $("#panelentrada").show();
        $("#panellista").hide();
        $("#panelregistro").hide();
    });*/

   /* llenarReembolso();
    $(".btnvolverentradar").click(function () {
        $("#mdldesea").modal("show");

        $("#btnsalir").click(function () {
            $("#opciones").hide();
            $("#panelentrada").show();
            $("#panellista").hide();
            $("#panelregistro").hide();
            $('#mdldesea').modal('hide');
            limpiarReembolso();
            limpiarmdlempresa();
            $("#rifnuevo").remove();
            $("#sefue").remove();
        })
    });
    $(".btncancelare").click(function () {
        limpiarmdlempresa();
        $("#rifnuevo").remove();
        $("#sefue").remove();
    });*/

    llenarCarta();
    $(".btnvolverentradac").click(function () {
        $("#mdldesea").modal("show");

        $("#btnsalir").click(function () {
            $("#opciones").hide();
            $("#panelentrada").show();
            $("#panellista").hide();
            $("#panelregistro").hide();
            $('#mdldesea').modal('hide');
            limpiarCarta();
            //limpiarmdlempresa();
           // $("#rifnuevo").remove();
           // $("#sefue").remove();
        })
    });
});


class Factura2{
    constructor() {
        console.log("Creando objeto Factura2");
        this.Beneficiario = new Beneficiario();
    }
}

class ConceptoCarta{
    constructor(){
        this.motivo = "";
        this.diagnostico = "";
        this.descripcion = '';
        this.DatoFactura = new Factura2();
        this.afiliado = '';
        this.requisito = new Array();
    }
}

class Carta {
    constructor() {
        console.log("Creando objeto carta");
        this.estatus = 0;
        this.montosolicitado = 0.00;
        this.cuentabancaria = new CuentaBancaria2();
        this.Concepto = new Array();
        this.montoaprobado = 0.00;
        this.requisito = new Array();
        //this.observaciones = "";
        this.Direccion = new Direccion();
        this.Telefono = new Telefono();
        this.Correo = new Correo();
        this.Seguimiento = new Seguimiento();
        this.fondo = "";
    }
}

class WCarta{
    constructor(){
        this.id = "";
        this.Carta = new Carta();
        this.nombre = "";
    }
}

function salvarEmpresa(){
    var rifn = $("#rifnuevo").val();
    var rznuevo = $("#rsocialnuevo").val();
    var tenuevo = $("#tipoenuevo").val();
    var direc = $("#direcnueva").val();
    var cuenta = $("#_txtmnrocuentanueva").val();
    var banco = $("#_cmbmtipofinanciera").val();
    var tipoc = $("#_cmbmtipocuentaranueva").val();
    if(rifn == "" || rznuevo == "" || tenuevo == "S" || direc == "" || cuenta == "" || banco == "S" || tipoc == "S"){
        $.notify("Debe ingresar todos los datos de la empresa a registrar");
        return false;
    }
    $.notify("Proceso de registro pendiente");
    $("#rif").val(rifn);
    $("#razonsocial").val(rznuevo);
    $("#mdlEmpresa").modal('hide');
}

function cargarFamiliar(pos){
    console.log(pos);

    if(pos == "T"){
        if (militar.Persona.Telefono != undefined) {
            $("#txtmtelefono").val(militar.Persona.Telefono.domiciliario);
            $("#txtmcelular").val(militar.Persona.Telefono.movil);
            $("#txtmcorreo").val(militar.Persona.Correo.principal);
        }

        if (militar.Persona.Direccion != undefined) {
            var DIR = militar.Persona.Direccion[0];
            Estados.ObtenerEstados();
            $("#cmbmestado").val(DIR.estado);
            $("#cmbmmunicipio").html('<option selected="selected" value="' + DIR.municipio + '">' + DIR.municipio + '</option>');
            $("#cmbmparroquia").html('<option selected="selected" value="' + DIR.parroquia + '">' + DIR.parroquia + '</option>');
            $("#cmbmciudad").html('<option selected="selected" value="' + DIR.ciudad + '">' + DIR.ciudad + '</option>');
            $("#txtmcalle").val(DIR.calleavenida);
            $("#txtmcasa").val(DIR.casa);
            $("#txtmapto").val(DIR.apartamento);
        }
        $("#perfilFamiliar").hide();
        return true;
    }
    $("#perfilMilitar").hide();

    $("#perfilFamiliar").show();

    var fami = militar.Familiar[pos];
    console.log(fami);
    $("#lblcedulaf").text(fami.Persona.DatoBasico.cedula);
    var ncf = fami.Persona.DatoBasico.nombreprimero+" "+fami.Persona.DatoBasico.apellidoprimero;
    $("#lblnombref").text(ncf);
    var parente = Util.ConvertirParentesco(fami.parentesco,fami.Persona.DatoBasico.sexo)
    $("#lblparentesco").text(parente);
    var fnac = Util.ConvertirFechaHumana(fami.Persona.DatoBasico.fechanacimiento);
    $("#lblfnac").text(fnac);

    if (fami.Persona.Telefono != undefined) {
        $("#txtmtelefono").val(fami.Persona.Telefono.domiciliario);
        $("#txtmcelular").val(fami.Persona.Telefono.movil);
        $("#txtmcorreo").val(fami.Persona.Correo.principal);
    }
    Estados.ObtenerEstados();
    if (fami.Persona.Direccion != undefined) {
        var DIR = fami.Persona.Direccion[0];

        $("#cmbmestado").val(DIR.estado);
        $("#cmbmmunicipio").html('<option selected="selected" value="' + DIR.municipio + '">' + DIR.municipio + '</option>');
        $("#cmbmparroquia").html('<option selected="selected" value="' + DIR.parroquia + '">' + DIR.parroquia + '</option>');
        $("#cmbmciudad").html('<option selected="selected" value="' + DIR.ciudad + '">' + DIR.ciudad + '</option>');
        $("#txtmcalle").val(DIR.calleavenida);
        $("#txtmcasa").val(DIR.casa);
        $("#txtmapto").val(DIR.apartamento);
    }
}


function llenarCarta(){
    $("#cmbbeneficiario").html('<option selected="selected" value="S"></option>');
cmbclinica
    $("#_cargando").hide();
    if(militar.Persona != undefined){
        var ncompleto = militar.Persona.DatoBasico.nombreprimero +" "+militar.Persona.DatoBasico.apellidoprimero;
        $("#txtnombre").val(militar.Persona.DatoBasico.nombreprimero);
        $("#txtapellido").val(militar.Persona.DatoBasico.apellidoprimero);
        $("#ttnombre").text(ncompleto);


        $("#cmbcomponente").val(militar.Componente.descripcion);
        $("#ttcomponente").text(militar.Componente.descripcion);

        $("#cmbgrado").val(militar.Grado.descripcion)
        $("#ttgrado").text(militar.Grado.descripcion);

        $("#txtcedula").val(militar.Persona.DatoBasico.cedula);
        $("#ttcedula").text(militar.Persona.DatoBasico.cedula);

        crearLista();

        var estcivil = Util.GenerarEstadoCivil(militar.Persona.DatoBasico.estadocivil,militar.Persona.DatoBasico.sexo);

        $("#cmbedocivil").val(estcivil);
        $("#ttestadocivil").text(estcivil);

        $("#cmbsituacion").val(militar.situacion);
        $("#ttsituacion").text(Util.ConvertirSitucacion(militar.situacion));

        if (militar.Persona.Telefono != undefined) {
            $("#txtmtelefono").val(militar.Persona.Telefono.domiciliario);
            $("#txtmcelular").val(militar.Persona.Telefono.movil);
            $("#txtmcorreo").val(militar.Persona.Correo.principal);
        }
        Estados.ObtenerEstados();
        if (militar.Persona.Direccion != undefined) {
            var DIR = militar.Persona.Direccion[0];

            $("#cmbmestado").val(DIR.estado);
            $("#cmbmmunicipio").html('<option selected="selected" value="' + DIR.municipio + '">' + DIR.municipio + '</option>');
            $("#cmbmparroquia").html('<option selected="selected" value="' + DIR.parroquia + '">' + DIR.parroquia + '</option>');
            $("#cmbmciudad").html('<option selected="selected" value="' + DIR.ciudad + '">' + DIR.ciudad + '</option>');
            $("#txtmcalle").val(DIR.calleavenida);
            $("#txtmcasa").val(DIR.casa);
            $("#txtmapto").val(DIR.apartamento);
        }

    }else{
        alert("Cedula no se encuentra registrada como militar dentro del sistema");
        $("#paneldatos").hide();
    }

}


function crearLista(){
    $("#cmbbeneficiario").append(new Option(militar.Persona.DatoBasico.nombreprimero+"(MILITAR)", "T|"+militar.Persona.DatoBasico.cedula, true, true));
    var ncompleto = militar.Persona.DatoBasico.nombreprimero+ " " + militar.Persona.DatoBasico.apellidoprimero;
    $("#depositar").append(new Option(ncompleto,militar.Persona.DatoBasico.cedula , true, true));
    if(militar.Familiar.length > 0){
        $.each(militar.Familiar,function(v){
            var edad = Util.CalcularEdad(Util.ConvertirFechaHumana(this.Persona.DatoBasico.fechanacimiento));
            var ncompleto2 = this.Persona.DatoBasico.nombreprimero+ " " + this.Persona.DatoBasico.apellidoprimero;
            if(edad > 18){

                $("#depositar").append(new Option(ncompleto2, this.Persona.DatoBasico.cedula, true, true));
            }
            var parentes = Util.ConvertirParentesco(this.parentesco,this.Persona.DatoBasico.sexo);
            $("#cmbbeneficiario").append(new Option(ncompleto2+"("+parentes+")", v+"|"+this.Persona.DatoBasico.cedula, true, true));
        });
    }
    $("#cmbbeneficiario").append(new Option("Seleccione","|seleccione", true, true));
    $("#depositar").append(new Option("Seleccione","", true, true));

    $("#cmbbeneficiario").on("change",function(){
        var opt = $("#cmbbeneficiario option:selected").val();
        var picado = $("#cmbbeneficiario option:selected").val().split("|");
        if(opt != '|seleccione' && picado[0]!="T"){
            cargarFamiliar(picado[0]);
            $("#perfilFamiliar").show();
        }else{
            $("#perfilFamiliar").hide();
        }
    });

    $("#cmbbeneficiario").select2({
        templateResult: formatoCombo
    });
}

function generarCarta(){

    var aval = new Carta();
    aval.montosolicitado = parseFloat($("#montosolicitado").val())
    var cuenta = new CuentaBancaria2();
    cuenta.cuenta= $("#empcuenta").val();
    cuenta.institucion = $("#empbanco").val();
    cuenta.tipo = $("#emptipoc").val();
    cuenta.cedula = $("#rifclinica").val();
    cuenta.titular =$("#cmbclinica option:selected").text();
    aval.cuentabancaria = cuenta;

    var dir = new Direccion();
    dir.tipo = 0;
    dir.estado = $("#cmbmestado option:selected").val();
    dir.municipio = $("#cmbmmunicipio option:selected").val();
    dir.parroquia = $("#cmbmparroquia option:selected").val();
    dir.ciudad = $("#cmbmciudad").val();
    dir.calleavenida = $("#txtmcalle").val().toUpperCase();
    dir.casa = $("#txtmcasa").val().toUpperCase();
    dir.apartamento = $("#txtmapto").val().toUpperCase();

    var tele = new Telefono();
    tele.domiciliario = $("#txtmtelefono").val();
    tele.movil = $("#txtmcelular").val();

    aval.Direccion = dir;

    aval.Telefono.domiciliario = tele.domiciliario;
    aval.Telefono.movil = tele.movil;

    aval.Correo.principal = $("#txtmcorreo").val().toUpperCase();

    var conceptos = new Array();

    var concep = new ConceptoCarta();
    var facturaD = new Factura2();

    var prov = new Beneficiario();
    prov.rif = $("#rifclinica").val();
    prov.razonsocial = $("#cmbclinica option:selected").text();
    prov.tipoempresa = "J";
    prov.direccion = "";

    facturaD.Beneficiario = prov;
    concep.DatoFactura = facturaD;

    var bene = $("#cmbbeneficiario option:selected").val().split('|');
    var beneficiario = bene[1]+"-"+$("#cmbbeneficiario option:selected").text();
    concep.afiliado = beneficiario;
    concep.descripcion = $("#cmbestudio option:selected").text();
    concep.motivo = $("#cmbmotivo option:selected").text();
    concep.diagnostico = $("#txtdiagnostico").val();
    concep.montopresupuesto = parseFloat($("#montopresupuesto").val());
    concep.montoseguro = parseFloat($("#montoacubrir").val());
    concep.numeropresupuesto = $("#numeropresupuesto").val();
    concep.fechapresupuesto = new Date(Util.ConvertirFechaUnix($("#txtfechapresupuesto").val())).toISOString();
    concep.fechaseguro =new Date(Util.ConvertirFechaUnix($("#txtfechaseguro").val())).toISOString();
    conceptos.push(concep);

    aval.Concepto = conceptos;

    var wcarta = new WCarta();

    wcarta.id = militar.Persona.DatoBasico.cedula;
    wcarta.Carta = aval;
    wcarta.nombre = militar.Persona.DatoBasico.nombreprimero.trim()+' '+militar.Persona.DatoBasico.apellidoprimero.trim();


    console.log(JSON.stringify(wcarta));
    var urlGuardar = Conn.URL + "wcarta";
    var request2 = CargarAPI({
        sURL: urlGuardar,
        metodo: 'POST',
        valores: wcarta,
    });
    request2.then(function(xhRequest) {
        res = JSON.parse(xhRequest.responseText);
        var idm = militar.Persona.DatoBasico.cedula;

    });

    if (Util.ValidarFormulario("frmcartaaval", "_btnSalvar")) {
        var aval = new Carta();
        aval.montosolicitado = parseFloat($("#montosolicitado").val())
        var cuenta = new CuentaBancaria2();
        cuenta.cuenta= $("#empcuenta").val();
        cuenta.institucion = $("#empbanco").val();
        cuenta.tipo = $("#emptipoc").val();
        cuenta.cedula = $("#rifclinica").val();
        cuenta.titular =$("#cmbclinica option:selected").text();
        aval.cuentabancaria = cuenta;

        var dir = new Direccion();
        dir.tipo = 0;
        dir.estado = $("#cmbmestado option:selected").val();
        dir.municipio = $("#cmbmmunicipio option:selected").val();
        dir.parroquia = $("#cmbmparroquia option:selected").val();
        dir.ciudad = $("#cmbmciudad").val();
        dir.calleavenida = $("#txtmcalle").val().toUpperCase();
        dir.casa = $("#txtmcasa").val().toUpperCase();
        dir.apartamento = $("#txtmapto").val().toUpperCase();

        var tele = new Telefono();
        tele.domiciliario = $("#txtmtelefono").val();
        tele.movil = $("#txtmcelular").val();

        aval.Direccion = dir;

        aval.Telefono.domiciliario = tele.domiciliario;
        aval.Telefono.movil = tele.movil;

        aval.Correo.principal = $("#txtmcorreo").val().toUpperCase();

        var conceptos = new Array();

        var concep = new ConceptoCarta();
        var facturaD = new Factura2();

        var prov = new Beneficiario();
        prov.rif = $("#rifclinica").val();
        prov.razonsocial = $("#cmbclinica option:selected").text();
        prov.tipoempresa = "J";
        prov.direccion = "";

        facturaD.Beneficiario = prov;
        concep.DatoFactura = facturaD;

        var bene = $("#cmbbeneficiario option:selected").val().split('|');
        var beneficiario = bene[1]+"-"+$("#cmbbeneficiario option:selected").text();
        concep.afiliado = beneficiario;
        concep.descripcion = $("#cmbestudio option:selected").text();
        concep.motivo = $("#cmbmotivo option:selected").text();
        concep.diagnostico = $("#txtdiagnostico").text();

        concep.montopresupuesto = parseFloat($("#montopresupuesto").val());
        concep.montoseguro = parseFloat($("#montoacubrir").val());
        concep.numeropresupuesto = $("#numeropresupuesto").val();
        concep.fechapresupuesto = new Date(Util.ConvertirFechaUnix($("#txtfechapresupuesto").val())).toISOString();
        concep.fechaseguro =new Date(Util.ConvertirFechaUnix($("#txtfechaseguro").val())).toISOString();
        conceptos.push(concep);

        aval.Concepto = conceptos;

        var wcarta = new WCarta();

        wcarta.id = militar.Persona.DatoBasico.cedula;
        wcarta.Carta = aval;
        wcarta.nombre = militar.Persona.DatoBasico.nombreprimero.trim()+' '+militar.Persona.DatoBasico.apellidoprimero.trim();

        console.log(JSON.stringify(wcarta));
        var urlGuardar = Conn.URL + "wcarta";
        var request2 = CargarAPI({
            sURL: urlGuardar,
            metodo: 'POST',
            valores: wcarta,
        });
        request2.then(function(xhRequest) {
            res = JSON.parse(xhRequest.responseText);
                if (res.msj != "") res.msj2 = "Carta Aval procesada con Exito";
                msj2Respuesta(res.msj2);
                llenarCarta();
            var idm = militar.Persona.DatoBasico.cedula;
            var ventana = window.open("cartaAval.html?id="+idm + "&nm=" +res.msj , "_blank");
        });

    } else {
        $.notify("Debe ingresar todos los datos para realizar la Carta Aval");
    }
}

function habilitarDireccion(estatus){
    $("#collapseTree select").attr("disabled",estatus);
    $("#collapseTree :input").attr("disabled",estatus);
    if(estatus == false){
        $("#btnhabdire").hide();
        $("#btndhabdire").show();
    }else{
        $("#btnhabdire").show();
        $("#btndhabdire").hide();
    }
}

function validaFechaFactura(n){
    var f = new Date();
    var fecha=(f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
    var fecha1=moment(fecha,"DD-MM-YYYY");
    var ff = $("#fechafactura").val();
    var fecha2 = moment(ff,"DD-MM-YYYY");
    var dif=fecha1.diff(fecha2, 'days');
    if(dif>n) {
        $("#alerta_fecha").text("Fecha fuera de rango");
        $("#alert_fecha").show();
    }else{
        $("#alert_fecha").hide();
    }
}

function obtenerEstudio(){
    var motivo = $("#cmbmotivo option:selected").val();
    $("#cmbestudio").val("S");
    switch (motivo){
        case "S":
            $("#cmbestudio").attr("disabled",true);
            $(".estudio").hide();
            $(".diagnostico").hide();
            break;
        case "0":
            $("#cmbestudio").attr("disabled",false);
            $(".masto").attr("disabled",false);
            $(".masto").show();
            $(".diagnostico").hide();
            $(".estudio").show();
            break;
        case "1":
            $("#cmbestudio").attr("disabled",false);
            $(".masto").attr("disabled",true);
            $(".masto").hide();
            $(".diagnostico").show();
            $(".estudio").hide();
            break;
    }
    var modal = $("#cmbmotivo option:selected").attr("desplegar");
    inactivarCheck(modal);
    $("#"+modal).modal("show");
}

function rifProveedor(){
    var rif = $("#cmbclinica option:selected").val();
    switch (rif){
        case "S":
            $("#rifclinica").val("");
            break;
        case "0":
            $("#rifclinica").val("J-00213125-0");
            break;
        case "1":
            $("#rifclinica").val("J-31043293-7");
            break;
        case "2":
            $("#rifclinica").val("J-00025083-9");
            break;
    }
    $("#empcuenta").val("");
    $("#empbanco").val("");
    $("#emptipoc").val("");
}

function calcularSolicitado(){
    var mntFactura = $("#montopresupuesto").val();
    var mntAsegura = $("#montoacubrir").val();
    var mntSolici = parseFloat(mntFactura)-parseFloat(mntAsegura);
    if(isNaN(mntSolici)){
        $("#montosolicitado").val("");
    }else{$("#montosolicitado").val(mntSolici.toFixed(2));}

}

function limpiarCarta() {
    $('#frmcartaaval').each(function () {
        this.reset();
        $("#cmbbeneficiario").select2("val", "");
    });
}
