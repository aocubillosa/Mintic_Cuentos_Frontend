$(document).ready(function() {

    var id = sessionStorage.getItem("id");
    var user = sessionStorage.getItem("usuario");
    if (user == null){
        window.location.href = "login.html";
    }
    var contentUser = document.getElementById("usuario");
    var itemUser = document.createElement("div");
    itemUser.innerHTML = "<h5>"+user+"</h5>";
    contentUser.appendChild(itemUser);
    
    var endpoint = "http://localhost:8080/usuario/"+id;
    $.get(endpoint, function(user){
        $("#nombres").val(user.nombres);
        $("#apellidos").val(user.apellidos);
        $("#correo").val(user.correo);
        $("#contrasena").val(user.contrasena);
        $("#tipo").val(user.tipo);
        $("#genero").val(user.genero);
    });
    
    $("#regresar").click(function(){
        window.location.href = "autor.html";
    });
    
    $("#guardar").click(function(){
        var nombres = $("#nombres").val();
        var apellidos = $("#apellidos").val();
        var correo = $("#correo").val();
        var usuario = user;
        var contrasena = $("#contrasena").val();
        var tipo = $("#tipo").val();
        var genero = $("#genero").val();
        var estado = 1;
        if (nombres=="" || apellidos=="" || correo=="" || contrasena=="" || tipo=="" || genero==""){
            Swal.fire({
                title: "Error",
                text: "Todos los campos son obligatorios.",
                icon: "error",
                confirmButtonText: "Confirmar"
            });
        }
        else {
            expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!expr.test(correo)){
                Swal.fire({
                    title: "Error",
                    text: "Correo electronico incorrecto.",
                    icon: "error",
                    confirmButtonText: "Confirmar"
                });
            }
            else {
                var endpoint = "http://localhost:8080/usuario";
                fetch(endpoint,{
                    method:"PUT",
                    mode:"cors",
                    cache:"no-cache",
                    headers:{"Content-type":"application/json"},
                    body:JSON.stringify({id,nombres,apellidos,correo,usuario,contrasena,tipo,genero,estado})
                }).then(function(data){
                    if (data.status == "200"){
                        Swal.fire({
                            title: "Usuario",
                            text: "Usuario actualizado exitosamente.",
                            icon: "success",
                            confirmButtonText: "Confirmar"
                        }).then(function() {
                            window.location.href = "autor.html";
                        });
                        $("#nombres").val("");
                        $("#apellidos").val("");
                        $("#correo").val("");
                        $("#contrasena").val("");
                        $("#tipo").val("");
                        $("#genero").val("");
                    }
                    else{
                        Swal.fire({
                            title: "Error",
                            text: "No se pudo actualizar el usuario.",
                            icon: "error",
                            confirmButtonText: "Confirmar"
                        });
                    }
                });
            }
        }
    });
});