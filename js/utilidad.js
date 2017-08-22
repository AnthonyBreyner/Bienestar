class Utilidad {
    constructor() {

    }

    Especiales(e,elemento) {
        var key = e.keyCode || e.which;
        var tecla = String.fromCharCode(key).toLowerCase();
        var letras = " áéíóúabcdefghijklmnñopqrstuvwxyz0123456789*";
        var especiales = [8, 37, 39, 46, 9, 17];

        var tecla_especial = false
        for (var i in especiales) {
            if (key == especiales[i]) {
                tecla_especial = true;
                break;
            }
        }

        if (letras.indexOf(tecla) == -1 && !tecla_especial) {
            $.notify("("+tecla+") Caracter no permitido", "warning");
            return false;
        }
        // var cond1 = 0;var cond2=0;
        // if($("#claveN").val().length < 8){
        //     $("#lblalert1").show();
        // }else{
        //     $("#lblalert1").hide();
        //     cond1 = 1;
        // }
        //
        // if($("#claveN").val() != $("#claveN2").val()){
        //     $("#lblalert2").show();
        // }else{
        //     if($("#claveN").val() != ""){
        //         $("#lblalert2").hide();
        //         cond2 = 1;
        //     }
        //
        // }
        //
        // if(cond1 == 1 && cond2 == 1){
        //     $("#btnmodclave").attr("disabled",false);
        // }else{
        //     $("#btnmodclave").attr("disabled",true);
        // }
    }

    cmbField(obj,foco){
        var id = obj.id;
        if(foco){
            $("#"+id).attr("type","text");
            $("#"+id).val("");
        }else{
            $("#"+id).attr("type","password");
        }

    }

    SoloNumero(event,elemento) {
        var contenidocaja = $("#"+elemento.id).val();


        var key = event.keyCode || event.which;
        var tecla = String.fromCharCode(key).toLowerCase();
        var numeros = "0123456789";
        var especiales = [8, 37, 39, 46, 13, 9];

        if(key == 46){
            if(contenidocaja.indexOf(".") != -1 || contenidocaja == ""){
                return false;
            }
        }

        var tecla_especial = false
        for (var i in especiales) {
            if (key == especiales[i]) {
                tecla_especial = true;
                break;
            }
        }

        if (numeros.indexOf(tecla) == -1 && !tecla_especial) {
            return false;
        }
    }

    //Recibe  Fecha Formato: AAAA-MM-DD 00:00:00
    //Retorna Fecha Formato: DD/MM/AAAA
    ConvertirFechaHumana(f) {
        var ISODate = new Date(f).toISOString();
        var fe = ISODate.substr(0, 10);
        var fa = fe.split("-");
        if (fa[0] != "0001") {
            return fa[2] + "/" + fa[1] + "/" + fa[0];
        } else {
            return "";
        }
        //return fa[2] + "/" + fa[1] + "/" + fa[0];
    }

    ConvertirFechaActual() {
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        var f = new Date();

        return f.getDate() + " del mes de " + meses[f.getMonth()] + " de " + f.getFullYear();
    }


    //Recibe  Fecha Formato: DD/MM/AAAA
    //Retorna Fecha Formato: AAAA-MM-DD
    ConvertirFechaUnix(f) {
        f = f.split("/");
        return f[2] + "-" + f[1] + "-" + f[0];
    }


    ValidarFormulario(_frm,ele) {

        let respuesta = true;
        $("#" + _frm + " :input").each(function (i) {
            var valor = $(this).val();
            var dis = $(this).attr('required');
            var id = $(this).attr('id');
            if (dis == "required") {
                if (valor == "") {
                    respuesta = false;
                }
            }
        });

        $("#" + _frm + " select").each(function (i) {
            var valor = $(this).val();
            var dis = $(this).attr('required');
            var id = $(this).attr('id');
            if (dis == "required") {
                if (valor == "S") {
                    respuesta = false;
                }
            }
        });
        if(respuesta) return respuesta;
        else return this.MensajeFormulario(_frm,ele);
    }

    MensajeFormulario(_frm,ele) {

        $("#" + _frm + " :input").each(function (i) {
            var valor = $(this).val();
            var dis = $(this).attr('required');
            var id = $(this).attr('id');

            if (dis == "required") {
                if (valor == "") {
                    $(this).notify("*");
                }
            }
        });

        $("#" + _frm + " select").each(function (i) {
            var valor = $(this).val();
            var dis = $(this).attr('required');
            var id = $(this).attr('id');

            if (dis == "required") {
                if (valor == "S" || valor == "") {
                    $("#select2-"+this.id+"-container").notify("*",{position:"top left"})
                    $(this).notify("*");

                }
            }
        });
        $("#"+ele).notify("Recuerde de ingresar todos los campos requeridos","warn");
        return false;
    }

    ModalValidar(msj) {
        $("#_contenido").html(msj);
        var botones = '<button type="button" class="btn btn-success btn-md" data-dismiss="modal">Aceptar</button>';
        $("#_botonesmsj").html(botones);
        $("#modMsj").modal("show");
    }

    ModalValidarFamiliar(msj) {
        $("#_contenido").html(msj);
        var botones = '<button type="button" class="btn btn-success btn-md" data-dismiss="modal" onclik="ActivarModalFamiliar()">Aceptar</button>';
        $("#_botonesmsj").html(botones);
        $("#modMsj").modal("show");
    }

    ModalValidarFamiliarLimitado(msj) {

        $("#_contenido").html('');
        var botones = '<button type="button" class="btn btn-success btn-md" data-dismiss="modal" onclik="ContinuarFamiliarValidar()">Aceptar</button>';
        $("#_botonesmsj").html(botones);
        $("#modMsj").modal("show");
    }

    //
    CalcularEdad(fecha) {
        var FechaActual = new Date(Date.now());
        var AnnoA = parseInt(FechaActual.getFullYear());
        var MesA = parseInt(FechaActual.getMonth()) + 1;
        var DiaA = parseInt(FechaActual.getDate());

        var f = fecha.split("/");

        var AnoN = parseInt(f[2]);
        var MesN = parseInt(f[1]);
        var DiaM = parseInt(f[0]);

        var Ano = AnnoA - AnoN;

        var Mes = MesA - MesN;
        var Dia = DiaA - DiaM;
        if (Dia < 0) {
            Dia = 0;
            Mes++;
        }
        if (Mes <= 0) {
            Ano--;
        } else {
            Ano;
        }

        return Ano;
    }


    ConvertirParentesco(cad,sexo){
        var parent = "";
        switch(cad) {
            case "PD":
                parent =(sexo=="F")?"MADRE":"PADRE";
                break;
            case "HJ":
                parent = (sexo=="F")?"HIJA":"HIJO";
                break;
            case "EA":
                parent = (sexo=="F")?"ESPOSA":"ESPOSO";
                break;
          case "VI":
              parent = (sexo=="F")?"VIUDA":"VIUDO";
              break;
            default:
                parent = "";
                break;
        }
        return parent;
    }

    ConvertirSitucacion(sit){
        var situacion = "";
        switch (sit){
            case "ACT":
                situacion = "ACTIVO";
                break;
            case "RCP":
                situacion = "RESERVA ACTIVA";
                break;
            case "RSP":
                situacion = "RETIRADO";
                break;
            case "FCP":
                situacion = "FALLECIDO CON PERNSION";
                break;
            case "FSP":
                situacion = "FALLECIDO SIN PENCION";
                break;
            case "I":
                situacion = "INVALIDO";
                break;
            case "D":
                situacion = "DISPONIBLE";
                break;
        }
        return situacion;
    }

    ConvertirBanco(ban){
        var banco = "";
        switch (ban){
            case "0156":
                banco = "100%BANCO";
                break;
            case "0196":
                banco = "ABN AMRO BANK";
                break;
            case "0172":
                banco = "BANCAMIGA BANCO MICROFINANCIERO, C.A.";
                break;
            case "0171":
                banco = "BANCO ACTIVO BANCO COMERCIAL, C.A.";
                break;
            case "0166":
                banco = "BANCO AGRICOLA";
                break;
            case "0175":
                banco = "BANCO BICENTENARIO";
                break;
            case "0128":
                banco = "BANCO CARONI, C.A. BANCO UNIVERSAL";
                break;
            case "0164":
                banco = "BANCO DE DESARROLLO DEL MICROEMPRESARIO";
                break;
            case "0102":
                banco = "BANCO DE VENEZUELA S.A.I.C.A.";
                break;
            case "0128":
                banco = "BANCO CARONI, C.A. BANCO UNIVERSAL";
                break;
            case "0114":
                banco = "BANCO DEL CARIBE C.A.";
                break;
            case "0149":
                banco = "BANCO DEL PUEBLO SOBERANO C.A.";
                break;
            case "0163":
                banco = "BANCO CARONI, C.A. BANCO UNIVERSAL";
                break;
            case "0166":
                banco = "BANCO AGRICOLA";
                break;
            case "0175":
                banco = "BANCO BICENTENARIO";
                break;
            case "0128":
                banco = "BANCO CARONI, C.A. BANCO UNIVERSAL";
                break;
        }
        return situacion;
    }


    //Obtener la direccion mac
    ObtenerMAC(MAC) {
        //en construccion
    }

    //Obtener la direccion ip
    ObtenerIP(IP) {
        //en construccion
    }

    //Cargar imagenes desde archivos
    CargarIMG(DIV, URL) {

    }

    GenerarEstadoCivil(est,sexo){
        var estadocivil;
        switch(est) {
            case "C":
                estadocivil =(sexo=="F")?"CASADA":"CASADO";
                break;
            case "D":
                estadocivil = (sexo=="F")?"DIVORCIADA":"DIVORCIADO";
                break;
            case "S":
                estadocivil = (sexo=="F")?"SOLTERA":"SOLTERO";
                break;
            case "V":
                estadocivil = (sexo=="F")?"VIUDA":"VIUDO";
                break;
            default:
                estadocivil = "";
                break;
        }
        return estadocivil;
    }

}
