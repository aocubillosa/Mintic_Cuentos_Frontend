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

    $(function() {
        var archivo = $("#file").val();
        if (archivo != null) {
            $('.input-file-input').on('change', function() {
                $('.input-file-field').text($(this)[0].files[0].name);
            });
        }
    });

    $("#regresar").click(function(){
        window.location.href = "autor.html";
    });

    $("#formulario").on("submit", function(e){
        e.preventDefault();
        var archivo = $("#file").val();
        var titulo = $("#titulo").val();
        var genero = $("#genero").val();
        var resumen = $("#resumen").val();
        if (archivo == "" || titulo == "" || genero == "" || resumen == ""){
            Swal.fire({
                title: "Error",
                text: "Campos obligatorios.",
                icon: "error",
                confirmButtonText: "Confirmar"
            });
        }
        else{
            var carpeta = $("#file");
            var file = carpeta[0].files[0];
            var extensiones = ['png','jpg','jpeg'];
            var tamano = function(megas){
                return megas * 1024 * 1024;
            }
            var extension = file.type.split('/').pop();
            var nombre = titulo.replace(/ /g,"_");
            var name = nombre.toLowerCase()+"."+extension;
            var imagen = "imagenes/portadas/cuentos/"+name;
            var leidas = 0;
            if (extensiones.indexOf(extension) != -1){
                if (file.size <= tamano(1)){
                    subirImagen(file, name);
                    var endpoint = "http://localhost:8080/cuento";
                    fetch(endpoint,{
                        method:"POST",
                        mode:"cors",
                        cache:"no-cache",
                        headers:{"Content-type":"application/json"},
                        body:JSON.stringify({titulo,genero,resumen,imagen,leidas,autor})
                    }).then(function(data){
                        if (data.status == "200"){
                            Swal.fire({
                                title: "Cuento",
                                text: "Cuento guardado exitosamente.",
                                icon: "success",
                                confirmButtonText: "Confirmar"
                            }).then(function() {
                                window.location.href = "autor.html";
                            });
                            $("#titulo").val("");
                            $("#genero").val("");
                            $("#resumen").val("");
                            $("#file").val("");
                            $('.input-file-field').text("Ningun archivo seleccionado");
                        }
                        else{
                            Swal.fire({
                                title: "Error",
                                text: "No se pudo cargar el cuento.",
                                icon: "error",
                                confirmButtonText: "Confirmar"
                            });
                        }
                    });
                }
                else{
                    Swal.fire({
                        title: "Error",
                        text: "Tamaño maximo permitido 1MB",
                        icon: "error",
                        confirmButtonText: "Confirmar"
                    });
                    $("#file").val("");
                }
            }
            else{
                Swal.fire({
                    title: "Error",
                    text: "Extensiones permitidas: " + extensiones,
                    icon: "error",
                    confirmButtonText: "Confirmar"
                });
                $("#file").val("");
            }
        }
    });
});

function subirImagen(file, name){
    var formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    var endpoint = "http://localhost:8080/upload-file";
    fetch(endpoint,{
        method:"POST",
        mode:"cors",
        cache:"no-cache",
        body:formData
    });
}