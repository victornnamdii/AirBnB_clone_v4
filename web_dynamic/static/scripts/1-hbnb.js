$(document).ready(function () {
	let amenity_check = {};
	$(document).on('change', "input[type='checkbox']", function () {
		if (this.checked) {
			amenity_check[$(this).data('id')] = $(this).data('name');
		}
		else {
			delete amenity_check[$(this).data('id')];
		}
		let amenity_list = Object.values(amenity_check);
		if (amenity_list.length > 0) {
			$('div.amenities > h4').text(amenity_list.join(', '));
		}
		else {
			$('div.amenities > h4').html('&nbsp;');
		}
	})
}

)