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

$(function () {
    console.log("CARTA AVAL");
    console.log(militar);

    $("#btnvolverlista").click(function(){
        $("#tblcarta").slideDown();
        $("#lstDetalle").slideUp();
    });

    $("#concepto").select2();

    $(".mdl-requisitos").on("change",function () {
        verificaCheckModal("requisitos","btnAgconcepto");
    });

    $(".btnvolverentrada2").click(function(){
        $("#opciones").hide();
        $("#panelentrada").show();
        $("#panellista").hide();
        $("#panelregistro").hide();
    });

    llenarCarta();
});



function consultarRif(){
    var rif = $("#rif").val();
    var rz = '';
    var encontrado = 0;
    $.each(lstProveedores,function () {
        if(this.rif == rif){
            rz= this.razonsocial;
            encontrado = 1;
        }
    });
    if(encontrado == 1){
        $("#razonsocial").val(rz);
    }else{
        $("#mdlEmpresa").modal("show");
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
    var fami = militar.Familiar[pos];
    $("#lblcedulaf").text(fami.Persona.DatoBasico.cedula);
    var ncf = fami.Persona.DatoBasico.nombreprimero+" "+fami.Persona.DatoBasico.apellidoprimero;
    $("#lblnombref").text(ncf);
    var parente = Util.ConvertirParentesco(fami.parentesco,fami.Persona.DatoBasico.sexo)
    $("#lblparentesco").text(parente);
    var fnac = Util.ConvertirFechaHumana(fami.Persona.DatoBasico.fechanacimiento);
    $("#lblfnac").text(fnac)
}


function llenarCarta(){
    $("#cmbbeneficiario").html('<option selected="selected" value="S"></option>');

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

function requisitosMotivo(){
    var modal = $("#cmbestudio option:selected").attr("desplegar");
    inactivarCheck(modal);
    alert(modal);

    $("#"+modal).modal("show");
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

  /*  $("#cmbbeneficiario").on("change",function(){
        var opt = $("#cmbbeneficiario option:selected").val();
        var picado = $("#cmbbeneficiario option:selected").val().split("|");
        if(opt != '|seleccione' && picado[0]!="T"){
            cargarFamiliar(picado[0]);
            $("#perfilFamiliar").show();
        }else{
            $("#perfilFamiliar").hide();
        }
    });*/

    $("#cmbbeneficiario").select2({
        templateResult: formatoCombo
    });
}

function cargarDatos(){
    var aval = new Carta();
    aval.montosolicitado = parseFloat($("#txtmonto").val())

    var cuenta = new CuentaBancaria2();
    cuenta.cuenta= $("#empcuenta").val();
    cuenta.institucion = $("#empbanco").val();
    cuenta.tipo = $("#emptipoc").val();
    cuenta.cedula = $("#rif").val();
    cuenta.titular =$("#cmbProveedor option:selected").text();
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
    prov.rif = $("#rif").val();
    prov.razonsocial = $("#cmbProveedor option:selected").text();
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
    conceptos.push(concep);

    aval.Concepto = conceptos;

    var datos = new WCarta();

    datos.id = militar.Persona.DatoBasico.cedula;
    datos.Carta = aval;
    datos.nombre = militar.Persona.DatoBasico.nombreprimero.trim()+' '+militar.Persona.DatoBasico.apellidoprimero.trim();


    console.log(JSON.stringify(datos));
    var urlGuardar = Conn.URL + "wcarta";
    var request2 = CargarAPI({
        sURL: urlGuardar,
        metodo: 'POST',
        valores: datos,
    });
    request2.then(function(xhRequest) {
        var ventana = window.open("cartaAval.html?id="+militar.Persona.DatoBasico.cedula, "_blank");
        window.closed();
    });


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
        case "S": $("#cmbestudio").attr("disabled",true);break;
        case "0":
            $("#cmbestudio").attr("disabled",false);
            $(".masto").attr("disabled",false);
            $(".prote").attr("disabled",true);
            $(".prote").hide();
            $(".masto").show();
            $(".diagnostico").show();
            break;
        case "1":
            $("#cmbestudio").attr("disabled",false);
            $(".masto").attr("disabled",true);
            $(".prote").attr("disabled",false);
            $(".masto").hide();
            $(".prote").show();
            break;
    }
}



function cargaRif(){
    var rif = $("#cmbProveedor option:selected").val();
    var picado = rif.split("|");
    $("#txtrifbeneficiario").val(picado[0]);
    $("#empcuenta").val(picado[1]);
    $("#empbanco").val(picado[2]);
    $("#emptipoc").val(picado[3]);
}
