// Mobile Toggle for the sliders
$('#filterShowHide').click(function(event){
    event.preventDefault();
    $('#sliders').slideToggle('slow');
});

// Initiatise the map
function initMap() {
  // Define the core map
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.5549458, lng: 0},
    zoom: 7,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
    },
  });

  // Define the data layer
  var layer = new google.maps.FusionTablesLayer({
    query: {
      select: '\'col0\'',
      from: 'AIzaSyDX8YCxqMBjzMkdAd2DknQ-prTNvBtz6Ug',
      where: '\'Average House Price\' < 1000000 AND \'Season Ticket Price\' < 25000 AND \'Commute Time\' < 200'
    },
    options: {
      styleId: 2,
      templateId: 2
    }
  });

  layer.setMap(map);

  // Initialise the interactive graph
  google.load('visualization', '1', { packages: ['table'], 'callback': drawTable });

    function drawTable() {
    var query = 'SELECT \'col0\', \'London Terminus\', \'Season Ticket Price\', \'Commute Time\', \'Average House Price\', \'Trains Per Day\', \'Crime Levels\', \'Pubs Per Capita\', \'Approx Population\',  \'Commuter Town Score\' FROM 1lMyWyrSb6GyJWaZS8_oouid-YVs9vGEXs7-pKJud  ORDER BY \'Commuter Town Score\' DESC LIMIT 10' ;
    var queryText = encodeURIComponent(query);
    var gvizQuery = new google.visualization.Query(
        'https://www.google.com/fusiontables/gvizdata?tq=' + queryText);

    var cssClassNames = {headerRow: 'fusionTableRowHeader', tableRow: 'fusionTableTableRows', oddTableRow: 'fusionTableTableRows'};

    gvizQuery.send(function(response) {
      var table = new google.visualization.Table(document.getElementById('visualization'));
      var tableData = response.getDataTable();

      var formatter = new google.visualization.NumberFormat(
        {prefix: '£', negativeColor: 'red', negativeParens: true, fractionDigits: 0});
      formatter.format(tableData, 2);
      formatter.format(tableData, 4);

      var formatter2 = new google.visualization.NumberFormat(
        {suffix: ' mins (fastest)', negativeColor: 'red', negativeParens: true, fractionDigits: 0});
      formatter2.format(tableData, 3);

      var formatter3 = new google.visualization.NumberFormat(
        {suffix: ' out of 10', negativeColor: 'red', negativeParens: true, fractionDigits: 2});
      formatter3.format(tableData, 9);

      table.draw(tableData, {
        showRowNumber: false,
        'cssClassNames': cssClassNames
      });
    });
  }


  // Event listener for the sliders
  google.maps.event.addDomListener(document.getElementById('sliders'),
      'input', function() {
        updateMap(layer);
  });

  // Event listener for the radio buttons
  google.maps.event.addDomListener(document.getElementById('sliders'),
      'change', function() {
        updateMap(layer);
  });

  // Fix to ensure that whenever someone clicks on an infowindow, the map readjusts itself to stop the infowindow from being obstructed
  google.maps.event.addListener(layer, 'click', function(e) {
    if ($(window).width() > 1199) {
     map.panBy(300, 100);
    }
  });
}


function updateMap(layer) {
    (function updateDOMNumbers(){
    var formattedHousePrice = '£' + $('#housePrice').val().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var formattedSeasonTicket = '£' + $('#seasonTicket').val().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var formattedCommuteTime = $('#commuteTime').val() + ' mins';

    if ($('#housePrice').val() == 1000000){
      $('#housePriceNum').text(formattedHousePrice + "+");
    } else {
      $('#housePriceNum').text(formattedHousePrice);
    }

    $('#seasonTicketNum').text(formattedSeasonTicket);
    $('#commuteTimeNum').text(formattedCommuteTime);
  })()


  var sliderObj = {
    housePrice: $('#housePrice').val(),
    seasonTicket: $('#seasonTicket').val(),
    commuteTime: $('#commuteTime').val()
  }


  var stationArray = [];
  var lowCrime = '';
  var pubs = '';
  var airport = '';
  var goodPrimarySchools = '';
  var goodSecondarySchools = '';


   $("input[type=checkbox]").each(function(){
     var instanceName = $(this).attr('name');
     var instanceValue = $(this).attr('value');
     if (instanceName === 'station' && $(this)[0].checked === true && stationArray.length === 0){
      stationArray.push('\'' + instanceValue + '\'');
     } else if(instanceName === 'station' && $(this)[0].checked === true && stationArray.length > 0){
      stationArray.push(' \'' + instanceValue +'\'');
     } else if(instanceName === 'lowcrime' && $(this)[0].checked === true){
      lowCrime = ' AND \'Crimes per 1000 of population\' < 50';
     } else if(instanceName === 'goodprimaryschools' && $(this)[0].checked === true){
      goodPrimarySchools = ' AND \'Good or Outstanding Primary Schools within 3 Miles\' > 5';
     } else if(instanceName === 'goodsecondaryschools' && $(this)[0].checked === true){
      goodSecondarySchools = ' AND \'Good or Outstanding Secondary Schools within 3 Miles\' > 5';
     } else if(instanceName === 'pubs' && $(this)[0].checked === true){
      pubs = ' AND \'Pubs Per Capita\'=\'Higher than Average\'';
     } else if(instanceName === 'airport' && $(this)[0].checked === true){
      airport = ' AND \'Distance from Nearest Airport\' < 10';
     }

  });


	var stationArrayJoined = '';
	if (stationArray.length > 0){
		stationArrayJoined = ' AND \'London Terminus\' IN (' + stationArray.toString() + ')';
	}


	layer.setOptions({
	query: {
	  select: '\'col0\'',
	  from: 'AIzaSyDX8YCxqMBjzMkdAd2DknQ-prTNvBtz6Ug',
	  where: '\'Average House Price\' < ' + sliderObj.housePrice + ' AND \'Season Ticket Price\' < ' + sliderObj.seasonTicket + ' AND \'Commute Time\' < ' + sliderObj.commuteTime + stationArrayJoined + lowCrime + goodPrimarySchools + goodSecondarySchools + pubs + airport
	}
	});

	updateTable(sliderObj, stationArrayJoined, lowCrime, goodPrimarySchools, goodSecondarySchools, pubs, airport);
}


function updateTable(sliderObj, stationArrayJoined, lowCrime, goodPrimarySchools, goodSecondarySchools, pubs, airport){
  google.load('visualization', '1', { packages: ['table'], 'callback': drawTable });

  function noResults(){
   if ($('.google-visualization-table-td').length == 0){
    $('#personalised-results').css('display','none');
   }
  }

  function drawTable() {
    var query = 'SELECT \'col0\', \'London Terminus\', \'Season Ticket Price\', \'Commute Time\', \'Average House Price\', \'Trains Per Day\', \'Crime Levels\', \'Pubs Per Capita\', \'Approx Population\',  \'Commuter Town Score\' FROM 1lMyWyrSb6GyJWaZS8_oouid-YVs9vGEXs7-pKJud WHERE \'Average House Price\' < ' + sliderObj.housePrice + ' AND \'Season Ticket Price\' < ' + sliderObj.seasonTicket + ' AND \'Commute Time\' < ' + sliderObj.commuteTime + stationArrayJoined + lowCrime + goodPrimarySchools + goodSecondarySchools + pubs + airport + ' ORDER BY \'Commuter Town Score\' DESC LIMIT 10' ;

    var queryText = encodeURIComponent(query);
    var gvizQuery = new google.visualization.Query(
        'https://fusiontables.google.com/data?docid=1M9GSREQzIGEKj8xLhd8HCiskhYQU3PhsGTqbCkDm#rows:id=6' + queryText);

    var cssClassNames = {headerRow: 'fusionTableRowHeader', tableRow: 'fusionTableTableRows', oddTableRow: 'fusionTableTableRows'};
    $('#personalised-results').css('display','block');

    gvizQuery.send(function(response) {
      var table = new google.visualization.Table(document.getElementById('visualization'));
      var tableData = response.getDataTable();

      var formatter = new google.visualization.NumberFormat(
        {prefix: '£', negativeColor: 'red', negativeParens: true, fractionDigits: 0});
      formatter.format(tableData, 2);
      formatter.format(tableData, 4);

      var formatter2 = new google.visualization.NumberFormat(
        {suffix: ' mins (fastest)', negativeColor: 'red', negativeParens: true, fractionDigits: 0});
      formatter2.format(tableData, 3);

      var formatter3 = new google.visualization.NumberFormat(
        {suffix: ' out of 10', negativeColor: 'red', negativeParens: true, fractionDigits: 2});
      formatter3.format(tableData, 9);

      table.draw(tableData, {
        showRowNumber: false,
        'cssClassNames': cssClassNames
      });
      noResults();
    });
  }
}


// click functions
$(document).ready(function() {
  $('#filterShowHide').on('click', function() {
    $('#sliders').toggle('slow');
  });

  $('#valuation').on('click', function() {
    location.href = 'https://www.yopa.co.uk/property-valuation';
  });
});
