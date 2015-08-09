Leaflet GeoCSV
==============

[English](#why-geocsv): [Leaflet](https://github.com/Leaflet/Leaflet) plugin for loading a CSV file as geoJSON layer.

[Castellano](#por-qu-geocsv): Plugin para [Leaflet](https://github.com/Leaflet/Leaflet) que permite cargar un archivo CSV como capa geoJSON.


Why GeoCSV?
-----------

* **Ease of use**: A CSV (comma-separated values) file is a simple and open file format that stores tabular data in
plain-text form. Virtually all spreadsheet and database software can import/export this file format.

* **Save bandwidth**: When used to display markers, GeoJSON files can be up to four times as large as a CSV file
containing the same information. This plugin provides the ability to download a CSV file that is then parsed into a
GeoJSON document on the client side, saving you bandwidth and reducing load times. In similar scenarios, we recommend
using GeoCSV together with [MarkerCluster](//github.com/danzel/leaflet.markercluster) as in the
[Bankia Offices Map Example](//joker-x.github.com/Leaflet.geoCSV/example/bankia/index.html).


Download
--------

*  Plugin only (2.4k, uncompressed): [leaflet.geocsv.js](leaflet.geocsv.js)

*  Full Repository (includes plugin, all prerequisites and examples): [.ZIP](https://github.com/joker-x/Leaflet.geoCSV/archive/master.zip) or [.TAR.GZ](https://github.com/joker-x/Leaflet.geoCSV/archive/master.tar.gz)


Options
-------

GeoCSV inherits the configuration options and methods of its parent object, the [GeoJSON](//leafletjs.com/reference.html#geojson) layer, and further defines the following of its own:

* **titles**: An array of field titles in the same order in which they appear within the CSV file. GeoCSV only requires the presence of two field titles, `lat` and `lng` (latitude and longitude, respectively); all others field titles are permitted, omitting spaces, capitalization, accent characters, etc. By default, `titles: ['lat', 'lng', 'popup']`

* **latitudeTitle**: The title used for the latitude value of the feature. By default, `latitudeTitle: 'lat'`.

* **longitudeTitle**: The title used for the longitude value of the feature. By default, `longitudeTitle: 'lng'`.

* **lineSeparator**: The string delimiting lines within the CSV file (between each GeoJSON feature). By default, `lineSeparator: '\n'`.

* **fieldSeparator**: The string delimiting individual fields within each feature. By default, `fieldSeparator: ';'`.

*  **deleteDoubleQuotes**: A boolean indicating if double quotes surrounding individual field values should be removed. By default, `true`.

* **firstLineTitles**: A boolean indicating if the first line of the CSV file contains field titles. If set to false, the plugin will ignore the `titles` configuration option. By default, `false`.


Methods
-------

*  **getPropertyTitle(** propertyName **)**: When passed a property name (string), returns the associated property title.

*  **getPropertyName(** propertyTitle **)**: When passed a property title (string), returns the associated property name.

Use
---

1. Include the plugin JavaScript file after leaflet.js: `<script src="leaflet.geocsv.js"></script>`

2. Create a GeoCSV layer by instantiating the class or calling `L.geoCsv()`. Where `csvFileContents` is the content of a CSV file and `options` is an object literal as described in the previous section: `var csvLayer = L.geoCsv(csvFileContents, options);`

An example, using jQuery to read a CSV file, and adding a GeoCSV layer to a map:

```js
(function() {
  'use strict';

  var map = L.map('mapContainer');

  $.get('data.csv', function(csvContents) {
    var geoLayer = L.geoCsv(csvContents, {firstLineTitles: true, fieldSeparator: ','});
    map.addLayer(geoLayer);
  });
});
```


Examples
--------

Complete examples can be found within the `examples` subdirectory of the repository:

*  [Configuration Options Test](//joker-x.github.com/Leaflet.geoCSV/example/options-test/index.html)

*  [Load custom icons from CSV](//joker-x.github.com/Leaflet.geoCSV/example/icons/index.html)

*  [Data Passing Through the URL](//joker-x.github.com/Leaflet.geoCSV/example/from-url/index.html)

*  [Bankia Offices (GeoCSV + MarkerCluster)](//joker-x.github.com/Leaflet.geoCSV/example/bankia/index.html)


¿Por qué GeoCSV?
----------------

*  **Comodidad**: CSV es un formato abierto muy simple para representar un conjunto de datos en forma de tabla. Cualquier hoja de cálculo, por ejemplo, puede importar/exportar fácilmente a este formato.
*  **Por razones de peso**: Cuando se trata de representar un conjunto grande de marcadores en un mapa, el fichero geoJSON generado puede ocupar 4 veces más que la misma información contenida en un CSV. Este plugin permite que transmitas el fichero CSV y realiza la conversión al geoJSON equivalente en el lado del cliente, ahorrando ancho de banda a tu servidor y disminuyendo el tiempo de carga de tu página. En este escenario recomendamos usarlo junto al fantástico plugin [MarkerCluster](https://github.com/danzel/Leaflet.markercluster). Ejemplo: [Mapa de las sucursales de Bankia: GeoCSV+MarkerCluster](http://joker-x.github.com/Leaflet.geoCSV/example/bankia/index.html)

Descarga
--------
*  [leaflet.geocsv.js](leaflet.geocsv.js): Sólo plugin 2,4K. Menos de 1K comprimido.
*  Repositorio completo [.ZIP](https://github.com/joker-x/Leaflet.geoCSV/archive/master.zip) [.TAR.GZ](https://github.com/joker-x/Leaflet.geoCSV/archive/master.tar.gz): Incluye plugin, ejemplos y librerías utilizadas en los mismos.

Opciones
--------

Leaflet GeoCSV hereda de [GeoJSON](http://leafletjs.com/reference.html#geojson), por lo que pueden usarse todas las opciones y métodos de la superclase.
Además define las siguientes opciones propias:

*  **titles**: Array con los rótulos o títulos de los campos en el orden en el que aparecen en el CSV. Hay dos títulos especiales que deben aparecer siempre con el mismo nombre: 'lat' → latitud y 'lng' → longitud. El resto puede adoptar cualquier forma, admitiendo espacios, mayúsculas, tildes, etc. Por defecto *['lat', 'lng', 'popup']*

* **latitudeTitle**: Título del campo latitud. Por defecto `latitudeTitle: 'lat'`.

* **longitudeTitle**: Título del campo longitud. Por defecto `longitudeTitle: 'lng'`.

*  **lineSeparator**: Carácter o cadena de caracteres que usarán para separar las líneas del archivo CSV, cada una de las features. Por defecto *'\n'*

*  **fieldSeparator**: Carácter o cadena de caracteres que usarán para separar los campos del archivo CSV. Por defecto *';'*

*  **deleteDoubleQuotes**: Valor booleano que indica si se desea borrar las comillas que delimitan los campos del archivo CSV. Por defecto *true*

*  **firstLineTitles**: Valor booleano que indica si la primera línea del archivo CSV contiene los rótulos de los campos. Por defecto *false*. Si se pone a true se ignorará la opción titles.

Métodos
-------

*  **getPropertyTitle(** nombre_propiedad **)**: Devuelve el rótulo asociado al nombre de la propiedad que recibe como parámetro.
*  **getPropertyName(** nombre_título **)**: Devuelve el nombre de la propiedad asociado al título del campo que recibe como parámetro.

Uso
---

1. Incluimos el plugin en nuestra página, detrás de leaflet.js:

```html
<script src="leaflet.geocsv.js"></script>
```

2. Creamos la capa GeoCSV bien instanciando la clase o utilizando el alias L.geoCsv:

```js
var mi_geocsv = L.geoCsv (csv_string, opciones);
```

Las opciones son las que hemos visto en el apartado anterior. El primer parámetro es un string con el contenido del fichero CSV. Si a la hora de instanciarlo no tenemos disponibles los datos, csv_string puede valer null y cargar los datos más adelante usando el método addData. Ejemplo de carga asíncrona usando jQuery:

```js
//...
var mi_geocsv = L.geoCsv (null, {firstLineTitles: true, fieldSeparator: ','});
//...
$.ajax ({
  type:'GET',
  dataType:'text',
  url:'datos.csv',
  error: function() {
    alert('No se pudieron cargar los datos');
  },
  success: function(csv) {
    mi_geocsv.addData(csv);
    mapa.addLayer(mi_geocsv);
  }
});
```

Ejemplos
--------

En el subdirectorio *example* se encuentran ejemplos completos del uso del plugin:

*  [Test dinámico de las opciones de configuración](http://joker-x.github.com/Leaflet.geoCSV/example/options-test/index.html)

*  [Cargando iconos personalizados desde el CSV](//joker-x.github.com/Leaflet.geoCSV/example/icons/index.html)

*  [Pasando los datos a través de la URL](http://joker-x.github.com/Leaflet.geoCSV/example/from-url/index.html)

*  [Mapa de las sucursales de Bankia: GeoCSV+MarkerCluster](http://joker-x.github.com/Leaflet.geoCSV/example/bankia/index.html)

