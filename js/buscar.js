let lstProveedores;
$(function () {
    $("#_cedula").on("keypress",function(e){
        if(e.keyCode == 13) {
            Buscar();
        }
    });
    $("#rif").on("blur",function () {
       consultarRif();
    });
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
        alert("entra");
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
        console.log(militar.Persona.DatoBasico.nombreprimero);
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
        crearLista();
        listaCuentas();
        $("#paneldatos").show();
        $("#_bxBuscar").hide();
    }else{
        alert("Cedula no se encuentra registrada con militar dentro del sistema");
        $("#paneldatos").hide();
    }

}

function listaCuentas(){

    $.each(militar.Persona.DatoFinanciero,function(){
        $("#datosbancarios").append(new Option(this.cuenta,this.cuenta+"|"+this.institucion+"|"+this.tipo, true, true));
    });
    $("#datosbancarios").append(new Option("OTRA","otra", true, true));
}

function crearLista(){
    if(militar.Familiar.length > 0){

        $("#cmbbeneficiario").append(new Option(militar.Persona.DatoBasico.nombreprimero, militar.Persona.DatoBasico.cedula, true, true));
        $.each(militar.Familiar,function(){
            $("#cmbbeneficiario").append(new Option(this.Persona.DatoBasico.nombreprimero, this.Persona.DatoBasico.cedula, true, true));
        });
    }else{
        $("#cuerporeembolsos").html("<tr><td>No posee reembolsos registrados</td></tr>");
    }

    if(militar.CIS.ServicioMedico.Programa.Reembolso.length >0){
        var html = "";
        var i = 0;
        $.each(militar.CIS.ServicioMedico.Programa.Reembolso,function(){
            i++;
            var tconcepto = "";
            $.each(this.Concepto,function(){
                console.log(this);
                tconcepto += "<div class='row'>" +
                    "<div class='col-md-3'>"+this.afiliado+"</div><div class='col-md-3'>"+this.DatoFactura.Beneficiario.rif+"|"+this.DatoFactura.Beneficiario.razonsocial+"</div> "+
                    "<div class='col-md-2'>"+this.DatoFactura.numero+"</div><div class='col-md-2'>"+this.DatoFactura.fecha+"</div><div class='col-md-2'>"+this.DatoFactura.monto+"</div> </div>";
            })
            var est = "Por procesar";
            var fcrea = Util.ConvertirFechaHumana(this.fechacreacion);
            html += "<tr class='bg-blue'><th>Detalle</th><th>Numero Solicitud</th><th>F.Solicitu</th><th>Monto Solicitud</th><th>Estatus</th></tr>" +
                "<tr>\n" +
                "                            <td class=\"mailbox-star\"><a href=\"#\" onclick=\"detalleVisible('fila"+i+"')\"><i\n" +
                "                                    class=\"fa fa-plus text-blue\"></i></a></td>\n" +
                "                            <td class=\"mailbox-subject\">"+this.numero+"</td>\n" +
                "                            <td class=\"mailbox-subject\"><b>"+fcrea+"</b> -\n" +
                "                            </td>\n" +
                "                            <td class=\"mailbox-attachment\">"+this.montosolicitado+"</td>\n" +
                "                            <td class=\"mailbox-date\">"+est+"</td>\n" +
                "                        </tr>\n" +
                "<tr style=\"display: none\" visible=\"fila"+i+"\">\n" +
                "<td colspan=\"5\">"+tconcepto+"</td>\n" +
                "</tr>\n";
        });
        $("#cuerporeembolsos").html(html);
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

function agregarConcepto(){
    var beneficiario = $("#cmbbeneficiario option:selected").val()+"-"+$("#cmbbeneficiario option:selected").text();
    var concepto = $("#concepto option:selected").text();
    var monto  = $("#monto").val();
    var rif = $("#rif").val().toUpperCase();
    var razon = $("#razonsocial").val().toUpperCase();
    var factura = $("#nfactura").val().toUpperCase();
    var fechaf = $("#fechafactura").val();
    var control = $("#ncontrol").val().toUpperCase();
    var tabla = $("#conceptoagregado").toUpperCase();
    var btndelete = "<button class='btn btn-danger borrarconcepto'><i class='fa fa-trash'></i>Quitar</button>";
    var html = "<tr><td>"+beneficiario+"</td><td>"+concepto+"</td><td>"+rif+"</td><td>"+razon+"</td><td>"+factura+"</td><td>"+control+"</td><td class='mntAcumulado'>"+monto+"</td>";
    html += "<td>"+fechaf+"</td><td>"+btndelete+"</td></tr>";
    tabla.append(html);

    $(".borrarconcepto").click(function () {
        $(this).parents('tr').eq(0).remove();
        calcularAcumulado();
    });

    calcularAcumulado();
    $.notify("Se ha agregado el concepto", "success");
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


function cargarDatos(){
    var reembolso = new Reembolso();
    reembolso.montosolicitado = parseFloat($("#mntAcumulado").html());

    var cuenta = new CuentaBancaria2();
    cuenta.cuenta= $("#numerocuenta").val();
    cuenta.institucion = $("#banco").val();
    cuenta.tipo = $("#tipodecuenta option:selected").val();
    cuenta.cedula = $("#cibancario").val();
    cuenta.titular = "POR ASIGNAR";
    reembolso.cuentabancaria = cuenta;

    var conceptos = new Array();
    $("#conceptoagregado tr").each(function () {
        var concep = new ConceptoReembolso();
        var facturaD = new Factura();
        facturaD.fecha = new Date(Util.ConvertirFechaUnix($(this).find("td").eq(7).html())).toISOString();
        facturaD.monto = parseFloat($(this).find("td").eq(6).html());
        facturaD.numero = $(this).find("td").eq(4).html();
        facturaD.control = $(this).find("td").eq(5).html();

        var prov = new Beneficiario();
        prov.rif = $(this).find("td").eq(2).html();
        prov.razonsocial = $(this).find("td").eq(3).html();
        prov.tipoempresa = 'J';
        prov.direccion = 'Por cargar';
        //prov.Banco = 'Pora cargar banco';

        facturaD.Beneficiario = prov;

        concep.DatoFactura = facturaD;
        concep.afiliado = $(this).find("td").eq(0).html();
        concep.tipo = $(this).find("td").eq(1).html();

        conceptos.push(concep);
    });
    reembolso.Concepto = conceptos;

    console.log(reembolso);
    console.log(JSON.stringify(reembolso));
    var datos = {id:militar.Persona.DatoBasico.cedula,Reembolso:reembolso};
    var urlGuardar = Conn.URL + "wreembolso";
    var request2 = CargarAPI({
        sURL: urlGuardar,
        metodo: 'POST',
        valores: datos,
    });

    request2.then(function(xhRequest) {

        lstProveedores = JSON.parse(xhRequest.responseText);
        console.log(lstProveedores);

    });

}

function verificaBeneficiarioCuenta(){
    var opt = $("#datosbancarios").val();
    if(opt == "otra"){
        $("#numerocuenta").attr("disabled",false);
        $("#cibancario").attr("disabled",false);
        $("#banco").attr("disabled",false);
        $("#tipodecuenta").attr("disabled",false);
        $("#cibancario").val('');
        $("#numerocuenta").val('');
        $("#tipodecuenta").val('S');
        $("#banco").val('S');
    }else{
        $("#numerocuenta").attr("disabled",true);
        $("#cibancario").attr("disabled",true);
        $("#banco").attr("disabled",true);
        $("#tipodecuenta").attr("disabled",true);
        var datosBancario = opt.split('|');
        $("#numerocuenta").val(datosBancario[0]);
        $("#banco").val(datosBancario[1]);
        $("#tipodecuenta").val(datosBancario[2]);
        $("#cibancario").val(militar.Persona.DatoBasico.cedula);
    }
}

function limpiarReembolso(){

}
