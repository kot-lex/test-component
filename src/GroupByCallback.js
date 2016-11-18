var PrepareData = require('./PrepareData');

/**
 *
 * @param {Object|string} targetDomNode
 * @param {Object} data
 * @param {Object} options
 * @param {string} options.groupBy
 * @param {function} options.getKeyForGrouping
 * @param {function} options.getLabel
 * @constructor
 */
var GroupByCallback = function(targetDomNode, data, options) {
  PrepareData.apply(this, arguments);
};

GroupByCallback.prototype = Object.create(PrepareData.prototype);

GroupByCallback.prototype.constructor = GroupByCallback;

GroupByCallback.prototype.getKeyForGrouping = function(item, groupBy) {
  if (!item[groupBy]) {
    throw new Error('No grouping property found');
  }

  return this.options.getKeyForGrouping.call(this, item[groupBy]);
};

GroupByCallback.prototype.getLabel = function(item) {
  return this.options.getLabel.call(this, item);
};

module.exports = GroupByCallback;
