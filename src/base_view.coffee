class Chestplate.BaseView extends Backbone.View
  template: ->

  constructor: (options={}) ->
    super(options)
    if @modelBindings?
      @_bindModelEvents()


  render: ->
    html =
      if @presenter?
        presenter = new @presenter(model: @model)
        @template(presenter)
      else
        @template(@)
    @$el.html(html)
    @


  _bindModelEvents: ->
    for event, modelAttr of @modelBindings
      eventSplitter = /^(\S+)\s*(.*)$/
      [eventName, selector] = event.match(eventSplitter)

      @$el.on eventName, selector, =>
        $source = @$(selector)
        val = switch $source.prop('type')
          when 'text'       then $source.val()
          when 'select-one' then $source.find('option:selected').val()
          else null
        @model.set(modelAttr, val)
