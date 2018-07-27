define([
  'core/js/adapt',
  'components/adapt-contrib-mcq/js/adapt-contrib-mcq'
], function(Adapt, Mcq) {

  var Gmcq = Mcq.view.extend({

    events: {
      'focus .js-mcq-item-input': 'onItemFocus',
      'blur .js-mcq-item-input': 'onItemBlur',
      'change .js-mcq-item-input': 'onItemSelected',
      'keyup .js-mcq-item-input': 'onKeyPress'
    },

    onItemSelected: function(event) {

      var selectedItemObject = this.model.get('_items')[$(event.currentTarget).parent('.js-mcq-item').index()];

      if (this.model.get('_isEnabled') && !this.model.get('_isSubmitted')) {
        this.toggleItemSelected(selectedItemObject, event);
      }

    },

    setupQuestion: function() {
      Mcq.view.prototype.setupQuestion.call(this);

      this.listenTo(Adapt, {
        'device:changed': this.resizeImage,
        'device:resize': this.onDeviceResize
      });

    },

    onQuestionRendered: function() {

      this.resizeImage(Adapt.device.screenSize);
      this.setUpColumns();

      this.$('.js-mcq-item-label').imageready(_.bind(function() {
        this.setReadyStatus();
      }, this));

    },

    onDeviceResize: function() {
      this.setUpColumns();
    },

    resizeImage: function(width) {
      var imageWidth = width === 'medium' ? 'small' : width;

      this.$('.js-mcq-item-label').each(function(index) {
        var $img = $(this).find('img');
        var newSrc = $img.attr('data-' + imageWidth);
        if (newSrc) {
          $img.attr('src', newSrc);
        }
      });

    },

    setUpColumns: function() {
      var columns = this.model.get('_columns');
      if (!columns) return;

      this.$el.addClass('gmcq-column-layout');

      if (Adapt.device.screenSize === 'large') {
        this.$('.js-mcq-item').css('width', (100 / columns) + '%');
      } else {
        this.$('.js-mcq-item').css('width', '');
      }
    }

  }, {
    template: 'gmcq'
  });

  return Adapt.register("gmcq", {
    view: Gmcq,
    model: Mcq.model.extend({})
  });

});
