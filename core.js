// specs for jquery core
module("core");
test

test("Basic requirements", function() {
	expect(7);
	ok( Array.prototype.push, "Array.push()" );
	ok( Function.prototype.apply, "Function.apply()" );
	ok( document.getElementById, "getElementById" );
	ok( document.getElementsByTagName, "getElementsByTagName" );
	ok( RegExp, "RegExp" );
	ok( jQuery, "jQuery" );
	ok( $, "$()" );
});

test("$()", function() {
	expect(5);
	
	var main = $("#main");
	isSet( $("div p", main).get(), q("sndp", "en", "sap"), "Basic selector with jQuery object as context" );
	
	// make sure this is handled
	$('<p>\r\n</p>');
	ok( true, "Check for \\r and \\n in jQuery()" );
	
	/* // Disabled until we add this functionality in
	var pass = true;
	try {
		$("<div>Testing</div>").appendTo(document.getElementById("iframe").contentDocument.body);
	} catch(e){
		pass = false;
	}
	ok( pass, "$('&lt;tag&gt;') needs optional document parameter to ease cross-frame DOM wrangling, see #968" );*/

	var code = $("<code/>");
	equals( code.length, 1, "Correct number of elements generated for code" );
	var img = $("<img/>");
	equals( img.length, 1, "Correct number of elements generated for img" );
	var div = $("<div/><hr/><code/><b/>");
	equals( div.length, 4, "Correct number of elements generated for div hr code b" );
});


test("noConflict", function() {
	expect(6);
	
	var old = jQuery;
	var newjQuery = jQuery.noConflict();

	ok( newjQuery == old, "noConflict returned the jQuery object" );
	ok( jQuery == old, "Make sure jQuery wasn't touched." );
	ok( $ == "$", "Make sure $ was reverted." );

	jQuery = $ = old;

	newjQuery = jQuery.noConflict(true);

	ok( newjQuery == old, "noConflict returned the jQuery object" );
	ok( jQuery == "jQuery", "Make sure jQuery was reverted." );
	ok( $ == "$", "Make sure $ was reverted." );

	jQuery = $ = old;
});

test("isFunction", function() {
	expect(21);

	// Make sure that false values return false
	ok( !jQuery.isFunction(), "No Value" );
	ok( !jQuery.isFunction( null ), "null Value" );
	ok( !jQuery.isFunction( undefined ), "undefined Value" );
	ok( !jQuery.isFunction( "" ), "Empty String Value" );
	ok( !jQuery.isFunction( 0 ), "0 Value" );

	// Check built-ins
	// Safari uses "(Internal Function)"
	ok( jQuery.isFunction(String), "String Function" );
	ok( jQuery.isFunction(Array), "Array Function" );
	ok( jQuery.isFunction(Object), "Object Function" );
	ok( jQuery.isFunction(Function), "Function Function" );

	// When stringified, this could be misinterpreted
	var mystr = "function";
	ok( !jQuery.isFunction(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	var myarr = [ "function" ];
	ok( !jQuery.isFunction(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	var myfunction = { "function": "test" };
	ok( !jQuery.isFunction(myfunction), "Function Object" );

	// Make sure normal functions still work
	var fn = function(){};
	ok( jQuery.isFunction(fn), "Normal Function" );

	var obj = document.createElement("object");

	// Firefox says this is a function
	ok( !jQuery.isFunction(obj), "Object Element" );

	// IE says this is an object
	ok( jQuery.isFunction(obj.getAttribute), "getAttribute Function" );

	var nodes = document.body.childNodes;

	// Safari says this is a function
	ok( !jQuery.isFunction(nodes), "childNodes Property" );

	var first = document.body.firstChild;
	
	// Normal elements are reported ok everywhere
	ok( !jQuery.isFunction(first), "A normal DOM Element" );

	var input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// IE says this is an object
	ok( jQuery.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	var a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !jQuery.isFunction(a), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme(callback){
		function fn(response){
			callback(response);
		}

		ok( jQuery.isFunction(fn), "Recursive Function Call" );

    	fn({ some: "data" });
	};

	callme(function(){
    	callme(function(){});
	});
});

var foo = false;

test("$('html')", function() {
	expect(4);
	
	reset();
	foo = false;
	var s = $("<script>var foo='test';</script>")[0];
	ok( s, "Creating a script" );
	ok( !foo, "Make sure the script wasn't executed prematurely" );
	$("body").append(s);
	ok( foo, "Executing a scripts contents in the right context" );
	
	reset();
	ok( $("<link rel='stylesheet'/>")[0], "Creating a link" );
	
	reset();
});

test("length", function() {
	expect(1);
	ok( $("p").length == 6, "Get Number of Elements Found" );
});

test("size()", function() {
	expect(1);
	ok( $("p").size() == 6, "Get Number of Elements Found" );
});

test("get()", function() {
	expect(1);
	isSet( $("p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("get(Number)", function() {
	expect(1);
	ok( $("p").get(0) == document.getElementById("firstp"), "Get A Single Element" );
});

test("add(String|Element|Array)", function() {
	expect(7);
	isSet( $("#sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document" );
	isSet( $("#sndp").add( $("#en")[0] ).add( $("#sap") ).get(), q("sndp", "en", "sap"), "Check elements from document" );
	ok( $([]).add($("#form")[0].elements).length >= 13, "Check elements from array" );
	
	var x = $([]).add($("<p id='x1'>xxx</p>")).add($("<p id='x2'>xxx</p>"));
	ok( x[0].id == "x1", "Check on-the-fly element1" );
	ok( x[1].id == "x2", "Check on-the-fly element2" );
	
	var x = $([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	ok( x[0].id == "x1", "Check on-the-fly element1" );
	ok( x[1].id == "x2", "Check on-the-fly element2" );
});

test("each(Function)", function() {
	expect(1);
	var div = $("div");
	div.each(function(){this.foo = 'zoo';});
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	  if ( div.get(i).foo != "zoo" ) pass = false;
	}
	ok( pass, "Execute a function, Relative" );
});

test("index(Object)", function() {
	expect(8);
	ok( $([window, document]).index(window) == 0, "Check for index of elements" );
	ok( $([window, document]).index(document) == 1, "Check for index of elements" );
	var inputElements = $('#radio1,#radio2,#check1,#check2');
	ok( inputElements.index(document.getElementById('radio1')) == 0, "Check for index of elements" );
	ok( inputElements.index(document.getElementById('radio2')) == 1, "Check for index of elements" );
	ok( inputElements.index(document.getElementById('check1')) == 2, "Check for index of elements" );
	ok( inputElements.index(document.getElementById('check2')) == 3, "Check for index of elements" );
	ok( inputElements.index(window) == -1, "Check for not found index" );
	ok( inputElements.index(document) == -1, "Check for not found index" );
});

test("attr(String)", function() {
	expect(13);
	ok( $('#text1').attr('value') == "Test", 'Check for value attribute' );
	ok( $('#text1').attr('type') == "text", 'Check for type attribute' );
	ok( $('#radio1').attr('type') == "radio", 'Check for type attribute' );
	ok( $('#check1').attr('type') == "checkbox", 'Check for type attribute' );
	ok( $('#simon1').attr('rel') == "bookmark", 'Check for rel attribute' );
	ok( $('#google').attr('title') == "Google!", 'Check for title attribute' );
	ok( $('#mark').attr('hreflang') == "en", 'Check for hreflang attribute' );
	ok( $('#en').attr('lang') == "en", 'Check for lang attribute' );
	ok( $('#simon').attr('class') == "blog link", 'Check for class attribute' );
	ok( $('#name').attr('name') == "name", 'Check for name attribute' );
	ok( $('#text1').attr('name') == "action", 'Check for name attribute' );
	ok( $('#form').attr('action').indexOf("formaction") >= 0, 'Check for action attribute' );
	
	$('<a id="tAnchor5"></a>').attr('href', '#5').appendTo('#main'); // using innerHTML in IE causes href attribute to be serialized to the full path
	ok( $('#tAnchor5').attr('href') == "#5", 'Check for non-absolute href (an anchor)' );
});

if ( !isLocal ) {
    test("attr(String) in XML Files", function() {
        expect(2);
        stop();
        $.get("data/dashboard.xml", function(xml) {
            ok( $("locations", xml).attr("class") == "foo", "Check class attribute in XML document" );
            ok( $("location", xml).attr("for") == "bar", "Check for attribute in XML document" );
            start();
        });
    });
}

test("attr(String, Function)", function() {
	expect(2);
	ok( $('#text1').attr('value', function() { return this.id })[0].value == "text1", "Set value from id" );
	ok( $('#text1').attr('title', function(i) { return i }).attr('title') == "0", "Set value with an index");
});

test("attr(Hash)", function() {
	expect(1);
	var pass = true;
	$("div").attr({foo: 'baz', zoo: 'ping'}).each(function(){
	  if ( this.getAttribute('foo') != "baz" && this.getAttribute('zoo') != "ping" ) pass = false;
	});
	ok( pass, "Set Multiple Attributes" );
});

test("attr(String, Object)", function() {
	expect(12);
	var div = $("div");
	div.attr("foo", "bar");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	  if ( div.get(i).getAttribute('foo') != "bar" ) pass = false;
	}
	ok( pass, "Set Attribute" );

	ok( $("#foo").attr({"width": null}), "Try to set an attribute to nothing" );	
	
	$("#name").attr('name', 'something');
	ok( $("#name").attr('name') == 'something', 'Set name attribute' );
	$("#check2").attr('checked', true);
	ok( document.getElementById('check2').checked == true, 'Set checked attribute' );
	$("#check2").attr('checked', false);
	ok( document.getElementById('check2').checked == false, 'Set checked attribute' );
	$("#text1").attr('readonly', true);
	ok( document.getElementById('text1').readOnly == true, 'Set readonly attribute' );
	$("#text1").attr('readonly', false);
	ok( document.getElementById('text1').readOnly == false, 'Set readonly attribute' );
	$("#name").attr('maxlength', '5');
	ok( document.getElementById('name').maxLength == '5', 'Set maxlength attribute' );

	reset();

	var type = $("#check2").attr('type');
	var thrown = false;
	try {
		$("#check2").attr('type','hidden');
	} catch(e) {
		thrown = true;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( type, $("#check2").attr('type'), "Verify that you can't change the type of an input element" );

	var check = document.createElement("input");
	var thrown = true;
	try {
		$(check).attr('type','checkbox');
	} catch(e) {
		thrown = false;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "checkbox", $(check).attr('type'), "Verify that you can change the type of an input element that isn't in the DOM" );
});

if ( !isLocal ) {
    test("attr(String, Object) - Loaded via XML document", function() {
        expect(2);
        stop();
        $.get('data/dashboard.xml', function(xml) { 
              var titles = [];
              $('tab', xml).each(function() {
                    titles.push($(this).attr('title'));
              });
              ok( titles[0] == 'Location', 'attr() in XML context: Check first title' );
              ok( titles[1] == 'Users', 'attr() in XML context: Check second title' );
              start();
        });
    });
}

test("css(String|Hash)", function() {
	expect(19);
	
	ok( $('#main').css("display") == 'none', 'Check for css property "display"');
	
	ok( $('#foo').is(':visible'), 'Modifying CSS display: Assert element is visible');
	$('#foo').css({display: 'none'});
	ok( !$('#foo').is(':visible'), 'Modified CSS display: Assert element is hidden');
	$('#foo').css({display: 'block'});
	ok( $('#foo').is(':visible'), 'Modified CSS display: Assert element is visible');
	
	$('#floatTest').css({styleFloat: 'right'});
	ok( $('#floatTest').css('styleFloat') == 'right', 'Modified CSS float using "styleFloat": Assert float is right');
	$('#floatTest').css({cssFloat: 'left'});
	ok( $('#floatTest').css('cssFloat') == 'left', 'Modified CSS float using "cssFloat": Assert float is left');
	$('#floatTest').css({'float': 'right'});
	ok( $('#floatTest').css('float') == 'right', 'Modified CSS float using "float": Assert float is right');
	$('#floatTest').css({'font-size': '30px'});
	ok( $('#floatTest').css('font-size') == '30px', 'Modified CSS font-size: Assert font-size is 30px');
	
	$.each("0,0.25,0.5,0.75,1".split(','), function(i, n) {
		$('#foo').css({opacity: n});
		ok( $('#foo').css('opacity') == parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		$('#foo').css({opacity: parseFloat(n)});
		ok( $('#foo').css('opacity') == parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});	
	$('#foo').css({opacity: ''});
	ok( $('#foo').css('opacity') == '1', "Assert opacity is 1 when set to an empty String" );
});

test("css(String, Object)", function() {
	expect(18);
	ok( $('#foo').is(':visible'), 'Modifying CSS display: Assert element is visible');
	$('#foo').css('display', 'none');
	ok( !$('#foo').is(':visible'), 'Modified CSS display: Assert element is hidden');
	$('#foo').css('display', 'block');
	ok( $('#foo').is(':visible'), 'Modified CSS display: Assert element is visible');
	
	$('#floatTest').css('styleFloat', 'left');
	ok( $('#floatTest').css('styleFloat') == 'left', 'Modified CSS float using "styleFloat": Assert float is left');
	$('#floatTest').css('cssFloat', 'right');
	ok( $('#floatTest').css('cssFloat') == 'right', 'Modified CSS float using "cssFloat": Assert float is right');
	$('#floatTest').css('float', 'left');
	ok( $('#floatTest').css('float') == 'left', 'Modified CSS float using "float": Assert float is left');
	$('#floatTest').css('font-size', '20px');
	ok( $('#floatTest').css('font-size') == '20px', 'Modified CSS font-size: Assert font-size is 20px');
	
	$.each("0,0.25,0.5,0.75,1".split(','), function(i, n) {
		$('#foo').css('opacity', n);
		ok( $('#foo').css('opacity') == parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		$('#foo').css('opacity', parseFloat(n));
		ok( $('#foo').css('opacity') == parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	$('#foo').css('opacity', '');
	ok( $('#foo').css('opacity') == '1', "Assert opacity is 1 when set to an empty String" );
});

test("text()", function() {
	expect(1);
	var expected = "This link has class=\"blog\": Simon Willison's Weblog";
	ok( $('#sap').text() == expected, 'Check for merged text of more then one element.' );
});

test("wrap(String|Element)", function() {
	expect(6);
	var defaultText = 'Try them out:'
	var result = $('#first').wrap('<div class="red"><span></span></div>').text();
	ok( defaultText == result, 'Check for wrapping of on-the-fly html' );
	ok( $('#first').parent().parent().is('.red'), 'Check if wrapper has class "red"' );

	reset();
	var defaultText = 'Try them out:'
	var result = $('#first').wrap(document.getElementById('empty')).parent();
	ok( result.is('ol'), 'Check for element wrapping' );
	ok( result.text() == defaultText, 'Check for element wrapping' );
	
	reset();
	$('#check1').click(function() {		
		var checkbox = this;		
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
		$(checkbox).wrap( '<div id="c1" style="display:none;"></div>' );
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
	}).click();
});

test("wrapAll(String|Element)", function() {
	expect(8);
	var prev = $("#first")[0].previousSibling;
	var p = $("#first")[0].parentNode;
	var result = $('#first,#firstp').wrapAll('<div class="red"><div id="tmp"></div></div>');
	equals( result.parent().length, 1, 'Check for wrapping of on-the-fly html' );
	ok( $('#first').parent().parent().is('.red'), 'Check if wrapper has class "red"' );
	ok( $('#firstp').parent().parent().is('.red'), 'Check if wrapper has class "red"' );
	equals( $("#first").parent().parent()[0].previousSibling, prev, "Correct Previous Sibling" );
	equals( $("#first").parent().parent()[0].parentNode, p, "Correct Parent" );

	reset();
	var prev = $("#first")[0].previousSibling;
	var p = $("#first")[0].parentNode;
	var result = $('#first,#firstp').wrapAll(document.getElementById('empty'));
	equals( $("#first").parent()[0], $("#firstp").parent()[0], "Same Parent" );
	equals( $("#first").parent()[0].previousSibling, prev, "Correct Previous Sibling" );
	equals( $("#first").parent()[0].parentNode, p, "Correct Parent" );
});

test("wrapInner(String|Element)", function() {
	expect(6);
	var num = $("#first").children().length;
	var result = $('#first').wrapInner('<div class="red"><div id="tmp"></div></div>');
	equals( $("#first").children().length, 1, "Only one child" );
	ok( $("#first").children().is(".red"), "Verify Right Element" );
	equals( $("#first").children().children().children().length, num, "Verify Elements Intact" );

	reset();
	var num = $("#first").children().length;
	var result = $('#first').wrapInner(document.getElementById('empty'));
	equals( $("#first").children().length, 1, "Only one child" );
	ok( $("#first").children().is("#empty"), "Verify Right Element" );
	equals( $("#first").children().children().length, num, "Verify Elements Intact" );
});

test("append(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(18);
	var defaultText = 'Try them out:'
	var result = $('#first').append('<b>buga</b>');
	ok( result.text() == defaultText + 'buga', 'Check if text appending works' );
	ok( $('#select3').append('<option value="appendTest">Append Test</option>').find('option:last-child').attr('value') == 'appendTest', 'Appending html options to select element');
	
	reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	$('#sap').append(document.getElementById('first'));
	ok( expected == $('#sap').text(), "Check for appending of element" );
	
	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$('#sap').append([document.getElementById('first'), document.getElementById('yahoo')]);
	ok( expected == $('#sap').text(), "Check for appending of array of elements" );
	
	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$('#sap').append($("#first, #yahoo"));
	ok( expected == $('#sap').text(), "Check for appending of jQuery object" );

	reset();
	$("#sap").append( 5 );
	ok( $("#sap")[0].innerHTML.match( /5$/ ), "Check for appending a number" );

	reset();
	$("#sap").append( " text with spaces " );
	ok( $("#sap")[0].innerHTML.match(/ text with spaces $/), "Check for appending text with spaces" );

	reset();
	ok( $("#sap").append([]), "Check for appending an empty array." );
	ok( $("#sap").append(""), "Check for appending an empty string." );
	ok( $("#sap").append(document.getElementsByTagName("foo")), "Check for appending an empty nodelist." );
	
	reset();
	$("#sap").append(document.getElementById('form'));
	ok( $("#sap>form").size() == 1, "Check for appending a form" );  // Bug #910

	reset();
	var pass = true;
	try {
		$( $("iframe")[0].contentWindow.document.body ).append("<div>test</div>");
	} catch(e) {
		pass = false;
	}

	ok( pass, "Test for appending a DOM node to the contents of an IFrame" );
	
	reset();
	$('<fieldset/>').appendTo('#form').append('<legend id="legend">test</legend>');
	t( 'Append legend', '#legend', ['legend'] );
	
	reset();
	$('#select1').append('<OPTION>Test</OPTION>');
	ok( $('#select1 option:last').text() == "Test", "Appending &lt;OPTION&gt; (all caps)" );
	
	$('#table').append('<colgroup></colgroup>');
	ok( $('#table colgroup').length, "Append colgroup" );
	
	$('#table colgroup').append('<col/>');
	ok( $('#table colgroup col').length, "Append col" );
	
	reset();
	$('#table').append('<caption></caption>');
	ok( $('#table caption').length, "Append caption" );

	reset();
	$('form:last')
		.append('<select id="appendSelect1"></select>')
		.append('<select id="appendSelect2"><option>Test</option></select>');
	
	t( "Append Select", "#appendSelect1, #appendSelect2", ["appendSelect1", "appendSelect2"] );
});

test("appendTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(6);
	var defaultText = 'Try them out:'
	$('<b>buga</b>').appendTo('#first');
	ok( $("#first").text() == defaultText + 'buga', 'Check if text appending works' );
	ok( $('<option value="appendTest">Append Test</option>').appendTo('#select3').parent().find('option:last-child').attr('value') == 'appendTest', 'Appending html options to select element');
	
	reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	$(document.getElementById('first')).appendTo('#sap');
	ok( expected == $('#sap').text(), "Check for appending of element" );
	
	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$([document.getElementById('first'), document.getElementById('yahoo')]).appendTo('#sap');
	ok( expected == $('#sap').text(), "Check for appending of array of elements" );
	
	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$("#first, #yahoo").appendTo('#sap');
	ok( expected == $('#sap').text(), "Check for appending of jQuery object" );
	
	reset();
	$('#select1').appendTo('#foo');
	t( 'Append select', '#foo select', ['select1'] );
});

test("prepend(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(5);
	var defaultText = 'Try them out:'
	var result = $('#first').prepend('<b>buga</b>');
	ok( result.text() == 'buga' + defaultText, 'Check if text prepending works' );
	ok( $('#select3').prepend('<option value="prependTest">Prepend Test</option>').find('option:first-child').attr('value') == 'prependTest', 'Prepending html options to select element');
	
	reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	$('#sap').prepend(document.getElementById('first'));
	ok( expected == $('#sap').text(), "Check for prepending of element" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$('#sap').prepend([document.getElementById('first'), document.getElementById('yahoo')]);
	ok( expected == $('#sap').text(), "Check for prepending of array of elements" );
	
	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$('#sap').prepend($("#first, #yahoo"));
	ok( expected == $('#sap').text(), "Check for prepending of jQuery object" );
});

test("prependTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(6);
	var defaultText = 'Try them out:'
	$('<b>buga</b>').prependTo('#first');
	ok( $('#first').text() == 'buga' + defaultText, 'Check if text prepending works' );
	ok( $('<option value="prependTest">Prepend Test</option>').prependTo('#select3').parent().find('option:first-child').attr('value') == 'prependTest', 'Prepending html options to select element');
	
	reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	$(document.getElementById('first')).prependTo('#sap');
	ok( expected == $('#sap').text(), "Check for prepending of element" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$([document.getElementById('yahoo'), document.getElementById('first')]).prependTo('#sap');
	ok( expected == $('#sap').text(), "Check for prepending of array of elements" );
	
	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$("#yahoo, #first").prependTo('#sap');
	ok( expected == $('#sap').text(), "Check for prepending of jQuery object" );
	
	reset();
	$('<select id="prependSelect1"></select>').prependTo('form:last');
	$('<select id="prependSelect2"><option>Test</option></select>').prependTo('form:last');
	
	t( "Prepend Select", "#prependSelect1, #prependSelect2", ["prependSelect1", "prependSelect2"] );
});

test("before(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: bugaYahoo';
	$('#yahoo').before('<b>buga</b>');
	ok( expected == $('#en').text(), 'Insert String before' );
	
	reset();
	expected = "This is a normal link: Try them out:Yahoo";
	$('#yahoo').before(document.getElementById('first'));
	ok( expected == $('#en').text(), "Insert element before" );
	
	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$('#yahoo').before([document.getElementById('first'), document.getElementById('mark')]);
	ok( expected == $('#en').text(), "Insert array of elements before" );
	
	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$('#yahoo').before($("#first, #mark"));
	ok( expected == $('#en').text(), "Insert jQuery before" );
});

test("insertBefore(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: bugaYahoo';
	$('<b>buga</b>').insertBefore('#yahoo');
	ok( expected == $('#en').text(), 'Insert String before' );
	
	reset();
	expected = "This is a normal link: Try them out:Yahoo";
	$(document.getElementById('first')).insertBefore('#yahoo');
	ok( expected == $('#en').text(), "Insert element before" );
	
	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$([document.getElementById('first'), document.getElementById('mark')]).insertBefore('#yahoo');
	ok( expected == $('#en').text(), "Insert array of elements before" );
	
	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$("#first, #mark").insertBefore('#yahoo');
	ok( expected == $('#en').text(), "Insert jQuery before" );
});

test("after(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: Yahoobuga';
	$('#yahoo').after('<b>buga</b>');
	ok( expected == $('#en').text(), 'Insert String after' );
	
	reset();
	expected = "This is a normal link: YahooTry them out:";
	$('#yahoo').after(document.getElementById('first'));
	ok( expected == $('#en').text(), "Insert element after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$('#yahoo').after([document.getElementById('first'), document.getElementById('mark')]);
	ok( expected == $('#en').text(), "Insert array of elements after" );
	
	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$('#yahoo').after($("#first, #mark"));
	ok( expected == $('#en').text(), "Insert jQuery after" );
});

test("insertAfter(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: Yahoobuga';
	$('<b>buga</b>').insertAfter('#yahoo');
	ok( expected == $('#en').text(), 'Insert String after' );
	
	reset();
	expected = "This is a normal link: YahooTry them out:";
	$(document.getElementById('first')).insertAfter('#yahoo');
	ok( expected == $('#en').text(), "Insert element after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$([document.getElementById('mark'), document.getElementById('first')]).insertAfter('#yahoo');
	ok( expected == $('#en').text(), "Insert array of elements after" );
	
	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$("#mark, #first").insertAfter('#yahoo');
	ok( expected == $('#en').text(), "Insert jQuery after" );
});

test("replaceWith(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(10);
	$('#yahoo').replaceWith('<b id="replace">buga</b>');
	ok( $("#replace")[0], 'Replace element with string' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after string' );
	
	reset();
	$('#yahoo').replaceWith(document.getElementById('first'));
	ok( $("#first")[0], 'Replace element with element' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after element' );

	reset();
	$('#yahoo').replaceWith([document.getElementById('first'), document.getElementById('mark')]);
	ok( $("#first")[0], 'Replace element with array of elements' );
	ok( $("#mark")[0], 'Replace element with array of elements' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after array of elements' );
	
	reset();
	$('#yahoo').replaceWith($("#first, #mark"));
	ok( $("#first")[0], 'Replace element with set of elements' );
	ok( $("#mark")[0], 'Replace element with set of elements' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after set of elements' );
});

test("replaceAll(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(10);
	$('<b id="replace">buga</b>').replaceAll("#yahoo");
	ok( $("#replace")[0], 'Replace element with string' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after string' );
	
	reset();
	$(document.getElementById('first')).replaceAll("#yahoo");
	ok( $("#first")[0], 'Replace element with element' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after element' );

	reset();
	$([document.getElementById('first'), document.getElementById('mark')]).replaceAll("#yahoo");
	ok( $("#first")[0], 'Replace element with array of elements' );
	ok( $("#mark")[0], 'Replace element with array of elements' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after array of elements' );
	
	reset();
	$("#first, #mark").replaceAll("#yahoo");
	ok( $("#first")[0], 'Replace element with set of elements' );
	ok( $("#mark")[0], 'Replace element with set of elements' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after set of elements' );
});

test("end()", function() {
	expect(3);
	ok( 'Yahoo' == $('#yahoo').parent().end().text(), 'Check for end' );
	ok( $('#yahoo').end(), 'Check for end with nothing to end' );
	
	var x = $('#yahoo');
	x.parent();
	ok( 'Yahoo' == $('#yahoo').text(), 'Check for non-destructive behaviour' );
});

test("find(String)", function() {
	expect(1);
	ok( 'Yahoo' == $('#foo').find('.blogTest').text(), 'Check for find' );
});

test("clone()", function() {
	expect(3);
	ok( 'This is a normal link: Yahoo' == $('#en').text(), 'Assert text for #en' );
	var clone = $('#yahoo').clone();
	ok( 'Try them out:Yahoo' == $('#first').append(clone).text(), 'Check for clone' );
	ok( 'This is a normal link: Yahoo' == $('#en').text(), 'Reassert text for #en' );
});

test("is(String)", function() {
	expect(26);
	ok( $('#form').is('form'), 'Check for element: A form must be a form' );
	ok( !$('#form').is('div'), 'Check for element: A form is not a div' );
	ok( $('#mark').is('.blog'), 'Check for class: Expected class "blog"' );
	ok( !$('#mark').is('.link'), 'Check for class: Did not expect class "link"' );
	ok( $('#simon').is('.blog.link'), 'Check for multiple classes: Expected classes "blog" and "link"' );
	ok( !$('#simon').is('.blogTest'), 'Check for multiple classes: Expected classes "blog" and "link", but not "blogTest"' );
	ok( $('#en').is('[lang="en"]'), 'Check for attribute: Expected attribute lang to be "en"' );
	ok( !$('#en').is('[lang="de"]'), 'Check for attribute: Expected attribute lang to be "en", not "de"' );
	ok( $('#text1').is('[type="text"]'), 'Check for attribute: Expected attribute type to be "text"' );
	ok( !$('#text1').is('[type="radio"]'), 'Check for attribute: Expected attribute type to be "text", not "radio"' );
	ok( $('#text2').is(':disabled'), 'Check for pseudoclass: Expected to be disabled' );
	ok( !$('#text1').is(':disabled'), 'Check for pseudoclass: Expected not disabled' );
	ok( $('#radio2').is(':checked'), 'Check for pseudoclass: Expected to be checked' );
	ok( !$('#radio1').is(':checked'), 'Check for pseudoclass: Expected not checked' );
	ok( $('#foo').is(':has(p)'), 'Check for child: Expected a child "p" element' );
	ok( !$('#foo').is(':has(ul)'), 'Check for child: Did not expect "ul" element' );
	ok( $('#foo').is(':has(p):has(a):has(code)'), 'Check for childs: Expected "p", "a" and "code" child elements' );
	ok( !$('#foo').is(':has(p):has(a):has(code):has(ol)'), 'Check for childs: Expected "p", "a" and "code" child elements, but no "ol"' );
	ok( !$('#foo').is(0), 'Expected false for an invalid expression - 0' );
	ok( !$('#foo').is(null), 'Expected false for an invalid expression - null' );
	ok( !$('#foo').is(''), 'Expected false for an invalid expression - ""' );
	ok( !$('#foo').is(undefined), 'Expected false for an invalid expression - undefined' );
	
	// test is() with comma-seperated expressions
	ok( $('#en').is('[lang="en"],[lang="de"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
	ok( $('#en').is('[lang="de"],[lang="en"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
	ok( $('#en').is('[lang="en"] , [lang="de"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
	ok( $('#en').is('[lang="de"] , [lang="en"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
});

test("$.extend(Object, Object)", function() {
	expect(11);

	var settings = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options =     { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		optionsCopy = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		merged = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "x", xxx: "newstring" },
		deep1 = { foo: { bar: true } },
		deep1copy = { foo: { bar: true } },
		deep2 = { foo: { baz: true }, foo2: document },
		deep2copy = { foo: { baz: true }, foo2: document },
		deepmerged = { foo: { bar: true, baz: true }, foo2: document };

	jQuery.extend(settings, options);
	isObj( settings, merged, "Check if extended: settings must be extended" );
	isObj( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(settings, null, options);
	isObj( settings, merged, "Check if extended: settings must be extended" );
	isObj( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(true, deep1, deep2);
	isObj( deep1.foo, deepmerged.foo, "Check if foo: settings must be extended" );
	isObj( deep2.foo, deep2copy.foo, "Check if not deep2: options must not be modified" );
	equals( deep1.foo2, document, "Make sure that a deep clone was not attempted on the document" );

	var defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options1 =     { xnumber2: 1, xstring2: "x" },
		options1Copy = { xnumber2: 1, xstring2: "x" },
		options2 =     { xstring2: "xx", xxx: "newstringx" },
		options2Copy = { xstring2: "xx", xxx: "newstringx" },
		merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	var settings = jQuery.extend({}, defaults, options1, options2);
	isObj( settings, merged2, "Check if extended: settings must be extended" );
	isObj( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	isObj( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	isObj( options2, options2Copy, "Check if not modified: options2 must not be modified" );
});

test("val()", function() {
	expect(2);
	ok( $("#text1").val() == "Test", "Check for value of input element" );
	ok( !$("#text1").val() == "", "Check for value of input element" );
});

test("val(String)", function() {
	expect(3);
	document.getElementById('text1').value = "bla";
	ok( $("#text1").val() == "bla", "Check for modified value of input element" );
	$("#text1").val('test');
	ok ( document.getElementById('text1').value == "test", "Check for modified (via val(String)) value of input element" );
	
	$("#select1").val("3");
	ok( $("#select1").val() == "3", "Check for modified (via val(String)) value of select element" );
});

var scriptorder = 0;

test("html(String)", function() {
	expect(9);
	var div = $("div");
	div.html("<b>test</b>");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	  if ( div.get(i).childNodes.length == 0 ) pass = false;
	}
	ok( pass, "Set HTML" );

	stop();

	$("#main").html('<script type="text/javascript">ok( true, "$().html().evalScripts() Evals Scripts Twice in Firefox, see #975" );</script>');

	$("#main").html('foo <form><script type="text/javascript">ok( true, "$().html().evalScripts() Evals Scripts Twice in Firefox, see #975" );</script></form>');

	$("#main").html("<script>ok(scriptorder++ == 0, 'Script is executed in order');ok($('#scriptorder').length == 0,'Execute before html')<\/script><span id='scriptorder'><script>ok(scriptorder++ == 1, 'Script is executed in order');ok($('#scriptorder').length == 1,'Execute after html')<\/script></span><script>ok(scriptorder++ == 2, 'Script is executed in order');ok($('#scriptorder').length == 1,'Execute after html')<\/script>");

	setTimeout( start, 100 );
});

test("filter()", function() {
	expect(4);
	isSet( $("#form input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	isSet( $("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')" );
	isSet( $("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')" );
	isSet( $("p").filter(function() { return !$("a", this).length }).get(), q("sndp", "first"), "filter(Function)" );
});

test("not()", function() {
	expect(3);
	ok( $("#main > p#ap > a").not("#google").length == 2, "not('selector')" );
	isSet( $("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );
	isSet( $("p").not($("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(jQuery)" );
});

test("andSelf()", function() {
	expect(4);
	isSet( $("#en").siblings().andSelf().get(), q("sndp", "sap","en"), "Check for siblings and self" );
	isSet( $("#foo").children().andSelf().get(), q("sndp", "en", "sap", "foo"), "Check for children and self" );
	isSet( $("#en, #sndp").parent().andSelf().get(), q("foo","en","sndp"), "Check for parent and self" );
	isSet( $("#groups").parents("p, div").andSelf().get(), q("ap", "main", "groups"), "Check for parents and self" );
});

test("siblings([String])", function() {
	expect(5);
	isSet( $("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	isSet( $("#sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" ); 
	isSet( $("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
	isSet( $("#foo").siblings("form, b").get(), q("form", "lengthtest", "testForm", "floatTest"), "Check for multiple filters" );
	isSet( $("#en, #sndp").siblings().get(), q("sndp", "sap", "en"), "Check for unique results from siblings" );
});

test("children([String])", function() {
	expect(3);
	isSet( $("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	isSet( $("#foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children" );
	isSet( $("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("parent([String])", function() {
	expect(5);
	ok( $("#groups").parent()[0].id == "ap", "Simple parent check" );
	ok( $("#groups").parent("p")[0].id == "ap", "Filtered parent check" );
	ok( $("#groups").parent("div").length == 0, "Filtered parent check, no match" );
	ok( $("#groups").parent("div, p")[0].id == "ap", "Check for multiple filters" );
	isSet( $("#en, #sndp").parent().get(), q("foo"), "Check for unique results from parent" );
});
	
test("parents([String])", function() {
	expect(5);
	ok( $("#groups").parents()[0].id == "ap", "Simple parents check" );
	ok( $("#groups").parents("p")[0].id == "ap", "Filtered parents check" );
	ok( $("#groups").parents("div")[0].id == "main", "Filtered parents check2" );
	isSet( $("#groups").parents("p, div").get(), q("ap", "main"), "Check for multiple filters" );
	isSet( $("#en, #sndp").parents().get(), q("foo", "main", "dl", "body", "html"), "Check for unique results from parents" );
});

test("next([String])", function() {
	expect(4);
	ok( $("#ap").next()[0].id == "foo", "Simple next check" );
	ok( $("#ap").next("div")[0].id == "foo", "Filtered next check" );
	ok( $("#ap").next("p").length == 0, "Filtered next check, no match" );
	ok( $("#ap").next("div, p")[0].id == "foo", "Multiple filters" );
});
	
test("prev([String])", function() {
	expect(4);
	ok( $("#foo").prev()[0].id == "ap", "Simple prev check" );
	ok( $("#foo").prev("p")[0].id == "ap", "Filtered prev check" );
	ok( $("#foo").prev("div").length == 0, "Filtered prev check, no match" );
	ok( $("#foo").prev("p, div")[0].id == "ap", "Multiple filters" );
});

test("show()", function() {
	expect(1);
	var pass = true, div = $("div");
	div.show().each(function(){
	  if ( this.style.display == "none" ) pass = false;
	});
	ok( pass, "Show" );
});

test("addClass(String)", function() {
	expect(1);
	var div = $("div");
	div.addClass("test");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	 if ( div.get(i).className.indexOf("test") == -1 ) pass = false;
	}
	ok( pass, "Add Class" );
});

test("removeClass(String) - simple", function() {
	expect(3);
	var div = $("div").addClass("test").removeClass("test"),
		pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).className.indexOf("test") != -1 ) pass = false;
	}
	ok( pass, "Remove Class" );
	
	reset();
	var div = $("div").addClass("test").addClass("foo").addClass("bar");
	div.removeClass("test").removeClass("bar").removeClass("foo");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	 if ( div.get(i).className.match(/test|bar|foo/) ) pass = false;
	}
	ok( pass, "Remove multiple classes" );
	
	reset();
	var div = $("div:eq(0)").addClass("test").removeClass("");
	ok( div.is('.test'), "Empty string passed to removeClass" );
	
});

test("toggleClass(String)", function() {
	expect(3);
	var e = $("#firstp");
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass("test");
	ok( e.is(".test"), "Assert class present" ); 
	e.toggleClass("test");
	ok( !e.is(".test"), "Assert class not present" );
});

test("removeAttr(String", function() {
	expect(1);
	ok( $('#mark').removeAttr("class")[0].className == "", "remove class" );
});

test("text(String)", function() {
	expect(1);
	ok( $("#foo").text("<div><b>Hello</b> cruel world!</div>")[0].innerHTML == "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );
});

test("$.each(Object,Function)", function() {
	expect(8);
	$.each( [0,1,2], function(i, n){
		ok( i == n, "Check array iteration" );
	});
	
	$.each( [5,6,7], function(i, n){
		ok( i == n - 5, "Check array iteration" );
	});
	 
	$.each( { name: "name", lang: "lang" }, function(i, n){
		ok( i == n, "Check object iteration" );
	});
});

test("$.prop", function() {
	expect(2);
	var handle = function() { return this.id };
	ok( $.prop($("#ap")[0], handle) == "ap", "Check with Function argument" );
	ok( $.prop($("#ap")[0], "value") == "value", "Check with value argument" );
});

test("$.className", function() {
	expect(6);
	var x = $("<p>Hi</p>")[0];
	var c = $.className;
	c.add(x, "hi");
	ok( x.className == "hi", "Check single added class" );
	c.add(x, "foo bar");
	ok( x.className == "hi foo bar", "Check more added classes" );
	c.remove(x);
	ok( x.className == "", "Remove all classes" );
	c.add(x, "hi foo bar");
	c.remove(x, "foo");
	ok( x.className == "hi bar", "Check removal of one class" );
	ok( c.has(x, "hi"), "Check has1" );
	ok( c.has(x, "bar"), "Check has2" );
});

test("remove()", function() {
	expect(4);
	$("#ap").children().remove();
	ok( $("#ap").text().length > 10, "Check text is not removed" );
	ok( $("#ap").children().length == 0, "Check remove" );
	
	reset();
	$("#ap").children().remove("a");
	ok( $("#ap").text().length > 10, "Check text is not removed" );
	ok( $("#ap").children().length == 1, "Check filtered remove" );
});

test("empty()", function() {
	expect(2);
	ok( $("#ap").children().empty().text().length == 0, "Check text is removed" );
	ok( $("#ap").children().length == 4, "Check elements are not removed" );
});

test("slice()", function() {
	expect(5);
	isSet( $("#ap a").slice(1,2), q("groups"), "slice(1,2)" );
	isSet( $("#ap a").slice(1), q("groups", "anchor1", "mark"), "slice(1)" );
	isSet( $("#ap a").slice(0,3), q("google", "groups", "anchor1"), "slice(0,3)" );
	isSet( $("#ap a").slice(-1), q("mark"), "slice(-1)" );

	isSet( $("#ap a").eq(1), q("groups"), "eq(1)" );
});

test("map()", function() {
	expect(2);

	isSet(
		$("#ap").map(function(){
			return $(this).find("a").get();
		}),
		q("google", "groups", "anchor1", "mark"),
		"Array Map"
	);

	isSet(
		$("#ap > a").map(function(){
			return this.parentNode;
		}),
		q("ap","ap","ap"),
		"Single Map"
	);
});

test("contents()", function() {
	expect(2);
	equals( $("#ap").contents().length, 9, "Check element contents" );
	ok( $("#iframe").contents()[0], "Check existance of IFrame document" );
	// Disabled, randomly fails
	//ok( $("#iframe").contents()[0].body, "Check existance of IFrame body" );
});
