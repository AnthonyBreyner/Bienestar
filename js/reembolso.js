$(function () {
    $("#rif").on("blur",function () {
        consultarRif();
    });
    $("#btnvolverlista").click(function(){
        $("#tblreembolsos").slideDown();
        $("#lstDetalle").slideUp();
    });

    $("#concepto").select2();

    $(".mdl-requisitos").on("change",function () {
        verificaCheckModal("requisitos","btnAgconcepto");
    });

    $(".mdl-requisitos2").on("change",function () {
        verificaCheckModal("requisitosconsultas","btnAgconcepto");
    });
    $(".mdl-requisitos3").on("change",function () {
        verificaCheckModal("requisitoshosp","btnAgconcepto");
    });
    $(".mdl-requisitos4").on("change",function () {
        verificaCheckModal("requisitostratamiento","btnAgconcepto");
    });

    llenar();
    $(".btnvolverentrada2").click(function(){
        $("#opciones").hide();
        $("#panelentrada").show();
        $("#panellista").hide();
        $("#panelregistro").hide();
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

function llenar(){
    $("#cmbbeneficiario").html('<option selected="selected" value="S"></option>');
    $("#datosbancarios").html('<option selected="selected" value="S"></option>');
    $("#_cargando").hide();
    if(militar.Persona != undefined){
        $("#cuerporeembolsos").html("");
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

        /*$("#paneldatos").show();
        $("#panelperfil").show();
        $("#opciones").show();
        $("#_bxBuscar").hide();*/
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
    historico();
}

function historico(){
    $("#historicoReembolso").html('<thead>\n' +
        '                        <tr><td></td><td class="pbuscar">#Reembolso</td><td>F. Solicitud</td><td class="pbuscar">Facturas</td><td>Monto</td><td>Estado</td></tr>\n' +
        '                        </thead>\n' +
        '                        <tbody id="cuerporeembolsos">\n' +
        '\n' +
        '                        </tbody>');

    var t = $('#historicoReembolso').DataTable({
        destroy: true,
        'paging': true,
        'lengthChange': true,
        'searching': false,
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

    if(militar.CIS.ServicioMedico.Programa.Reembolso != undefined && militar.CIS.ServicioMedico.Programa.Reembolso.length >0){
        var html = "";
        var i = 0;
        $.each(militar.CIS.ServicioMedico.Programa.Reembolso,function(v,ob){
            var est = "Por procesar";
            var fcrea = Util.ConvertirFechaHumana(this.fechacreacion,true);
            var listaFact = "";
            var nfac = "";
            if(this.Concepto[0].DatoFactura.numero == ""){
                nfac = "Sin factura";
            }
            if(this.Concepto.length > 1){
                listaFact = "<div class=\"dropdown\">\n" +
                    "            <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu"+i+"\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
                    "            "+ nfac +
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
                "<a href=\"#\"><i class=\"fa fa fa-refresh\"></i></a>",
                "<a href='#cuerpoLstConceptos' onclick=\"detalleVisible("+i+")\">"+this.numero+"</a>", //1
                "<b>"+fcrea+"</b>",
                listaFact,
                numeral(parseFloat(this.montosolicitado)).format('0,0[.]00 $'),
                est
            ]).draw(false);
            $('#historicoReembolso thead td.pbuscar').each( function () {
                var title = $(this).text();
                $(this).html( title+'<br><input type="text" placeholder="Buscar" />' );
            } );
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
            i++;

        });
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
        tconcepto += "<tr><td>"+this.afiliado+"</td><td>"+this.descripcion+"</td><td>"+this.DatoFactura.Beneficiario.rif+"|"+this.DatoFactura.Beneficiario.razonsocial+"</td> "+
            "<td>"+this.DatoFactura.numero+"</td><td>"+ffact+"</td><td>"+numeral(parseFloat(this.DatoFactura.monto)).format('0,0[.]00 $')+"</td></tr>";
    })
    tconcepto += "</table>";
    $("#cuerpoLstConceptos").html(tconcepto);
    $("#lstDetalle").show();
    $("#tblreembolsos").hide();
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
    var tele = new Telefono();
    tele.domiciliario = $("#txtmtelefono").val();
    tele.movil = $("#txtmcelular").val();
    reembolso.Direccion = dir;
    reembolso.Telefono.domiciliario = tele.domiciliario;
    reembolso.Telefono.movil = tele.movil;
    if($("#telfcontacto").val() != ""){
        reembolso.Telefono.movil = $("#telfcontacto").val();
    }
    reembolso.Correo.principal = $("#txtmcorreo").val().toUpperCase();

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

        var datos = {id:militar.Persona.DatoBasico.cedula,Reembolso:reembolso,Telefono:tele};
        console.log(JSON.stringify(datos));
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
    inactivarCheck(modal);
    $("#btnAgconcepto").attr("disabled",true);
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
