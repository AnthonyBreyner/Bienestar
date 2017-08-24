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
    llenar();
});

function llenar(){


}