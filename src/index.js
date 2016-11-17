var GroupedByFirstLetter = require('./GroupedByFirstLetter');
var data = require('./sampleData');

new GroupedByFirstLetter('.list_type_first-name', data.names, 'firstName');

new GroupedByFirstLetter('.list_type_last-name', data.names, 'lastName');