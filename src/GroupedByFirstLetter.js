var GroupedList = require('./GroupedList');

var GroupedByFirstLetter = function(targetDomNode, data, groupBy, sortBy) {
  sortBy = sortBy || groupBy;

  // We need to sort data prior to groping
  var sortedData = this.sort(data, sortBy);

  var groupedData = this.groupData(sortedData, groupBy);

  GroupedList.call(this, targetDomNode, groupedData);
};

GroupedByFirstLetter.prototype = Object.create(GroupedList.prototype);

GroupedByFirstLetter.prototype.constructor = GroupedByFirstLetter;

GroupedByFirstLetter.prototype.sort = function(data, sortBy) {
  return data.sort(function(a, b) {
    if (a[sortBy] < b[sortBy]) {
      return -1;
    }

    if (a[sortBy] > b[sortBy]) {
      return 1;
    }

    return 0;
  });
};


GroupedByFirstLetter.prototype.groupData = function(data, groupBy) {
  var ctx = this;
  var groupedData = [];
  var currentGroup;
  var currentGroupingKey = null;

  data.forEach(function(listItem, index) {
    var groupingKey = ctx.getKeyForGrouping(listItem, groupBy);
    var newItem = listItem;
    newItem.label = ctx.getLabel(listItem);

    if (currentGroupingKey != groupingKey) {
      currentGroupingKey = groupingKey;

      if (currentGroup) {
        groupedData.push(currentGroup);
      }

      currentGroup = {
        label: currentGroupingKey,
        items: []
      };
    }

    currentGroup.items.push(newItem);

    // Pushing group in case of last array iteration
    if (index === data.length - 1) {
      groupedData.push(currentGroup);
    }
  });

  return groupedData;
};

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
