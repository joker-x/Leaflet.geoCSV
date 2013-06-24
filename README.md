Leaflet GeoCSV
==============

[English](#english): [Leaflet](https://github.com/Leaflet/Leaflet) plugin for loading a CSV file as geoJSON layer.

[Castellano](#castellano): Plugin para [Leaflet](https://github.com/Leaflet/Leaflet) que permite cargar un archivo CSV como capa geoJSON.


<div id="english" lang="en"></div>
Why GeoCSV?
-----------

*  **Comfort**: CSV is a simple open format to represent a set of data in a table. All spreadsheet software allow to import/export in this format easily.
*  **For reasons of weight**: When it comes to represent a large set of markers on a map, generated GeoJSON file can occupy 4 times more than the same information contained in a CSV. This plugin allows you to transmit the CSV file and converts the equivalent GeoJSON on the client side, saving bandwidth and reducing your server load time of your page. In this scenario we recommend using it together with the fantastic plugin [MarkerCluster](https://github.com/danzel/Leaflet.markercluster). Example: [Bankia offices map: GeoCSV+MarkerCluster](http://joker-x.github.com/Leaflet.geoCSV/example/bankia/index.html)

Download
--------
*  [leaflet.geocsv.js](leaflet.geocsv.js): Only plugin (2,4K uncompressed).
*  Full Repository [.ZIP](https://github.com/joker-x/Leaflet.geoCSV/archive/master.zip) [.TAR.GZ](https://github.com/joker-x/Leaflet.geoCSV/archive/master.tar.gz): ncludes plugin, examples and libraries used in them.

Options
-------

Leaflet GeoCSV inherited from [GeoJSON](http://leafletjs.com/reference.html#geojson), so it can be used all the options and methods of the superclass.
It also defines the following own:

*  **titles**: Array with the labels or titles of the fields in the order in which they appear in the CSV. There are two special titles should always appear with the same name: 'lat' → latitude y 'lng' → longitude. The rest can take any form, admitting spaces, capitalization, accents, etc.. By default *['lat', 'lng', 'popup']*
*  **lineSeparator**: A character or string of characters used to separate CSV file lines, each of the features. By default *'\n'*
*  **fieldSeparator**: A character or string of characters used to separate fields in the CSV file. By default *';'*
*  **deleteDobleQuotes**: Boolean value indicating whether to delete the quotes that delimit the CSV file fields. Default *true*
*  **firstLineTitles**: A Boolean value that indicates whether the first line of the CSV file contains the labels of the fields. Default *false*. If set to true will ignore the option titles.

Methods
-------

*  **getPropertyTitle(** property_name **)**: Returns the label associated with the name of the property you receive as a parameter.
*  **getPropertyName(** title_name **)**: Returns the name of the property associated with the title of the field that receives as a parameter.

Use
---

1. Include the plugin in our website, behind leaflet.js:

```html
<script src="leaflet.geocsv.js"></script>
```

2. We create well GeoCSV layer instantiating the class or using the alias L.geoCsv:

```js
var my_geocsv = L.geoCsv (csv_string, options);
```

The options are as we have seen in the previous section. The first parameter is a string with the contents of the CSV file. If you instantiate it with null value as csv_string, you can load data later using the method addData. Example of asynchronous loading using jQuery:

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

Examples
--------

In the subdirectory *example* are complete examples of using the plugin:
*  [Dinamic test of configuration options](http://joker-x.github.com/Leaflet.geoCSV/example/options-test/index.html)
*  [Data passing through the URL](http://joker-x.github.com/Leaflet.geoCSV/example/from-url/index.html)
*  [Bankia offices map: GeoCSV+MarkerCluster](http://joker-x.github.com/Leaflet.geoCSV/example/bankia/index.html)


<div id="castellano" lang="es"></div>
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
*  **lineSeparator**: Carácter o cadena de caracteres que usarán para separar las líneas del archivo CSV, cada una de las features. Por defecto *'\n'*
*  **fieldSeparator**: Carácter o cadena de caracteres que usarán para separar los campos del archivo CSV. Por defecto *';'*
*  **deleteDobleQuotes**: Valor booleano que indica si se desea borrar las comillas que delimitan los campos del archivo CSV. Por defecto *true*
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
*  [Pasando los datos a través de la URL](http://joker-x.github.com/Leaflet.geoCSV/example/from-url/index.html)
*  [Mapa de las sucursales de Bankia: GeoCSV+MarkerCluster](http://joker-x.github.com/Leaflet.geoCSV/example/bankia/index.html)

