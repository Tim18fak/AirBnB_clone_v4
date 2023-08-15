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
            '<article class=' + this.id + '>' +
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
            '<div class="reviews">' +
            '<h2> Reviews <span id=' + this.id + '>show ...</span> </h2>' +
            '<ul>' +
            '</ul>' +
          '</div>' +
            '</article>'
          );
        });
      }
    });
  }
  const checkedAmenity = {};
  const checkedState = {};
  const checkedCity = {};
  loadPlaces();
  $('.amenity input[type=checkbox]').change(
    function () {
      if (this.checked) {
        checkedAmenity[($(this).attr('data-id'))] = $(this).attr('data-name');
      } else {
        delete checkedAmenity[($(this).attr('data-id'))];
      }
      if (Object.keys(checkedAmenity).length === 0) {
        $('.amenities h4').html('&nbsp;');
      } else {
        $('.amenities h4').text(Object.values(checkedAmenity));
      }
    });
  $('.state input[type=checkbox]').change(
    function () {
      if (this.checked) {
        checkedState[($(this).attr('data-id'))] = $(this).attr('data-name');
      } else {
        delete checkedState[($(this).attr('data-id'))];
      }
      if (Object.keys(checkedState).length === 0 && Object.keys(checkedCity).length === 0) {
        $('.locations h4').html('&nbsp;');
      } else {
        let comma = '';
        if (Object.keys(checkedState).length !== 0 && Object.keys(checkedCity).length !== 0) {
          comma = ',';
        }
        const listLocation = Object.values(checkedState) + comma + Object.values(checkedCity);
        $('.locations h4').text(listLocation);
      }
    });
  $('.city input[type=checkbox]').change(
    function () {
      if (this.checked) {
        checkedCity[($(this).attr('data-id'))] = $(this).attr('data-name');
      } else {
        delete checkedCity[($(this).attr('data-id'))];
      }
      if (Object.keys(checkedCity).length === 0 && Object.keys(checkedState).length === 0) {
        $('.locations h4').html('&nbsp;');
      } else {
        let comma = '';
        if (Object.keys(checkedState).length !== 0 && Object.keys(checkedCity).length !== 0) {
          comma = ',';
        }
        const listLocation = Object.values(checkedState) + comma + Object.values(checkedCity);
        $('.locations h4').text(listLocation);
      }
    });
  $('BUTTON').click(function () {
    const params = {};
    params.amenities = Object.keys(checkedAmenity);
    params.states = Object.keys(checkedState);
    params.cities = Object.keys(checkedCity);
    $('.places article').remove();
    loadPlaces(params);
    console.log(params);
  });
  $(document).on('click', '.places .reviews span', function () {
    const showId = $(this).attr('id');
    if ($('.' + showId + ' span').text() === 'hide ^') {
      $('.' + showId + ' ul').empty();
      $('.' + showId + ' span').text('show ...');
    } else {
      $.ajax({
        url: 'http://' + window.location.hostname + ':5001/api/v1/places/' + showId + '/reviews',
        type: 'GET',
        success: function (data) {
          $.each(data, async function () {
            let fecha = this.updated_at.split(' ')[0];
            fecha = fecha.split('-');
            const date = new Date(fecha[0], fecha[1], fecha[2]);
            const month = date.toLocaleString('default', { month: 'long' });
            const fdate = fecha[2] + ' ' + month + ' ' + fecha[0];
            const nombre = await getName(this.user_id);
            $('.' + showId + ' ul').append(
              '<li>' +
              '<h3> From ' + nombre.first_name + ' ' + nombre.last_name + ' the ' + fdate + '</h3>' +
                '<p>' + this.text + '</p> ' +
              '</li>'
            );
          });
        }
      });
      $('.' + showId + ' span').text('hide ^');
    }
  });
});
