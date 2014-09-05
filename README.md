# Chestplate.js

A small set of helpers for Backbone.

## Chestplate.BaseModel

An extension to `Backbone.Model` for your models.

### Local-only attributes

"Local" model attributes are ones which are never sent to the server. They're defined using the `localAttributes` model property, and accessed by calling `persistedAttributes()` - 

```coffeescript
class ExampleModel extends Chestplate.BaseModel
  localAttributes: ['finishedEditing']
  
  
model = new ExampleModel()
model.set(
  title: "Example Title"
  finishedEditing: true
)

model.persistedAttributes() # => { title: "Example Title" }
```


### Parsing/serialization

Chestplate includes helpers for nested 'root' keys when speaking with the server. For example, if you have a Book model, your API may be coded to expect requests and responses to be nested as such:

```javascript
{ "book": { "title": ... } }
```

Notice the nesting of attributes under the "book" key. Instead of overriding `parse` and `toJSON` in all of your models, Chestplate allows you to write

```coffeescript
class Book extends Chestplate.BaseModel
  modelName: "Book"
  wrapJSON: true
  
  
book = new Book(title: "Example title")
book.toJSON() { "book": { "title": "Example title" } }
book.fetch() # Will automatically parse nested response key
```


### Computed attributes

Chestplate lets you define 'computed' attributes as functions:

```coffeescript
class Order extends Chestplate.BaseModel
  defaults: {
    quantity: 0
    price: 0
    total: -> @get('quantity') * @get('price')
  }


order = new Order(quantity: 2, price: 10)
order.get('total') # => 20
order.toJSON() # => { quantity: 2, price: 10, total: 20 }
```

`get()` works with computed properties, as does `toJSON()`. Note that these properties are not truly 'computed'; they only execute when explicitly called or from `toJSON`; they do not update in response to any of their dependent fields changing.



## Chestplate.BaseView

An extension to `Backbone.View` for your views.

### 1-way model-view data binding
Chestplate supports simple data binding of model attributes to DOM elements such as text inputs or selects. All you have to do is define a set of `modelBindings` in your view:

```coffeescript
class Book extends Chestplate.BaseModel
  defaults: {
    title: ''
    coverType: ''
  }


class BookView extends Chestplate.BaseView
  modelBindings:
    'keyup  .book-title' : 'title'
    'change .select-hardcover-paperback' : 'coverType'
    
    
book = new Book()
view = new BookView(model: book)
```

```html
<div class="book-container">
  <input type="text" class="book-title"></input>
  
  <select class="select-hardcover-paperback">
    <option value="hardcover">Hardcover</option>
    <option value="paperback">Paperback</option>
  </select>
</div>
```

Here, whenever the user enters input into the `book-title` field, the `title` attribute of the view's associated model will be set to its value. Similarly, whenever the `select-hardcover-paperback` dropdown changes, the `coverType` attribute will be set to the selected option value.

Note that this data binding is 1-way only; updating an attribute on the model will _not_ update the view's display by default.



### (Completely optional) Sane default view rendering

Chestplate.BaseView provides a default implementation of `render` that integrates with JST and the presenter pattern (more on that later) out of the box. It's completely optional and can be overriden/extended as desired, but tends to cut down on boilerplate. JST templates are used as follows:

```books/show.jst.ejs
<div class="book-container">
  <h1><%= model.get('title') %></h1>
</div>
```

```coffeescript
class BookView extends Chestplate.BaseView
  template: JST['books/show']
  

book = new Book(title: "Example Title")
view = new BookView(model: Book)
view.render() # Automatically populates $el with the rendered JST template (in the context of the view)
```


### Chestplate.BasePresenter

Chestplate provides a basic implementation of the [Presenter pattern](http://blog.jayfields.com/2007/03/rails-presenter-pattern.html). Backbone Views can easily become cluttered with presentational methods for formatting model data for display, which gets cluttered up with event handling and DOM rendering logic. Presenter classes are associated with a model just as Views are, and act as a home for these display-related methods. For example:


```coffeescript
class Order extends Chestplate.BaseModel


class OrderPresenter extends Chestplate.BasePresenter
  formatCreatedAt: ->
    date = new Date(@model.get('created_at_unix') * 1000) # s to ms
    "#{date.getHours()}:#{date.getMinutes()}"


class OrderView extends Chestplate.BaseView
  template: JST['orders/show']
  
  render: ->
    presenter = new OrderPresenter(model: @model)
    @$el.html(@template(presenter))
    @

    
order = new Order(created_at_unix: 1409942912)
view = new OrderView(model: order)
view.render()
```


```html
<div class="order-container">  
  Order placed at: <%= formatCreatedAt() %>
</div>
```


This simple example shows a presenter formatting a Unix timestamp to a human-readable format (rendering "11:48" in this case), and illustrates the separation of concerns between views and presenters.

The BaseView's default `render` function supports presenters out of the box, allowing you to write this instead:

```
class OrderView extends Chestplate.BaseView
  template: JST['orders/show']
  presenter: OrderPresenter
  
  
order = new Order(created_at_unix: 1409942912)
view = new OrderView(model: order)
view.render() # This has the exact same effect as above
```


Chestplate's presenters are inspired from the presenters are described in [this article](http://pragmatic-backbone.com/views).
