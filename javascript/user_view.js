let cuentos = [];
let autores = [];
let endpoint1;
let endpoint2;
let decimals = 0;
let refreshIntervalId;
let cuento_especifico2;
var max_number_cuentos = 6;
var grupo_cuentos = -1;
var contenido_llenado = false;

var clasificaciones_cuentos = [
    "Cuentos de Hadas","Cuentos de Animales","Cuentos de Costumbre","Cuentos Fantásticos",
    "Cuentos Realistas","Cuentos de Misterio","Cuentos de Suspendo","Cuentos de Terror",
    "Cuentos de Comedia","Cuentos Históricos","Cuentos Románticos","Cuentos de Aventura",
    "Cuentos Policiales","Cuentos de Ciencia Ficción","Cuentos de Navidad","Cuentos Infantiles"
];

colores = [
    "#00ecf0f1","#0096a6a6","#00f49c14","#00d55401","#00c1392b","#00bec3c7","#00808b8d","#001bbc9d","#002fcc71","#003598dc",
    "#009c59b8","#0034495e","#0016a086","#0027ae61","#002a80b9","#008f44ad","#002d3e50","#00f1c40f","#00e77e23","#00e84c3d"
];

colores = [
    "rgba(205,85,5,0.9)","rgba(200,75,35,0.9)","rgba(195,85,35,0.9)","rgba(195,95,35,0.8)",
    "rgba(190,105,25,0.9)","rgba(185,105,45,0.9)","rgba(195,105,45,0.9)"
];

$(document).ready(function () {
    var usuario = sessionStorage.getItem("usuario");
    if (usuario == null){
        window.location.href = "login.html";
    }
    var contentUser = document.getElementById("usuario");
    var itemUser = document.createElement("div");
    itemUser.innerHTML = "<h5>"+usuario+"</h5>";
    contentUser.appendChild(itemUser);
    $("#atras").click(function(){
        btn_content(0);
    });
    $("#adelante").click(function(){
        btn_content(1);
    });
    $("#login").click(function(){
        sessionStorage.removeItem("usuario");
        window.location.href = "login.html";
    });
    $("#modal-cerrar").click(function(){
        document.getElementById('modal-shadow').style.display = 'none';
        document.getElementById('atras').style.display = 'flex';
        document.getElementById('adelante').style.display = 'flex';
        if (decimals>300){
            cuentos[cuento_especifico2]["leidas"] = cuentos[cuento_especifico2]["leidas"]+1;
            endpoint1 = "http://localhost:8080/cuento/";
            $.ajax({
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                url: endpoint1, 
                data: JSON.stringify(cuentos[cuento_especifico2]),
                dataType: "json",
            });
        }
        decimals = 0;
        clearInterval(refreshIntervalId);
    });
    endpoint1 = "http://localhost:8080/cuento/cuentos?fields=titulo";
    endpoint2 = "http://localhost:8080/usuario/tipo?tipo=2";
    $.get({
        type:"GET",
        url: endpoint1,
        async: false,
        success: function(resultado){
            cuentos = resultado;
        }    
    });
    $.get({
        type:"GET",
        url: endpoint2,
        async: false,
        success: function(resultado){
            autores = resultado;
        }    
    });
    llenar_contenido(cuentos,autores)
});

function llenar_clasificaciones () {
    var opciones_sidebar = document.getElementsByClassName("opciones_sidebar")[0];
    for (i=0; i<clasificaciones_cuentos.length; i++){
        var li = document.createElement("li");
        var a_href = document.createElement("a");
        a_href.textContent = clasificaciones_cuentos[i];
        li.appendChild(a_href);
        (function(genero_especifico){
            a_href.addEventListener("click", function(){
                endpoint1 = "http://localhost:8080/cuento/genero?genero="+genero_especifico;
                $.get({
                    type:"GET",
                    url: endpoint1,
                    async: false,
                    success: function(resultado){
                        cuentos = resultado;
                    }    
                });
                endpoint2 = "http://localhost:8080/usuario/tipo?tipo=2";
                $.get({
                    type:"GET",
                    url: endpoint2,
                    async: false,
                    success: function(resultado){
                        autores = resultado;
                    }    
                });
                for(j=0; j<grupo_cuentos; j++){
                    btn_content(0);
                }
                llenar_contenido(cuentos, autores);
            }, false);
        })(i+1);
        opciones_sidebar.appendChild(li);
    }
}

function llenar_contenido(cuentos,autores) {
    var box_content = document.getElementsByClassName("shadow_items_content")[0];
    var cantidad = Object.keys(cuentos).length > max_number_cuentos ? max_number_cuentos : Object.keys(cuentos).length;
    if (grupo_cuentos == -1){
        llenar_clasificaciones();
        for (i=0; i<cantidad; i++){
            var item = document.createElement("a");
            item.href = "#"
            item.className = "item";
            item.style.backgroundColor = colores[i%colores.length];
            var item_autor = document.createElement("p");
            item_autor.className = "item-autor"
            item_autor.textContent = get_name_autor(cuentos[i]["autor"], autores);
            item.appendChild(item_autor);
            var item_title = document.createElement("h1");
            item_title.className = "item-title";
            item_title.innerText = cuentos[i]["titulo"];
            item.appendChild(item_title);
            var item_genres = document.createElement("p");
            item_genres.className = "item-genres";
            item_genres.innerText = clasificaciones_cuentos[cuentos[i]["genero"]-1];
            item.appendChild(item_genres);
            agregar_modal(i,item);
            box_content.appendChild(item);
        }
        grupo_cuentos++;
    }
    else {
        var item = document.getElementsByClassName("item");
        var cuentos_acumulados = max_number_cuentos*grupo_cuentos;
        for (i=0; i<max_number_cuentos; i++){
            if (cuentos_acumulados+i<cuentos.length){
                item[i].childNodes[0].textContent = get_name_autor(cuentos[cuentos_acumulados+i]["autor"],autores);
                item[i].childNodes[1].textContent = cuentos[cuentos_acumulados+i]["titulo"];
                item[i].childNodes[2].textContent = clasificaciones_cuentos[cuentos[cuentos_acumulados+i]["genero"]-1];
                item[i].style.display = "flex";
            }
            else {
                item[i].style.display = "none";
            }
        }
    }
}
  
function get_name_autor(id, autores) {
    var cantidad2 = Object.keys(autores).length
    for (j=0; j<cantidad2; j++){
        if (autores[j]["id"] == id){
            return autores[j]["nombres"] + " " + autores[j]["apellidos"];
        }
    }
}

function btn_content(orientacion){
    if (orientacion == 1){
        if (cuentos.length > max_number_cuentos*(grupo_cuentos+1)){
            grupo_cuentos++;
            llenar_contenido(cuentos,autores);
        }
    }
    else {
        if (grupo_cuentos > 0){
            grupo_cuentos--;
            llenar_contenido(cuentos, autores);
        }
    }
}

function crear_modal(cuento_especifico){
    document.getElementById('atras').style.display = 'none';
    document.getElementById('adelante').style.display = 'none';
    document.getElementById('modal-shadow').style.display = 'flex';
    document.getElementById('modal-title').innerText = cuentos[cuento_especifico]["titulo"];
    document.getElementById('modal-autor').innerText = get_name_autor(cuentos[cuento_especifico]["autor"], autores)
    document.getElementById('modal-genero').innerText = clasificaciones_cuentos[cuentos[cuento_especifico]["genero"]-1];
    document.getElementById('modal-resumen').innerText = cuentos[cuento_especifico]["resumen"];
    document.getElementById('modal-image').src = cuentos[cuento_especifico]["imagen"];
}

function agregar_modal(dato,item){
    (function(cuento_especifico){
        item.addEventListener("click", function(){
            cuento_especifico2 = max_number_cuentos * grupo_cuentos + cuento_especifico;
            document.getElementById('atras').style.display = 'none';
            document.getElementById('adelante').style.display = 'none';
            document.getElementById('modal-shadow').style.display = 'flex';
            document.getElementById('modal-title').innerText = cuentos[cuento_especifico2]["titulo"];
            document.getElementById('modal-autor').innerText = get_name_autor(cuentos[cuento_especifico2]["autor"], autores)
            document.getElementById('modal-genero').innerText = clasificaciones_cuentos[cuentos[cuento_especifico2]["genero"]-1];
            document.getElementById('modal-resumen').innerText = cuentos[cuento_especifico2]["resumen"];
            document.getElementById('modal-image').src = cuentos[cuento_especifico2]["imagen"];
            refreshIntervalId = setInterval(contarTiempo, 100);
        }, false);
    })(dato);
}

function contarTiempo(){
    decimals++;
}