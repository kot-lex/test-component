var GroupedList = function(targetDomNode, groupedListData) {
  this.classes = {
    container: 'list__container',
    group: 'list-group',
    groupLabel: 'list-group__label',
    groupItems: 'list-group__items',
    groupItem: 'list-group__item'
  };
  this.element = targetDomNode;
  this.data = groupedListData;
  this.render();
};

GroupedList.prototype.render = function() {
  var groupNodes = this.renderGroups(this.data);
  var rootNode = document.createElement('ul');
  rootNode.classList.add(this.classes.container);
  groupNodes.forEach(function(element) {
    rootNode.appendChild(element);
  });

  this.element.appendChild(rootNode);
};

GroupedList.prototype.renderGroups = function(data) {
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

GroupedList.prototype.renderGroupItem = function(item) {
  var node = document.createElement('li');
  node.classList.add(this.classes.groupItem);
  node.appendChild(document.createTextNode(item.label));
  return node;
};

module.exports = GroupedList;
