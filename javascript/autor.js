$(document).ready(function() {

    var autor = sessionStorage.getItem("id");
    var usuario = sessionStorage.getItem("usuario");
    if (usuario == null){
        window.location.href = "login.html";
    }
    var contentUser = document.getElementById("usuario");
    var itemUser = document.createElement("div");
    itemUser.innerHTML = "<h5>"+usuario+"</h5>";
    contentUser.appendChild(itemUser);

    var cuentos = [];
    var endpoint = "http://localhost:8080/cuento/autor?autor="+autor;
    $.get(endpoint, function(resultado){
        cuentos = resultado;
        llenar_contenido();
    });

    function llenar_contenido() {
        var box_content = document.getElementById("lista");
        for (i=0; i<cuentos.length; i++) {
            var item = document.createElement("div");
            item.className = "col-md-4"
            item.innerHTML =
            `<div class="card-deck">
                <div class="card">
                    <div class="card-head">
                        <h4 class="card-title"><b>${cuentos[i]["titulo"]}</b></h4>
                        <button type="button" class="btn btn-info" data-toggle="modal" data-target="#resumen${cuentos[i]["id"]}">
                            <span class="fa fa-file"></span> Resumen
                        </button>
                    </div>
                    <div class="card-body">
                        <img class="card-img-top" src="${cuentos[i]["imagen"]}">
                    </div>
                    <div class="card-footer">
                        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delete${cuentos[i]["id"]}">
                            <span class="fa fa-trash"></span> Eliminar
                        </button>
                    </div>
                    <div class="modal" tabindex="-1" role="dialog" id="resumen${cuentos[i]["id"]}" data-keyboard="false" data-backdrop="static">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header d-block">
                                    <button type="button" class="close" data-dismiss="modal">
                                        <span class="fa fa-times-circle" style="color: red;" aria-hidden="true"></span>
                                    </button>
                                    <h4 class="modal-title text-center">${cuentos[i]["titulo"]}</h4>
                                </div>
                                <div class="modal-body">
                                    <img class="img-modal" src="${cuentos[i]["imagen"]}">
                                    <p class="text-justify" style="color:saddlebrown">${cuentos[i]["resumen"]}</p>
                                </div>
                                <div class="modal-footer d-block">
                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal" tabindex="-1" role="dialog" id="delete${cuentos[i]["id"]}" data-keyboard="false" data-backdrop="static">
                        <div class="modal-dialog modal-md" role="document">
                            <div class="modal-content">
                                <div class="modal-header d-block">
                                    <button type="button" class="close" data-dismiss="modal">
                                        <span class="fa fa-times-circle" style="color: red;" aria-hidden="true"></span>
                                    </button>
                                    <h4 class="modal-title text-center">Eliminar Cuento</h4>
                                </div>
                                <div class="modal-body">
                                    <h5 class="text-center" style="color:black">¿ Confirma que desea eliminar el cuento ${cuentos[i]["titulo"]} ?</h5>
                                </div>
                                <div class="modal-footer d-block">
                                    <button class="btn btn-danger" onclick="eliminarCuento(${cuentos[i]["id"]},'${cuentos[i]["imagen"].split("/").pop()}')">Confirmar</button>
                                    <button class="btn btn-info" data-dismiss="modal">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            box_content.appendChild(item);
        }
    }

    $("#upload").click(function(){
        window.location.href = "upload.html";
    });

    $("#editar").click(function(){
        window.location.href = "editar.html";
    });

    $("#inicio").click(function(){
        window.location.href = "index.html";
    });

    $("#login").click(function(){
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("usuario");
        window.location.href = "login.html";
    });
});

function eliminarCuento(id, name){
    var endpoint = "http://localhost:8080/cuento/"+id+"?name="+name;
    fetch(endpoint,{
        method:"DELETE",
        mode:"cors",
        cache:"no-cache",
    });
    window.location.href = "autor.html";
}