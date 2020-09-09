/*
* Copyright 2013 - GPL
* Iván Eixarch <ivan@sinanimodelucro.org>
* https://github.com/joker-x/Leaflet.geoCSV
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301, USA.
*/

L.GeoCSV = L.GeoJSON.extend({

  //opciones por defecto
  options: {
    titles: ['lat', 'lng', 'popup'],
	latitudeTitle: 'lat',
	longitudeTitle: 'lng',
    fieldSeparator: ';',
    lineSeparator: '\n',
    deleteDoubleQuotes: true,
    firstLineTitles: false,
    activeWKT: false,
    WKTTitle: 'wkt'
  },

  _propertiesNames: [],

  initialize: function (csv, options) {
    this._propertiesNames = [];
    L.Util.setOptions (this, options);
    L.GeoJSON.prototype.initialize.call (this, csv, options);
  },

  addData: function (data) {
    if (typeof data === 'string') {
      //leemos titulos
      var titulos = this.options.titles;
      if (this.options.firstLineTitles) {
        data = data.split(this.options.lineSeparator);
        if (data.length < 2) return;
        titulos = data[0];
        data.splice(0,1);
        data = data.join(this.options.lineSeparator);
        titulos = titulos.trim().split(this.options.fieldSeparator);
        for (var i=0; i<titulos.length; i++) {
          titulos[i] = this._deleteDoubleQuotes(titulos[i]);
        }
        this.options.titles = titulos;
      }
      //generamos _propertiesNames
      for (var i=0; i<titulos.length; i++) {
         var prop = titulos[i].toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_');
         if (prop == '' || prop == '_') prop = 'prop-'+i;
         this._propertiesNames[i] = prop;
      }
      //convertimos los datos a geoJSON
      data = this._csv2json(data);
    }
    return L.GeoJSON.prototype.addData.call (this, data);
  },

  getPropertyName: function (title) {
    var pos = this.options.titles.indexOf(title)
      , prop = '';
    if (pos >= 0) prop = this._propertiesNames[pos];
    return prop;
  },

  getPropertyTitle: function (prop) {
    var pos = this._propertiesNames.indexOf(prop)
      , title = '';
    if (pos >= 0) title = this.options.titles[pos];
    return title;
  },

  _deleteDoubleQuotes: function (cadena) {
    if (this.options.deleteDoubleQuotes) cadena = cadena.trim().replace(/^"/,"").replace(/"$/,"");
    return cadena;
  },

  // from https://stackoverflow.com/questions/1293147/example-javascript-code-to-parse-csv-data
  _csv2array: function (str) {
    var arr = [];
    var quote = false;
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';

        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  
        if (cc == '"') { quote = !quote; continue; }
        if (cc == this.options.fieldSeparator && !quote) { ++col; continue; }
        if (cc == '\r' && nc == this.options.lineSeparator && !quote) { ++row; col = 0; ++c; continue; }
        if (cc == this.options.lineSeparator && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        arr[row][col] += cc;
    }
    return arr;
  },

  _parseWKTFeature: function (wkt) {
    var feature = this._featureBlank();
    wkt = wkt.toUpperCase().replace(/\s+/g,' ').trim();
    var geotype = wkt.split('(')[0].trim();
    var coordinates = wkt.replace(/[^0-9., -]/g, '').trim().split(',');

    for (var i=0; i<coordinates.length; i++) {
      coordinates[i]=coordinates[i].trim().split(' ');
      if (coordinates[i].length != 2) return feature;
      var lat=parseFloat(coordinates[i][0]);
      var lng=parseFloat(coordinates[i][1]);
      if (isNaN(lat) || lng > 90 || lng < -90) return feature;
      if (isNaN(lng) || lng > 180 || lng < -180) return feature;
      coordinates[i]=[lng,lat];
    }

    switch (geotype) {
      case 'POINT':
        feature["geometry"]["type"]='Point';
        feature["geometry"]["coordinates"]=coordinates[0];
        break;
      case 'LINESTRING':
        feature["geometry"]["type"]='LineString';
        feature["geometry"]["coordinates"]=coordinates;
        break;
      case 'POLYGON':
        feature["geometry"]["type"]='Polygon';
        feature["geometry"]["coordinates"]=[coordinates];
        break;
      default:
        console.log(geotype+' not supported');
    }

    return feature;
  }, 

  _featureBlank: function() {
    return {
      type: "Feature",
      geometry: {},
      properties: {}
    };
  },

  _csv2json: function (csv) {
    var json = {};
    json["type"]="FeatureCollection";
    json["features"]=[];
    var titulos = this.options.titles;

    csv = this._csv2array(csv);

    for (var num_linea = 0; num_linea < csv.length; num_linea++) {
      var campos = csv[num_linea]
        , feature = this._featureBlank();

      if (campos.length != titulos.length) continue;

      if (this.options.activeWKT) {
        feature = this._parseWKTFeature(campos[titulos.indexOf(this.options.WKTTitle)]);
      } else {
	    var lng = parseFloat(campos[titulos.indexOf(this.options.longitudeTitle)])
	      , lat = parseFloat(campos[titulos.indexOf(this.options.latitudeTitle)]);
	    if (lng<180 && lng>-180 && lat<90 && lat>-90) {
	      feature["geometry"]["type"]="Point";
	      feature["geometry"]["coordinates"]=[lng,lat];
        }
      }
      if (feature.geometry && feature.geometry.type) {
        // valid feature
	    for (var i=0; i<titulos.length; i++) {
	      if (titulos[i] != this.options.WKTTitle && titulos[i] != this.options.latitudeTitle && titulos[i] != this.options.longitudeTitle) {
	        feature["properties"][this._propertiesNames[i]] = this._deleteDoubleQuotes(campos[i]);
	      }
	    }
        json["features"].push(feature);
      }
    }
    return json;
  }

});

L.geoCsv = function (csv_string, options) {
  return new L.GeoCSV (csv_string, options);
};
