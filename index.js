/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var List = __webpack_require__(3);
	var data = __webpack_require__(2);

	var containerNode = document.querySelector('.list');

	var list = new List(containerNode, data, 'firstName');

/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = [
	  {
	    firstName: 'Иван',
	    lastName: 'Алексеев'
	  },
	  {
	    firstName: 'Алексей',
	    lastName: 'Аверин'
	  },
	  {
	    firstName: 'Анна',
	    lastName: 'Горлова'
	  },
	  {
	    firstName: 'Юрий',
	    lastName: 'Чернов'
	  }
	];


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var GroupedList = __webpack_require__(1);

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


/***/ }
/******/ ]);