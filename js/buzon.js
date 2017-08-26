let lstBuzon = null;
let reembolsoActivo = null;
let copia = null;
$(function () {
    $(".modconcep").click(function () {

    });
});

function listaBuzon(est) {
    var url = Conn.URL + "wreembolso/listar/" + est;
    var request = CargarAPI({
        sURL: url,
        metodo: 'GET',
        valores: ''
    });
    request.then(function (xhRequest) {

        lstBuzon = JSON.parse(xhRequest.responseText);
        crearBuzon(est);
    });
}

function crearBuzon(est) {
    console.log(lstBuzon);
    $("#lista").html('<li>\n' +
        '            <div class="row">\n' +
        '                <div class="col-sm-1"><span class="text">Reembolso</span></div>\n' +
        '                <div class="col-sm-1"><span class="text">Cedula</span></div>\n' +
        '                <div class="col-sm-3"><span class="text">Nombre y Apellido</span></div>\n' +
        '                <div class="col-sm-2"><span class="text">F.Solicitud</span></div>\n' +
        '                <div class="col-sm-2"><span class="text">M.Solicitud</span></div>\n' +
        '                <div class="col-sm-2">Estatus</div>\n' +
        '            </div>\n' +
        '        </li>');
    $.each(lstBuzon, function () {
        var item = '<li><div class="row"><div class="col-sm-1"><span class="text"><a href="#" onclick="detalleBuzon(\'' + this.id + '\',\'' + this.numero + '\')"> ' + this.numero + '</a></span></div>\n' +
            '                <div class="col-sm-1"><span class="text">' + this.id + '</span></div>\n' +
            '                <div class="col-sm-3">' + this.nombre + '</div>\n' +
            '                <div class="col-sm-2">' + Util.ConvertirFechaHumana(this.fechacreacion) + '</div>\n' +
            '                <div class="col-sm-2">' + numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $') + '</div>\n' +
            '                <div class="col-sm-2">' + this.estatus + '</div>\n' +
            '                <div class="tools">\n' +
            '                    <i class="fa fa-edit" onclick="verificarAprobacion(\'' + this.numero + '\',\'' + this.estatus + '\')"></i>\n' +
            '                    <i class="fa fa-trash-o" onclick="verificarRechazo(\'' + this.numero + '\',\'' + this.estatus + '\')"></i>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </li>';
        $("#lista").append(item);
    });

}

function verificarAprobacion(num, esta) {
    $("#_contenido").html("¿Está seguro que APROBAR el reembolso " + num + "?");
    var botones = '<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar" onClick="aprobarReembolso(\'' + num + '\',\'' + est + '\')">Si</button><button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function verificarRechazo(num, esta) {
    $("#_contenido").html("¿Está seguro que RECHAZAR el reembolso " + num + "?");
    var botones = '<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar" onClick="rechazarReembolso(\'' + num + '\',\'' + est + '\')">Si</button><button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function aprobarReembolso(num, est) {
    alert("proceso de aprobacion");
}

function rechazarReembolso(num, est) {
    alert("proceso de rechazo");
}

function detalleBuzon(id, numero) {
    var url = Conn.URL + "militar/crud/" + id;
    var request = CargarAPI({
        sURL: url,
        metodo: 'GET',
        valores: '',
        Objeto: militar
    });
    request.then(function (xhRequest) {
        reembolsoActivo = JSON.parse(xhRequest.responseText);
        llenar(numero);
    });
}

function llenar(numero) {
    console.log(reembolsoActivo);
    $('#lblcedula').text(reembolsoActivo.Persona.DatoBasico.cedula);
    var ncompleto = reembolsoActivo.Persona.DatoBasico.nombreprimero + " " + reembolsoActivo.Persona.DatoBasico.apellidoprimero;
    $('#lblnombre').text(ncompleto);
    $('#lblgrado').text(reembolsoActivo.Grado.descripcion);
    $('#lblsituacion').text(Util.ConvertirSitucacion(reembolsoActivo.situacion));
    $('#lblnumero').text(numero);
    $('#lblcomponente').text(reembolsoActivo.Componente.descripcion);

    var rutaimg = Conn.URLIMG;
    url = rutaimg + reembolsoActivo.Persona.DatoBasico.cedula + ".jpg";
    if (reembolsoActivo.Persona.foto != undefined) {
        rutaimg = Conn.URLTEMP;
        url = rutaimg + reembolsoActivo.Persona.DatoBasico.cedula + "/foto.jpg";
    }
    $("#fotoperfil").attr("src", url);

    crearTablaConceptos(numero);

    $('#listadoCompleto').hide();
    $('#detalle').slideToggle();
}

function crearTablaConceptos(numero) {
    var fila = "";
    var pos = 0;
    var lst = reembolsoActivo.CIS.ServicioMedico.Programa.Reembolso;
    var i = 0;
    $.each(lst, function () {
        if (this.numero == numero) pos = i;
        i++;
    });
    copia = lst[pos];
    $("#cuerpoEditarConceptos").html('');
    $.each(copia.Concepto, function () {
        var ffact = Util.ConvertirFechaHumana(this.DatoFactura.fecha);
        fila = '<tr><td>' + this.afiliado + '</td><td>' + this.descripcion + '</td><td>' + this.DatoFactura.Beneficiario.rif + '</td><td style="display: none">' + this.DatoFactura.Beneficiario.razonsocial + '</td><td>' + Util.ConvertirFechaHumana(this.DatoFactura.fecha) + '</td>\n' +
            '                                <td><input type="text" value="' + this.DatoFactura.numero + '" class="numfact"></td>\n' +
            '                                <td><input type="text" value="' + this.DatoFactura.monto + '" class="mntAcumulado" onkeypress="return Util.SoloNumero(event,this,true)"></td>\n' +
            '                                <td style="width: 7%;">\n' +
            '                                    <button type="button" class="btn btn-default btn-sm borrarconcepto" title="Eliminar"><i class="fa fa-trash-o" style="color: red;"></i></button>\n' +
            '                                </td><td><button type="button" class="btn btn-default btn-sm modconcep" data-toggle="tooltip"title="Modificar"><i class="fa fa-check" style="color: green;"></i></button></td></tr>';
        $("#cuerpoEditarConceptos").append(fila);
    });
    $("#totalter").html(copia.montosolicitado);
    $(".borrarconcepto").click(function () {
        $(this).parents('tr').eq(0).remove();
        if ($("#cuerpoEditarConceptos tr").length == 0) {

        }
        calcularAcumulado();
    });

    $(".modconcep").click(function () {
        calcularAcumulado();
    });

    /**
     * Crear tabla de objservaciones
     */
    if (copia.Seguimiento.Observaciones.length > 0) {
        var lstObs = copia.Seguimiento.Observaciones;
        $.each(lstObs, function () {
            $("#cuerpoObservaciones").html('<tr><td>' + this + '</td><td></td></tr>');
        });

    }
}

function calcularAcumulado() {
    var acumulado = 0;
    $("#cuerpoEditarConceptos tr").each(function () {
        var mnt = $(this).find("input.mntAcumulado").eq(0).val();
        alert(mnt);
        acumulado = parseFloat(acumulado) + parseFloat(mnt);
    });
    $("#totalter").html(acumulado);
    copia.montoaprobado = parseFloat(acumulado);
}


function volverLista() {
    $('#detalle').slideToggle();
    $('#listadoCompleto').show();

}

function actualizarReembolso() {
    var conceptos = new Array();
    var datos = null;
    console.log(copia);
    if ($("#cuerpoEditarConceptos tr").length > 0) {
        $("#cuerpoEditarConceptos tr").each(function () {
            var concep = new ConceptoReembolso();
            var facturaD = new Factura();
            var ffact = copia.fechacreacion;
            if ($(this).find("td").eq(4).html() != "") {
                ffact = new Date(Util.ConvertirFechaUnix($(this).find("td").eq(4).html())).toISOString();
            }
            facturaD.fecha = ffact;
            facturaD.monto = parseFloat($(this).find("input.mntAcumulado").val());
            facturaD.numero = $(this).find("input.numfact").val();
            facturaD.control = $(this).find("input.numfact").val();

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
        copia.Concepto = conceptos;
    } else {
        $.notify("Debe poseer al menos un concpeto para editar. O puede rechazar el reembolso");
    }


    var obseraciones = new Array();
    if($("#cuerpoObservaciones tr").length > 0){
        $("#cuerpoObservaciones tr").each(function(){
           obseraciones.push($(this).find("td").eq(0).html());
        });
    }
    copia.Seguimiento.Estatus = $("#estSeguimiento").val();
    copia.Seguimiento.observaciones = obseraciones;

    datos = {id: reembolsoActivo.Persona.DatoBasico.cedula, numero: copia.numero, Reembolso: copia};
    console.log(datos);
    /*var urlGuardar = Conn.URL + "wreembolso";
    var request2 = CargarAPI({
        sURL: urlGuardar,
        metodo: 'POST',
        valores: datos,
    });

    request2.then(function(xhRequest) {
        var ventana = window.open("planillaReembolso.html?id="+militar.Persona.DatoBasico.cedula, "_blank");
    });*/
}

function agObservacion() {
    var texto = $("#txtObservacion").val();
    var cant = $("#cuerpoObservaciones tr").length;
    var rem = '<button type="button" onclick="remObse(this)" class="btn btn-default btn-sm pull-right" data-toggle="tooltip" title="Borrar"><i style="color: red" class="fa fa-trash-o"></i></button>';
    $("#cuerpoObservaciones").append("<tr><td>" + texto + "</td><td style='5px'>" + rem + "</td></tr>");
}

function remObse(fila) {
    $(fila).parents('tr').eq(0).remove();
}