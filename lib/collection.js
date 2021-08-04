/**
 * Push items and count them
 */
"use strict";

/**
 * @class
 */
function Collection() {
  this.items = {};
}

Collection.prototype = {
  /**
   * Pushes a given item to the collection and counts each occurrence
   *
   * @param {string} item
   * @return {void}
   */
  push: function (item) {
    if (typeof this.items[item] === "undefined") {
      this.items[item] = {
        cnt: 1,
      };
    } else {
      this.items[item].cnt++;
    }
  },

  /**
   * Sorts collected items in desending order by their occurrences
   *
   * @return {Collection}
   */
  sort: function () {
    var newItems = {},
      sortedKeys;

    // sort in descending order (by cnt)
    sortedKeys = Object.keys(this.items).sort(
      function (a, b) {
        return this.items[b].cnt - this.items[a].cnt;
      }.bind(this)
    );

    // build new items dictionary
    sortedKeys.forEach(function (key) {
      newItems[key] = this.items[key];
    }, this);

    this.items = newItems;
    return this;
  },

  /**
   * Runs provided callback for each item in the collection.
   *
   * Item and the count is provided to the callback.
   *
   * @param {forEachCallback} callback
   *
   */
  forEach: function (callback) {
    Object.keys(this.items).forEach(function (key) {
      callback(key, this.items[key].cnt);
    }, this);
  },
};

/**
 * @callback forEachCallback
 * @param {string} item
 * @param {number} count
 */

module.exports = Collection;
