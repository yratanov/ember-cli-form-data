import Ember from 'ember';

import FormDataAdapterMixin from 'ember-cli-form-data/mixins/form-data-adapter';

var adapter;

module('FormDataAdapterMixin', {
  setup: function() {
    adapter = Ember.Object.extend({
      ajaxOptions: function(url, type, options) {
        return options;
      }
    }, FormDataAdapterMixin).create();
  }
});

test('Default FormData Types', function() {
  deepEqual(adapter.get('formDataTypes'), ['POST', 'PUT', 'PATCH']);
});

test('#ajaxOptions', function() {
  window.FormData = function() {
    this.data = [];
    this.append = function(key, value) {
      var object = {};
      object[key] = value;
      this.data.push(object);
    };
  };

  var testFormData = new window.FormData();

  testFormData.append('post[id]', 1);
  testFormData.append('post[title]', 'Rails is Omakase');

  var options = {
    data: {
      post: {
        id: 1,
        title: 'Rails is Omakase'
      }            
    }
  };

  var hash = adapter.ajaxOptions('/', 'POST', options);

  deepEqual(hash.data, testFormData);
});