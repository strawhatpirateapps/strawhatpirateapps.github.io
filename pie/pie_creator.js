// shorthand to divide two big integers
function div(a,b) {
	return a.divide(b);
}

// multiply 2x2 matrix a by matrix b
function comp(a,b) {
	return [
		a[0].multiply(b[0]).add(a[1].multiply(b[2])),
		a[0].multiply(b[1]).add(a[1].multiply(b[3])),
		a[2].multiply(b[0]).add(a[3].multiply(b[2])),
		a[2].multiply(b[1]).add(a[3].multiply(b[3]))
	];
}

function pi_generator() {
	var n_27 = BigInteger(27),
		n_12 = BigInteger(12),
		n_5 = BigInteger(5),
		n_675 = BigInteger(675),
		n_216 = BigInteger(216),
		n_125 = BigInteger(125),
		n_10 = BigInteger(10),
		n_0 = BigInteger(0),
		n_1 = BigInteger(1),
		n_3 = BigInteger(3),
		n_2 = BigInteger(2),
		n_12 = BigInteger(12)
	;

	var state = [n_1,n_0,n_0,n_1];
	var i = n_1;

	return function() {
		while(true) {
			// x = 27*i - 12
			var x = n_27.multiply(i).subtract(n_12);

			// y = (M_00*x + 5*M_01) / (M_10*x + 5*M_11)
			var y = div(state[0].multiply(x).add(n_5.multiply(state[1])), state[2].multiply(x).add(n_5.multiply(state[3])));

			// x = 675*i - 216
			var x = n_675.multiply(i).subtract(n_216);

			// z = (M_00*x + 125*M_01) / (M_10*x + 125*M_11)
			var z = div(state[0].multiply(x).add(n_125.multiply(state[1])), state[2].multiply(x).add(n_125.multiply(state[3])));

			// if y = z
			if(y.compare(z)==0) {
				// M' = ( [10, -10*y], [0, 1] ) * M
				state = comp([n_10,n_10.negate().multiply(y),n_0,n_1],state);
				return y;
			} else {
				// j = 3*(3*i+1)*(3*i+2)
				var j = n_3.multiply(n_3.multiply(i).add(1)).multiply(n_3.multiply(i).add(n_2));

				// X = ( [i*(2*i-1), j*(5*i-2)], [0, j] )
				var X = [ i.multiply(n_2.multiply(i).subtract(1)), j.multiply(n_5.multiply(i).subtract(2)), n_0, j];

				// M' = M * X
				state = comp(state,X);

				// i' = i + 1
				i = i.add(n_1);
			}
		}
	}
}

historical_records = {
	2: '22/7',
	3: '377/120 (Ptolemy, 150)',
	6: '355/113 (Zu Chongzhi, 480)',
	10: 'Madhava of Sangamagrama, 1400',
	17: 'Jamshad al-Kahopsha, 1424',
	20: 'Ludolph van Ceulen, 1596',
	32: 'Ludolph van Ceulen, 1615',
	35: 'Willebrord Snell, 1621',
	38: 'Christoph Grienberger, 1630',
	53: 'Quantum limit for measurable Ï€ celebration',
	61: 'Enough to calculate the radius of the observable universe in Planck lengths',
	71: 'Abraham Sharp, 1699',
	100: 'John Machin, 1706',
	112: 'Thomas Fanted de Lagny, 1719',
	126: 'Jurij Vega, 1789',
	136: 'Jurij Vega, 1794',
	200: 'Zacharias Dase, 1841',
	248: 'Thomas Clausen, 1847',
	261: 'Lehmann, 1853',
	500: 'Richter, 1855',
	528: 'William Shanks made an error here',
	620: 'D.F. Ferguson, 1946, with a desk calculator',
	707: 'William Shanks thought he had this many',
	710: 'D.F. Ferguson, January 1947',
	762: 'Feynman point - six 9s in a row',
	808: 'D.F. Ferguson, September 1947',
	1000: 'Weird Al Yankovic knows this many',
	1120: 'Ferguson and Wrench, 1949',
	2037: 'Wrench and Smith, 1949, with ENIAC'
}

var superscript_numbers = 'â°Â¹Â²Â³â´âµâ¶â·â¸â¹';
// write a number in superscript digits
function superscript(n) {
	var s = n.toString();
	var out = '';
	for(var i=0;i<s.length;i++) {
		out += superscript_numbers[s[i]];
	}
	return out;
}

function get_explanation(num_dp) {
	if(num_dp in historical_records) {
		return historical_records[num_dp];
	}
}

var next_digit = pi_generator();
next_digit();	//consume the 3

var pi_string = '3';

function last_digit_in_screen() {
	var d = $('#digits li:last');
	if(d.length==0) {
		return true;
	}
	return d.position().top+d.height() - window.pageYOffset < window.innerHeight*1.5;
}

function add_digit() {
	var digit = next_digit();
	pi_string += digit;
	num_dp += 1;

	var li = $('<li><span class="digit"></span></li>');
	$(li).find('.digit').text(digit);

	if(num_dp>1) {
		var num_dp_string = num_dp.toString();
		if(num_dp_string.match(/^10{2,}$/)) {
			num_dp_string = '10'+superscript(num_dp_string.length-1);
		} else if(pi_string.slice(0,num_dp_string.length)==num_dp_string) {
			num_dp_string = 'â‰ˆ Ï€ Ã— 10'+superscript(num_dp_string.length-1);
		} else if(num_dp==6) {
			num_dp_string = 'â‰ˆ Ï„';
		}
		$(li).find('.digit').attr('data-num-digits',num_dp > 1 ? num_dp_string+' digits' : '')
	}

	var explanation = get_explanation(num_dp);
	if(explanation) {
		$(li).find('.digit').attr('data-explanation',explanation);
	}

	$('#digits').append(li);
}

var num_dp = 0;
function add_digits() {
	while(last_digit_in_screen()) {
		add_digit();
	}
}

function resize() {
	$('#digits').css({
		'padding-left': $('#header').width()+5,
		'padding-top': $('#header').height()*.75
	});
}

$(window).load(function() {
	add_digits();
	$(window).on('scroll resize',add_digits);
	resize();
	$(window).on('resize',resize);
	window.scrollTo(0,-1000);

	if(window.location.hash) {
		var n = parseInt(window.location.hash.slice(1));
		while(num_dp<n+20) {
			add_digit();
		}
		setTimeout(function(){
			var digit = $('#digits .digit').eq(n-1);
			var y = digit.position().top+digit.height()/2-$('#header').height();
			window.scrollTo(0,y);
			add_digits();
		},10);
	}
});