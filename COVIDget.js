// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: info-circle;
function createWidget(district, newInfections) {
  let widget = new ListWidget()
  
  let title = widget.addText(district)
  title.font = Font.boldSystemFont(16)
  title.minimumScaleFactor = 0.6
  title.lineLimit = 2
  
  let subTitle = widget.addText("Neuinfektionen")
  subTitle.font = Font.regularSystemFont(15)
  subTitle.textColor = Color.gray()
  
  widget.addSpacer()
  
  let infections = widget.addText(Math.round(newInfections).toString())
  infections.font = Font.regularSystemFont(40)
  infections.centerAlignText()
  if (newInfections > 50) {
    infections.textColor = Color.red()
  } else if (newInfections > 0) {
    infections.textColor = Color.orange()
  }
  
  widget.addSpacer()
  
  let footer = widget.addText("7 Tage / 100.000 Einw.")
  footer.minimumScaleFactor = 0.5
  footer.lineLimit = 1
  footer.textColor = Color.gray()
  
  return widget
}

async function getData(objectID) {
  let req = new Request(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=OBJECTID%3D${objectID}&outFields=OBJECTID,GEN,cases7_per_100k&returnGeometry=false&outSR=4326&f=json`)
  let response = await req.loadJSON()
  return response.features[0].attributes
}

if (config.runsInApp) {
  // Demo for in-app testing
  let data = await getData(125)
  let widget = createWidget(data.GEN, data.cases7_per_100k)
  widget.presentSmall()
} else {
  // The real deal
  let objectID = args.widgetParameter
  let data = await getData(objectID)
  let widget = createWidget(data.GEN, data.cases7_per_100k)
  Script.setWidget(widget)
}
