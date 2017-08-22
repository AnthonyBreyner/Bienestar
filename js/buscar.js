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
    $("#rif").on("blur",function () {
       consultarRif();
    });
    $("#btnvolverlista").click(function(){
        $("#tblreembolsos").slideDown();
        $("#lstDetalle").slideUp();
    });

    $(".btnvolverentrada").click(function(){
        $("#paneldatos").slideUp();
        $("#panelentrada").slideDown();
    });

    $("#concepto").select2();

    $(".mdl-requisitos").on("change",function () {
        verificaCheckModal("requisitos");
    });

    $(".mdl-requisitos2").on("change",function () {
        verificaCheckModal("requisitosconsultas");
    });
    $(".mdl-requisitos3").on("change",function () {
        verificaCheckModal("requisitoshosp");
    });
    $(".mdl-requisitos4").on("change",function () {
        verificaCheckModal("requisitostratamiento");
    });
});

function consultarRif(){
    var rif = $("#rif").val();
    var rz = '';
    var encontrado = 0;
    console.log(lstProveedores);
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
    if(rifn == "" || rznuevo == "" || tenuevo == "S" || direc == ""){
        $.notify("Debe ingresar todos los datos de la empresa a registrar");
        return false;
    }
    $.notify("Proceso de registro pendiente");
    $("#rif").val(rifn);
    $("#razonsocial").val(rznuevo);
    $("#mdlEmpresa").modal('hide');
}

function ActivarBuscar(){
    $("#_bxBuscar").show();
    $("#panelentrada").hide();
    $("#paneldatos").hide();
    //verReembolsos();
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

    var request2 = CargarAPI({
        sURL: 'js/proveedores.js',
        metodo: 'GET',
        valores: '',
    });

    request2.then(function(xhRequest) {

        lstProveedores = JSON.parse(xhRequest.responseText);
        console.log(lstProveedores);

    });

    //CargarAPI(url, "GET", "", militar);


}

function llenar(){
    console.log(militar);

    $("#cmbbeneficiario").html('<option selected="selected" value="S"></option>');
    $("#datosbancarios").html('<option selected="selected" value="S">Escoja</option>');
    $("#_cargando").hide();
    if(militar.Persona != undefined){
        $("#cuerporeembolsos").html("");
        var ncompleto = militar.Persona.DatoBasico.nombreprimero +" "+militar.Persona.DatoBasico.apellidoprimero;
        $("#lblnombre").text(ncompleto);
        $("#txtnombre").val(militar.Persona.DatoBasico.nombreprimero);
        $("#txtapellido").val(militar.Persona.DatoBasico.apellidoprimero);
        $("#ttnombre").text(ncompleto);


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

        $("#cmbcomponente").val(militar.Componente.descripcion);
        $("#lblcomponente").text(militar.Componente.descripcion);
        $("#ttcomponente").text(militar.Componente.descripcion);

        $("#lblgrado").text(militar.Grado.descripcion);
        $("#cmbgrado").val(militar.Grado.descripcion)
        $("#ttgrado").text(militar.Grado.descripcion);

        $("#lblcedula").text(militar.Persona.DatoBasico.cedula);
        $("#txtcedula").val(militar.Persona.DatoBasico.cedula);
        $("#ttcedula").text(militar.Persona.DatoBasico.cedula);

        crearLista();

        $("#lblfnacimiento").val(Util.ConvertirFechaHumana(militar.Persona.DatoBasico.fechanacimiento));
        //SeleccionarPorSexo(DB.sexo);

        var estcivil = Util.GenerarEstadoCivil(militar.Persona.DatoBasico.estadocivil,militar.Persona.DatoBasico.sexo);

        $("#lblestcivil").text(estcivil);
        $("#cmbedocivil").val(estcivil);
        $("#ttestadocivil").text(estcivil);

        $("#cmbsituacion").val(militar.situacion);
        $("#ttsituacion").text(Util.ConvertirSitucacion(militar.situacion));

        if (militar.Persona.Telefono != undefined) {
            $("#txtmtelefono").val(militar.Persona.Telefono.domiciliario);
            $("#txtmcelular").val(militar.Persona.Telefono.movil);
        }

        if(militar.Persona.DatoFinanciero != undefined){
            $("#txtmnrocuenta").val(militar.Persona.DatoFinanciero.cuenta);
            $("#cmbminstfinanciera").val(militar.Persona.DatoFinanciero.institucion);
            $("#cmbmtipofinanciera").val(militar.Persona.DatoFinanciero.tipo);
            listaCuentas();
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


        $("#panelentrada").show();
        $("#_bxBuscar").hide();
    }else{
        alert("Cedula no se encuentra registrada como militar dentro del sistema");
        $("#paneldatos").hide();
    }

}

function listaCuentas(){
    $("#datosbancarios").html("");
    $.each(militar.Persona.DatoFinanciero,function(){
        $("#datosbancarios").append(new Option(this.cuenta,this.cuenta+"|"+this.institucion+"|"+this.tipo, true, true));
    });
    $("#datosbancarios").append(new Option("OTRA","otra", true, true));
    $("#datosbancarios").append(new Option("Selecione","", true, true));
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

    if(militar.CIS.ServicioMedico.Programa.Reembolso != undefined && militar.CIS.ServicioMedico.Programa.Reembolso.length >0){
        var html = "";
        var i = 0;
        $.each(militar.CIS.ServicioMedico.Programa.Reembolso,function(){

            var est = "Por procesar";
            var fcrea = Util.ConvertirFechaHumana(this.fechacreacion);
            html += "<tr>\n" +
                "                            <td class=\"mailbox-star\"><a href=\"#\"><i\n" +
                "                                    class=\"fa fa fa-refresh\"></i></a></td>\n" +
                "                            <td class=\"mailbox-subject\"><a href='#cuerpoLstConceptos' onclick=\"detalleVisible("+i+")\">"+this.numero+"</a></td>\n" +
                "                            <td class=\"mailbox-subject\"><b>"+fcrea+"</b> \n" +
                "                            </td>\n" +
                "                            <td class=\"mailbox-attachment\">"+this.montosolicitado+"</td>\n" +
                "                            <td class=\"mailbox-date\">"+est+"</td>\n" +
                "                        </tr>\n" ;
            i++;
        });
        $("#cuerporeembolsos").html(html);
    }
}

function cedulaDepositar(){
    var ced = $("#depositar").val();
    $("#cibancario").val(ced);
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

function detalleVisible(pos){
    var tconcepto = "";
    $.each(militar.CIS.ServicioMedico.Programa.Reembolso[pos].Concepto,function(){
        var ffact = Util.ConvertirFechaHumana(this.DatoFactura.fecha);
        tconcepto += "<tr><td>"+this.afiliado+"</td><td>"+this.DatoFactura.Beneficiario.rif+"|"+this.DatoFactura.Beneficiario.razonsocial+"</td> "+
            "<td>"+this.DatoFactura.numero+"</td><td>"+this.DatoFactura.control+"</td><td>"+ffact+"</td><td>"+this.DatoFactura.monto+"</td></tr>";
    })
    tconcepto += "</table>";
    $("#cuerpoLstConceptos").html(tconcepto);
    $("#lstDetalle").show();
    $("#tblreembolsos").hide();
}

function verificarNuevo(){
    $("#requisitos").modal("show");
    //crearReembolso();
}

function verificaCheckModal(mdl){
    var falta=false;
    $("#"+mdl+" :input[type=checkbox]").each(function(){
       if($(this)[0].checked == false){
           falta = true;
       }
    });
    if(falta == true){
        $("#"+mdl+" button.btnrequisitos").attr("disabled",true);
        $("#btnAgconcepto").attr("disabled",true);
    }else{
        $("#"+mdl+" button.btnrequisitos").attr("disabled",false);
        $("#btnAgconcepto").attr("disabled",false);
    }
}

function inactivarCheck(mdl){
    $("#"+mdl+" :input[type=checkbox]").each(function(){
        $(this)[0].checked = false;
        $("#"+mdl+" button.btnrequisitos").attr("disabled",true);
    });
    $("#"+mdl).modal("hide");
}

function crearReembolso(){
    $("#panellista").hide();
    $("#paneldatos").show();
    $("#panelentrada").slideUp();
    $("#panelregistro").slideDown();

    //$("#btnnreembolso").hide();
    //$("#btnlreembolso").show();
}

function verReembolsos(){
    $("#panelregistro").hide();
    $("#paneldatos").show();
    $("#panelentrada").slideUp();
    $("#panellista").slideDown();
    //$("#btnnreembolso").show();
    //$("#btnlreembolso").hide();
}

function agregarConcepto(){
    if(Util.ValidarFormulario("frmreembolso","btnAgconcepto")){
        var bene = $("#cmbbeneficiario option:selected").val().split('|');
        var beneficiario = bene[1]+"-"+$("#cmbbeneficiario option:selected").text();
        var concepto = $("#concepto option:selected").text();
        var monto  = $("#monto").val();
        var rif = $("#rif").val();
        var razon = $("#razonsocial").val();
        var factura = $("#nfactura").val();
        var fechaf = $("#fechafactura").val();
        var tabla = $("#conceptoagregado");
        var btndelete = "<button class='btn btn-danger borrarconcepto'><i class='glyphicon glyphicon-remove'></i></button>";
        var html = "<tr><td>"+beneficiario+"</td><td>"+concepto+"</td><td class=\"detfactconcep\">"+rif+"</td><td class=\"detfactconcep\">"+razon+"</td><td>"+factura+"</td><td class='mntAcumulado'>"+monto+"</td>";
        html += "<td class=\"detfactconcep\">"+fechaf+"</td><td>"+btndelete+"</td></tr>";
        tabla.append(html);

        $(".borrarconcepto").click(function () {
            $(this).parents('tr').eq(0).remove();
            if($("#conceptoagregado tr").length == 0){
                $("#cajaConceptos").slideUp();
            }
            calcularAcumulado();
        });

        calcularAcumulado();
        $.notify("Se ha agregado el concepto", "success");
        $("#cajaConceptos").slideDown("slow");
        limpiarReembolso();
    }
    return false;
}

function calcularAcumulado(){
    var acumulado = 0;
    $("#conceptoagregado tr").each(function(){
        var mnt = $(this).find("td.mntAcumulado").eq(0).html();
        acumulado = parseFloat(acumulado)+parseFloat(mnt);
    });
    $("#mntAcumulado").html(acumulado);
}

function validadDatosBancarios(){
    var tipoc = $("#tipodecuenta").val();
    var banco = $("#banco").val();
    var cuenta = $("#numerocuenta").val();
    var cedula = $("#cibancario").val();
    var depositar = $("#depositar").val();
    if(tipoc == "S" || banco == "S" || cuenta == "" || cedula == "" || depositar == ""){
        $.notify("Debe ingresar todos los datos financieros","warn");
        return false;
    }
    return true;
}


function cargarDatos(){
    var reembolso = new Reembolso();
    reembolso.montosolicitado = parseFloat($("#mntAcumulado").html());

    var cuenta = new CuentaBancaria2();
    cuenta.cuenta= $("#numerocuenta").val();
    cuenta.institucion = $("#banco").val();
    cuenta.tipo = $("#tipodecuenta option:selected").val();
    cuenta.cedula = $("#cibancario").val();
    cuenta.titular =$("#depositar option:selected").text();
    reembolso.cuentabancaria = cuenta;

    var dir = new Direccion();
    dir.tipo = 0;
    dir.estado = $("#cmbmestado option:selected").val();
    dir.municipio = $("#cmbmmunicipio option:selected").val();
    dir.parroquia = $("#cmbmparroquia option:selected").val();
    dir.ciudad = $("#cmbmciudad").val();
    dir.calleavenida = $("#txtmcalle").val().toUpperCase();
    dir.casa = $("#txtmcasa").val().toUpperCase();
    dir.apartamento = $("#txtmapto").val().toUpperCase();
    reembolso.Direccion = dir;
    reembolso.Telefono.domiciliario = $("#txtmtelefono").val();
    reembolso.Telefono.movil = $("#txtmcelular").val();

    var conceptos = new Array();
    if($("#conceptoagregado tr").length >0 && validadDatosBancarios()){
        $("#conceptoagregado tr").each(function () {
            var concep = new ConceptoReembolso();
            var facturaD = new Factura();
            facturaD.fecha = new Date(Util.ConvertirFechaUnix($(this).find("td").eq(6).html())).toISOString();
            facturaD.monto = parseFloat($(this).find("td").eq(5).html());
            facturaD.numero = $(this).find("td").eq(4).html();
            facturaD.control = $(this).find("td").eq(4).html();

            var prov = new Beneficiario();
            prov.rif = $(this).find("td").eq(2).html();
            prov.razonsocial = $(this).find("td").eq(3).html();
            prov.tipoempresa = 'J';
            prov.direccion = 'Por cargar';
            //prov.Banco = 'Pora cargar banco';

            facturaD.Beneficiario = prov;

            concep.DatoFactura = facturaD;
            concep.afiliado = $(this).find("td").eq(0).html();
            concep.descripcion = $(this).find("td").eq(1).html();

            conceptos.push(concep);
        });
        reembolso.Concepto = conceptos;

        console.log(reembolso);
        console.log(JSON.stringify(reembolso));
        var datos = {id:militar.Persona.DatoBasico.cedula,Reembolso:reembolso,Direccion:dir,Telefono:reembolso.Telefono};
        var urlGuardar = Conn.URL + "wreembolso";
        var request2 = CargarAPI({
            sURL: urlGuardar,
            metodo: 'POST',
            valores: datos,
        });

        request2.then(function(xhRequest) {
            var ventana = window.open("planillaReembolso.html?id="+militar.Persona.DatoBasico.cedula, "_blank");
        });
    }else{
        $.notify("Debe ingresar todos los datos para realizar el reembolso");
    }

}

function verificaBeneficiarioCuenta(){
    var opt = $("#datosbancarios").val();
    if(opt == "otra"){
        $("#numerocuenta").attr("disabled",false);
        $("#depositar").attr("disabled",false);
        $("#banco").attr("disabled",false);
        $("#tipodecuenta").attr("disabled",false);
        $("#cibancario").val('');
        $("#numerocuenta").val('');
        $("#tipodecuenta").val('S');
        $("#depositar").val('S');
        $("#banco").val('S');
    }else{
        $("#numerocuenta").attr("disabled",true);
        $("#depositar").attr("disabled",true);
        $("#banco").attr("disabled",true);
        $("#tipodecuenta").attr("disabled",true);
        var datosBancario = opt.split('|');
        $("#numerocuenta").val(datosBancario[0]);
        $("#banco").val(datosBancario[1]);
        $("#tipodecuenta").val(datosBancario[2]);
        $("#cibancario").val(militar.Persona.DatoBasico.cedula);
        $("#depositar").val(militar.Persona.DatoBasico.cedula);
    }
}

function limpiarReembolso(){
    $('#frmreembolso').each (function(){
        this.reset();
    });
}

function requisitosConcepto(){

    var modal = $("#concepto option:selected").attr("desplegar");
    inactivarCheck(modal)
    $("#"+modal).modal("show");
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