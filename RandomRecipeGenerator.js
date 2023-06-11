
// ============================
// Allow for a cached result
// ============================
var csvRows = [];

function buildTable(csvRows) {
  var $table = $("<table cellpadding=\"2\" cellspacing=\"0\"></table>");

  $table = csvRows.reduce(function ($table, csvRow) {
    var csvRowCells = csvRow.split(",");

    // Base table row
    var $tr = $("<tr>/tr>");

    // For each item in the array, append a new column to the html table
    $tr = csvRowCells.reduce(function ($tr, csvRowCell) {
      var lastIndex = csvRowCells.indexOf(csvRowCells[csvRowCells.length-1]);
      var tempStr = csvRowCells[lastIndex];
      var ingredientCount = parseInt(tempStr.replace('\r',''));
      if (csvRowCells.indexOf(csvRowCell) == 0) {
        return $tr.append($("<b><tr>/</tr></b>").text(csvRowCell));
      }
      if (csvRowCells.indexOf(csvRowCell) == 1){
        $tr.append($("<br><br><b><tr>Ingredients:</tr></br></b></br>"));
        $tr.append($("<tr>/</tr>").text(csvRowCell));
        return $tr;
      } else if (csvRowCells.indexOf(csvRowCell) == ingredientCount+1){
        $tr.append($("<br><br><b><tr>Directions:</tr></br></b></br>"));
        $tr.append($("<tr>/</tr>").text(csvRowCell));
        return $tr;
      } 
      else {
        return $tr.append($("<tr>/</tr>").text(csvRowCell));
      }
    }, $tr);

    return $table.append($tr);
  }, $table);

  return $table;
}

// Randomly select one row from the .csv as an array and build a table with it.
function fillContainerWithTable(csvRows, $container) {
  var randomRow = [csvRows[Math.floor(Math.random() * csvRows.length)]];
  var $table = buildTable(randomRow);
  $container.append($table);
}

function generator() {
  // link to the .csv in our bucket
  var url = "https://akramvocs383bucket.s3.amazonaws.com/Recipes.csv";
  var $container = $("#recipe");

  $container.empty();

  // If we have the data locally already just use it.
  if (csvRows.length !== 0) {
    console.log("using local data...");
    fillContainerWithTable(csvRows, $container);
    return;
  }

  console.log("fetching remote data...");

  $.get(url, function (data) {
    csvRows = data.split("\n");
    fillContainerWithTable(csvRows, $container);
  });
}
// ============================