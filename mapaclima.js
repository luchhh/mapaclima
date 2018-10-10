
var climaWidget = function(){
    
    var tempElem = $( "#home .titulo" );
    var pronElem = $( "#pronostico" );
    var marker;
    var api_key_weather = "05368a30f30aa3de0d153301a9ac52f6";    
    
    return {
        init: init
    }

    // Initicializa el mapa
    function init (){

        // La ubicación de santander
        var santander = {lat: 43.461, lng: -3.846};

        // Centramos el mapa en Santander y apagamos la opción Street View
        var map = new google.maps.Map(
            document.getElementById('map'), {zoom: 8, center: santander, streetViewControl:false});

        marker = new google.maps.Marker({map: map});
        
        // este listener llama a setPosition() de Marker cuando se hace clic sobr el mapa
        google.maps.event.addListener(map, 'click', function(event) {
            marker.setPosition(event.latLng);
        });

        // cuando cambia la posición del marker se llama al API climático
        google.maps.event.addListener(marker, 'position_changed', function() {
            var pos = marker.getPosition();
            
            var apiTemp = "https://api.openweathermap.org/data/2.5/weather?lat="+pos.lat()+"&lon="+pos.lng()+"&units=metric&appid="+api_key_weather;
            var jqxhr = $.getJSON( apiTemp)
            .done(function(data) {
                actualizarTemperatura(data);
            })
            .fail(function(data) {
                tempElem.html("Lo siento! no es posible conectar con nuestros servicio de climas");
                console.log( "error conectando a API openweathermap.org" );
            })
            .always(function() {
                //cuando termina, no lo utilizamos
            });
            
            //http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=05368a30f30aa3de0d153301a9ac52f6
            var apiPron = "https://api.openweathermap.org/data/2.5/forecast?lat="+pos.lat()+"&lon="+pos.lng()+"&units=metric&appid="+api_key_weather;
            var jqxhr = $.getJSON( apiPron)
            .done(function(data) {
                actualizarPronostico(data);
            })
            .fail(function(data) {
                pronElem.html("Lo siento! no es posible conectar con nuestros servicio de climas");
                console.log( "error conectando a API openweathermap.org" );
            })
            .always(function() {
                //cuando termina, no lo utilizamos
            });

        });

        marker.setPosition(santander);
    }

    function actualizarTemperatura(jsonData){
        var img = $('<img>');
        img.attr('src', "http://openweathermap.org/img/w/"+jsonData.weather[0].icon+".png");
        tempElem.html("Temperatura: "+jsonData.main.temp+" ℃ ");
        img.appendTo(tempElem);
    }

    function actualizarPronostico(jsonData){
        var pronostico, img, d;
        pronElem.html("** ");
        
        for (var i = 0; i < 8; i++) {
            pronostico = jsonData.list[i];
            d = new Date(pronostico.dt*1000);
            hora = d.getHours()+":00";
            img = $('<img>');
            img.attr('src', "http://openweathermap.org/img/w/"+pronostico.weather[0].icon+".png");
            pronElem.append(hora+" - "+pronostico.main.temp+" ℃ ");
            pronElem.append(img);
            pronElem.append(" ** ");
        }
    }
}();