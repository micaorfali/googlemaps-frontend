let markersAll = [];
//let infoWindow = null;

// Initialize and add the map
window.initMap = () => {
    // The location of Uluru
    const kmcero = { lat: -34.60944577483608, lng: -58.38886401806107 };
    // The map, centered at km cero
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: kmcero,
        styles: styles,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
            mapTypeIds: []
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });
    // The marker, positioned at km cero
    const marker = new google.maps.Marker({
        //position: kmcero,
        map: map,
    });

    fetchMarkers(map);

    const $filter = document.querySelectorAll('.handleFilter')

    $filter.forEach((filter) => {
        filter.addEventListener('click', (e) => {
            let filterQuery = filter.innerHTML
            if (filterQuery == "Arte y Cultura") {
                filterQuery = "arteycultura";
            } else if (filterQuery == "Monumentos") {
                filterQuery = "monumentos"
            } else if (filterQuery == "Parques-Plazas") {
                filterQuery = "parques-plazas";
            } else if (filterQuery == "Gubernamentales") {
                filterQuery = "gubernamentales"
            } else if (filterQuery == "Compras") {
                filterQuery = "compras";
            } else if (filterQuery == "Gastronomia") {
                filterQuery = "gastronomia"
            } else if (filterQuery == "Patrimonio Nacional") {
                filterQuery = "patrimonionacional"
            }
            console.log(filter.innerHTML)
           
            addMarkersFiltered(filterQuery, map)
        })
    })
    const $filterReset = document.querySelector('.handleFilterReset')
    $filterReset.addEventListener('click', () => {
        markersAll.forEach((marker) => {
            marker.setMap(null)
        })
        markersAll.forEach((marker) => {
            marker.setMap(map)
        })
    })
}

const addMarkersFiltered = (filterQuery, map) => {
    markersAll.forEach((marker) => {
        marker.setMap(null)
    })

    const markersFiltered = markersAll.filter((marker) => marker.customInfo === filterQuery)
    console.log(markersFiltered);

    markersFiltered.forEach((marker) => {
        marker.setMap(map);
    })
}

const fetchMarkers = async (map) => {
    try {
        const response = await fetch('https://googlemaps-backend.vercel.app/markers');
        const json = await response.json();
        console.log(json);
        json.forEach(marker => addMarker(map, marker))
    } catch (error) {
        console.log(error)
    }
}

const addMarker = (map, marker) => {

    const { id, nombre, descripcion, lat, lng, type } = marker

    let categoria
    if (type == "arteycultura") {
        categoria = "Arte y Cultura";
    } else if (type == "monumentos") {
        categoria = "Monumentos"
    } else if (type == "parques-plazas") {
        categoria = "Parques-Plazas";
    } else if (type == "gubernamentales") {
        categoria = "Gubernamentales"
    } else if (type == "compras") {
        categoria = "Compras";
    } else if (type == "gastronomía") {
        categoria = "Gastronomia"
    } else if (type == "patrimonionacional") {
        categoria = "Patrimonio Nacional"
    }

    const icons = {
        'Arte y Cultura': 'assets/img/arteycultura.png',
        'Monumentos': 'assets/img/monumentos.png',
        'Parques-Plazas': 'assets/img/parquesyplazas.png',
        'Gubernamentales': 'assets/img/gubernamentales.png',
        'Compras': 'assets/img/compras.png',
        'Gastronomia': 'assets/img/gastronomia.png',
        'Patrimonio Nacional': 'assets/img/patrimonionacional.png',
    }

    const markerItem = new google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        icon: icons[categoria],
        map: map,
        customInfo: categoria
    })
    markerItem.setMap(map);
    markersAll.push(markerItem);


    const contentString = `
        <div class="info_wrapper" style="max-width: 40vw!important">
            <h2>${nombre}</h2>
            <h3>${categoria}</h3>
            <p>${descripcion}</p>
        </div>
        `

    const infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    markerItem.addListener('click', () => {

        if (infoWindow) {
            infoWindow.close();
        }
        infoWindow.open(map, markerItem)
    });
}

