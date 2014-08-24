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
      if _.isFunction(value)
        data[key] = @get(key)
      else
        data[key] = value
    if @modelName? && @wrapJSON == true
      json = {}
      json[@modelName] = data
      json
    else
      data


  save: (options={}) ->
    success = options.success || ->
    error   = options.error || ->
    super @persistedAttributes(), {
      success: (model, response) -> success(model, response)
      error:   (model, response) -> error(model, response)
    }
