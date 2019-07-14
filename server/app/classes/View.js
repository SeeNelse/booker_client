const js2xmlparser = require("js2xmlparser");

module.exports = class View {

  getData(queryResult, format) {
    switch(format) {
      case '.xml':
        return js2xmlparser.parse("item", queryResult);
    
      case '.html':
        return this.getTxt(queryResult);
      
      case '.txt':
        return this.getTxt(queryResult);
    
      case '.json':
        return queryResult;

      case undefined:
        return queryResult;
    
      default:
        return false;
    }
  }

  getHtml(queryResult) {
    let htmlRequest = '<div>'
    queryResult.map(queryItem => {
      htmlRequest += '<ul>';
      for (let elementItem in queryItem) {
        htmlRequest += `<li>${elementItem}: ${queryItem[elementItem]}</li>`;
      }
      htmlRequest += '</ul>';
    });
    htmlRequest += '</div>';
    return htmlRequest;
  }


  getTxt(queryResult) {
    let txtRequest = '[';
    queryResult.map(queryItem => {
      txtRequest += '[';
      for (let elementItem in queryItem) {
        txtRequest += `[${elementItem}: ${queryItem[elementItem]}],`;
      }
      txtRequest += '],';
    });
    txtRequest += ']';
    return txtRequest;
  }

}