var Datastore, Storage, _, dbsDir, mkdirp, path, q;

Datastore = require('nedb');

_ = require('lodash');

mkdirp = require('mkdirp');

path = require('path');

q = require('q');

dbsDir = '/data/alarm-panel/dbs';

mkdirp.sync(dbsDir);

module.exports = Storage = (function() {
  function Storage(_collectionName, _maxRecords) {
    this._collectionName = _collectionName;
    this._maxRecords = _maxRecords != null ? _maxRecords : null;
    this._nextId = 1;
    this._collection = null;
  }

  Storage.prototype.start = function() {
    this._collection = new Datastore({
      filename: path.join(dbsDir, this._collectionName),
      autoload: true
    });
    return this._fetchId().then((function(_this) {
      return function() {
        return _this._ensureIndex();
      };
    })(this)).then((function(_this) {
      return function() {
        return _this._collection.persistence.setAutocompactionInterval(3600 * 1000);
      };
    })(this));
  };

  Storage.prototype.stop = function() {
    var ref;
    return (ref = this._collection) != null ? ref.persistence.stopAutocompaction() : void 0;
  };

  Storage.prototype.count = function(filter) {
    var d;
    if (filter == null) {
      filter = {};
    }
    d = q.defer();
    this._collection.count(filter, function(err, result) {
      if (err) {
        return d.reject(err);
      } else {
        return d.resolve(result);
      }
    });
    return d.promise;
  };

  Storage.prototype.find = function(filter, options) {
    var cursor, d;
    if (filter == null) {
      filter = {};
    }
    if (options == null) {
      options = {};
    }
    d = q.defer();
    cursor = this._collection.find(filter);
    if (options.sort) {
      cursor = cursor.sort(options.sort);
    }
    if (options.skip) {
      cursor = cursor.skip(options.skip);
    }
    if (options.limit) {
      cursor = cursor.limit(options.limit);
    }
    cursor.exec(function(err, result) {
      if (err) {
        return d.reject(err);
      } else {
        return d.resolve(_.map(result, function(doc) {
          return _.omit(doc, ['_id']);
        }));
      }
    });
    return d.promise;
  };

  Storage.prototype.findOne = function(filter) {
    var d;
    d = q.defer();
    this._collection.findOne(filter, function(err, result) {
      if (err) {
        return d.reject(err);
      } else {
        if (result != null) {
          return d.resolve(_.omit(result, ['_id']));
        } else {
          return d.resolve(null);
        }
      }
    });
    return d.promise;
  };

  Storage.prototype.insert = function(data) {
    var d, doc;
    d = q.defer();
    doc = _.cloneDeep(data);
    doc.id = this._nextId;
    this._nextId += 1;
    this._collection.insert(doc, (function(_this) {
      return function(err, inserted) {
        if (err) {
          return d.reject(err);
        } else {
          d.resolve(_.omit(inserted, ['_id']));
          if (_this._maxRecords != null) {
            return process.nextTick(_this._validateMaxRecords.bind(_this));
          }
        }
      };
    })(this));
    return d.promise;
  };

  Storage.prototype.remove = function(filter) {
    var d;
    d = q.defer();
    this._collection.remove(filter, {
      multi: true
    }, function(err, removed) {
      if (err) {
        return d.reject(err);
      } else {
        return d.resolve(removed);
      }
    });
    return d.promise;
  };

  Storage.prototype.patch = function(filter, patch) {
    var d;
    d = q.defer();
    this._collection.update(filter, {
      $set: patch
    }, {}, function(err, updated) {
      if (err) {
        return d.reject(err);
      } else {
        return d.resolve(updated);
      }
    });
    return d.promise;
  };

  Storage.prototype.replace = function(filter, newObject) {
    var d;
    d = q.defer();
    this._collection.update(filter, newObject, {}, function(err, updated) {
      if (err) {
        return d.reject(err);
      } else {
        return d.resolve(updated);
      }
    });
    return d.promise;
  };

  Storage.prototype._fetchId = function() {
    var d;
    d = q.defer();
    this._collection.find({}).sort({
      id: -1
    }).exec((function(_this) {
      return function(err, docs) {
        if (err) {
          return d.reject(err);
        } else {
          if (docs.length) {
            _this._nextId = 1 + docs[0].id;
          }
          return d.resolve(null);
        }
      };
    })(this));
    return d.promise;
  };

  Storage.prototype._ensureIndex = function() {
    var d;
    d = q.defer();
    this._collection.ensureIndex({
      fieldName: 'id',
      unique: true
    }, function(err) {
      if (err) {
        return d.reject(err);
      } else {
        return d.resolve(null);
      }
    });
    return d.promise;
  };

  Storage.prototype._validateMaxRecords = function() {
    return this.remove({
      id: {
        $lt: this._nextId - this._maxRecords
      }
    })["catch"]((function(_this) {
      return function(reason) {
        return console.log("!! db " + _this._collectionName + " validation error", JSON.stringify(reason));
      };
    })(this));
  };

  return Storage;

})();
