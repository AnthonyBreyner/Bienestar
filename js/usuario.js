class Roles{
    constructor(){
        this.descripcion = "";
    }
}

class Privilegios{
    constructor(){
        this.metodo = "";
        this.descripcion = "";
        this.accion = "";
    }
}

class Menu{
    constructor(){
        this.url = "";
        this.js = "";
        this.icono = "";
        this.nombre = "";
        this.accion = "";
    }
}

class Perfil{
    constructor(){
        this.descripcion = "";
        this.privilegios = new Array();
        this.menu = new Array();
    }
}

class Firma{
    constructor(){
        this.direccionmac = "";
        this.direccionip = "";
        this.tiempo = "";
    }
}

class Usuario{
    constructor(){
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
        this.Roles = new Roles();
        this.Perfil = new Perfil();
        this.FirmaDigital = new Firma();
    }

    Obtener(){
       this.cedula = $("#cedula").val();
       this.nombre = $("#nombre").val();
       this.login = $("#seudonimo").val();
       this.Roles.descripcion = $("#rolUsuario").val();
       this.Perfil.descripcion = $("#perfilUsuario").val();
       this.cargo = $("#cargo").val();
       this.telefono = $("#telefono").val();
       this.correo = $("#correo").val();
       this.FirmaDigital.DireccionIP = $("#direccionIp").val();
       this.FirmaDigital.DireccionMAC = $("#direccionMac").val();
       this.direccion = $("#direccionUsuario").val();
      
       return this;
    }
    Salvar(){
      console.log(JSON.stringify(this.Obtener()));
      var requestE = CargarAPI({
          sURL: Conn.URL + "wusuario/crud",
          metodo: 'POST',
          valores: this.Obtener(),
      });
      requestE.then(function(xhRequest) {
        console.log("Obteniendo Datos...");
        console.log(xhRequest);
      });
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


function Salvar(){
  var usuario = new Usuario();
  console.log("Enviando datos para salvar usuario");
  usuario.Salvar();
  console.log("Usuario Salvado!!!");

}
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
