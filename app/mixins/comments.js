import Mixin from '@ember/object/mixin';

export default Mixin.create({
  hideCommentForm() {
    this.set('isCommentFormExpanded', false);
  },

  actions: {
    showCommentForm() {
      this.set('isCommentFormExpanded', true);

      let scrollTimeout;

      let onScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
          window.removeEventListener('scroll', onScroll);
          document.querySelector('textarea').focus();
        }, 100);
      };

      window.addEventListener('scroll', onScroll);

      // will force the callback to be called incase the element
      // is already at the right position and scrolling is ignored
      window.dispatchEvent(new Event('scroll'));

      window.scrollTo({
        top: this.element.offsetTop,
        behavior: 'smooth'
      });
    },

    close() {
      this.hideCommentForm();
    }
  }
});
