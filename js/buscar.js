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

    $(".volver2").click(function(){
        $("#tblTodos").show();
        $("#tblreembolsos").slideDown();
        $("#tblapoyos").slideDown();
        $("#tblcartas").slideDown();
        $("#lstDetalle").hide();
        $("#lstDetalleApoyo").hide();
        $("#lstDetalleCarta").hide();
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
    historico();
    historicoApoyo();
    historicoCarta();
}

function cargaPrograma(tipo){
    switch (tipo){
        case "r":
            CargarUrl("modalgeneral","inc/modals");
            //CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearReembolso");
            titulos("reembolso")
            break;
        case "a":
            CargarUrl("modalgeneral","inc/modalsapoyo");
            //CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearApoyoEconomico");
            titulos("Apoyo <br> Economico");
            break;
        case "pen":
            CargarUrl("modalgeneral","inc/modals");
            //CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearPension");
            titulos("Pension");
            break;
        case "far":
            CargarUrl("modalgeneral","inc/modalsfarmacia");
            //CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearFarmacia");
            titulos("Tto. <br> Prolongado");
            break;
        case "invs":
            CargarUrl("modalgeneral","inc/modals");
            //CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearInvSocial");
            titulos("Investigacion Social");
            break;
        case "fdv":
            CargarUrl("panelentrada", "inc/opcionesFedeVida");
            CargarUrl("modalgeneral","inc/modals");
            //CargarUrl("panellista", "inc/lstReembolsos");
            CargarUrl("panelregistro", "inc/crearFedeVida");
            //titulos("Fe de vida");
            break;
        case "ca":
            CargarUrl("modalgeneral","inc/modalscarta");
            //CargarUrl("panellista", "inc/lstReembolsos");
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
    $("#opciones").hide();
    $("#panelentrada").show();
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
    $("#panelentrada").hide();
    $("#panelregistro").show();

    //$("#btnnreembolso").hide();
    //$("#btnlreembolso").show();
}

function verPrograma(){
    $("#panelregistro").hide();
    $("#paneldatos").show();
    $("#panelentrada").hide();
    $("#panellista").show();
    //$("#btnnreembolso").show();
    //$("#btnlreembolso").hide();
}

function historico(){
    $("#historicoReembolso").html('<thead>\n' +
        '                        <tr class="bg-info"><td class="pbuscar">#Reembolso</td><td>F. Solicitud</td><td class="pbuscar">Facturas</td><td>Monto Sol.</td><td>Monto Apro.</td><td>Estado</td></tr>\n' +
        '                        </thead>\n' +
        '                        <tbody id="cuerporeembolsos">\n' +
        '\n' +
        '                        </tbody>');

    var t = $('#historicoReembolso').DataTable({
        destroy: true,
        'paging': false,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "aLengthMenu": [[10, 25, 5, -1], [10, 25, 5, "Todo"]],
        "bStateSave": true,
        "order": [[ 3, "desc" ]],
        "language": {
            "lengthMenu": "Mostar _MENU_ filas por pagina",
            "zeroRecords": "Nada que mostrar",
            "info": "Mostrando _PAGE_ de _PAGES_",
            "infoEmpty": "No se encontro nada",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar",
            "paginate": {
                "first":      "Primero",
                "last":       "Ultimo",
                "next":       "Siguiente",
                "previous":   "Anterior"
            },
        },
    });
    t.clear().draw();
    console.log("aqui");
    console.log(militar);
    if(militar.CIS.ServicioMedico.Programa.Reembolso != undefined && militar.CIS.ServicioMedico.Programa.Reembolso.length >0){
        var html = "";
        var i = 0;
        $.each(militar.CIS.ServicioMedico.Programa.Reembolso,function(v,ob){
            var est = conviertEstatus(this.estatus);
            var fcrea = Util.ConvertirFechaHumana(this.fechacreacion,true);
            var listaFact = "";
            var nfac = this.Concepto[0].DatoFactura.numero;
            if(this.Concepto[0].DatoFactura.numero == ""){
                nfac = "Sin factura";
            }
            if(this.Concepto.length > 1){
                listaFact = "<div class=\"dropdown\">\n" +
                    "            <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu"+i+"\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
                    "            " + nfac +
                    "            <span class=\"fa fa-plus\"></span>\n" +
                    "            </button>\n" +
                    "            <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu"+i+"\">";
                $.each(this.Concepto,function(){
                    var nfac2 = this.DatoFactura.numero;
                    if(nfac2 == "") nfac2 = "Sin Factura"
                    listaFact += "<li class='bg-info'>"+nfac2+"</li>";
                });
                listaFact +="</ul></div>";
            }else{
                listaFact = nfac;
            }
            t.row.add([
                "<a href='#cuerpoLstConceptos' onclick=\"detalleVisible("+i+")\">"+this.numero+"</a>", //1
                "<b>"+fcrea+"</b>",
                listaFact,
                numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $'),
                numeral(parseFloat(this.montoaprobado)).format('0,0[.]00 $'),
                est
            ]).draw(false);
            i++;
        });
        $('#historicoReembolso thead td.pbuscar').each( function () {
            var title = $(this).text();
            $(this).html( title+'<br><input class="form-group" type="text" placeholder="Buscar" />' );
        });
        t.columns().every( function () {
            var that = this;

            $('input', this.header()).on('keyup change', function () {
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            });
        });
    }
}

function detalleVisible(pos){
    var tconcepto = "";
    $.each(militar.CIS.ServicioMedico.Programa.Reembolso[pos].Concepto,function(){
        var ffact = Util.ConvertirFechaHumana(this.DatoFactura.fecha);
        tconcepto += "<tr><td>"+this.afiliado+"</td><td>"+this.descripcion+"</td><td>"+this.DatoFactura.Beneficiario.rif+"|"+this.DatoFactura.Beneficiario.razonsocial+"</td> "+
            "<td>"+this.DatoFactura.numero+"</td><td>"+ffact+"</td><td>"+numeral(parseFloat(this.DatoFactura.monto)).format('0,0[.]00 $')+"</td></tr>";
    })
    tconcepto += "</table>";
    $("#cuerpoLstConceptos").html(tconcepto);
    $("#lstDetalle").show();
    $("#tblTodos").hide();

}

function historicoApoyo(){
    $("#historicoApoyos").html('<thead>\n' +
        '                        <tr class="bg-info"><td class="pbuscar">#Apoyo</td><td>F. Solicitud</td><td class="pbuscar">Factura</td><td>Monto Sol.</td><td>Monto Apro.</td><td>Estado</td></tr>\n' +
        '                        </thead>\n' +
        '                        <tbody id="cuerporeembolsos">\n' +
        '\n' +
        '                        </tbody>');

    var t = $('#historicoApoyos').DataTable({
        destroy: true,
        'paging': false,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "aLengthMenu": [[10, 25, 5, -1], [10, 25, 5, "Todo"]],
        "bStateSave": true,
        "order": [[ 3, "desc" ]],
        "language": {
            "lengthMenu": "Mostar _MENU_ filas por pagina",
            "zeroRecords": "Nada que mostrar",
            "info": "Mostrando _PAGE_ de _PAGES_",
            "infoEmpty": "No se encontro nada",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar",
            "paginate": {
                "first":      "Primero",
                "last":       "Ultimo",
                "next":       "Siguiente",
                "previous":   "Anterior"
            },
        },
    });
    t.clear().draw();

    console.log(militar);
    if(militar.CIS.ServicioMedico.Programa.Apoyo != undefined && militar.CIS.ServicioMedico.Programa.Apoyo.length >0){
        var html = "";
        var i = 0;
        $.each(militar.CIS.ServicioMedico.Programa.Apoyo,function(v,ob){
            var est = conviertEstatus(this.estatus);
            var fcrea = Util.ConvertirFechaHumana(this.fechacreacion,true);
            var listaFact = "";
            var nfac = this.Concepto[0].DatoFactura.numero;
            if(this.Concepto[0].DatoFactura.numero == ""){
                nfac = "Sin factura";
            }
            if(this.Concepto.length > 1){
                listaFact = "<div class=\"dropdown\">\n" +
                    "            <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu"+i+"\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
                    "            " + nfac +
                    "            <span class=\"fa fa-plus\"></span>\n" +
                    "            </button>\n" +
                    "            <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu"+i+"\">";
                $.each(this.Concepto,function(){
                    var nfac2 = this.DatoFactura.numero;
                    if(nfac2 == "") nfac2 = "Sin Factura"
                    listaFact += "<li class='bg-info'>"+nfac2+"</li>";
                });
                listaFact +="</ul></div>";
            }else{
                listaFact = nfac;
            }
            t.row.add([
                "<a href='#cuerpoLstConceptos' onclick=\"detalleVisibleApoyo("+i+")\">"+this.numero+"</a>", //1
                "<b>"+fcrea+"</b>",
                listaFact,
                numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $'),
                numeral(parseFloat(this.montoaprobado)).format('0,0[.]00 $'),
                est
            ]).draw(false);
            i++;
        });
        $('#historicoApoyo thead td.pbuscar').each( function () {
            var title = $(this).text();
            $(this).html( title+'<br><input class="form-group" type="text" placeholder="Buscar" />' );
        });
        t.columns().every( function () {
            var that = this;

            $('input', this.header()).on('keyup change', function () {
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            });
        });
    }
}

function detalleVisibleApoyo(pos){
    var tconcepto = "";
    $.each(militar.CIS.ServicioMedico.Programa.Apoyo[pos].Concepto,function(){
        var ffact = Util.ConvertirFechaHumana(this.DatoFactura.fecha);
        tconcepto += "<tr><td>"+this.afiliado+"</td><td>"+this.descripcion+"</td><td>"+this.DatoFactura.Beneficiario.rif+"|"+this.DatoFactura.Beneficiario.razonsocial+"</td> "+
            "<td>"+this.DatoFactura.numero+"</td><td>"+ffact+"</td><td>"+numeral(parseFloat(this.DatoFactura.monto)).format('0,0[.]00 $')+"</td></tr>";
    })
    tconcepto += "</table>";
    $("#cuerpoLstConceptosApoyo").html(tconcepto);
    $("#lstDetalleApoyo").show();
    $("#tblTodos").hide();
}

function historicoCarta(){
    $("#historicoCartas").html('<thead>\n' +
        '                        <tr class="bg-info"><td class="pbuscar">#Carta</td><td>F. Solicitud</td><td class="pbuscar">Factura</td><td>Monto Sol.</td><td>Monto Apro.</td><td>Estado</td></tr>\n' +
        '                        </thead>\n' +
        '                        <tbody id="cuerpocartas">\n' +
        '\n' +
        '                        </tbody>');

    var t = $('#historicoCartas').DataTable({
        destroy: true,
        'paging': false,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "aLengthMenu": [[10, 25, 5, -1], [10, 25, 5, "Todo"]],
        "bStateSave": true,
        "order": [[ 3, "desc" ]],
        "language": {
            "lengthMenu": "Mostar _MENU_ filas por pagina",
            "zeroRecords": "Nada que mostrar",
            "info": "Mostrando _PAGE_ de _PAGES_",
            "infoEmpty": "No se encontro nada",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar",
            "paginate": {
                "first":      "Primero",
                "last":       "Ultimo",
                "next":       "Siguiente",
                "previous":   "Anterior"
            },
        },
    });
    t.clear().draw();

    console.log(militar);
    if(militar.CIS.ServicioMedico.Programa.CartaAval != undefined && militar.CIS.ServicioMedico.Programa.CartaAval.length >0){
        var html = "";
        var i = 0;
        $.each(militar.CIS.ServicioMedico.Programa.CartaAval,function(v,ob){
            var est = conviertEstatus(this.estatus);
            var fcrea = Util.ConvertirFechaHumana(this.fechacreacion,true);
            var listaFact = "";
            var nfac = this.Concepto[0].DatoFactura.numero;
            if(this.Concepto[0].DatoFactura.numero == ""){
                nfac = "Sin factura";
            }
            if(this.Concepto.length > 1){
                listaFact = "<div class=\"dropdown\">\n" +
                    "            <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu"+i+"\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
                    "            " + nfac +
                    "            <span class=\"fa fa-plus\"></span>\n" +
                    "            </button>\n" +
                    "            <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu"+i+"\">";
                $.each(this.Concepto,function(){
                    var nfac2 = this.DatoFactura.numero;
                    if(nfac2 == "") nfac2 = "Sin Factura"
                    listaFact += "<li class='bg-info'>"+nfac2+"</li>";
                });
                listaFact +="</ul></div>";
            }else{
                listaFact = nfac;
            }
            t.row.add([
                "<a href='#cuerpoLstConceptos' onclick=\"detalleVisibleCarta("+i+")\">"+this.numero+"</a>", //1
                "<b>"+fcrea+"</b>",
                listaFact,
                numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $'),
                numeral(parseFloat(this.montoaprobado)).format('0,0[.]00 $'),
                est
            ]).draw(false);
            i++;
        });
        $('#historicoCarta thead td.pbuscar').each( function () {
            var title = $(this).text();
            $(this).html( title+'<br><input class="form-group" type="text" placeholder="Buscar" />' );
        });
        t.columns().every( function () {
            var that = this;

            $('input', this.header()).on('keyup change', function () {
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            });
        });
    }
}

function detalleVisibleCarta(pos){
    var tconcepto = "";
    $.each(militar.CIS.ServicioMedico.Programa.CartaAval[pos].Concepto,function(){
        var ffact = Util.ConvertirFechaHumana(this.DatoFactura.fecha);
        tconcepto += "<tr><td>"+this.afiliado+"</td><td>"+this.descripcion+"</td><td>"+this.DatoFactura.Beneficiario.rif+"|"+this.DatoFactura.Beneficiario.razonsocial+"</td> "+
            "<td>"+this.DatoFactura.numero+"</td><td>"+ffact+"</td><td>"+numeral(parseFloat(this.DatoFactura.monto)).format('0,0[.]00 $')+"</td></tr>";
    })
    tconcepto += "</table>";
    $("#cuerpoLstConceptosCarta").html(tconcepto);
    $("#lstDetalleCarta").show();
    $("#tblTodos").hide();
}