function initMap(){
  function e(){
    var e="SELECT 'col0', 'London Terminus', 'Season Ticket Price', 'Commute Time', 'Average House Price', 'Trains Per Day', 'Crime Levels', 'Pubs Per Capita', 'Approx Population',  'Commuter Town Score' FROM 1lMyWyrSb6GyJWaZS8_oouid-YVs9vGEXs7-pKJud  ORDER BY 'Commuter Town Score' DESC LIMIT 10",o=encodeURIComponent(e),
    a=new google.visualization.Query("https://www.google.com/fusiontables/gvizdata?tq="+o),
    t={headerRow:"fusionTableRowHeader",tableRow:"fusionTableTableRows",oddTableRow:"fusionTableTableRows"};
    a.send(function(e){
      var o=new google.visualization.Table(document.getElementById("visualization")),
      a=e.getDataTable(),
      i=new google.visualization.NumberFormat({prefix:"£",negativeColor:"red",negativeParens:!0,fractionDigits:0});
      i.format(a,2),i.format(a,4);
      var s=new google.visualization.NumberFormat({suffix:" mins (fastest)",negativeColor:"red",negativeParens:!0,fractionDigits:0});
      s.format(a,3);
      var n=new google.visualization.NumberFormat({suffix:" out of 10",negativeColor:"red",negativeParens:!0,fractionDigits:2});
      n.format(a,9),o.draw(a,{showRowNumber:!1,cssClassNames:t})})}
      var o=new google.maps.Map(document.getElementById("map"),{center:{lat:51.5549458,lng:0},zoom:7,zoomControl:!0,zoomControlOptions:{position:google.maps.ControlPosition.LEFT_CENTER}}),
      a=new google.maps.FusionTablesLayer({query:{select:"'col0'",from:"1lMyWyrSb6GyJWaZS8_oouid-YVs9vGEXs7-pKJud",where:"'Average House Price' < 1000000 AND 'Season Ticket Price' < 25000 AND 'Commute Time' < 200"},
      options:{styleId:2,templateId:2}});
      a.setMap(o),google.load("visualization","1",{packages:["table"],callback:e}),
      google.maps.event.addDomListener(document.getElementById("sliders"),"input",
      function(){
        updateMap(a)}),
        google.maps.event.addDomListener(document.getElementById("sliders"),"change",
        function(){
          updateMap(a)}),
          google.maps.event.addListener(a,"click",function(e){
            $(window).width()>1199&&o.panBy(300,100)})}function updateMap(e){
              !function(){
                var e="£"+$("#housePrice").val().toString().replace(/\B(?=(\d{3})+(?!\d))/g,","),o="£"+$("#seasonTicket").val().toString().replace(/\B(?=(\d{3})+(?!\d))/g,","),
                a=$("#commuteTime").val()+" mins";1e6==$("#housePrice").val()?$("#housePriceNum").text(e+"+"):$("#housePriceNum").text(e),$("#seasonTicketNum").text(o),$("#commuteTimeNum").text(a)}();
                var o={housePrice:$("#housePrice").val(),seasonTicket:$("#seasonTicket").val(),commuteTime:$("#commuteTime").val()},a=[],t="",i="",s="",n="",r="";$("input[type=checkbox]").each(
                  function(){
                    var e=$(this).attr("name"),o=$(this).attr("value");"station"===e&&$(this)[0].checked===!0&&0===a.length?a.push("'"+o+"'"):"station"===e&&$(this)[0].checked===!0&&a.length>0?a.push(" '"+o+"'"):"lowcrime"===e&&$(this)[0].checked===!0?t=" AND 'Crimes per 1000 of population' < 50":"goodprimaryschools"===e&&$(this)[0].checked===!0?n=" AND 'Good or Outstanding Primary Schools within 3 Miles' > 5":"goodsecondaryschools"===e&&$(this)[0].checked===!0?r=" AND 'Good or Outstanding Secondary Schools within 3 Miles' > 5":"pubs"===e&&$(this)[0].checked===!0?i=" AND 'Pubs Per Capita'='Higher than Average'":"airport"===e&&$(this)[0].checked===!0&&(s=" AND 'Distance from Nearest Airport' < 10")});
                    var l="";a.length>0&&(l=" AND 'London Terminus' IN ("+a.toString()+")"),e.setOptions({query:{select:"'col0'",from:"1lMyWyrSb6GyJWaZS8_oouid-YVs9vGEXs7-pKJud",where:"'Average House Price' < "+o.housePrice+" AND 'Season Ticket Price' < "+o.seasonTicket+" AND 'Commute Time' < "+o.commuteTime+l+t+n+r+i+s}}),
                    updateTable(o,l,t,n,r,i,s)}function updateTable(e,o,a,t,i,s,n){
                      function r(){
                        0==$(".google-visualization-table-td").length&&$("#personalised-results").css("display","none")}
                        function l(){
                          var l="SELECT 'col0', 'London Terminus', 'Season Ticket Price', 'Commute Time', 'Average House Price', 'Trains Per Day', 'Crime Levels', 'Pubs Per Capita', 'Approx Population',  'Commuter Town Score' FROM 1lMyWyrSb6GyJWaZS8_oouid-YVs9vGEXs7-pKJud WHERE 'Average House Price' < "+e.housePrice+" AND 'Season Ticket Price' < "+e.seasonTicket+" AND 'Commute Time' < "+e.commuteTime+o+a+t+i+s+n+" ORDER BY 'Commuter Town Score' DESC LIMIT 10",u=encodeURIComponent(l),c=new google.visualization.Query("https://www.google.com/fusiontables/gvizdata?tq="+u),m={headerRow:"fusionTableRowHeader",tableRow:"fusionTableTableRows",oddTableRow:"fusionTableTableRows"};$("#personalised-results").css("display","block"),
                          c.send(function(e){
                            var o=new google.visualization.Table(document.getElementById("visualization")),a=e.getDataTable(),
                            t=new google.visualization.NumberFormat({prefix:"£",negativeColor:"red",negativeParens:!0,fractionDigits:0});t.format(a,2),t.format(a,4);var i=new google.visualization.NumberFormat({suffix:" mins (fastest)",negativeColor:"red",negativeParens:!0,fractionDigits:0});i.format(a,3);
                            var s=new google.visualization.NumberFormat({suffix:" out of 10",negativeColor:"red",negativeParens:!0,fractionDigits:2});s.format(a,9),o.draw(a,{showRowNumber:!1,cssClassNames:m}),r()})}google.load("visualization","1",{packages:["table"],
                            callback:l})}$("#filterShowHide").click(function(e){
                              e.preventDefault(),$("#sliders").slideToggle("slow")});
