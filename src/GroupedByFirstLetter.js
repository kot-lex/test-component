var PrepareData = require('./PrepareData');

var GroupedByFirstLetter = function(targetDomNode, data, groupBy, sortBy) {
  PrepareData.apply(this, arguments);
};

GroupedByFirstLetter.prototype = Object.create(PrepareData.prototype);

GroupedByFirstLetter.prototype.constructor = GroupedByFirstLetter;

GroupedByFirstLetter.prototype.getKeyForGrouping = function(item, groupBy) {
  if (!item[groupBy]) {
    throw new Error('No grouping property found');
  }

  return item[groupBy].substring(0, 1);
};

GroupedByFirstLetter.prototype.getLabel = function(item) {
  return item.firstName + ' ' + item.lastName;
};

module.exports = GroupedByFirstLetter;
