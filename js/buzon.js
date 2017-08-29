let lstBuzon = null;
let reembolsoActivo = null;
let lstBuzonApoyo = null;
let apoyoActivo = null;
let copia = null;
let posicionModificar = null;
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
}

function conviertEstatus(est){
    var estatus = "";
    switch (est){
        case -1:estatus = "Rechazado";break;
        case 0:estatus = "Inicial";break;
        case 1:estatus = "Pendiente";break;
        case 2:estatus = "En jefatura";break;
        case 3:estatus = "En gerencia";break;
        case 4:estatus = "En presidencia";break;
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
            '                    <i class="fa fa-check" style="color: green" onclick="verificarAprobacion(\'' + this.numero + '\',\'' + this.estatus + '\',\''+this.id+'\')"></i>\n' +
            '                    <i class="fa fa-trash-o" onclick="verificarRechazo(\'' + this.numero + '\',\'' + this.estatus + '\',\''+this.id+'\')"></i>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </li>';
        $("#lista").append(item);
    });
}

function buzonReembolso(est){

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
    var datos = {ID:id,Numero:num,Estatus:parseInt(esta)};
    console.log(datos);
    var request = CargarAPI({
        sURL: url,
        metodo: 'POST',
        valores: datos,
    });
    request.then(function (xhRequest) {
        listaBuzon(est);
        $.notify("Se modifico estatus del reembolso");
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
        listaBuzon(est);
        $.notify("El reembolso fue rechazado");
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
        reembolsoActivo = JSON.parse(xhRequest.responseText);
        if(tipo == "A"){
            llenarBuzonApoyo(numero,est);
        }else{
            llenarBuzon(numero,est);
        }

    });
}

function llenarBuzon(numero,est) {
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

    crearTablaConceptos(numero,est);

    mostrarTextoObservacion(est);

    $('#listasProgramas').hide();
    $('#detalle').slideToggle();
}

function crearTablaConceptos(numero,est) {
    var fila = "";
    var pos = 0;
    var lst = reembolsoActivo.CIS.ServicioMedico.Programa.Reembolso;
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
        activarCambioEstatus();
    }
    $("#cuerpoEditarConceptos").html('');
    $.each(copia.Concepto, function () {
        var mntApo = this.DatoFactura.monto;
        if(this.DatoFactura.montoaprobado > 0) mntApo = this.DatoFactura.montoaprobado;
        var ffact = Util.ConvertirFechaHumana(this.DatoFactura.fecha);
        fila = '<tr><td>' + this.afiliado + '</td><td>' + this.descripcion + '</td><td>' + this.DatoFactura.Beneficiario.rif + '</td><td style="display: none">' + this.DatoFactura.Beneficiario.razonsocial + '</td><td>' + Util.ConvertirFechaHumana(this.DatoFactura.fecha) + '</td>\n' +
            '                                <td><input type="text" value="' + this.DatoFactura.numero + '" class="numfact"></td>\n' +
            '                                <td class="mntsoli">' + this.DatoFactura.monto + '</td>\n' +
            '                                <td><input type="text" value="' + mntApo + '" class="mntAcumulado" onkeypress="return Util.SoloNumero(event,this,true)" onblur="calcularAcumulado()"></td>\n' +
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
        calcularAcumulado();
    });

    $(".modconcep").click(function () {
        calcularAcumulado();
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
}

function calcularAcumulado() {
    var acumulado = 0;
    $("#cuerpoEditarConceptos tr").each(function () {
        var mnt = $(this).find("input.mntAcumulado").eq(0).val();
        var sol = $(this).find("td.mntsoli").eq(0).html();
        console.log(mnt + "||"+sol );
        if(parseFloat(mnt) > parseFloat(sol)){
            mnt = sol;
            $(this).find("input.mntAcumulado").eq(0).val(mnt);
            $.notify("El  monto aprobado no debe ser mayor al solicitado");
        }
        acumulado = parseFloat(acumulado) + parseFloat(mnt);
    });
    acumulado = parseFloat(acumulado).toFixed(2);
    $("#totalapro").html(acumulado);
}


function volverLista() {
    $("#listasProgramas").slideToggle();
    $('#detalle').hide();
    $("#detalleApoyo").hide();
}

function actualizarReembolso(est) {
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
            facturaD.monto = parseFloat($(this).find("td").eq(6).html());
            facturaD.montoaprobado = parseFloat($(this).find("input.mntAcumulado").val());
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
            copia.montoaprobado = parseFloat($("#totalapro").html());

            conceptos.push(concep);
        });
        copia.Concepto = conceptos;
    } else {
        $.notify("Debe poseer al menos un concpeto para editar. O puede rechazar el reembolso");
    }


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

    datos = {id: reembolsoActivo.Persona.DatoBasico.cedula, numero: copia.numero, Reembolso: copia,Posicion:posicionModificar,Observaciones:obseraciones};
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

function agObservacion() {
    var texto = $("#txtObservacion").val();
    var tabla = $("#cuerpoObservaciones");
    if(copia.estatus > 1) tabla = $("#cuerpoOpiniones");
    var rem = '<button type="button" onclick="remObse(this)" class="btn btn-default btn-sm pull-right" data-toggle="tooltip" title="Borrar"><i style="color: red" class="fa fa-trash-o"></i></button>';
    tabla.append("<tr class='agobs'><td>" + texto + "</td><td style='5px'>" + rem + "</td></tr>");
}

function remObse(fila) {
    $(fila).parents('tr').eq(0).remove();
}

function activarCambioEstatus(){

    $("#cambioestatus").show();
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

    crearTablaConceptos(numero,est);

    mostrarTextoObservacion(est);

    $('#listasProgramas').hide();
    $('#detalle').slideToggle();
}
