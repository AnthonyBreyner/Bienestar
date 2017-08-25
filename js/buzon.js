let lstBuzon = null;

function listaBuzon(est){
    var url = Conn.URL + "wreembolso/listar/" + est;
    var request = CargarAPI({
        sURL: url,
        metodo: 'GET',
        valores: ''
    });
    request.then(function(xhRequest) {

        lstBuzon = JSON.parse(xhRequest.responseText);
        crearBuzon(est);
    });
}

function crearBuzon(est){
    console.log(lstBuzon);

    $.each(lstBuzon,function(){
        var item = '<li><div class="row"><div class="col-sm-1"><span class="text"> '+this.numero+'</span></div>\n' +
            '                <div class="col-sm-1"><span class="text">'+this.id+'</span></div>\n' +
            '                <div class="col-sm-4">'+this.nombre+'</div>\n' +
            '                <div class="col-sm-2">'+Util.ConvertirFechaHumana(this.fechacreacion)+'</div>\n' +
            '                <div class="col-sm-2">M.Solicitud</div>\n' +
            '                <div class="col-sm-2">Estatus<small class="label label-danger"><i class="fa fa-clock-o"></i> 2 mins</small></div>\n' +
            '                <div class="tools">\n' +
            '                    <i class="fa fa-edit" onclick="verificarAprobacion(\"'+this.numero+'\",\"'+this.estatus+'\")"></i>\n' +
            '                    <i class="fa fa-trash-o" onclick="verificarRechazo(\"'+this.numero+'\",\"'+this.estatus+'\")"></i>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </li>';
        $("#lista").append(item);
    });

}

function verificarAprobacion(num,esta){
    $("#_contenido").html("¿Está seguro que APROBAR el reembolso "+num+"?");
    var botones = '<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar" onClick="aprobarReembolso(num,est)">Si</button>\
    <button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}

function verificarRechazo(num,esta){
    $("#_contenido").html("¿Está seguro que RECHAZAR el reembolso "+num+"?");
    var botones = '<button type="button" class="btn btn-success" data-dismiss="modal" id="_aceptar" onClick="rechazarReembolso(num,est)">Si</button>\
    <button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
    $("#_botonesmsj").html(botones);
    $('#modMsj').modal('show');
}
function aprobarReembolso(num,est){
    alert("proceso de aprobacion");
}

function rechazarReembolso(num,est){
    alert("proceso de rechazo");
}
