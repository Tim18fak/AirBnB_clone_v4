$(document).ready(function () {
  const checked = {};
  $('input[type=checkbox').change(
    function () {
      if (this.checked) {
        checked[($(this).attr('data-id'))] = $(this).attr('data-name');
      } else {
        delete checked[($(this).attr('data-id'))];
      }
      if (Object.keys(checked).length === 0) {
        $('.amenities h4').html('&nbsp;');
      } else {
        console.log(checked);
        $('.amenities h4').text(Object.values(checked));
      }
    });
});
