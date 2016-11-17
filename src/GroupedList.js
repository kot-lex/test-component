var GroupedListView = require('./GroupedListView');

/**
 *
 * @param {string|Object} targetDomNode dom node or selector
 * @param {Object} groupedListData
 * @constructor
 */
var GroupedList = function(targetDomNode, groupedListData) {

  if (typeof targetDomNode === 'string') {
    this.element = document.querySelector(targetDomNode);
  } else {
    this.element = targetDomNode;
  }

  this.view = new GroupedListView(this.element);

  this.data = groupedListData;

  this.view.render(this.data);
  this.windowResizeHandler();

  this.scrollableElement = this.view.getScrollableElement();
  this.bindEvents();
};

GroupedList.prototype.bindEvents = function() {
  this.scrollableElement.addEventListener('scroll', this.scrollHandler.bind(this));
  window.addEventListener('resize', this.windowResizeHandler.bind(this));
};

GroupedList.prototype.scrollHandler = function(event) {
    this.scroll = this.scrollableElement.scrollTop;
    this.groupBounds.forEach(function(item, groupIndex) {
      var itemOriginalTop = item[0];
      var itemOriginalBottom = item[1];
      var itemTopPosition = itemOriginalTop - this.scroll;
      var itemBottomPosition = itemOriginalBottom - this.scroll;

      if (itemTopPosition < 0 && itemBottomPosition > 0) {

        var labelTopOffset = (this.labelDimensions.height - itemBottomPosition) * -1;
        var labelTopTranslateOffset = 0;

        if (labelTopOffset < 0
          && this.labelDimensions.height * -1 <= labelTopOffset
        ) {
          labelTopTranslateOffset = labelTopOffset;
        }

        this.view.setLockedStyles(groupIndex, true, labelTopTranslateOffset);

      } else {
        this.view.setLockedStyles(groupIndex);
      }

    }.bind(this));
};

GroupedList.prototype.windowResizeHandler = function() {
  this.cacheGroupsBounds();
  this.cacheLabelSize();
  this.view.setLabelsWidth(this.labelDimensions.width);
};

// Todo: Do not assume that all labels will have one height
GroupedList.prototype.cacheLabelSize = function() {
  this.labelDimensions = {
    width:  this.groups[0].offsetWidth,
    height:  this.groupsLabels[0].offsetHeight
  };
};

GroupedList.prototype.cacheGroupsBounds = function() {

  this.groups = this.view.getGroups();
  this.groupsLabels = this.view.getGroupsLabels();

  this.groupBounds = this.groups.map(function(group) {
    return [group.offsetTop, group.offsetTop + group.offsetHeight];
  });
};

module.exports = GroupedList;
