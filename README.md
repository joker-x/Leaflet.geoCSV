Leaflet GeoCSV
==============

Plugin para [Leaflet](https://github.com/CloudMade/Leaflet) que permite cargar un archivo CSV como capa geoJSON.

[Leaflet](https://github.com/CloudMade/Leaflet) plugin for loading a CSV file as geoJSON layer.

¿Por qué GeoCSV?
----------------

*  **Comodidad**: CSV es un formato abierto muy simple para representar un conjunto de datos en forma de tabla. Cualquier hoja de cálculo, por ejemplo, puede importar/exportar fácilmente a este formato.
*  **Por razones de peso**: Cuando se trata de representar un conjunto grande de marcadores en un mapa, el fichero geoJSON generado puede ocupar 4 veces más que la misma información contenida en un CSV. Este plugin permite que transmitas el fichero CSV y realiza la conversión al geoJSON equivalente en el lado del cliente, ahorrando ancho de banda a tu servidor y disminuyendo el tiempo de carga de tu página. En este escenario recomendamos usarlo junto al fantástico plugin [MarkerCluster](https://github.com/danzel/Leaflet.markercluster). Ejemplo: [Mapa de las sucursales de Bankia: GeoCSV+MarkerCluster](example/bankia/index.html)

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

*  **getPropertyTitle(**nombre_propiedad**)**: Devuelve el rótulo asociado al nombre de la propiedad que recibe como parámetro.
*  **getPropertyName(**nombre_título**)**: Devuelve el nombre de la propiedad asociado al título del campo que recibe como parámetro.

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
*  [Test dinámico de las opciones de configuración](example/options-test/index.html)
*  [Pasando los datos a través de la URL](example/from-url/index.html)
*  [Mapa de las sucursales de Bankia: GeoCSV+MarkerCluster](example/bankia/index.html)

