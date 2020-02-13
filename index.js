const {Matcher} = require("@faden/matcher");
const jsdoc2md = require("jsdoc-to-markdown");
const fs = require("fs");
const path = require("path");

const defaults = {
  extension: ".js",
  outputFolder: "doc",
  jsdoc2md: null
};

const plugin = (opts) => {
  const options = Object.assign({}, defaults, opts);
  const matchExtensions = new Matcher(options.extension, "i", true);
  
  return {
    name: "jsdoc2md",
    
    writeBundle(bundle) {
      const outputFolder = path.join(process.cwd(), options.outputFolder ? options.outputFolder : "");
      if (options.outputFolder && !fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);
      
      Object.getOwnPropertyNames(bundle)
        .filter(file => matchExtensions.test(bundle[file].fileName))
        .forEach(file => {
          const bundleFile = bundle[file].fileName;
          const outputFile = matchExtensions.replace(bundleFile, ".md");
          const markdown = jsdoc2md.renderSync({...options.jsdoc2md, source: bundle[file].code});
          fs.writeFileSync(path.join(outputFolder, outputFile), markdown);
        });
    }
  };
};

module.exports = plugin;
