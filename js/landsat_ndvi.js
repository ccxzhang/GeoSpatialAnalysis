// Obtain DC's geometry
var dc = ee.FeatureCollection('TIGER/2018/States')
                .filterMetadata('NAME', 'equals', 'District of Columbia')
                .geometry();
print(dc);

var dc_ls = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
           .filterDate('2010-01-01', '2021-12-31')
           .filterBounds(dc)
           
print(dc_ls);

// Define a function to create a nvdi band 
var addNVDIBand = function(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands([ndvi]);
};

var dcNDVI = dc_ls.map(addNVDIBand).select('NDVI');
print(dcNDVI.getInfo());

// Create a chart over time
var chart =
    ui.Chart.image
        .series({
          imageCollection: dcNDVI,
          region: dc,
          reducer: ee.Reducer.mean(),
          scale: 30,
          xProperty: 'system:time_start'
        })
        .setSeriesNames(['NDVI'])
        .setOptions({
          title: 'NDVI over time',
          hAxis: {title: 'Year', titleTextStyle: {italic: false, bold: true}},
          vAxis: {
            title: 'NDVI',
            titleTextStyle: {italic: false, bold: true}
          },
          lineWidth: 2,
          colors: ['e37d05', '1d6b99'],
          curveType: 'function'
        });
print(chart);
