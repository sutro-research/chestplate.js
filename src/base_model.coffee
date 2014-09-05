class Chestplate.BaseModel extends Backbone.Model
  localAttributes: []

  persistedAttributes: ->
    _.omit(_.clone(@attributes), @localAttributes)


  # Override parse to handle nested responses
  parse: (attributes, options) ->
    if @modelName? && @wrapJSON == true
      attributes[@modelName]
    else
      attributes


  get: (attr) ->
    value = super(attr)
    if _.isFunction(value) then value.call(@) else value


  toJSON: ->
    data = {}
    for key, value of @persistedAttributes()
      data[key] = if _.isFunction(value) then @get(key) else value
      
    if @modelName? && @wrapJSON == true
      json = {}
      json[@modelName] = data
      json
    else
      data
