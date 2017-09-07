let lstBuzon = null;
let militarActivo = null;
let lstBuzonApoyo = null;
let lstBuzonCarta = null;
let apoyoActivo = null;
let copia = null;
let posicionModificar = null;
$(function () {

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

    var url2 = Conn.URL + "wapoyo/listar/" + est;
    var request2 = CargarAPI({
        sURL: url2,
        metodo: 'GET',
        valores: ''
    });
    request2.then(function (xhRequest) {

        lstBuzonApoyo = JSON.parse(xhRequest.responseText);
        crearBuzonApoyo(est);
    });

    var url3 = Conn.URL + "wcarta/listar/" + est;
    var request3 = CargarAPI({
        sURL: url3,
        metodo: 'GET',
        valores: ''
    });
    request3.then(function (xhRequest) {

        lstBuzonCarta = JSON.parse(xhRequest.responseText);
        crearBuzonCarta(est);
    });
}

function conviertEstatus(est){
    var estatus = "";
    switch (est){
        case -1:estatus = "Rechazado";break;
        case 0:estatus = "Inicial";break;
        case 1:estatus = "Pendiente";break;
        case 2:estatus = "En jefatura";break;
        case 3:estatus = "En gerencia";break;
        case 4:estatus = "Aprobado";break;
        case 5:estatus = "Aprobado";break;
    }
    return estatus;
}

function crearBuzon(est) {
    console.log(lstBuzon);
    $("#lista").html('<li>\n' +
        '            <div class="row">\n' +
        '                <div class="col-sm-1"><span class="text">Reembolso</span></div>\n' +
        '                <div class="col-sm-1"><span class="text">Cedula</span></div>\n' +
        '                <div class="col-sm-3"><span class="text">Nombre y Apellido</span></div>\n' +
        '                <div class="col-sm-1"><span class="text">F.Solicitud</span></div>\n' +
        '                <div class="col-sm-2"><span class="text">M.Solicitud</span></div>\n' +
        '                <div class="col-sm-2"><span class="text">M.Aprobado</span></div>\n' +
        '                <div class="col-sm-1">Estatus</div>\n' +
        '            </div>\n' +
        '        </li>');
    $.each(lstBuzon, function () {
        var alertSegui = "";
        switch (this.estatusseguimiento){
            case 1:
                alertSegui = '<small class="label label-danger"><i class="fa fa-info-circle"></i>Pendientes</small>';
                break;
            case 2:
                alertSegui = '<small class="label label-info"><i class="fa fa-comment-o"></i>Recomendacion</small>';
                break;
        }
        var item = '<li><div class="row"><div class="col-sm-1"><span class="text"><a href="#" onclick="detalleBuzon(\'' + this.id + '\',\'' + this.numero + '\','+est+')"> ' + this.numero + '</a></span></div>\n' +
            '                <div class="col-sm-1"><span class="text">' + this.id + '</span></div>\n' +
            '                <div class="col-sm-3">' + this.nombre + '</div>\n' +
            '                <div class="col-sm-1">' + Util.ConvertirFechaHumana(this.fechacreacion) + '</div>\n' +
            '                <div class="col-sm-2">' + numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $') + '</div>\n' +
            '                <div class="col-sm-2">' + numeral(parseFloat(this.montoaprobado)).format('0,0[.]00 $') + '</div>\n' +
            '                <div class="col-sm-1">' + conviertEstatus(this.estatus)+alertSegui + '</div>\n' +
            '                <div class="tools" style="margin-right: 50px;">\n' +
            '                    <i class="fa fa-check" style="color: green" onclick="verificarAprobacion(\'' + this.numero + '\',\'' + this.estatus + '\',\''+this.id+'\')">Procesar</i>\n' +
            '                    <i class="fa fa-trash-o" onclick="verificarRechazo(\'' + this.numero + '\',\'' + this.estatus + '\',\''+this.id+'\')">Rechazar</i>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </li>';
        $("#lista").append(item);
    });
}

function verificarAprobacion(num, esta,id) {
    $("#_contenido").html("¿Está seguro que APROBAR el reembolso " + num + "?");
    var botones = '<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar" onClick="aprobarReembolso(\'' + num + '\',\'' + esta + '\',\''+id+'\')">Si</button><button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function verificarRechazo(num, esta,id) {
    $("#_contenido").html("¿Está seguro que RECHAZAR el reembolso " + num + "?");
    var botones = '<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar" onClick="rechazarReembolso(\'' + num + '\',\'' + esta + '\',\''+id+'\')">Si</button><button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function aprobarReembolso(num, est,id) {
    var url = Conn.URL + "wreembolso/estatus";
    var esta = parseInt(est) + 1
    var datos = {id:id,numero:num,estatus:parseInt(esta)};
    console.log(JSON.stringify(datos));
    var request = CargarAPI({
        sURL: url,
        metodo: 'PUT',
        valores: datos,
    });
    request.then(function (xhRequest) {

        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        //msjRespuesta(respuesta.msj);
        $.notify(respuesta.msj);
        listaBuzon(est);
    });
}

function rechazarReembolso(num, est,id) {
    var url = Conn.URL + "wreembolso/estatus";
    var esta = -1;
    var datos = {ID:id,Numero:num,Estatus:parseInt(esta)};
    console.log(JSON.stringify(datos));
    var request = CargarAPI({
        sURL: url,
        metodo: 'PUT',
        valores: datos,
        Objeto: militar
    });
    request.then(function (xhRequest) {

        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        $.notify(respuesta.msj);
        listaBuzon(est);
    });

}

function detalleBuzon(id, numero, est,tipo) {
    var url = Conn.URL + "militar/crud/" + id;
    var request = CargarAPI({
        sURL: url,
        metodo: 'GET',
        valores: '',
        Objeto: militar
    });
    request.then(function (xhRequest) {
        militarActivo = JSON.parse(xhRequest.responseText);
        switch (tipo){
            case "A":llenarBuzonApoyo(numero,est);break;
            case "C":llenarBuzonCarta(numero,est);break;
            default: llenarBuzon(numero,est);
        }
    });
}

function llenarBuzon(numero,est) {
    $('#lblcedula').text(militarActivo.Persona.DatoBasico.cedula);
    var ncompleto = militarActivo.Persona.DatoBasico.nombreprimero + " " + militarActivo.Persona.DatoBasico.apellidoprimero;
    $('#lblnombre').text(ncompleto);
    $('#lblgrado').text(militarActivo.Grado.descripcion);
    $('#lblsituacion').text(Util.ConvertirSitucacion(militarActivo.situacion));
    $('#lblnumero').text(numero);
    $('#lblcomponente').text(militarActivo.Componente.descripcion);

    var rutaimg = Conn.URLIMG;
    url = rutaimg + militarActivo.Persona.DatoBasico.cedula + ".jpg";
    if (militarActivo.Persona.foto != undefined) {
        rutaimg = Conn.URLTEMP;
        url = rutaimg + militarActivo.Persona.DatoBasico.cedula + "/foto.jpg";
    }
    $("#fotoperfil").attr("src", url);

    crearTablaConceptos(numero,est);

    mostrarTextoObservacion(est);

    $('#listasProgramas').hide();
    $('#detalle').slideToggle();
}

function crearTablaConceptos(numero,est) {
    var fila = "";
    var pos = 0;
    var lst = militarActivo.CIS.ServicioMedico.Programa.Reembolso;
    var i = 0;
    $.each(lst, function () {
        if (this.numero == numero) {
            pos = i;
            posicionModificar = i;
        }
        i++;
    });
    copia = lst[pos];
    if(copia.Seguimiento.Estatus != undefined) $("#estSeguimiento").val(copia.Seguimiento.Estatus);
    if(est > 2){
        activarCambioEstatus();
    }
    $("#cuerpoEditarConceptos").html('');
    var jj = new Array();
    $.each(copia.Concepto, function () {
        var mntApo = 0;
        if(this.DatoFactura.montoaprobado > 0) mntApo = this.DatoFactura.montoaprobado;
        var ffact = Util.ConvertirFechaHumana(this.DatoFactura.fecha);
        jj.push(this.afiliado);
        var picar = this.afiliado.split("-");
        var picar2 = picar[1].split("(");
        var tam = picar2[1].length;
        if(est)
        fila = '<tr><td>'+picar2[1].substr(0,tam-1)+'</td><td>' + picar[0] + '</td><td>'+picar2[0]+'</td><td>' + this.descripcion + '</td><td><input type="text" value="' + this.DatoFactura.numero + '" class="numfact"></td>' +
            '<td style="display: none">' + this.DatoFactura.Beneficiario.rif + '</td><td style="display: none">' + this.DatoFactura.Beneficiario.razonsocial + '</td><td><input type="text" class="ffactReembolso" value="' + Util.ConvertirFechaHumana(this.DatoFactura.fecha) + '"></input></td>\n' +
            '                                <td><input type="text" onblur="calcularPorcen(this,\'r\')" class="mntsoli" onkeypress="return Util.SoloNumero(event,this,true)" value="' + this.DatoFactura.monto + '" /></td><td><input type="number" class="porcentajecalculo" onkeypress="return Util.SoloNumero(event,this)" value="0" onblur="calcularPorcen(this,\'r\')" /></td>\n' +
            '                                <td><input type="text" value="' + mntApo + '" class="mntAcumulado" onkeypress="return Util.SoloNumero(event,this,true)" onblur="calcularAcumulado(\'r\')"></td>\n' +
            '                                <td style="width: 7%;">\n' +
            '                                    <button type="button" class="btn btn-default btn-sm borrarconcepto" title="Eliminar"><i class="fa fa-trash-o" style="color: red;"></i></button>\n' +
            '                                </td></tr>';
        $("#cuerpoEditarConceptos").append(fila);
    });
    $("#totalter").html(copia.montosolicitado.toFixed(2));
    $("#totalapro").html(copia.montoaprobado);
    $(".borrarconcepto").click(function () {
        $(this).parents('tr').eq(0).remove();
        if ($("#cuerpoEditarConceptos tr").length == 0) {

        }
        calcularAcumulado("r");
    });
    $(".mntsoli").on("keypress",function(e){
        var key = e.keyCode || e.which;
        if(key == 13){
            calcularPorcen(this,'r');
        }
    });

    $(".porcentajecalculo").on("keypress",function(e){
        var key = e.keyCode || e.which;
        if(key == 13){
            calcularPorcen(this,'r');
        }
    });
    $(".modconcep").click(function () {
        calcularAcumulado("r");
    });

    /**
     * Crear tabla de objservaciones
     */
    if (copia.Seguimiento.Observaciones != undefined) {
        var lstObs = copia.Seguimiento.Observaciones;
        $("#cuerpoObservaciones").html('');
        $("#cuerpoOpiniones").html('');
        $.each(lstObs, function () {
            var tipo = this.contenido.split("|||");
            if(tipo[1] != undefined) $("#cuerpoOpiniones").append('<tr><td>' + tipo[0] + '</td><td>'+conviertEstatus(copia.estatus)+'</td></tr>');
            else $("#cuerpoObservaciones").append('<tr><td>' + this.contenido + '</td><td></td></tr>');
        });
    }

    validarDetalleReembolso(est);
}

function calcularPorcen(obj,tipo){
    var por = $(obj).parents("tr").eq(0).find("input.porcentajecalculo").val();
    var soli = $(obj).parents("tr").eq(0).find("input.mntsoli").val();
    var nuevoAprobado = soli*por/100;

    $(obj).parents("tr").eq(0).find("input.mntAcumulado").val(nuevoAprobado.toFixed(2));
    calcularAcumulado(tipo);
}

function calcularAcumulado(tipo) {
    var idTabla = "";
    var idTotal = "";
    var idTotalSol = "";
    switch(tipo){
        case "r":idTabla ="cuerpoEditarConceptos";idTotal = "totalapro";idTotalSol="totalter";break;
        case "a":idTabla ="cuerpoEditarConceptosApoyo";idTotal = "totalaproApoyo";idTotalSol="totalterApoyo";break;
        case "c":idTabla ="cuerpoEditarConceptosCarta";idTotal = "totalaproCarta";idTotalSol="totalterCarta";break;
    }
    //alert(idTabla);
    var acumulado = 0;
    var acumulado2 = 0;
    $("#"+idTabla+" tr").each(function () {
        var mnt = $(this).find("input.mntAcumulado").eq(0).val();
        var sol = $(this).find("input.mntsoli").eq(0).val();
        console.log(mnt + "||"+sol );
        if(parseFloat(mnt) > parseFloat(sol)){
            mnt = sol;
            $(this).find("input.mntAcumulado").eq(0).val(mnt);
            $.notify("El  monto aprobado no debe ser mayor al solicitado");
        }
        acumulado2 = parseFloat(acumulado2)+parseFloat(sol);
        acumulado = parseFloat(acumulado) + parseFloat(mnt);
    });
    acumulado = parseFloat(acumulado).toFixed(2);
    acumulado2 = parseFloat(acumulado2).toFixed(2);
    $("#"+idTotal).html(acumulado);
    $("#"+idTotalSol).html(acumulado2);
}


function volverLista() {
    $("#listasProgramas").slideToggle();
    $('#detalle').hide();
    $("#detalleApoyo").hide();
    $("#detalleCarta").hide();
}

function actualizarReembolso(est) {
    var conceptos = new Array();
    var datos = null;
    console.log(copia);
    var i = 0;
    if ($("#cuerpoEditarConceptos tr").length > 0) {
        $("#cuerpoEditarConceptos tr").each(function () {
            var concep = new ConceptoReembolso();
            var facturaD = new Factura();
            var ffact = copia.fechacreacion;
            if ($(this).find("input.ffactReembolso").eq(0).val() != "") {
                ffact = new Date(Util.ConvertirFechaUnix($(this).find("input.ffactReembolso").val())).toISOString();
            }
            facturaD.fecha = ffact;
            facturaD.monto = parseFloat($(this).find("input.mntsoli").val());
            facturaD.montoaprobado = parseFloat($(this).find("input.mntAcumulado").val());
            facturaD.numero = $(this).find("input.numfact").val();
            facturaD.control = $(this).find("input.numfact").val();

            facturaD.Beneficiario = copia.Concepto[i].DatoFactura.Beneficiario;

            concep.DatoFactura = facturaD;
            concep.afiliado = copia.Concepto[i].afiliado;
            concep.descripcion = copia.Concepto[i].descripcion;
            i++;
            conceptos.push(concep);
        });

        copia.Concepto = conceptos;
    } else {
        $.notify("Debe poseer al menos un concpeto para editar. O puede rechazar el reembolso");
    }

    copia.montoaprobado = parseFloat($("#totalapro").html());
    copia.montosolicitado = parseFloat($("#totalter").html());
    var obseraciones = new Array();
    var tipoObser = "";
    if(copia.estatus > 1) tipoObser = "|||"+copia.estatus;
    if($("#cuerpoObservaciones tr").length > 0){
        $("#cuerpoObservaciones tr.agobs").each(function(){
           obseraciones.push($(this).find("td").eq(0).html());
        });
    }
    if($("#cuerpoOpiniones tr").length > 0){
        $("#cuerpoOpiniones tr.agobs").each(function(){
            obseraciones.push($(this).find("td").eq(0).html()+tipoObser);
        });
    }
    copia.Seguimiento.Estatus = parseInt($("#estSeguimiento").val());

    datos = {id: militarActivo.Persona.DatoBasico.cedula, numero: copia.numero, Reembolso: copia,Posicion:posicionModificar,Observaciones:obseraciones};
    console.log(datos);
    console.log(JSON.stringify(datos));
    var urlGuardar = Conn.URL + "wreembolso";
    var request2 = CargarAPI({
        sURL: urlGuardar,
        metodo: 'PUT',
        valores: datos,
    });

    request2.then(function(xhRequest) {
        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        msjRespuesta(respuesta.msj);
        listaBuzon(copia.estatus);
        volverLista();
    });
}

function agObservacion(tipo) {
    var idTexto = "";
    var idTabla = "";
    var idOpi = "";
    switch (tipo){
        case "r":idOpi="cuerpoOpiniones";idTexto="txtObservacion";idTabla = "cuerpoObservaciones";break;
        case "a":idOpi="cuerpoOpinionesApoyo";idTexto="txtObservacionApoyo";idTabla = "cuerpoObservacionesApoyo";break;
        case "c":idOpi="cuerpoOpinionesCarta";idTexto="txtObservacionCarta";idTabla = "cuerpoObservacionesCarta";break;
    }

    var texto = $("#"+idTexto).val();
    var tabla = $("#"+idTabla);
    if(copia.estatus > 1) tabla = $("#"+idOpi);
    var rem = '<button type="button" onclick="remObse(this)" class="btn btn-default btn-sm pull-right" data-toggle="tooltip" title="Borrar"><i style="color: red" class="fa fa-trash-o"></i></button>';
    tabla.append("<tr class='agobs'><td>" + texto + "</td><td style='5px'>" + rem + "</td></tr>");
}

function remObse(fila) {
    $(fila).parents('tr').eq(0).remove();
}

function activarCambioEstatus(){

    $("#cambioestatus").show();
    $("#cambioestatusApoyo").show();
    $("#cambioestatusCarta").show();
}

function cambiarEstatus(tipo){
    var estatus = 0;
    switch (tipo){
        case "a":
            verificarAprobacion(copia.numero ,copia.estatus,$("#lblcedula").text());
            break;
        case "r":
            verificarRechazo(copia.numero ,copia.estatus,$("#lblcedula").text());
        break;
        case "e":
            estatus = $("#cmbcambioestatus").val();
            verificarAprobacion(copia.numero ,estatus,$("#lblcedula").text());
            break;
    }
}

function mostrarTextoObservacion(est){
    if(est > 1){
        $(".lblobser").text(" OPINIÓN");
        $("#cabObserbaciones").html("OPINIONES");
    }else{
        $(".lblobser").text(" OBSERVACIÓN");
        $("#cabObserbaciones").html("OBSERVACIONES");
    }
}

/** APOYO **/

function cambiarEstatusApoyo(tipo){
    var estatus = 0;
    switch (tipo){
        case "a":
            verificarAprobacionApoyo(copia.numero ,copia.estatus,$("#lblcedulaApoyo").text());
            break;
        case "r":
            verificarRechazoApoyo(copia.numero ,copia.estatus,$("#lblcedulaApoyo").text());
            break;
        case "e":
            estatus = $("#cmbcambioestatusApoyo").val();
            verificarAprobacionApoyo(copia.numero ,estatus,$("#lblcedulaApoyo").text());
            break;
    }
}

function verificarAprobacionApoyo(num, esta,id) {
    $("#_contenido").html("¿Está seguro que APROBAR el apoyo " + num + "?");
    var botones = '<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar" onClick="aprobarApoyo(\'' + num + '\',\'' + esta + '\',\''+id+'\')">Si</button><button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function verificarRechazoApoyo(num, esta,id) {
    $("#_contenido").html("¿Está seguro que RECHAZAR el apoyo " + num + "?");
    var botones = '<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar" onClick="rechazarApoyo(\'' + num + '\',\'' + esta + '\',\''+id+'\')">Si</button><button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function aprobarApoyo(num, est,id) {
    var url = Conn.URL + "wapoyo/estatus";
    var esta = parseInt(est) + 1
    var datos = {id:id,numero:num,estatus:parseInt(esta)};
    console.log(JSON.stringify(datos));
    var request = CargarAPI({
        sURL: url,
        metodo: 'PUT',
        valores: datos,
    });
    request.then(function (xhRequest) {

        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        //msjRespuesta(respuesta.msj);
        $.notify(respuesta.msj);
        listaBuzon(est);
    });
}

function rechazarApoyo(num, est,id) {
    var url = Conn.URL + "wapoyo/estatus";
    var esta = -1;
    var datos = {ID:id,Numero:num,Estatus:parseInt(esta)};
    console.log(JSON.stringify(datos));
    var request = CargarAPI({
        sURL: url,
        metodo: 'PUT',
        valores: datos,
        Objeto: militar
    });
    request.then(function (xhRequest) {

        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        $.notify(respuesta.msj);
        listaBuzon(est);
    });

}
function crearBuzonApoyo(est){
    $("#listaApoyo").html('<li>\n' +
        '            <div class="row">\n' +
        '                <div class="col-sm-1"><span class="text">Apoyo</span></div>\n' +
        '                <div class="col-sm-1"><span class="text">Cedula</span></div>\n' +
        '                <div class="col-sm-3"><span class="text">Nombre y Apellido</span></div>\n' +
        '                <div class="col-sm-1"><span class="text">F.Solicitud</span></div>\n' +
        '                <div class="col-sm-2"><span class="text">M.Solicitud</span></div>\n' +
        '                <div class="col-sm-2"><span class="text">M.Aprobado</span></div>\n' +
        '                <div class="col-sm-1">Estatus</div>\n' +
        '            </div>\n' +
        '        </li>');
    $.each(lstBuzonApoyo, function () {
        var alertSegui = "";
        switch (this.estatusseguimiento){
            case 1:
                alertSegui = '<small class="label label-danger"><i class="fa fa-info-circle"></i>Pendientes</small>';
                break;
            case 2:
                alertSegui = '<small class="label label-info"><i class="fa fa-comment-o"></i>Recomendacion</small>';
                break;
        }
        var item = '<li><div class="row"><div class="col-sm-1"><span class="text"><a href="#" onclick="detalleBuzon(\'' + this.id + '\',\'' + this.numero + '\','+est+',\'A\')"> ' + this.numero + '</a></span></div>\n' +
            '                <div class="col-sm-1"><span class="text">' + this.id + '</span></div>\n' +
            '                <div class="col-sm-3">' + this.nombre + '</div>\n' +
            '                <div class="col-sm-1">' + Util.ConvertirFechaHumana(this.fechacreacion) + '</div>\n' +
            '                <div class="col-sm-2">' + numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $') + '</div>\n' +
            '                <div class="col-sm-2">' + numeral(parseFloat(this.montoaprobado)).format('0,0[.]00 $') + '</div>\n' +
            '                <div class="col-sm-1">' + conviertEstatus(this.estatus)+alertSegui + '</div>\n' +
            '                <div class="tools" style="margin-right: 50px;">\n' +
            '                    <i class="fa fa-check" style="color: green" onclick="verificarAprobacionApoyo(\'' + this.numero + '\',\'' + this.estatus + '\',\''+this.id+'\')"></i>\n' +
            '                    <i class="fa fa-trash-o" onclick="verificarRechazoApoyo(\'' + this.numero + '\',\'' + this.estatus + '\',\''+this.id+'\')"></i>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </li>';
        $("#listaApoyo").append(item);
    });
}


function llenarBuzonApoyo(numero,est) {
    console.log(militarActivo);
    $('#lblcedulaApoyo').text(militarActivo.Persona.DatoBasico.cedula);
    var ncompleto = militarActivo.Persona.DatoBasico.nombreprimero + " " + militarActivo.Persona.DatoBasico.apellidoprimero;
    $('#lblnombreApoyo').text(ncompleto);
    $('#lblgradoApoyo').text(militarActivo.Grado.descripcion);
    $('#lblsituacionApoyo').text(Util.ConvertirSitucacion(militarActivo.situacion));
    $('#lblnumeroApoyo').text(numero);
    $('#lblcomponenteApoyo').text(militarActivo.Componente.descripcion);

    var rutaimg = Conn.URLIMG;
    url = rutaimg + militarActivo.Persona.DatoBasico.cedula + ".jpg";
    if (militarActivo.Persona.foto != undefined) {
        rutaimg = Conn.URLTEMP;
        url = rutaimg + militarActivo.Persona.DatoBasico.cedula + "/foto.jpg";
    }
    $("#fotoperfilApoyo").attr("src", url);

    crearTablaConceptosApoyo(numero,est);

    mostrarTextoObservacion(est);

    $('#listasProgramas').hide();
    $('#detalleApoyo').show();
}

function crearTablaConceptosApoyo(numero,est){
    var fila = "";
    var pos = 0;
    var lst = militarActivo.CIS.ServicioMedico.Programa.Apoyo;
    var i = 0;
    $.each(lst, function () {
        if (this.numero == numero) {
            pos = i;
            posicionModificar = i;
        }
        i++;
    });
    copia = lst[pos];
    $("#estSeguimiento").val(copia.Seguimiento.Estatus);
    if(est > 2){
        activarCambioEstatus("apoyo");
    }
    $("#cuerpoEditarConceptosApoyo").html('');
    $.each(copia.Concepto, function () {
        var mntApo = 0;
        if(this.DatoFactura.montoaprobado > 0) mntApo = this.DatoFactura.montoaprobado;
        var ffact = Util.ConvertirFechaHumana(this.DatoFactura.fecha);
        var picar = this.afiliado.split("-");
        var picar2 = picar[1].split("(");
        var tam = picar2[1].length;
        fila = '<tr><td>'+picar2[1].substr(0,tam-1)+'</td><td>' + picar[0] + '</td><td>'+picar2[0]+'</td><td>' + this.descripcion + '</td><td><input type="text" value="' + this.DatoFactura.numero + '" class="numfact"></td>' +
            '<td style="display: none">' + this.DatoFactura.Beneficiario.rif + '</td><td style="display: none">' + this.DatoFactura.Beneficiario.razonsocial + '</td><td><input type="text" class="ffactApoyo" value="' + Util.ConvertirFechaHumana(this.DatoFactura.fecha) + '"></input></td>\n' +
            '                                <td><input type="text" onblur="calcularPorcen(this,\'a\')" class="mntsoli" onkeypress="return Util.SoloNumero(event,this,true)" value="' + this.montoaportar + '" /></td><td><input type="number" class="porcentajecalculo" onkeypress="return Util.SoloNumero(event,this)" value="0" onblur="calcularPorcen(this,\'a\')" /></td>\n' +
            '                                <td><input type="text" value="' + mntApo + '" class="mntAcumulado" onkeypress="return Util.SoloNumero(event,this,true)" onblur="calcularAcumulado(\'a\')"></td>\n' +
            '                                <td style="width: 7%;">\n' +
            '                                    <button type="button" class="btn btn-default btn-sm borrarconcepto" title="Eliminar"><i class="fa fa-trash-o" style="color: red;"></i></button>\n' +
            '                                </td></tr>';
        $("#cuerpoEditarConceptosApoyo").append(fila);
    });
    $("#totalterApoyo").html(copia.montosolicitado.toFixed(2));
    $("#totalaproApoyo").html(copia.montoaprobado);
    $(".borrarconcepto").click(function () {
        $(this).parents('tr').eq(0).remove();
        if ($("#cuerpoEditarConceptosApoyo tr").length == 0) {

        }
        calcularAcumulado("apoyo");
    });
    $(".mntsoli").on("keypress",function(e){
        var key = e.keyCode || e.which;
        if(key == 13){
            calcularPorcen(this,'a');
        }
    });
    $(".porcentajecalculo").on("keypress",function(e){
        var key = e.keyCode || e.which;
        if(key == 13){
            calcularPorcen(this,'a');
        }
    });

    /**
     * Crear tabla de objservaciones
     */
    if (copia.Seguimiento.Observaciones != undefined) {
        var lstObs = copia.Seguimiento.Observaciones;
        $("#cuerpoObservacionesApoyo").html('');
        $("#cuerpoOpinionesApoyo").html('');
        $.each(lstObs, function () {
            var tipo = this.contenido.split("|||");
            if(tipo[1] != undefined) $("#cuerpoOpinionesApoyo").append('<tr><td>' + tipo[0] + '</td><td>'+conviertEstatus(copia.estatus)+'</td></tr>');
            else $("#cuerpoObservacionesApoyo").append('<tr><td>' + this.contenido + '</td><td></td></tr>');
        });
    }
    activarCambioEstatus();
}

function planillaReembolso(){
    var ventana = window.open("planillaReembolso.html?id="+militarActivo.Persona.DatoBasico.cedula+"&pos="+posicionModificar, "_blank");
}

function actualizarApoyo(est) {
    var conceptos = new Array();
    var datos = null;
    console.log(copia);
    var i = 0;
    if ($("#cuerpoEditarConceptosApoyo tr").length > 0) {
        $("#cuerpoEditarConceptosApoyo tr").each(function () {
            var concep = new ConceptoApoyo();
            var facturaD = new Factura();
            var ffact = copia.fechacreacion;
            if ($(this).find("input.ffactApoyo").eq(0).val() != "") {
                ffact = new Date(Util.ConvertirFechaUnix($(this).find("input.ffactApoyo").val())).toISOString();
            }
            facturaD.fecha = ffact;
            facturaD.monto = parseFloat($(this).find("input.mntsoli").val());
            facturaD.montoaprobado = parseFloat($(this).find("input.mntAcumulado").val());
            facturaD.numero = $(this).find("input.numfact").val();
            facturaD.control = $(this).find("input.numfact").val();

            facturaD.Beneficiario = copia.Concepto[i].DatoFactura.Beneficiario;

            concep.DatoFactura = facturaD;
            concep.afiliado = copia.Concepto[i].afiliado;
            concep.descripcion = copia.Concepto[i].descripcion;
            concep.montoaportar = parseFloat($("#totalterApoyo").html());
            i++;
            conceptos.push(concep);
        });

        copia.Concepto = conceptos;
    } else {
        $.notify("Debe poseer al menos un concpeto para editar. O puede rechazar el reembolso");
    }

    copia.montoaprobado = parseFloat($("#totalaproApoyo").html());
    copia.montosolicitado = parseFloat($("#totalterApoyo").html());
    var obseraciones = new Array();
    var tipoObser = "";
    if(copia.estatus > 1) tipoObser = "|||"+copia.estatus;
    if($("#cuerpoObservacionesApoyo tr").length > 0){
        $("#cuerpoObservacionesApoyo tr.agobs").each(function(){
            obseraciones.push($(this).find("td").eq(0).html());
        });
    }
    if($("#cuerpoOpinionesApoyo tr").length > 0){
        $("#cuerpoOpinionesApoyo tr.agobs").each(function(){
            obseraciones.push($(this).find("td").eq(0).html()+tipoObser);
        });
    }
    copia.Seguimiento.Estatus = parseInt($("#estSeguimientoApoyo").val());

    datos = {id: militarActivo.Persona.DatoBasico.cedula, numero: copia.numero, Apoyo: copia,Posicion:posicionModificar,Observaciones:obseraciones};
    console.log(datos);
    console.log(JSON.stringify(datos));
    var urlGuardar = Conn.URL + "wapoyo";
    var request2 = CargarAPI({
        sURL: urlGuardar,
        metodo: 'PUT',
        valores: datos,
    });

    request2.then(function(xhRequest) {
        respuesta = JSON.parse(xhRequest.responseText);
        if(respuesta.msj == "") respuesta.msj = "Se proceso con exito....";
        msjRespuesta(respuesta.msj);
        listaBuzon(copia.estatus);
        volverLista();
    });
}


/**CARTA AVAL***/
function crearBuzonCarta(est) {
    console.log(lstBuzonCarta);
    $("#listaCarta").html('<li>\n' +
        '            <div class="row">\n' +
        '                <div class="col-sm-1"><span class="text">Carta</span></div>\n' +
        '                <div class="col-sm-1"><span class="text">Cedula</span></div>\n' +
        '                <div class="col-sm-3"><span class="text">Nombre y Apellido</span></div>\n' +
        '                <div class="col-sm-1"><span class="text">F.Solicitud</span></div>\n' +
        '                <div class="col-sm-2"><span class="text">M.Solicitud</span></div>\n' +
        '                <div class="col-sm-2"><span class="text">M.Aprobado</span></div>\n' +
        '                <div class="col-sm-1">Estatus</div>\n' +
        '            </div>\n' +
        '        </li>');
    $.each(lstBuzonCarta, function () {
        var alertSegui = "";
        switch (this.estatusseguimiento){
            case 1:
                alertSegui = '<small class="label label-danger"><i class="fa fa-info-circle"></i>Pendientes</small>';
                break;
            case 2:
                alertSegui = '<small class="label label-info"><i class="fa fa-comment-o"></i>Recomendacion</small>';
                break;
        }
        var item = '<li><div class="row"><div class="col-sm-1"><span class="text"><a href="#" onclick="detalleBuzon(\'' + this.id + '\',\'' + this.numero + '\','+est+',\'C\')"> ' + this.numero + '</a></span></div>\n' +
            '                <div class="col-sm-1"><span class="text">' + this.id + '</span></div>\n' +
            '                <div class="col-sm-3">' + this.nombre + '</div>\n' +
            '                <div class="col-sm-1">' + Util.ConvertirFechaHumana(this.fechacreacion) + '</div>\n' +
            '                <div class="col-sm-2">' + numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $') + '</div>\n' +
            '                <div class="col-sm-2">' + numeral(parseFloat(this.montoaprobado)).format('0,0[.]00 $') + '</div>\n' +
            '                <div class="col-sm-1">' + conviertEstatus(this.estatus)+alertSegui + '</div>\n' +
            '                <div class="tools" style="margin-right: 50px;">\n' +
            '                    <i class="fa fa-check" style="color: green" onclick="verificarAprobacion(\'' + this.numero + '\',\'' + this.estatus + '\',\''+this.id+'\')"></i>\n' +
            '                    <i class="fa fa-trash-o" onclick="verificarRechazo(\'' + this.numero + '\',\'' + this.estatus + '\',\''+this.id+'\')"></i>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </li>';
        $("#listaCarta").append(item);
    });
}

function llenarBuzonCarta(numero,est) {
    console.log(militarActivo);
    $('#lblcedulaCarta').text(militarActivo.Persona.DatoBasico.cedula);
    var ncompleto = militarActivo.Persona.DatoBasico.nombreprimero + " " + militarActivo.Persona.DatoBasico.apellidoprimero;
    $('#lblnombreCarta').text(ncompleto);
    $('#lblgradoCarta').text(militarActivo.Grado.descripcion);
    $('#lblsituacionCarta').text(Util.ConvertirSitucacion(militarActivo.situacion));
    $('#lblnumeroCarta').text(numero);
    $('#lblcomponenteCarta').text(militarActivo.Componente.descripcion);

    var rutaimg = Conn.URLIMG;
    url = rutaimg + militarActivo.Persona.DatoBasico.cedula + ".jpg";
    if (militarActivo.Persona.foto != undefined) {
        rutaimg = Conn.URLTEMP;
        url = rutaimg + militarActivo.Persona.DatoBasico.cedula + "/foto.jpg";
    }
    $("#fotoperfilCarta").attr("src", url);

    crearTablaConceptosCarta(numero,est);

    mostrarTextoObservacion(est);

    $('#listasProgramas').hide();
    $('#detalleCarta').show();
}

function crearTablaConceptosCarta(numero,est){
    var fila = "";
    var pos = 0;
    console.log("aca esta el objeto");
    console.log(militarActivo);
    var lst = militarActivo.CIS.ServicioMedico.Programa.CartaAval;
    var i = 0;
    $.each(lst, function () {
        if (this.numero == numero) {
            pos = i;
            posicionModificar = i;
        }
        i++;
    });
    copia = lst[pos];
    $("#estSeguimientoCarta").val(copia.Seguimiento.Estatus);
    if(est > 2){
        activarCambioEstatus("carta");
    }
    $("#cuerpoEditarConceptosCarta").html('');
    $.each(copia.Concepto, function () {
        var mntApo = this.DatoFactura.monto;
        if(this.DatoFactura.montoaprobado > 0) mntApo = this.DatoFactura.montoaprobado;

        fila = '<tr><td>' + this.afiliado + '</td><td>' + this.descripcion + '</td><td>' + this.DatoFactura.Beneficiario.rif + '</td><td style="display: none">' + this.DatoFactura.Beneficiario.razonsocial + '</td><td>' + this.DatoFactura.monto + '</td>\n' +
            '                                <td><input type="text" value="' + this.montoaseguradora + '" class="numfact"></td>\n' +
            '                                <td class="mntsoli">' + this.montoaportar + '</td>\n' +
            '                                <td><input type="text" value="' + mntApo + '" class="mntAcumulado" onkeypress="return Util.SoloNumero(event,this,true)" onblur="calcularAcumulado()"></td>\n' +
            '                                <td style="width: 7%;">\n' +
            '                                    <button type="button" class="btn btn-default btn-sm borrarconcepto" title="Eliminar"><i class="fa fa-trash-o" style="color: red;"></i></button>\n' +
            '                                </td></tr>';
        $("#cuerpoEditarConceptosCarta").append(fila);
    });
    $("#totalterCarta").html(copia.montosolicitado.toFixed(2));
    $("#totalaproCarta").html(copia.montoaprobado);
    $(".borrarconcepto").click(function () {
        $(this).parents('tr').eq(0).remove();
        if ($("#cuerpoEditarConceptosCarta tr").length == 0) {

        }
        calcularAcumulado("carta");
    });

    /**
     * Crear tabla de objservaciones
     */
    if (copia.Seguimiento.Observaciones != undefined) {
        var lstObs = copia.Seguimiento.Observaciones;
        $("#cuerpoObservacionesCarta").html('');
        $("#cuerpoOpinionesCarta").html('');
        $.each(lstObs, function () {
            var tipo = this.contenido.split("|||");
            if(tipo[1] != undefined) $("#cuerpoOpinionesCarta").append('<tr><td>' + tipo[0] + '</td><td>'+conviertEstatus(copia.estatus)+'</td></tr>');
            else $("#cuerpoObservacionesCarta").append('<tr><td>' + this.contenido + '</td><td></td></tr>');
        });
    }
}

function validarDetalleReembolso(est){
    switch (est){
        case 0:
            $(".porcentajecalculo").attr("disabled",true);
            $(".mntAcumulado").attr("disabled",true);
            $(".impPlanillaReembolso").hide();
            break;
        case 1:
            $(".porcentajecalculo").attr("disabled",false);
            $(".mntAcumulado").attr("disabled",false);
            $(".impPlanillaReembolso").show();
            break;
        case 2:
            $(".porcentajecalculo").attr("disabled",false);
            $(".mntAcumulado").attr("disabled",false);
            $(".impPlanillaReembolso").show();
            break;
        case 3:
            $(".porcentajecalculo").attr("disabled",false);
            $(".mntAcumulado").attr("disabled",false);
            $(".impPlanillaReembolso").show();
            break;
        case 4:
            $(".porcentajecalculo").attr("disabled",false);
            $(".mntAcumulado").attr("disabled",false);
            $(".impPlanillaReembolso").show();
            break;
        case 5:
            $(".porcentajecalculo").attr("disabled",false);
            $(".mntAcumulado").attr("disabled",false);
            $(".impPlanillaReembolso").show();
            break;
    }
}