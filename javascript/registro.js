$(function() {
    
    $("#inicio").click(function(){
        window.location.href = "index.html";
    });
    
    $("#login").click(function(){
        window.location.href = "login.html";
    });
    
    $("#registrar").click(function(){
        var nombres = $("#nombres").val();
        var apellidos = $("#apellidos").val();
        var correo = $("#correo").val();
        var usuario = $("#usuario").val();
        var contrasena = $("#contrasena").val();
        var confirmar = $("#confirmar").val();
        var tipo = $("#tipo").val();
        var genero = $("#genero").val();
        var acepto = $("#acepto").prop("checked");
        var estado = 1
        if (nombres=="" || apellidos=="" || correo=="" || usuario=="" || contrasena=="" || confirmar=="" || tipo=="" || genero=="" || !acepto){
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
                if (contrasena != confirmar){
                    Swal.fire({
                        title: "Error",
                        text: "Las contraseñas no coinciden.",
                        icon: "error",
                        confirmButtonText: "Confirmar"
                    });
                }
                else {
                    var endpoint = "http://localhost:8080/usuario";
                    fetch(endpoint,{
                        method:"POST",
                        mode:"cors",
                        cache:"no-cache",
                        headers:{"Content-type":"application/json"},
                        body:JSON.stringify({nombres,apellidos,correo,usuario,contrasena,tipo,genero,estado})
                    }).then(function(data){
                        if (data.status == "200"){
                            Swal.fire({
                                title: "Usuario",
                                text: "Usuario registrado exitosamente.",
                                icon: "success",
                                confirmButtonText: "Confirmar"
                            }).then(function() {
                                window.location.href = "login.html";
                            });
                            $("#nombres").val("");
                            $("#apellidos").val("");
                            $("#correo").val("");
                            $("#usuario").val("");
                            $("#contrasena").val("");
                            $("#confirmar").val("");
                            $("#tipo").val("");
                            $("#genero").val("");
                            $("#acepto").prop("checked", false);
                        }
                        else{
                            Swal.fire({
                                title: "Error",
                                text: "No se pudo registrar el usuario.",
                                icon: "error",
                                confirmButtonText: "Confirmar"
                            });
                        }
                    });
                }
            }
        }
    });
});
