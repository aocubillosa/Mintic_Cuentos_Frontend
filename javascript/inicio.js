$(document).ready(function() {

    $("#index").click(function(){
        window.location.href = "index.html";
    });

    $("#login").click(function(){
        window.location.href = "login.html";
    });

    $("#registro").click(function(){
        window.location.href = "registro.html";
    });

    var top3 = [];
    var endpoint = "http://localhost:8080/cuento/cuentos?fields=leidas";
    $.get(endpoint, function(resultado){
        top3 = resultado;
        cargar_top3(top3);
    });

    function cargar_top3(top3) {
        var box_content = document.getElementById("top");
        for (i=0; i<3; i++) {
            var item = document.createElement("div");
            item.className = "col-md-4"
            item.innerHTML =
            `<div class="card-deck">
                <div class="card">
                    <div class="card-head">
                        <h4 class="card-title"><b>${top3[i]["titulo"]}</b></h4>
                    </div>
                    <div class="card-body">
                        <img class="card-img-top" src="${top3[i]["imagen"]}">
                    </div>
                    <div>
                        <h4>Numero de lecturas: ${top3[i]["leidas"]}</h4>
                    </div>
                </div>
            </div>`
            box_content.appendChild(item);
        }
    }
});