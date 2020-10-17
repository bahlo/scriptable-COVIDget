const Cache = require('@11ty/eleventy-cache-assets');

module.exports = async function() {
    let data = await Cache("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=OBJECTID,GEN,BEZ&returnGeometry=false&outSR=4326&f=json", {
        duration: '1h',
        type: 'json',
    })
    let districts = data.features.map(feature => {
        return feature.attributes
    })
    districts.sort(function (a, b) {
        if (a.GEN < b.GEN) {
            return -1
        } 
        if (a.GEN > b.GEN) {
            return 1
        }
        return 0
    })
    return districts
}