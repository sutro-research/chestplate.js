class Chestplate.CollectionView extends Backbone.View
  views: []

  render: ->
    @$el.empty()
    @resetViews()
    for view in @views
      @$el.append(view.render().$el)
    @


  resetViews: ->
    for view in @views
      view.stopListening() # TODO: undelegateEvents ?

    @views = @collection.map (item) =>
      new @modelView(model: item)
