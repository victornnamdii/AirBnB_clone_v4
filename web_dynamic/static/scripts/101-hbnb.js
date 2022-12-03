$(document).ready(function () {
  const amenity_check = {};
  const state_check = {};
  const city_check = {};
  $(document).on('change', ".amenities input[type='checkbox']", function () {
    if (this.checked) {
      amenity_check[$(this).data('id')] = $(this).data('name');
    } else {
      delete amenity_check[$(this).data('id')];
    }
    const amenity_list = Object.values(amenity_check);
    if (amenity_list.length > 0) {
      $('div.amenities > h4').text(amenity_list.join(', '));
    } else {
      $('div.amenities > h4').html('&nbsp;');
    }
  });
  $(document).on('change', ".locations input[id='statecheck']", function () {
    if (this.checked) {
      state_check[$(this).data('id')] = $(this).data('name');
    } else {
      delete state_check[$(this).data('id')];
    }
    const state_list = Object.values(state_check);
    if (state_list.length > 0) {
      $('div.locations > h4').text(state_list.join(', '));
    } else {
      $('div.locations > h4').html('&nbsp;');
    }
  });
  $(document).on('change', ".locations input[id='citycheck']", function () {
    if (this.checked) {
      city_check[$(this).data('id')] = $(this).data('name');
    } else {
      delete city_check[$(this).data('id')];
    }
    const city_list = Object.values(city_check);
    if (city_list.length > 0) {
      $('div.locations > h4').text(city_list.join(', '));
    } else {
      $('div.locations > h4').html('&nbsp;');
    }
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (result, textStatus) {
    if (textStatus === 'success') {
      if (result.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }
  });
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    data: '{}',
    contentType: 'application/json',
    success: function (data) {
      for (let i = 0; i < data.length; i++) {
        let place = data[i];
        $('.places ').append('<article id=Z' + place.id + '><div class="title_box"><h2>' + place.name + '</h2><div class="price_by_night"><p>$' + place.price_by_night + '</p></div></div><div class="information"><div class="max_guest">' + place.max_guest + ' Guests</div><div class="number_rooms">' + place.number_rooms + ' Bedroom</div><div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom</div></div><div class="user"><b>Owner: </b>' + place.owner + '</div><div class="description">' + place.description + '</div></article>');
        $.get('http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews', function (result, textStatus) {
          if (textStatus === 'success') {
            $('article#Z' + place.id).append('<div class=reviews><h2>' + result.length + ' Reviews <span id="spans">show</span></h2><ul></ul></div');
            for (let j = 0; j < result.length; j++) {
              let review = result[j];
              $('article#Z' + place.id + ' > .reviews ul').append('<li><h3>From ' + review.reviewer + ' the ' + review.date + '</h3><p>' + review.text + '</p></li>');
            }
            $('.reviews ul').hide();
          }
        });
      }
    }
  });
  $('button:contains("Search")').click(function () {
    $('.places > article').remove()
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      data: JSON.stringify({'amenities': Object.keys(amenity_check), 'states': Object.keys(state_check), 'cities': Object.keys(city_check)}),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        for (let i = 0; i < data.length; i++) {
          let place = data[i];
          $('.places ').append('<article id=Z' + place.id + '><div class="title_box"><h2>' + place.name + '</h2><div class="price_by_night"><p>$' + place.price_by_night + '</p></div></div><div class="information"><div class="max_guest">' + place.max_guest + ' Guests</div><div class="number_rooms">' + place.number_rooms + ' Bedroom</div><div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom</div></div><div class="user"><b>Owner: </b>' + place.owner + '</div><div class="description">' + place.description + '</div></article>');
          $.get('http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews', function (result, textStatus) {
            if (textStatus === 'success') {
              $('article#Z' + place.id).append('<div class=reviews><h2>' + result.length + ' Reviews <span id="spans">show</span></h2><ul></ul></div');
              for (let j = 0; j < result.length; j++) {
                let review = result[j];
                $('article#Z' + place.id + ' > .reviews ul').append('<li><h3>From ' + review.reviewer + ' the ' + review.date + '</h3><p>' + review.text + '</p></li>');
              }
              $('.reviews ul').hide();
            }
          });
          $('article:contains(' + place.name + ') > .reviews:nth-child(1)').last().remove();
        }
      }
    }); 
  });
  $(document).on('click', 'article span', function () {
    if ($(this).text() === 'show') {
      $(this).text('hide');
      $(this).parent().siblings('ul').show();
    }
    else {
      $(this).text('show');
      $(this).parent().siblings('ul').hide();
    }
  });
});
