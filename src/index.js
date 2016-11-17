var List = require('./GroupedByFirstLetter');
var data = require('./sampleData');

var containerNode = document.querySelector('.list-container');

var list = new List(containerNode, data, 'firstName');