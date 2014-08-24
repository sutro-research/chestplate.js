class Chestplate.BasePresenter
  constructor: (options={}) ->
    if !options.model? && !options.collection?
      throw 'Presenter must be initialized with a model or collection'

    @model      = options.model if options.model?
    @collection = options.collection if options.collection?
    @initialize()


  # Override initialize in subclasses if necessary
  initialize: ->


  # Render a JST template (scoped to this module) with context
  #
  # path    - String JST template path, ex: 'posts/show'
  # context - Arbitrary template context
  #          Ex: Hash of locals, or Presenter object, etc
  #          (Default: presenter instance)
  #
  # Returns String
  partial: (path, context = @) ->
    template = JST[path]
    template(context)
