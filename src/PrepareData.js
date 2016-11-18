var GroupedList = require('./GroupedList');

var PrepareData = function(targetDomNode, data, options) {
  this.options = options || {};
  sortBy = this.options.sortBy || this.options.groupBy;

  // We need to sort data prior to grouping
  var sortedData = this.sort(data, sortBy);

  var groupedData = this.groupData(sortedData, this.options.groupBy);

  GroupedList.call(this, targetDomNode, groupedData);
};

PrepareData.prototype = Object.create(GroupedList.prototype);

PrepareData.prototype.constructor = PrepareData;

PrepareData.prototype.sort = function(data, sortBy) {
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


PrepareData.prototype.groupData = function(data, groupBy) {
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

PrepareData.prototype.getKeyForGrouping = function() {
  console.warn('To be overridden');
};

PrepareData.prototype.getLabel = function() {
  console.warn('To be overridden');
};

module.exports = PrepareData;
