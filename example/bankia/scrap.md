Scrapea los datos básicos de las sucursales de Bankia usando Firebug
====================================================================

Para extraer los datos de las sucursales bancarias de Bankia empleamos un método poco típico con excelentes resultados:
Utilizar la consola de [Firebug](https://getfirebug.com/) para realizar las llamadas necesarias dejando el resultado en sendos
textarea dentro de la página, uno con el objeto JSON y otro con un CSV.

Echando un vistazo rápido al código que genera el mapa de Bankia nos encontramos con que utilizan prototype y que los datos
los recoge a través de la función getMarkets (línea 810) en el archivo http://buscador.bankia.es/js/geosearch.js

Paso 0:
------
1.  Instalar firebug (si no lo tienes ya): [Descargar Firebug](https://getfirebug.com/).
2.  Ingresar en la página http://buscador.bankia.es/doAction.do?text=Oficinas+y+Cajeros&action=query
3.  Activar firebug y abrir su consola.

Paso 1:
------

Copia, pega y ejecuta el siguiente código javascript:

```js
//toditas tendrá el string con todos los resultados concatenados de los objetos JSON que devuelva la llamada ajax 
var toditas = '';
//num_sucursales contendrá el número de sucursales procesadas
var num_sucursales = 0;

//Petición Ajax
function dameSucursales(zona) {
    posicionCaja=zona;
    var ajax = new Ajax.Request("GetAssests.do", {
        parameters: "level=activos&ubicacion=Toledo&lat=39.867&lng=-4.00649999999996&posicionCaja=" + posicionCaja+"&cache=false",
        method: "post",
         onSuccess: function(response){
             var temp = JSON.parse(response.responseText);
             temp = temp.length;
             num_sucursales += temp;
             console.log('Recibidas '+temp);
             //quitamos los corchetes, los añadiremos en el codigo 2
             toditas += response.responseText.slice(1,response.responseText.length-1)+",";
         }
    });
}

function recursivator(zona) {
  dameSucursales(zona["posicionCaja"]);
  if (zona.subActivos) {
    zona.subActivos.forEach(recursivator);
  }
}

resultadosZonas.forEach(recursivator);
```

Paso 2
------

Borra el código anterior y pega el código siguiente:

```js
/* CÓDIGO 2: mostramos el resultado anterior en un textarea
   IMPORTANTE BORRAR O COMENTAR EL CÓDIGO ANTERIOR */

function crearTextArea(texto) {
  var toditas_textarea = document.createElement('textarea');

  Element.extend(toditas_textarea);
  toditas_textarea.setStyle({width:"100%",height:"300px"});
  
  toditas_textarea.update(texto);

  document.body.appendChild(toditas_textarea);
  return toditas_textarea;
}

//añadimos los corchetes y le quitamos la última coma
toditas = "[\n"+toditas.slice(0,toditas.length-1)+"\n]";
var toditas_textarea = crearTextArea(toditas);
console.log('Número total de sucursales procesadas: '+num_sucursales);
```

Paso 3
------

Borra el código anterior y pega el código siguiente:

```js
/* CÓDIGO 3: CONVERTIR A CSV */

/* Ejemplo de "sucursal"
{
  "cp" : "01010",
  "servicios" : [ "entradas", "pago", "audio" ],
  "giro" : 0,
  "localidad" : "Vitoria-Gasteiz",
  "provincia" : "Álava",
  "horario" : "L, M, X, V de 08:15 a 14:15, J de 08:15 a 14:15 de 16:45 a 19:15, J de 01/05 a 30/09 de 08:15 a 14:15",
  "cajero" : true,
  "tipo_entidad" : "oficina",
  "numero_entidad" : "4232",
  "direccion_via" : "C/ Antonio Machado, 35",
  "telefono_fax" : "945197397",
  "latitud" : 42.860577,
  "longitud" : -2.6933467
}
*/

function crearTextArea(texto) {
  var toditas_textarea = document.createElement('textarea');

  Element.extend(toditas_textarea);
  toditas_textarea.setStyle({width:"100%",height:"300px"});
  
  toditas_textarea.update(texto);

  document.body.appendChild(toditas_textarea);
  return toditas_textarea;
}

function aCSV() {
	var csv = '#cp;localidad;provincia;tipo_entidad;numero_entidad;direccion_via;telefono_fax;latitud;longitud\n';
   var json_toditas = JSON.parse(toditas);
	json_toditas.forEach(function(s) {
		csv += s.cp+";"+s.localidad+";"+s.provincia+";"+s.tipo_entidad+";"+s.numero_entidad+";"+
			s.direccion_via+";"+s.telefono_fax+";"+s.latitud+";"+s.longitud+"\n";
	});
	var toditas_textarea = crearTextArea(csv);
}

aCSV();
```

Paso 4:
-------

Una vez hemos llegado aqui tenemos en la propia web al final de la página dos textarea: uno con el JSON generado y
otro con el CSV, ya podemos copiar y pegar su contenido a sendos archivos, por ejemplo *bankia.raw.json* y *bankia.raw.csv*.

Nos queda limpiar esos archivos, pues hay muchísimos registros repetidos. A partir del CSV utilizando uniq, sort, awk y grep
resulta muy fácil eliminar los repetidos o borrar aquellos campos que no utilices. Por ejemplo así:

```sh
grep ";oficina;" bankia.raw.csv | awk -F ";" '{print $6";"$1";"$2";"$3";"$7";"$8";"$9}' | sort | uniq > bankias.csv
```

Y con el plugin Leaflet.geoCSV podemos cargar los datos una vez limpios directamente.

Datos en bruto: http://joker-x.github.com/Leaflet.geoCSV/example/bankia/bankia.raw.csv

Datos límpios: http://joker-x.github.com/Leaflet.geoCSV/example/bankia/bankias.csv

Web de ejemplo: http://joker-x.github.com/Leaflet.geoCSV/example/bankia/

P.S: Este podría ser un ejemplo extremo de lo que puede suponer transmitir el archivo en CSV en lugar de en JSON.
Con 35231 registros totales que extraemos (la gran mayoría repetidos o correspondientes a cajeros) el archivo bankia.raw.csv
ocupa 2,9 Mb; mientras que el JSON ocupa 15Mb. Por ello este último fichero no se incluye en el repositorio.
