define([
  './view'
],
function (View) {
  return View.extend({
    initialize: function (options) {
      options = options || {};
      var collection = this.collection = options.collection;

      this.valueAttr = options.valueAttr;

      View.prototype.initialize.apply(this, arguments);

      collection.on('reset add remove sync', this.render, this);

      this.$table = $('<table></table>');

      this.prepareTable();
      this.render();
    },

    prepareTable: function () {
      this.$table.appendTo(this.$el);
    },

    renderEl: function (elementName, context, value, attr) {
      var element;
      if (context) {
        element = $('<' + elementName + '></' + elementName + '>');
        if (value && value !== null || value !== undefined) {
          element.text(this.formatValueForTable(value));
        }
        if (attr) {
          element.attr(attr);
        }
        element.appendTo(context);
      }
      return element;
    },

    // TODO: This should live in a common formatter as this also lives in other places.
    // It should probably be controlled by some central config for formatting in the module setup json.
    formatValueForTable: function (value) {
      if (this.valueAttr === 'avgresponse' && typeof value === 'number') {
        return this.formatDuration(value, 's', 2);
      }
      if (this.valueAttr === 'uptimeFraction' || this.valueAttr === 'completion' && typeof value === 'number') {
        return this.formatPercentage(value);
      } else {
        return value;
      }
    },

    // Example Input
    // [[date, no-dig, dig], ['01/02/01', 'meh', 'meh meh']]
    //
    // Example Render
    // <table>
    //   <tr>
    //     <th scope="col">date</th>
    //     <th scope="col">no-dig</th>
    //     <th scope="col">dig</th>
    //   </tr>
    //   <tr>
    //     <td>01/02/01</td>
    //     <td>meh</td>
    //     <td>meh meh</td>
    //   </tr>
    // </table>

    render: function () {
      this.$table.empty();
      _.each(this.collection.getDataByTableFormat(this.valueAttr), function (row, rowIndex) {

        this.row = this.renderEl('tr', this.$table);

        _.each(row, function (cel) {
          var elName = 'td',
              attr,
              celValue = (cel === null || cel === undefined) ? 'no data' : cel;

          if (rowIndex === 0) {
            elName = 'th';
            attr = {scope: 'col'};
          }
          this.renderEl(elName, this.row, celValue, attr);
        }, this);

      }, this);
    }
  });
});