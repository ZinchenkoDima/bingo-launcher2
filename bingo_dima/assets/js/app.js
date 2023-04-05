// Custom JS Application Code
function validate_email_js(email) { var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; if(reg.test(email) == false) { return false; } return true; }
var ellipsisText = function (e, etc) { var wordArray = e.innerHTML.split(" "); while (e.scrollHeight > e.offsetHeight) { wordArray.pop(); e.innerHTML = wordArray.join(" ") + (etc || "..."); } };

function checkHeaderOffset() {
	var $window = $(window);
	var offset = $window.scrollTop();
	if (offset>=30) {
		$('#headerWrapper').addClass('scrolled');
	}else{
		$('#headerWrapper').removeClass('scrolled');
	}
}

function windowOnResize() {
	var myWidth, myHeight;
	if( typeof( window.innerWidth ) == 'number' ) { myWidth = window.innerWidth; myHeight = window.innerHeight; }
	else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) { myWidth = document.documentElement.clientWidth; myHeight = document.documentElement.clientHeight; }
	else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) { myWidth = document.body.clientWidth; myHeight = document.body.clientHeight; }
	browserWidth = myWidth;
	browserHeight = myHeight;
}
function pageScroll() {
	checkHeaderOffset();
}

function scrollToSlide(slideTo) {
	$('body,html').animate({ scrollTop: $('.'+slideTo).offset().top-$('header').height() }, 800);
}

function generateNumber() {
	var random = bingo.generateNextRandom().toString();
	var msg = new SpeechSynthesisUtterance(random);
	var num1 = new SpeechSynthesisUtterance(random.charAt(0));
	var num2 = new SpeechSynthesisUtterance(random.charAt(1));
	//var voices = window.speechSynthesis.getVoices();
	msg.lang='pt-BR';
	if (bingo.turbo) {
		msg.rate = 1.2;
		num1.rate = 1.2;
		num2.rate = 1.2;
	}
	window.speechSynthesis.speak(msg);
	if (!bingo.turbo) {
		if (random.charAt(1)=='') {
				var msg_aux = new SpeechSynthesisUtterance('Numero');
				window.speechSynthesis.speak(msg_aux);
				window.speechSynthesis.speak(num1);
		}else{
			window.speechSynthesis.speak(num1);
			window.speechSynthesis.speak(num2);
		}
	}else{
		if (random.charAt(1)=='') {
			var msg_aux = new SpeechSynthesisUtterance('Numero');
			window.speechSynthesis.speak(msg_aux);
			window.speechSynthesis.speak(num1);
		}
	}

	$('.bigNumberDisplay span').text(random);
	$('.bigNumberDisplay span.counter').text('('+(bingo.selectedNumbers.length)+')');

	$('.numbers-board span').removeClass('last-out');
	$('.numbers-board span').removeClass('newnumber');
	$('.numbers-board span.number-' + random).addClass('selected');
	$('.numbers-board span.number-' + random).addClass('newnumber');

	if (bingo.lastNumber!=0) $('.numbers-board span.number-' + bingo.lastNumber).addClass('last-out');
	bingo.lastNumber = random;

	//$('#numbersOut span').text( ($('#numbersOut span').text()!='' ? $('#numbersOut span').text()+' / ' : '')+random);
	bingo.numbersHistory += (bingo.numbersHistory!='' ? ' / '+random : random);
}

function initBingo() {
	$('.numbers-board').html('');
	$('.bingoValues').html('');
	for (var i=1; i<=90; i++) $('.numbers-board').append('<span class="number-'+i+'">'+i+'</span>');
}

function checkCardBingo(cardNumber) {
	var currentCard = jsonCards['c'+cardNumber];
	var checkBingo = true;
	for (var i=0; i<currentCard.numbers.length; i++) {
		if ($.inArray(parseInt(currentCard.numbers[i],10), bingo.selectedNumbers) == -1) {
			checkBingo = false;
			break;
		}
	}
	if (checkBingo) {
		for (var i=0; i<currentCard.numbers.length; i++) {
			$('.numbers-board span.number-' + parseInt(currentCard.numbers[i],10)).addClass('bingook');
		}
		$('#btnBingo').click();
	}else{
		var message = new SpeechSynthesisUtterance('Bingo incorrecto.');
		message.lang='pt-BR';
		window.speechSynthesis.speak(message);
	}
}

function checkCardLine(cardNumber) {
	var currentCard = jsonCards['c'+cardNumber];
	var cardLines = currentCard.lines;
	var checkLine = false;
	for (var i=0; i<currentCard.lines.length; i++) {
		var line = currentCard.lines[i];
		var currentLine = true;
		for (var j=0; j<line.length; j++) {
			if ($.inArray(parseInt(line[j],10), bingo.selectedNumbers) == -1) {
				currentLine = false;
				break;
			}
		}
		if (currentLine) {
			for (var j=0; j<line.length; j++) {
				$('.numbers-board span.number-' + parseInt(line[j],10)).addClass('lineok');
			}

			checkLine = true;
			break;
		}
	}
	if (checkLine) {
		$('#btnLine').click();
	}else{
		var message = new SpeechSynthesisUtterance('Linha incorrecta.');
		message.lang='pt-BR';
		window.speechSynthesis.speak(message);
	}
}


(function($) {
	"use strict"; // Start of use strict
	$(window).bind('hashchange');
	$(window).trigger('hashchange');
	$(window).scroll( function() { /*disableScroll();*/ pageScroll(); } );
	$(window).resize(function() { windowOnResize(); });
	$(window).ready(function() {
		var myWidth, myHeight;
		if( typeof( window.innerWidth ) == 'number' ) { myWidth = window.innerWidth; myHeight = window.innerHeight; }
		else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) { myWidth = document.documentElement.clientWidth; myHeight = document.documentElement.clientHeight; }
		else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) { myWidth = document.body.clientWidth; myHeight = document.body.clientHeight; }
		browserWidth = myWidth;
		browserHeight = myHeight;

	});
	$(window).on('load',function() {
		initBingo();
		$('#btnGenerate').click(function() {
			if ($(this).val()=='Iniciar') {
				$('.numbers-board span').removeClass('lineok');
				$('.numbers-board span').removeClass('bingook');
				var msg_aux = new SpeechSynthesisUtterance('Primeiro numero:');
				msg_aux.lang='pt-BR';
				window.speechSynthesis.speak(msg_aux);
				$('#btnNewGame').prop('disabled',true);
				$(this).val('Parar');
				$(this).addClass('playing');
				setTimeout(function() {
					generateNumber();
					playInterval = setInterval(function() { generateNumber(); },(bingo.turbo ? 2750 : 4000));
				},1000);
			}else if ($(this).val()=='Continuar') {
				$('.numbers-board span').removeClass('lineok');
				$('.numbers-board span').removeClass('bingook');
				var msg_aux = new SpeechSynthesisUtterance('Continuemos para '+(bingo.lineStatus ? 'Bingo' : 'Linha')+'. Seguinte numero:');
				msg_aux.lang='pt-BR';
				window.speechSynthesis.speak(msg_aux);
				$(this).val('Parar');
				$(this).addClass('playing');
				setTimeout(function() {
					generateNumber();
					playInterval = setInterval(function() { generateNumber(); },(bingo.turbo ? 2750 : 4000));
				},3000);
			}else if ($(this).val()=='Parar') {
				$(this).val('Continuar');
				$(this).removeClass('playing');
				clearInterval(playInterval);
			}
		});
		$('#btnTurbo').bind('click',function() {
			if ($(this).hasClass('off')) {
				$(this).removeClass('off');
				$(this).addClass('on');
				bingo.turbo = true;
			}else{
				$(this).removeClass('on');
				$(this).addClass('off');
				bingo.turbo = false;
			}
			if ($('#btnGenerate').val()=='Parar') {
				clearInterval(playInterval);
				playInterval = setInterval(function() { generateNumber(); },(bingo.turbo ? 2750 : 4000));
			}
		});
		$('#btnHistory').bind('click',function() {
			alert(bingo.numbersHistory);
		});
		$('#btnCheckBingo').bind('click',function() {
			$('.numbers-board span').removeClass('lineok');
			$('.numbers-board span').removeClass('bingook');
			var cardNumber = prompt("Número Cartão?");
			if (cardNumber!=null) { checkCardBingo(cardNumber); }
		});
		$('#btnCheckLine').bind('click',function() {
			$('.numbers-board span').removeClass('lineok');
			$('.numbers-board span').removeClass('bingook');
			var cardNumber = prompt("Número Cartão?");
			if (cardNumber!=null) { checkCardLine(cardNumber); }
		});
		$('#btnLine').bind('click',function() {
			var msg_aux = new SpeechSynthesisUtterance('Linha correcta! Mais alguma linha?');
			msg_aux.lang='pt-BR';
			window.speechSynthesis.speak(msg_aux);
			bingo.lineStatus = true;
			/*
			if (confirm('Linha correcta! Mais alguma linha?')) {
				$('#btnLine').click();
			} else {
				var msg_aux2 = new SpeechSynthesisUtterance('Continuemos para Bingo!');
				msg_aux2.lang='pt-BR';
				window.speechSynthesis.speak(msg_aux2);
			}
			*/
		});
		$('#btnBingo').bind('click',function() {
			var bingoAudio = document.getElementById('bingoSound');
			bingo.bingoStatus = true;
			bingoAudio.play();
			setTimeout(function() {
				var msg_aux = new SpeechSynthesisUtterance('Bingo correcto! Mais algum bingo?');
				msg_aux.lang='pt-BR';
				window.speechSynthesis.speak(msg_aux);
			},1500);
			confetti.start();
			$('#btnNewGame').prop('disabled',false);
		});
		$('#btnNewGame').bind('click',function() {
			$('.numbers-board span').removeClass('lineok');
			$('.numbers-board span').removeClass('bingook');
			if (bingo.bingoStatus) {
				var introMessage = new SpeechSynthesisUtterance('Jogada Terminada.');
				introMessage.lang='pt-BR';
				window.speechSynthesis.speak(introMessage);
			}

			confetti.stop();

			$('#btnGenerate').val('Iniciar');
			$('#btnGenerate').removeClass('playing');

			$('.bigNumberDisplay span').text('00');
			$('.bigNumberDisplay span.counter').text('(0)');

			bingo.lastNumber = 0;
			bingo.selectedNumbers = [];
			bingo.numbersHistory = '';
			bingo.lineStatus = false;
			bingo.bingoStatus = false;
			initBingo();

			var numPersons = prompt("Número Jogadores?","6");
			var playValue = prompt("Valor Jogada?","0.5");

			if (numPersons!=null && playValue!=null) {
				var valorBingo = (numPersons*playValue)*0.5;
				var valorLinha = (numPersons*playValue)*0.25;
				var valorAcumulado = (numPersons*playValue)*0.25;
				var msg_aux = new SpeechSynthesisUtterance('Valor Bingo: '+valorBingo+' euros. Valor Linha: '+valorLinha+' euros. Valor acumulado: mais '+valorAcumulado+' euros.');
				msg_aux.lang='pt-BR';
				window.speechSynthesis.speak(msg_aux);

				$('.bingoValues').html('Bingo: '+valorBingo+'€<br />Linha: '+valorLinha+'€<br />Acumulado: +'+valorAcumulado+'€');

				setTimeout(function() {
					var introMessage = new SpeechSynthesisUtterance('Todos Prontos? Vamos começar.');
					introMessage.lang='pt-BR';
					window.speechSynthesis.speak(introMessage);
				},1500);
			}

		});
	});

})(jQuery); // End of use strict


var browserWidth = 0;
var browserHeight = 0;

var playInterval = null;
var bingo = {
	turbo: false,
	lineStatus: false,
	bingoStatus: false,
	lastNumber: 0,
	selectedNumbers: [],
	generateRandom: function() {
		var min = 1;
		var max = 90;
		var random = Math.floor(Math.random() * (max - min + 1)) + min;
		return random;
	},
	generateNextRandom: function() {
		if (bingo.selectedNumbers.length > 89) {
			alert("All numbers Exhausted");
			return 0;
		}
		var random = bingo.generateRandom();
		while ($.inArray(random, bingo.selectedNumbers) > -1) {
			random = bingo.generateRandom();
		}
		bingo.selectedNumbers.push(random);
		return random;
	},
	numbersHistory: ''
};
