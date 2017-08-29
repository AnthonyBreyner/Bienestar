$(function () {
    console.log("aca apoyo");
    console.log(militar);

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
   
});

function llenar(){


}

function cargarDatos(){
    var html = '<tr><td>'+$("#cmbdoctores option:selected").text()+'</td><td>'+$("#cmbnomhospital option:selected").text()+'</td><td>'+$("#cmbnomhospital option:selected").text()+'</td><td>'+$("#cmbunimedica option:selected").text()+'</td><td>'+$("#cmbcodigo option:selected").text()+
    '</td><td>'+$("#diagnostico option:selected").text();
    
    $("#tblAgfarmacia").append(html);
    
    
    $(".borrarFila").click(function () {
        $(this).parents('tr').eq(0).remove();

    });
}


