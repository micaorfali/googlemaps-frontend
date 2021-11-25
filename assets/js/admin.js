
function collapse() {
    let coll = document.getElementsByClassName("collapsible");
    let i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}


function showhideform() {
    let formulario = document.getElementById("nuevo");

    formulario.addEventListener("click", function () {
        this.classList.toggle("active");
        var content = document.querySelector("#formnuevo");
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

showhideform();

function showhideformedit(id) {
    let formulario = document.getElementById("formeditando");
    if (formulario.style.display === "block") {
        formulario.style.display = "none";
    } else {
        formulario.style.display = "block";
        llenarFormEdit(id);
    }
   
  
}


const deleteItem = async (id) => {
    try {
        const response = await fetch(`https://googlemaps-backend.vercel.app/markers/${id}`, { method: 'DELETE' })
        const data = await response.json;
        fetchData();
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

const llenarFormEdit = async (id) => {

    try {
        const response = await fetch(`https://googlemaps-backend.vercel.app/markers/${id}`)
        const data = await response.json();

        const formEdit = document.querySelector("#formeditando");
        const inputs = formEdit.elements;
        inputs["nombre"].value = data.nombre;
        inputs["lat"].value = data.lat;
        inputs["lng"].value = data.lng;
        inputs["descripcion"].value = data.descripcion;
        console.log(data.type);
        /*
        let categoria
        if(data.type == "Arte y Cultura"){
            categoria = "arteycultura";
        }else if(data.type == "Monumentos"){
            categoria = "monumentos"
        } else if(data.type == "Parques-Plazas"){
            categoria = "parques-plazas";
        }else if(data.type == "Gubernamentales"){
            categoria = "gubernamentales"
        }else if(data.type == "Compras"){
            categoria = "compras";
        }else if(data.type == "Gastronomía"){
            categoria = "gastronomia"
        }else if(data.type == "Patrimonio Nacional"){
            categoria = "patrimonionacional"
        }*/
        console.log(data)
        inputs["_id"].value = data._id
        document.querySelector('#type option[value=' + data.type + ']').selected = 'selected'
       
        
    } catch (error) {
        console.log(error)
    }
}

const updateItem = async (id, data) => {
    console.log(data)
    console.log(id);
    try {
        const response = await fetch(`https://googlemaps-backend.vercel.app/markers/${id}`, {
            method: 'PUT',
            headers: new Headers({ 'content-type': 'application/x-www-form-urlencoded' }),
            body: data
        })

        const dataUpdated = await response.json()
        console.log(dataUpdated)
        fetchData();
        console.log(dataUpdated)
    } catch (error) {
        console.log(error)
    }
}


const fetchData = async (marker) => {
    const $contenedor = document.querySelector('#contenidocollapsible');
    $contenedor.innerHTML = null;
    try {
        const response = await fetch('https://googlemaps-backend.vercel.app/markers');
        const json = await response.json();
        console.log(json);
        json.forEach((marker) => {
            const { _id, nombre, descripcion, lat, lng, type } = marker
            /*let categoria
            if(type == "arteycultura"){
                categoria = "Arte y Cultura";
            }else if(type == "monumentos"){
                categoria = "Monumentos"
            } else if(type == "parques-plazas"){
                categoria = "Parques-Plazas";
            }else if(type == "gubernamentales"){
                categoria = "Gubernamentales"
            }else if(type == "compras"){
                categoria = "Compras";
            }else if(type == "gastronomía"){
                categoria = "Gastronomia"
            }else if(type == "patrimonionacional"){
                categoria = "Patrimonio Nacional"
            }*/

            const contentString = `
            <section class="informacion">
                <div class="cont-collapsible">
                    <div type="button" class="collapsible">${nombre}
                    </div>
                    <div class="content">
                        <p>${descripcion}</p>
                        <p>Categoría: <strong> ${type} </strong> </p>
                    </div>
                </div>
                <div class="editareliminar">
                    <div class="editar" data-id=${_id} class='edit'>
                        Editar
                    </div>
                    <div data-id=${_id} class='delete'>
                        Eliminar
                    </div>
                </div>
            <section>
        `

            $contenedor.innerHTML += contentString;
            collapse();

            const $deleteButtons = document.querySelectorAll('.delete')
            $deleteButtons.forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(el.dataset.id)
                    deleteItem(el.dataset.id)
    
                })
            })
    
            const $editButtons = document.querySelectorAll('.editar')
            $editButtons.forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(el.dataset.id)
                    showhideformedit(el.dataset.id)
                })
            })
        })

        
    }
    catch (error) {
        console.log(error)
    }
}


const initAdmin = () => {
    fetchData();
}
initAdmin();

$(document).ready(function () {
    $("#formnuevo").validate({
        rules: {
            "nombre": {
                required: true
            },
            "descripcion": {
                required: true
            },
            "latitud": {
                required: true
            },
            "longitud": {
                required: true
            }
        },
        messages: {
            "nombre": "Ingresa el nombre de la atracción",
            "descripcion": "Ingresa una descripcion",
            "latitud": "Ingresa la latitud",
            "longitud": "Ingresa la longitud",
        },

        submitHandler: function (form) {
            console.log("Se envio el form");
            //$(form).submit();
            $.ajax({
                url: form.action,
                type: form.method,
                data: $(form).serialize(),
                beforeSend: function () {
                    $('#respuesta_form').html('Espere...');
                },
                success: function (response) {
                    console.log(response)
                    $('#respuesta_form').html('Gracias por agregar un marcador :)');

                    //fetchData();
                }
            })
        }
    });

    $("#formeditando").validate({
        rules: {
            "nombre": {
                required: true
            },
            "descripcion": {
                required: true
            },
            "latitud": {
                required: true
            },
            "longitud": {
                required: true
            }
        },
        messages: {
            "nombre": "Ingresa el nombre de la atracción",
            "descripcion": "Ingresa una descripcion",
            "latitud": "Ingresa la latitud",
            "longitud": "Ingresa la longitud",
        },

        submitHandler: function () {
            const id = document.querySelector("#idedit").value;
            updateItem(id, $(formeditando).serialize());
            console.log(id)
            console.log($(formeditando).serialize())
        }
    });
})