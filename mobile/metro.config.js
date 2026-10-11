// Web sitesiyle paylaşılan veri ve kurallar (../src/data) proje kökünün dışında;
// Metro'nun bu klasörü görmesi için watchFolders'a eklenir.
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
config.watchFolders = [path.resolve(__dirname, '../src/data')]

module.exports = config
