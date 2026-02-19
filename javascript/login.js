$(function() {

    $("#inicio").click(function(){
        window.location.href = "index.html";
    });

    $("#registro").click(function(){
        window.location.href = "registro.html";
    });

    $("#ingresar").click(function(){
        var usuario = $("#usuario").val();
        var password = $("#pass").val();
        var endpoint = "http://localhost:8080/usuario?usuario="+usuario+"&contrasena="+password;
        $.get(endpoint, function(user){
            if (user != null){
                sessionStorage.setItem("id", user.id);
                sessionStorage.setItem("usuario", user.usuario);
                Swal.fire({
                    title: "Usuario",
                    text: "Bienvenido "+ sessionStorage.getItem("usuario"),
                    icon: "success",
                    confirmButtonText: "Confirmar"
                }).then(function() {
                    if (user.tipo == 1){
                        window.location.href = "user.html";
                    }
                    else if (user.tipo == 2){
                        window.location.href = "autor.html";
                    }
                });
            }
            else {
                $("#usuario").val("");
                $("#pass").val("");
                Swal.fire({
                    title: "Error",
                    text: "Usuario o contraseña incorrectos.",
                    icon: "error",
                    confirmButtonText: "Confirmar"
                });
            }
        });
    });
});