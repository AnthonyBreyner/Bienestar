let Util = new Utilidad();

class CuentaBancaria2 {
    constructor() {
        console.log('Creando cuenta Bancaria');
        this.tipo = "";
        this.institucion = "";
        this.cuenta = "";
        this.titular = '';
        this.cedula = '';
    }
}

class Beneficiario {
    constructor() {
        console.log('Creando objeto Beneficiario');
        this.rif = '';
        this.razonsocial = '';
        this.tipo = '';
        this.direccion = '';
        this.Banco = new CuentaBancaria2();
    }
}

class Factura {
    constructor() {
        console.log("Creando objeto Factura");
        this.numero = '';
        this.control = '';
        this.fecha = '';
        this.monto = 0.00;
        this.Beneficiario = new Beneficiario();
    }
}


class ConceptoReembolso {
    constructor() {
        console.log("Creando objeto ConceptoReembolso");
        this.tipo = '';
        this.DatoFactura = new Factura();
        this.afiliado = '';
    }
}

class Reembolso {
    constructor() {
        console.log("Creando objeto Reembolso");
        this.estatus = 0;
        this.montosolicitado = 0.00;
        //this.numero = '';
        //this.fechacreacion = '';
        //this.responsable = '';
        this.cuentabancaria = new CuentaBancaria2();
        this.Concepto = new Array();
        this.montoaprobado = 0.00;
        this.fechaaprobacion = '';
    }
}


class Programa {
    constructor() {
        console.log("Creando objeto Programa");
        this.Apoyo = new Array();
        this.Reembolso = new Array();
        this.CartaAval = new Array();
    }
}

class ServicioMedico {
    constructor() {
        console.log("Creando objeto ServicoMedico");
        this.Programa = new Array();
    }
}

class CIS {
    constructor() {
        console.log("Creando objeto CIS");
        this.ServicioMedico = new Array();
        this.Gasto = new Array();
        this.InvestigacionSocial = new Array();
    }
}

class Militar2 {
    constructor() {
        console.log("Creando objeto Militar2");
        this.Persona = new Persona();
        this.estatuscarnet = '';
        this.familiar = new Familiar();
        this.CIS = new CIS();
    }
}