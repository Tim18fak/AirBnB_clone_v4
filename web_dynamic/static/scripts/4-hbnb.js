$(document).ready(function () {
  $.ajax({
    url: 'http://' + window.location.hostname + ':5001/api/v1/status/',
    type: 'GET',
    success: function (data) {
      if (data.status === 'OK') {
        $('DIV#api_status').addClass('available');
      }
    }
  });
  function getName (id) {
    return $.ajax({
      url: 'http://' + window.location.hostname + ':5001/api/v1/users/' + id,
      type: 'GET'

    });
  }
  function loadPlaces (params = {}) {
    $.ajax({
      url: 'http://' + window.location.hostname + ':5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(params),
      success: function (data) {
        $.each(data, async function () {
          const nombre = await getName(this.user_id);
          $('.places').append(
            '<article>' +
            '<div class="title">' +
            '<h2>' + this.name + '</h2>' +
            '<div class="price_by_night">' + this.price_by_night + '</div>' +
            '</div>' +
            '<div class="information">' +
            '<div class="max_guest">' +
            '<i class="fa fa-users fa-3x" aria-hidden="true"></i>' +
            '<br />' + this.max_guest + ' Guests' +
            '</div>' +
            '<div class="number_rooms">' +
            '<i class="fa fa-bed fa-3x" aria-hidden="true"></i>' +
            '<br />' + this.number_rooms + ' Bedrooms' +
            '</div>' +
            '<div class="number_bathrooms">' +
            '<i class="fa fa-bath fa-3x" aria-hidden="true"></i>' +
            '<br />' + this.number_bathrooms + ' Bathroom' +
            '</div>' +
            '</div>' +
            '<div class="user">' +
            '<strong>Owner: ' + nombre.first_name + ' ' + nombre.last_name + '</strong>' +
            '</div>' +
            '<div class="description">' + this.description + '</div>' +
            '</article>'
          );
        });
      }
    });
  }
  const checked = {};
  loadPlaces(checked);
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
        $('.amenities h4').text(Object.values(checked));
      }
    });
  $('BUTTON').click(function () {
    const params = { amenities: Object.keys(checked) };
    $('.places article').remove();
    loadPlaces(params);
    console.log(params);
  });
});
