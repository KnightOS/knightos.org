(function() {
  var templates = {};
  templates.empty = Handlebars.compile(document.getElementById('template-empty').innerHTML);
  templates.suggestion = Handlebars.compile(document.getElementById('template-suggestion').innerHTML);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/documentation/reference/data.json');
  xhr.onload = function() {
    var response = JSON.parse(this.responseText);
    var items = [];
    for (var c in response) {
      var category = response[c];
      for (var f in category) {
        items.push({
          category: c.toLowerCase(),
          name: f,
          description: category[f].description
        });
      }
    }
    var engine = new Bloodhound({
      name: 'functions',
      local: items,
      datumTokenizer: function(d) {
        return Bloodhound.tokenizers.whitespace(d.name + ' ' + d.description);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    engine.initialize().done(function() {
      $("#search").typeahead({
        highlight: true
      }, {
        source: engine.ttAdapter(),
        templates: templates,
        displayKey: function(s) {
          return s.name;
        }
      })
      .on("typeahead:selected typeahead:autocompleted", function(e, item) {
        window.location = "/documentation/reference/" + item.category + ".html#" + item.name;
      });
    });
  };
  xhr.send();
})();
