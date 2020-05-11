
const fs = require('fs')


const wqxRequiredIf = async(file, source, required = []) => {
  const object = require(`wqx/required/${file}.json`)

  fs.writeFileSync(__dirname + `/../src/logic/${file}.json`, JSON.stringify(object, null, 2), {encoding: 'utf8'})

}

//wqxRequiredIf('ActivityType-AnalyticalMethod','CharacteristicName',['AnalyticalMethodtype'])
//wqxRequiredIf('ActivityType-MonitoringLocation','CharacteristicName',['MonitoringLocation'])
//wqxRequiredIf('Characteristic-AnalyticalMethod','CharacteristicName',['ResultAnalyticalMethodID','ResultAnalyticalMethodContext'])
wqxRequiredIf('CharacteristicName-MethodSpeciation')
wqxRequiredIf('CharacteristicName-ResultSampleFraction')


