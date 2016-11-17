var GroupedListView = function(domElement) {
  this.element = domElement;

  this.classes = {
    inner: 'list__inner',
    container: 'list__container',
    group: 'list-group',
    groupLocked: 'list-group_locked',
    groupLabel: 'list-group__label',
    groupItems: 'list-group__items',
    groupItem: 'list-group__item'
  };
};


GroupedListView.prototype.render = function(data) {
  var groupNodes = this.renderGroups(data);
  var rootNode = document.createElement('div');
  var listNode = document.createElement('ul');
  rootNode.classList.add(this.classes.inner);
  listNode.classList.add(this.classes.container);
  groupNodes.forEach(function(element) {
    listNode.appendChild(element);
  });

  rootNode.appendChild(listNode);
  this.element.appendChild(rootNode);
};

GroupedListView.prototype.renderGroups = function(data) {
  var ctx = this;
  return data.map(function(group) {
    var groupNode = document.createElement('li');
    var groupLabelNode = document.createElement('div');
    var groupNodeText = document.createTextNode(group.label);

    groupLabelNode.appendChild(groupNodeText);
    groupNode.appendChild(groupLabelNode);

    groupNode.classList.add(ctx.classes.group);
    groupLabelNode.classList.add(ctx.classes.groupLabel);

    var innerNodesList = document.createElement('ul');
    innerNodesList.classList.add(ctx.classes.groupItems);

    var innerNodes = group.items.map(ctx.renderGroupItem.bind(ctx));
    innerNodes.forEach(function(node) {
      innerNodesList.appendChild(node);
    });
    groupNode.appendChild(innerNodesList);

    return groupNode;
  });
};

GroupedListView.prototype.getGroups = function() {
  if (this.groups) {
    return this.groups;
  }

  this.groups = this.element.querySelectorAll('.' + this.classes.group);
  this.groups = Array.prototype.slice.call(this.groups);
  return this.groups;
};

GroupedListView.prototype.getGroupsLabels = function() {
  if (this.groupLabels) {
    return this.groupLabels;
  }

  this.groupLabels = this.element.querySelectorAll('.' + this.classes.groupLabel);
  this.groupLabels =  Array.prototype.slice.call(this.groupLabels);
  return this.groupLabels;
};

GroupedListView.prototype.getScrollableElement = function() {
  return this.element.querySelector('.' + this.classes.inner);
};

GroupedListView.prototype.renderGroupItem = function(item) {
  var node = document.createElement('li');
  node.classList.add(this.classes.groupItem);
  node.appendChild(document.createTextNode(item.label));
  return node;
};

// Todo: cache state. DOM calls on each scroll event is a bad practice.
GroupedListView.prototype.setLockedStyles = function(index, isLocked, offset) {
  isLocked = isLocked || false;
  offset = offset || 0;

  if (!isLocked) {
    this.groups[index].classList.remove(this.classes.groupLocked);
  } else {
    this.groups[index].classList.add(this.classes.groupLocked);
  }

  this.groupLabels[index].style.transform = 'translate3d(0, ' + offset + 'px, 0)';
};

GroupedListView.prototype.setLabelsWidth = function(labelWidth) {
  this.groupLabels.forEach(function(labelNode) {
    labelNode.style.width = labelWidth + 'px';
  });
};

module.exports = GroupedListView;