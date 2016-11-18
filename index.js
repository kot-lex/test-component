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

	var GroupByCallback = __webpack_require__(7);
	var data = __webpack_require__(4);

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


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var GroupedListView = __webpack_require__(3);

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


/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports) {

	var names = [
	  {
	    firstName: 'Иван',
	    lastName: 'Алексеев'
	  },
	  {
	    firstName: 'Алексей',
	    lastName: 'Аверин'
	  },
	  {
	    firstName: 'Лев',
	    lastName: 'Кротов'
	  },
	  {
	    firstName: 'Иван',
	    lastName: 'Алексеев'
	  },
	  {
	    firstName: 'Алексей',
	    lastName: 'Гражданин'
	  },
	  {
	    firstName: 'Анна',
	    lastName: 'Горлова'
	  },
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
	    firstName: 'Олег',
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
	  },
	  {
	    firstName: 'Юрий',
	    lastName: 'Кашин'
	  },
	  {
	    firstName: 'Юрий',
	    lastName: 'Чернов'
	  },
	  {
	    firstName: 'Юрий',
	    lastName: 'Чернов'
	  },
	  {
	    firstName: 'Юрий',
	    lastName: 'Чернов'
	  },
	  {
	    firstName: 'Юрий',
	    lastName: 'Чернов'
	  },
	  {
	    firstName: 'Юлий',
	    lastName: 'Чернов'
	  },
	  {
	    firstName: 'Юрий',
	    lastName: 'Чернов'
	  },
	  {
	    firstName: 'Юрий',
	    lastName: 'Чернов'
	  }
	];

	var albums = [
	  {
	    name: "Revolver",
	    artist: "The Beatles",
	    year: 1966
	  },
	  {
	    name: "Abbey Road",
	    artist: "The Beatles",
	    year: 1969
	  },
	  {
	    name: "Sgt. Pepper's Lonely Hearts Club Band",
	    artist: "The Beatles",
	    year: 1967
	  },
	  {
	    name: "The Velvet Underground And Nico",
	    artist: "The Velvet Underground And Nico",
	    year: 1967
	  },
	  {
	    name: "The Beatles (The White Album)",
	    artist: "The Beatles",
	    year: 1968
	  },
	  {
	    name: "Pet Sounds",
	    artist: "The Beach Boys",
	    year: 1966
	  },
	  {
	    name: "Highway 61 Revisited",
	    artist: "Bob Dylan",
	    year: 1965
	  },
	  {
	    name: "Rubber Soul",
	    artist: "The Beatles",
	    year: 1965
	  },
	  {
	    name: "The Doors",
	    artist: "The Doors",
	    year: 1967
	  },
	  {
	    name: "Blonde On Blonde",
	    artist: "Bob Dylan",
	    year: 1966
	  },
	  {
	    name: "Are You Experienced",
	    artist: "The Jimi Hendrix Experience",
	    year: 1967
	  },
	  {
	    name: "Led Zeppelin II",
	    artist: "Led Zeppelin",
	    year: 1969
	  },
	  {
	    name: "In The Court Of The Crimson King",
	    artist: "King Crimson",
	    year: 1969
	  },
	  {
	    name: "Let It Bleed",
	    artist: "The Rolling Stones",
	    year: 1969
	  },
	  {
	    name: "Astral Weeks",
	    artist: "Van Morrison",
	    year: 1968
	  },
	  {
	    name: "Led Zeppelin",
	    artist: "Led Zeppelin",
	    year: 1969
	  },
	  {
	    name: "Led Zeppelin",
	    artist: "Love",
	    year: 1967
	  },

	];



	module.exports = {
	  names: names,
	  albums: albums
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var GroupedList = __webpack_require__(2);

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


/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var PrepareData = __webpack_require__(5);

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


/***/ }
/******/ ]);