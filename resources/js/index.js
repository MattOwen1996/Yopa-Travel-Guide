let map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}


google.load('visualization', '1', { packages: ['corechart'] });

/**
 * Sector type mapped to a style rule.
 * @type {Object}
 * @const
 */
const LAYER_STYLES = {
  'Residential': {
    'min': 0,
    'max': 10000,
    'colors': [
      '#f4cccc',
      '#ea9999',
      '#e06666',
      '#cc0000',
      '#990000'
    ]
  },
  'Non-Residential': {
    'min': 0,
    'max': 10000,
    'colors': [
      '#d0e0e3',
      '#a2c4c9',
      '#76a5af',
      '#45818e',
      '#134f5c'
    ]
  },
  'Total': {
    'min': 0,
    'max': 20000,
    'colors': [
      '#d9d2e9',
      '#b4a7d6',
      '#8e7cc3',
      '#674ea7',
      '#351c75'
    ]
  }
}

function initialize() {
  const sector = 'Residential';

  const map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(37.4, -119.8),
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    },
  });

  const layer = new google.maps.FusionTablesLayer();
  updateLayerQuery(layer, sector);
  layer.setMap(map);

  createLegend(map, sector);
  styleLayerBySector(layer, sector);
  styleMap(map);
  drawVisualization('Alameda');

  google.maps.event.addListener(layer, 'click', function(e) {
    const county = e.row['County'].value;
    drawVisualization(county);

    const electricity = e.row['2010'].value;
    if (electricity > 5000) {
      e.infoWindowHtml = '<p class="high">High Usage!</p>';
    } else if (electricity > 2500) {
      e.infoWindowHtml = '<p class="medium">Medium Usage</p>';
    } else {
      e.infoWindowHtml = '<p class="low">Low Usage</p>';
    }
  });

  google.maps.event.addDomListener(document.getElementById('sector'),
      'change', function() {
        sector = this.value;
        updateLayerQuery(layer, sector);
        styleLayerBySector(layer, sector);
        updateLegend(sector);
      });

  google.maps.event.addDomListener(document.getElementById('county'),
      'change', function() {
        const county = this.value;
        updateLayerQuery(layer, sector, county);
        drawVisualization(county);
      });
}

function updateLayerQuery(layer, sector, county) {
  const where = "Sector = '" + sector + "'";
  if (county) {
    where += " AND County = '" + county + "'";
  }
  layer.setOptions({
    query: {
      select: 'geometry',
      from: '18fyPg1LvW3KB3N5DE_ub-MKicB0Nx7vkGn9kw4s',
      where: where
    }
  });
}

function createLegend(map, sector) {
  const legendWrapper = document.createElement('div');
  legendWrapper.id = 'legendWrapper';
  legendWrapper.index = 1;
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
      legendWrapper);
  legendContent(legendWrapper, sector);
}

function legendContent(legendWrapper, sector) {
  const legend = document.createElement('div');
  legend.id = 'legend';

  const title = document.createElement('p');
  title.innerHTML = sector + ' Electricity Consumption';
  legend.appendChild(title);

  const layerStyle = LAYER_STYLES[sector];
  const colors = layerStyle.colors;
  const minNum = layerStyle.min;
  const maxNum = layerStyle.max;
  const step = (maxNum - minNum) / colors.length;
  for (let i = 0; i < colors.length; i++) {
    var legendItem = document.createElement('div');

    const color = document.createElement('div');
    color.setAttribute('class', 'color');
    color.style.backgroundColor = colors[i];
    legendItem.appendChild(color);

    const newMin = minNum + step * i;
    const newMax = newMin + step;
    const minMax = document.createElement('span');
    minMax.innerHTML = newMin + ' - ' + newMax;
    legendItem.appendChild(minMax);

    legend.appendChild(legendItem);
  }

  legendWrapper.appendChild(legend);
}

function updateLegend(sector) {
  const legendWrapper = document.getElementById('legendWrapper');
  const legend = document.getElementById('legend');
  legendWrapper.removeChild(legend);
  legendContent(legendWrapper, sector);
}

function styleLayerBySector(layer, sector) {
  const layerStyle = LAYER_STYLES[sector];
  const colors = layerStyle.colors;
  const minNum = layerStyle.min;
  const maxNum = layerStyle.max;
  const step = (maxNum - minNum) / colors.length;

  const styles = new Array();
  for (let i = 0; i < colors.length; i++) {
    const newMin = minNum + step * i;
    styles.push({
      where: generateWhere(newMin, sector),
      polygonOptions: {
        fillColor: colors[i],
        fillOpacity: 1
      }
    });
  }
  layer.set('styles', styles);
}

function generateWhere(minNum, sector) {
  let whereClause = new Array();
  whereClause.push("Sector = '");
  whereClause.push(sector);
  whereClause.push("' AND '2010' >= ");
  whereClause.push(minNum);
  return whereClause.join('');
}

function styleMap(map) {
  const style = [{
    featureType: 'all',
    stylers: [{
      saturation: -99
    }]
  }, {
    featureType: 'poi',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road',
    stylers: [{
      visibility: 'off'
    }]
  }];

  const styledMapType = new google.maps.StyledMapType(style, {
    map: map,
    name: 'Styled Map'
  });
  map.mapTypes.set('map-style', styledMapType);
  map.setMapTypeId('map-style');
}

function drawVisualization(county) {
  google.visualization.drawChart({
    containerId: "visualization",
    dataSourceUrl: "http://www.google.com/fusiontables/gvizdata?tq=",
    query: "SELECT Sector,'2006','2007','2008','2009','2010' " +
        "FROM 18fyPg1LvW3KB3N5DE_ub-MKicB0Nx7vkGn9kw4s WHERE County = '" + county + "'",
    chartType: "ColumnChart",
    options: {
      title: county,
      height: 400,
      width: 400
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
