(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Chestplate = {};

  Chestplate.BaseModel = (function(_super) {

    __extends(BaseModel, _super);

    function BaseModel() {
      return BaseModel.__super__.constructor.apply(this, arguments);
    }

    BaseModel.prototype.localAttributes = [];

    BaseModel.prototype.persistedAttributes = function() {
      return _.omit(_.clone(this.attributes), this.localAttributes);
    };

    BaseModel.prototype.parse = function(attributes, options) {
      if ((this.modelName != null) && this.wrapJSON === true) {
        return attributes[this.modelName];
      } else {
        return attributes;
      }
    };

    BaseModel.prototype.get = function(attr) {
      var value;
      value = BaseModel.__super__.get.call(this, attr);
      if (_.isFunction(value)) {
        return value.call(this);
      } else {
        return value;
      }
    };

    BaseModel.prototype.toJSON = function() {
      var data, json, key, value, _ref;
      data = {};
      _ref = this.persistedAttributes();
      for (key in _ref) {
        value = _ref[key];
        if (_.isFunction(value)) {
          data[key] = this.get(key);
        } else {
          data[key] = value;
        }
      }
      if ((this.modelName != null) && this.wrapJSON === true) {
        json = {};
        json[this.modelName] = data;
        return json;
      } else {
        return data;
      }
    };

    BaseModel.prototype.save = function(options) {
      var error, success;
      if (options == null) {
        options = {};
      }
      success = options.success || function() {};
      error = options.error || function() {};
      return BaseModel.__super__.save.call(this, this.persistedAttributes(), {
        success: function(model, response) {
          return success(model, response);
        },
        error: function(model, response) {
          return error(model, response);
        }
      });
    };

    return BaseModel;

  })(Backbone.Model);

  Chestplate.BasePresenter = (function() {

    function BasePresenter(options) {
      if (options == null) {
        options = {};
      }
      if (!(options.model != null) && !(options.collection != null)) {
        throw 'Presenter must be initialized with a model or collection';
      }
      if (options.model != null) {
        this.model = options.model;
      }
      if (options.collection != null) {
        this.collection = options.collection;
      }
      this.initialize();
    }

    BasePresenter.prototype.initialize = function() {};

    BasePresenter.prototype.partial = function(path, context) {
      var template;
      if (context == null) {
        context = this;
      }
      template = JST[path];
      return template(context);
    };

    return BasePresenter;

  })();

  Chestplate.BaseView = (function(_super) {

    __extends(BaseView, _super);

    BaseView.prototype.template = function() {};

    function BaseView(options) {
      if (options == null) {
        options = {};
      }
      BaseView.__super__.constructor.call(this, options);
      if (this.modelBindings != null) {
        this._bindModelEvents();
      }
    }

    BaseView.prototype.render = function() {
      var html, presenter;
      html = this.presenter != null ? (presenter = new this.presenter({
        model: this.model
      }), this.template(presenter)) : this.template(this);
      this.$el.html(html);
      return this;
    };

    BaseView.prototype._bindModelEvents = function() {
      var event, eventName, eventSplitter, modelAttr, selector, _ref, _ref1, _results,
        _this = this;
      _ref = this.modelBindings;
      _results = [];
      for (event in _ref) {
        modelAttr = _ref[event];
        eventSplitter = /^(\S+)\s*(.*)$/;
        _ref1 = event.match(eventSplitter), eventName = _ref1[0], selector = _ref1[1];
        _results.push(this.$el.on(eventName, selector, function() {
          var $source, val;
          $source = _this.$(selector);
          val = (function() {
            switch ($source.prop('type')) {
              case 'text':
                return $source.val();
              case 'select-one':
                return $source.find('option:selected').val();
              default:
                return null;
            }
          })();
          return _this.model.set(modelAttr, val);
        }));
      }
      return _results;
    };

    return BaseView;

  })(Backbone.View);

}).call(this);
