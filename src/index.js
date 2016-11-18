var GroupByCallback = require('./GroupByCallback');
var data = require('./sampleData');

new GroupByCallback('.list_type_first-name', data.names, {
  groupBy: 'firstName',
  getKeyForGrouping: function(label) {
    return label.substring(0, 2);
  },
  getLabel: function(item) {
    return item.firstName + ' ' + item.lastName;
  }
  });

new GroupByCallback('.list_type_last-name', data.names, {
  groupBy: 'lastName',
  getKeyForGrouping: function(label) {
    return label.substring(0, 1);
  },
  getLabel: function(item) {
    return item.firstName + ' ' + item.lastName;
  }
  });

new GroupByCallback('.list_type_best-albums', data.albums, {
  groupBy: 'year',
  getKeyForGrouping: function(label) {
    return label;
  },
  getLabel: function(item) {
    return item.name + ' – ' + item.artist;
  }
  });
