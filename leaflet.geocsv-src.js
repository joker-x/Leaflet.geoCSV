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
    quoteSymbol: ''
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

  _splitLine: function (rawline) {
    if (this.options.quoteSymbol == '') {
      return rawline.split(this.options.fieldSeparator).map(s => s.trim());
    }

    const replaceSymbol = '\n';
    const re1 = new RegExp(this.options.quoteSymbol + this.options.fieldSeparator, 'gi');
    const re2 = new RegExp(replaceSymbol, 'gi');
    // hide quoted fieldSeparator
    const line = rawline.replace(re1, replaceSymbol);
    const lst = line.split(this.options.fieldSeparator);
    // and than restore it back
    return lst.map(s => s.replace(re2, this.options.fieldSeparator).trim());
  },

  _csv2json: function (csv) {
    var json = {};
    json["type"]="FeatureCollection";
    json["features"]=[];
    var titulos = this.options.titles;

    csv = csv.split(this.options.lineSeparator);
    for (var num_linea = 0; num_linea < csv.length; num_linea++) {
      var campos = this._splitLine(csv[num_linea])
        , lng = parseFloat(campos[titulos.indexOf(this.options.longitudeTitle)])
        , lat = parseFloat(campos[titulos.indexOf(this.options.latitudeTitle)]);
      if (campos.length==titulos.length && lng<180 && lng>-180 && lat<90 && lat>-90) {
        var feature = {};
        feature["type"]="Feature";
        feature["geometry"]={};
        feature["properties"]={};
        feature["geometry"]["type"]="Point";
        feature["geometry"]["coordinates"]=[lng,lat];
        //propiedades
        for (var i=0; i<titulos.length; i++) {
          if (titulos[i] != this.options.latitudeTitle && titulos[i] != this.options.longitudeTitle) {
            feature["properties"][this._propertiesNames[i]] = this._deleteDoubleQuotes(campos[i]);
          }
        }
        json["features"].push(feature);
      }
      else {
        console.log(`bad record ${num_linea} '${csv[num_linea]}'`);
      }
    }
    return json;
  }

});

L.geoCsv = function (csv_string, options) {
  return new L.GeoCSV (csv_string, options);
};
