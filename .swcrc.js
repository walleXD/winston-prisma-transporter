const MODULE_TYPE = process.env.MODULE_TYPE

/** @type import('@swc/core').Config */
const config = {
  "module": {
    "type": "es6"
  },
  "jsc": {
    "externalHelpers": true,
    "parser": {
      "syntax": "typescript",
      "tsx": false,
      "decorators": true,
      "dynamicImport": true,
      "decoratorsBeforeExport": true,
      "exportDefaultFrom": true,
      "importMeta": true
    },
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    },
    "target": "es2020",
  }
}

module.exports = config
