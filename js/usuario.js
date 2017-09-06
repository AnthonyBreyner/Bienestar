class Rol{
    construct(){
        this.descripcion = "";
    }
}

class Privilegios{
    construct(){
        this.metodo = "";
        this.descripcion = "";
        this.accion = "";
    }
}

class Menu{
    construct(){
        this.url = "";
        this.js = "";
        this.icono = "";
        this.nombre = "";
        this.accion = "";
    }
}

class Perfil{
    construct(){
        this.descripcion = "";
        this.privilegios = new Array();
        this.menu = new Array();
    }
}

class Firma{
    construct(){
        this.direccionmac = "";
        this.direccionip = "";
        this.tiempo = "";
    }
}

class Usuario{
    construct(){
        this.cedula = "";
        this.nombre = "";
        this.login = "";
        this.correo = "";
        this.clave = "";
        this.sucursal = "";
        this.direccion = "";
        this.cargo = "";
        this.telefono = "";
        this.sistema = "";
        this.token = "";
        this.rol = new Rol();
        this.perfil = new Perfil();
        this.firma = new Firma();
    }

    Obtener(){
       this.cedula = $("#cedula").val();
       this.nombre = $("#nombre").val();
       this.usuario = $("#seudonimo").val();
       this.Roles.descripcion = $("#rolUsuario").val();
       this.Perfil.descripcion = $("#perfilUsuario").val();
       this.cargo = $("#cargo").val();
       this.telefono = $("#telefono").val();
       this.correo = $("#correo").val();
       this.FirmaDigital.DireccionIP = $("#direccionIp").val();
       this.FirmaDigital.DireccionMAC = $("#direccionMac").val();
       this.direccion = $("#direccionUsuario").val();
       this.fechacreacion = $("#fechaCreacion").val();
    }
}

let listaUsuario = null;
let Conn = new Conexion();

$(function () {

    var requestE = CargarAPI({
        sURL: Conn.URL + "wusuario/listar",
        metodo: 'GET',
        valores: '',
    });
    requestE.then(function(xhRequest) {
        listaUsuario = JSON.parse(xhRequest.responseText);
        llenarLista();
        llenarUsuarios();
    });
     $("#cmbUsuario").select2();
});

function llenarLista(){
    $("#cmbListadoUsuario").html("");
    $.each(listaUsuario,function(){
        $("#cmbListadoUsuario").append("<option value='"+this.cedula+"'>"+this.nombre+"</option>");
    });
}

function llenarUsuarios(){
    $("#cmbUsuario").html("");
    $.each(listaUsuario,function(){
        $("#cmbUsuario").append("<option value='"+this.cedula+"'>"+this.nombre+"</option>");
    });
}

function cargarUsuario(){
    var usuario = $("#cmbListadoUsuario option:selected").val();
    var requestE = CargarAPI({
        sURL: Conn.URL + "wusuario/crud/"+usuario,
        metodo: 'GET',
        valores: '',
    });
    requestE.then(function(xhRequest) {
        var datos = JSON.parse(xhRequest.responseText);
        llenarUsuario(datos);
    });

}

function llenarUsuario(datos){
    $("#cedula").val(datos.cedula);
    $("#nombre").val(datos.nombre);
    $("#seudonimo").val(datos.usuario);
    $("#rolUsuario").val(datos.Roles.descripcion);
    $("#perfilUsuario").val(datos.Perfil.descripcion);
    $("#cargo").val(datos.cargo);
    $("#telefono").val(datos.telefono);
    $("#correo").val(datos.correo);
    $("#direccionIp").val(datos.FirmaDigital.DireccionIP);
    $("#direccionMac").val(datos.FirmaDigital.DireccionMAC);
    $("#direccionUsuario").val(datos.direccion);
    $("#fechaCreacion").val(datos.fechacreacion);

}
function cargarMenu(){
    var usuario = $("#cmbUsuario option:selected").val();
    var requestE = CargarAPI({
        sURL: Conn.URL + "wusuario/crud/"+usuario,
        metodo: 'GET',
        valores: '',
    });
    requestE.then(function(xhRequest) {
        var datos = JSON.parse(xhRequest.responseText);
        llenarMenu(datos);
    });
}

function llenarMenu(){
    $("#cmbMenu").html("");
    $.each(listaUsuario,function(){
        $("#cmbMenu").append("<option value='"+this.cedula+"'>"+this.nombre+"</option>");
    });
}