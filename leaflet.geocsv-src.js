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

  // default values for options
  options: {
    titles: ['lat', 'lng', 'popup'],
    latitudeTitle: 'lat',
    longitudeTitle: 'lng',
    fieldSeparator: ',',
    lineSeparator: '\n',
    decimalSeparator: '.',
    lineCommentSeparator: '#',
    firstLineTitles: false,
    activeWKT: false,
    WKTTitle: 'wkt',
    debug: false
  },

  _propertiesNames: [],

  // for performance
  _re: {
    spaces: /\s+/g,
    notFloats: /[^0-9., -]/g,
    notWord: /[^\w]/g
  },

  _debug: function (msg, data) {
    if (this.options.debug) {
      if (msg) console.log(msg);
      if (data) console.log(data);
    }
    return data;
  },

  _checkOptions: function(opts) {
    if (this.options.activeWKT && !opts.WKTTitle && !this.options.firstLineTitles) this._debug('WARN: WKTTitle not defined', false);
    if (this.options.activeWKT && this.options.decimalSeparator != '.') this._debug('WARN: In WKT mode decimalSeparator need to be a dot', false);
    if (this.options.firstLineTitles && opts.titles) this._debug('WARN: With firstLineTitles titles array not apply', false);
    if (this.options.fieldSeparator.length != 1) this._debug('WARN: fieldSeparator need to be a single character', false);
    if (this.options.lineSeparator.length != 1) this._debug('WARN: lineSeparator need to be a single character', false);
  },

  initialize: function (csv, options) {
    this._propertiesNames = [];
    L.Util.setOptions (this, options);
    this._checkOptions(options);
    L.GeoJSON.prototype.initialize.call (this, csv, options);
  },

  addData: function (data) {
    if (typeof data === 'string') {
      data = this._csv2array(data);
      // read titles
      if (this.options.firstLineTitles) {
        this.options.titles = data[0];
        data.splice(0,1);
      }
      // fill _propertiesNames
      for (var i=0; i<this.options.titles.length; i++) {
         var prop = this.options.titles[i].toLowerCase().replace(this._re.spaces,'_').replace(this._re.notWord,'');
         if (prop == '' || prop == '_') prop = 'prop-'+i;
         this._propertiesNames[i] = prop;
      }
      // convert data to JSON
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

  _csv2array: function (str) {
    var arr = [];
    var quote = false;
    var comment = false;
    for (var row = col = c = 0; c < str.length; c++) {
      var cc = str[c], nc = str[c+1];
      arr[row] = arr[row] || [];
      arr[row][col] = arr[row][col] || '';

      if (cc == this.options.lineCommentSeparator && !quote) { comment=true; continue; }
      if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  
      if (cc == '"') { quote = !quote; continue; }
      if (cc == this.options.fieldSeparator && !quote) { ++col; continue; }
      if (cc == '\r' && nc == this.options.lineSeparator && !quote) { ++row; col = 0; ++c; comment=false; continue; }
      if (cc == this.options.lineSeparator && !quote) { ++row; col = 0; comment=false; continue; }
      if (cc == '\r' && !quote) { ++row; col = 0; comment=false; continue; }

      if (!comment) arr[row][col] += cc;
    }
    return arr;
  },

  _parseWKTFeature: function (wkt) {
    wkt = wkt.toUpperCase().replace(this._re.spaces,' ').trim().split('(');
    var geotype = wkt[0].trim()
      , groups = wkt.slice(1).join('(').split('),')
      , feature = this._featureBlank()
      , coordinates = [];

    for (var g=0; g<groups.length; g++) {
      var coordinates_group = groups[g].replace(this._re.notFloats, '').trim().split(',');
      coordinates[g]=[];
      for (var i=0; i<coordinates_group.length; i++) {
        coordinates_group[i]=coordinates_group[i].trim().split(' ');
        if (coordinates_group[i].length != 2) return feature;
        var lng=parseFloat(coordinates_group[i][0]);
        var lat=parseFloat(coordinates_group[i][1]);
        if (isNaN(lat) || lat > 90 || lat < -90) return feature;
        if (isNaN(lng) || lng > 180 || lng < -180) return feature;
        if (groups.length == 1) {
          coordinates[i]=[lng,lat];
        } else if (geotype == 'MULTIPOINT') {
          coordinates[g]=[lng, lat];
        } else {
          coordinates[g][i]=[lng, lat];
        }
      }
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
      case 'MULTIPOINT':
        feature["geometry"]["type"]='MultiPoint';
        feature["geometry"]["coordinates"]=coordinates;
        break;
      case 'MULTILINESTRING':
        feature["geometry"]["type"]='MultiLineString';
        feature["geometry"]["coordinates"]=coordinates;
        break;
      case 'MULTIPOLYGON':
        feature["geometry"]["type"]='MultiPolygon';
        feature["geometry"]["coordinates"]=[coordinates];
        break;
      default:
        this._debug('ERR: '+geotype+' not supported', false);
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
    var titulos = this.options.titles
      , json = {
          type: "FeatureCollection",
          features: []
        }
      , incr = (this.options.firstLineTitles) ? 2 : 1;
    

    for (var num_linea = 0; num_linea < csv.length; num_linea++) {
      var campos = csv[num_linea]
        , feature = this._featureBlank();

      if ((campos.length == 1) && (campos[0].trim() == '')) {
        this._debug("INFO: Blank or commented at line "+(num_linea+incr), campos);
        continue;
      }

      if (campos.length != titulos.length) {
        this._debug("ERR: Fields and titles don't match at line "+(num_linea+incr)+':', campos);
        continue;
      }

      if (this.options.activeWKT) {
        feature = this._parseWKTFeature(campos[titulos.indexOf(this.options.WKTTitle)]);
      } else {
        var lng = parseFloat(campos[titulos.indexOf(this.options.longitudeTitle)].replace(this.options.decimalSeparator, '.'))
          , lat = parseFloat(campos[titulos.indexOf(this.options.latitudeTitle)].replace(this.options.decimalSeparator, '.'));
        if (lng<180 && lng>-180 && lat<90 && lat>-90) {
          feature["geometry"]["type"]="Point";
          feature["geometry"]["coordinates"]=[lng,lat];
        } else {
          this._debug('ERR: Invalid LatLon pair at line '+(num_linea+incr), false);
        }
      }
      if (feature.geometry && feature.geometry.type) {
        // valid feature
        for (var i=0; i<titulos.length; i++) {
          if ((this.options.activeWKT && titulos[i] != this.options.WKTTitle) || 
          (!this.options.activeWKT && titulos[i] != this.options.latitudeTitle && titulos[i] != this.options.longitudeTitle)) {
            feature["properties"][this._propertiesNames[i]] = campos[i];
          }
      }
        json["features"].push(feature);
      } else {
        this._debug('ERR: Invalid feature at line '+(num_linea+incr)+':', campos);
      }
    }
    return this._debug('INFO: GeoJSON generated', json);
  }

});

L.geoCsv = function (csv_string, options) {
  return new L.GeoCSV (csv_string, options);
};
