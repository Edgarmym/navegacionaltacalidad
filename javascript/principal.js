
/******************************************************************************************************************************************************/
/******************************************************************************************************************************************************/
/******************************************************************************************************************************************************/
/* Diseño adaptable */
/******************************************************************************************************************************************************/
/******************************************************************************************************************************************************/
/******************************************************************************************************************************************************/

(function($){

	// Objeto que almacena los datos de los diseños
	var disenyoAdaptable = function (elemento, modos, opciones) {
		this.modoAct = "";
		this.modos = modos; // modos disponibles
		this.elemento = elemento; // elemento DOM de referencia
		this.opciones = $.extend({prefijo: "modo-", sufijoMin: "-min", sufijoMax: "-max"}, opciones); // opciones
		this.ajustar = function () {
			// Se ha escalado la ventana, mirar a que modo corresponde

			// ancho y alto del espacio de trabajo
		    var ancho = document.documentElement.clientWidth  || document.body.clientWidth || window.innerWidth;
			var alto = document.documentElement.clientHeight  || document.body.clientHeight || window.innerHeight;

			// Establezco el primer modo que cumpla sus restricciones
			var i, j;
			var modoNuevo = "";
			for (i=0 ; i<this.modos.length ; i++)
			{
				if (typeof this.modos[i].anchoMin != "undefined" && ancho < this.modos[i].anchoMin) continue;
				if (typeof this.modos[i].anchoMax != "undefined" && ancho > this.modos[i].anchoMax) continue;
				if (typeof this.modos[i].altoMin != "undefined" && alto < this.modos[i].altoMin) continue;
				if (typeof this.modos[i].altoMax != "undefined" && alto > this.modos[i].altoMax) continue;
				// Este modo cumple todas las condiciones
				modoNuevo = this.modos[i].tipo;
				break;
			}
			if (this.modoAct == modoNuevo) return; // El modo es el mismo, no hacer nada

			// Aplico el nuevo modo
			if (this.modoAct != "") $(this.elemento).removeClass(this.opciones.prefijo + this.modoAct);
			if (modoNuevo != "") $(this.elemento).addClass(this.opciones.prefijo + modoNuevo);

			// Aplico los modos acumulados
			for (j=0 ; j<this.modos.length ; j++)
			{
				if (modoNuevo != "" && j >= i)
					$(this.elemento).addClass(this.opciones.prefijo + this.modos[j].tipo + this.opciones.sufijoMin);
				else
					$(this.elemento).removeClass(this.opciones.prefijo + this.modos[j].tipo + this.opciones.sufijoMin);
				if (j <= i)
					$(this.elemento).addClass(this.opciones.prefijo + this.modos[j].tipo + this.opciones.sufijoMax);
				else
					$(this.elemento).removeClass(this.opciones.prefijo + this.modos[j].tipo + this.opciones.sufijoMax);
			}

			// Invoco el manejador
			if (typeof this.opciones.manejador == "function") this.opciones.manejador(this.modoAct, modoNuevo)

			// Realizo el cambio
			this.modoAct = modoNuevo;
		};
	}

	// Creo un nuevo método para JQuery
	$.fn.disenyoAdaptable = function(modos, opciones) {
		var da = new disenyoAdaptable (this, modos, opciones);
		//$(this).data("disenyoAdaptable", da);
		da.ajustar();
		$(window).resize(function() {da.ajustar()});
	}

})(jQuery);


$(document).ready(function()
{
    // Encapsula contenido entre bloques. El inicio del bloque viene definido por 'cabecera' (h1, h2, h3,...)
    // Utiliza 'bloque' como encapsulador del bloque
    // Utiliza 'contenido' como encapsulador del contenido del bloque
	   encapsularBloque("h4", "<div class='bloque' />", "<div class='blq-contenido' />");

  	// Igualamos la altura de los bloques en la plantilla de 2 areas y 3 areas
    /*$("div.areas > div.area1").each(function(){
		var maxHeight = calculaAlturaMaximaHermanos(this);
      	$(this).parent().children().height(maxHeight);
    });
    $("div.areas > div.area3_1").each(function(){
		var maxHeight = calculaAlturaMaximaHermanos(this);
      	$(this).parent().children().height(maxHeight);
    });*/


	// ---- Menu movil ----

	// Crear el menu del movil copiando otros menus
	$("#menu-movil > ul > li").each(function() { // recorrer los elementos del menu movil
		var c = $(this).attr("class"); // obtener la clase
		var $cnt = $("." + c).not("#menu-movil *"); // buscar esa clase en otro sitio
        $("#menu-movil").append("<div class='" + c + "'></div>"); // añadir el contenedor para ese submenu
		$("#menu-movil div." + c).append($cnt.clone().attr({"id": "", "class": c})).hide(); // realizar una copia
    });

	// Activar el primer submenu
	$("#menu-movil > ul > li").first().addClass("desplegado");
	$("#menu-movil > div").first().show();

	// Mostrar/ocultar el menu movil
	$("#mostrar-menu").click(function() {
		menuMostrar();
	});

	// Cambiar de submenu
	$("#menu-movil > ul > li").click(function() {
		if ($(this).hasClass("desplegado")) return;
		var c = $(this).attr("class");
		$("#menu-movil > ul > li.desplegado").removeClass("desplegado");
		$(this).addClass("desplegado");
		$("#menu-movil > div:visible").slideUp(function() { $("#menu-movil > div." + c).slideDown(); });
	});

	// ---- Diseño adaptable ----

	var modos = // modos soportados
	[
		{tipo: "gra", anchoMin: 976}, // diseño grande. Con menu, varias columnas, diseño fijo
		{tipo: "med", anchoMin: 720}, // diseño mediano. Con menu, varias columnas, diseño fluido
		{tipo: "peq", anchoMin: 540}, // diseño pequeño. Con menu, una sola columna, diseño fluido
		{tipo: "mob", anchoMin: 0} // diseño movil. Se ocultan los menus, una sola columna
	];
	$("body").disenyoAdaptable(modos, {manejador: ajustar}); // Autoajustar

	// ---- Menus ----

	// Menus desplegables
	$("#menu-movil > div > ul > li > ul").parent().addClass("desplegable");
	//$("#menu li > ul").parent().addClass("desplegable desplegado");
  //$("#menu ul.mm-menu > li > ul").parent().addClass("desplegable desplegado");

	// Desplegar los items menus
	$(".desplegable").click(function() {
		$(this).toggleClass("desplegado").children("ul").slideToggle();


        var flecha = $(this).children("div").first();
        if (flecha != null && flecha.hasClass("i-flecha_abajo"))
        {
          flecha.removeClass("i-flecha_abajo")
          flecha.addClass("i-flecha_arriba")
        }
        else
        {
          flecha.removeClass("i-flecha_arriba")
          flecha.addClass("i-flecha_abajo")
        }


		return false;

	});

  $(".desplegable div").click(function() {
    $(this).parent().toggleClass("desplegado").children("ul").slideToggle();

    var flecha = $(this);
    if (flecha != null && flecha.hasClass("i-flecha_abajo"))
    {
      flecha.removeClass("i-flecha_abajo")
      flecha.addClass("i-flecha_arriba")
    }
    else
    {
      flecha.removeClass("i-flecha_arriba")
      flecha.addClass("i-flecha_abajo")
    }
	});

	$(".desplegable ul").click(function() {return false;});

	// Mostrar / Ocultar herramientas
	$(".mostrar-herramientas").click(function() {
		$(this).parent().children(".herramientas").slideToggle();
		$(this).toggleClass("i-flecha_arriba_blanca");
	});

	// En version movil mostrar/ocultar bloques de contenido
	$(document).on('click', '.bloque h4', function(){
		if (! $("body").hasClass("modo-mob")) return;
        if ($(this).closest('.slider_horizontal').length>0) return;
		$(this).parent().find(".blq-contenido").slideToggle(500);
		$(this).parent().toggleClass("desplegado");
	});

	// Carrusel portada
	$("#foto-portada div").hide();
	animarPortada();

	// Anclar cabecera en el modo movil
	$(window).on("scroll touchmove", anclarCabecera);


	/* Desplegables */

	// Apertura y cierre
	$("*").click(function(event){
		// Obtengo el desplegable donde he pulsado (si es asi)
		var $p = $(this).parents().filter(".desplegable");
		if ($p.length > 0 && $(this).parents().andSelf().hasClass("desplegar")) // Es un desplegable y he pulsado en la zona actuadora
		{
			// Abro / cierro el desplegable
			if ($p.hasClass("desplegado"))
			{
				// Ya esta abierto

				if ($p.hasClass("autoabrir")) return;

				if ($p.hasClass("sensible"))
				{
					// Estaba en modo sensible. Lo dejo abierto normal (no se autocierra al salir)
					$p.removeClass("sensible");
				}
				else
				{
					// Hay que cerrar el desplegable
					$p.find(".ver-abierto").stop().slideUp(function(){$p.removeClass("desplegado");});
				}
			}
			else
			{
				// Si voy a desplegar, cierro otros desplegables
				$(".desplegable.desplegado.autocerrar .ver-abierto").stop().slideUp(function(){$(this).parents(".desplegable.desplegado.autocerrar").removeClass("desplegado");});
				// Despliego
				$p.addClass("desplegado").find(".ver-abierto").stop().slideDown();

				// Situo el foco en el primer campo
				$p.find("input").first().focus();
			}
			event.stopPropagation();

      if ($p.hasClass("no-propagar"))
			{
			  return false;
      }
      else
      {
        return true;
      }
		}

		// Si he pulsado dentro del desplegable no hacer nada
		if ($(this).parents().andSelf().filter(".desplegable").length > 0)
		{
			event.stopPropagation();
			return;
		}
		// Si he pulsado fuera del desplegable cerrar
		$p = $(".desplegable.desplegado.autocerrar")
		$p.find(".ver-abierto").stop().slideUp(function(){$p.removeClass("desplegado");});
		return;
	});

	/* ---- Autodesplegables (se despliegan al entrar en un input) ---- */

	// Autodesplegables: Desplegar
	$(".desplegable.autoabrir:not(desplegado) input").focus(function(){
		$(this).triggerHandler("click");
	});

	/* Hacer que el menu sea sensible al ratón */
	$("#zona-menu .contenido").hover(
		function(){
			if ($(this).hasClass("desplegado")) return;
			$(this).addClass("sensible");
			$("#menu-principal").triggerHandler("click");
		},
		function(){
			if (! $(this).hasClass("sensible")) return;
			$(this).removeClass("sensible")
			$("#menu-principal").triggerHandler("click");
		}
	);

 	// Abrir enlaces en una nueva ventana
    $("a[rel='enterno']").attr('target','_blank');
    $("a[rel='ventananueva']").attr('target','_blank');

  	$(document).on('click', "a[rel='webmail']", function(){
      window.open($(this).attr('href'),'titol', 'toolbar=no,menubar=no,statusbar=no,resizable=yes,width=820,height=600');
                    return false;
                });




  	/* Actividades */

    var template_item_listado  = '<div class="evento" id="">';
        template_item_listado += '  <div class="imagenevento">';
        template_item_listado += '    <img title="" alt="" src="">';
        template_item_listado += '  </div>';
        template_item_listado += '  <div class="tipoevento" href="#"></div>';
        template_item_listado += '  <span><a class="tituloevento" href="#"></a></span>';
        template_item_listado += '  <div class="fechaevento"></div>';
        template_item_listado += '  <div class="fechainsc"></div>';
        template_item_listado += '  <div class="lugar"></div>';
        template_item_listado += '</div>';

    var textos = {
            'es': {
                'inscripcion' : 'Fecha de inscripci&oacute;n: ',
                'al': ' a '
            },
            'va': {
                'inscripcion' : 'Data d\'inscripci&oacute;: ',
                'al': ' a '
            },
            'en': {
                'inscripcion' : 'Registration date: ',
                'al': ' to '
            }
        };


    $('div.actividades').each(
        function(i, elem) {
            var data = {};
            if ($(elem).data() && $(elem).data('mce-json'))
              data = eval("(" + $(elem).data('mce-json') + ")");
            var cargando = data.cargando || 'Cargando evento';
            var sineventos = data.sineventos || 'No hay eventos';
            $(elem).text(cargando);
            if ('agenda' in data) {
                var agenda = data.agenda;
                var tipos = '';
                var periodo = '';
                var idioma = 'es';
                var numero = '';
                var ua = false;
                if ('tipos' in data)
                    tipos = $.map(data.tipos, function (e) {return  e.id}).join(',');
                if ('periodo' in data && data.periodo!='T')
                    periodo = data.periodo;
                if ('idioma' in data)
                    idioma = data.idioma;
             	if ('num' in data)
                    numero = data.num;
                if ('ua' in data && data.ua) {
                    ua = true;
                }


                var url  = 'https://cvnet.cpd.ua.es/AgendaUA/api/Activitats/';
                    url += '?idioma=' + (idioma?idioma:'es') + '&';
                    url += 'agenda=' + (agenda?agenda:'');
                    url += '&llistaTipus=' + (tipos?tipos:'');
                    url += '&ua=' + ua;

                $.get(url, function( res ) {
                    jQuery(elem).removeClass('cargando');
                    var numEventos = 0;
                    if (res.length > 0) {
                        jQuery(elem).text('');
                        numEventos = res.length;
                      	if (numero && !isNaN(parseInt(numero)) && numEventos>parseInt(numero)) {
                    		res = $(res).slice(0, parseInt(numero));
		                }
                        $(res).each(function(i, e) {
                            var item = $.parseHTML(template_item_listado);
                            $(item).first().attr('id','evento_' + e.Id);
                            $(item).find('.tipoevento').text(e.Tipus);
                            $(item).find('.tituloevento').text(e.Titol);
                            if (e.Url!="") {
                              $(item).find('.tituloevento').attr('href', e.Url);
                            }
                            $(item).find('.fechaevento').text(e.Dates);
                            if (e.DataInscInici && e.DataInscFi)
                                $(item).find('.fechainsc').html(textos[idioma]['inscripcion'] + e.DataInscInici + textos[idioma]['al'] + e.DataInscFi);
                            $(item).find('.lugar').text(e.Lloc);
                            $(item).find('.imagenevento > img').attr({
                              	src: (e.Imagen?e.Imagen:'https://web.ua.es/es/comun/imagenes/-gestadm/logo-ua-smooth.png'),
                                title: e.Titol,
                                alt: e.Titol
                            });
                            if ('opciones' in data) {
                                if ('imagen' in data.opciones && !data.opciones.imagen) {
                                    $(item).find('.imagenevento').remove();
                                }
                                if ('lugar' in data.opciones && !data.opciones.lugar) {
                                    $(item).find('.lugar').remove();
                                }
                                if ('fecha' in data.opciones && !data.opciones.fecha) {
                                    $(item).find('.fechaevento').remove();
                                }
                                if ('fecha_insc' in data.opciones && !data.opciones.fecha_insc) {
                                    $(item).find('.fechainsc').remove();
                                }
                                if ('actividad' in data.opciones && !data.opciones.actividad) {
                                    $(item).find('.tipoevento').remove();
                                }
                            }
                            $(item).appendTo(jQuery(elem));
                        });
                    }
                    else {
                        jQuery(elem).text(sineventos);
                    }
                },
                'json');
            }
            else {
                jQuery(elem).text(sineventos);
            }
        }
    );


});


// Encapsula contenido entre bloques
// El inicio del bloque viene definido por 'cabecera' (h1, h2, h3,...)
// Utiliza 'bloque' como encapsulador del bloque
// Utiliza 'contenido' como encapsulador del contenido del bloque
function encapsularBloque (cabecera, bloque, contenido) {
	// Obtener el final de bloque. Si cabecera es 'h2' el final es 'h1, h2'
	var fin = cabecera;
	if (cabecera.length == 2 && cabecera.substr(0,1) == 'h')
		for (var i=parseInt(cabecera.substr(1))-1 ; i>0 ; i--)
			fin += ", h" + i;

    // No encapsular los webservices, ya devuelven el html encapsulado
  	fin += ', div.web-service-ua';

	// Encapsular
	$("body").find(cabecera + ":not(.nobloque)").each(function() {
  //  $("body").find(cabecera).each(function() {
        $(bloque) // crear el bloque
			.append($(contenido).append($(this).nextUntil(fin))) // mover los siguientes elementos hasta fin dentro del bloque (en el contenido)
			.insertAfter($(this)) // situar el bloque justo despues de la cabecera
			.prepend($(this)); // mover la cabecera al inicio del bloque
    });
}



function Busquedas() {
	var palabra = $('#q').val();

	if ($('input:radio[name=buscar-tipo]:checked').val() == 'buscar-persona') {
        $('#Buscar').val('PER');
		$('#Cuyo').val('NA');
		$('#Contiene').val('LIKE');
		$('#Que').val(palabra);
		$('#form-buscar').attr('action', 'https://cvnet.cpd.ua.es/Directorio/Home/Buscar');
		$('#form-buscar').attr('method', 'post');

		return true;
	}
	else if ($('input:radio[name=buscar-tipo]:checked').val() == 'buscar-unidad') {
        $('#Buscar').val('PER');
		$('#Cuyo').val('NA');
		$('#Contiene').val('LIKE');
		$('#Que').val(palabra);
		$('#form-buscar').attr('action', 'https://cvnet.cpd.ua.es/Directorio/Home/Buscar');
		$('#form-buscar').attr('method', 'post');

		return true;
	}
	else if ($('input:radio[name=buscar-tipo]:checked').val() == 'buscar-ua') {

        $('#sitesearch').val('ua.es');
		$('#form-buscar').attr('action', 'https://www.google.com/search');
		$('#form-buscar').attr('method', 'get');

		return true;
	}
	else { // buscar en sitio

		$('#form-buscar').attr('action', 'https://www.google.com/search');
		$('#form-buscar').attr('method', 'get');

		return true;
	}


	return false;
}

// Anima la imagen de la portada
function animarPortada()
{
	var n = $("#foto-portada div");
	var $act = $("#foto-portada div:visible");
	var $sig = null;
	if ($act.length)
	{
		$act.hide();
		$sig = $act.next("div");
	}

	if ($sig == null || $sig.length == 0)
	{
		$sig = $("#foto-portada div:first");
	}
	$sig.fadeIn(1000);
	setTimeout(animarPortada, 5000);
}

// Muestra / Oculta el menu móvil
function menuMostrar (mostrar)
{
	if (typeof mostrar == "undefined") // toggle
	{
		if ($("#mostrar-menu").hasClass("desplegado"))
			mostrar = false;
		else
			mostrar = true;
	}

	var ancho = $("#menu-movil").outerWidth(true);
	if (mostrar)
	{
		$("#menu-movil").css({"left":"-"+ancho+"px"}).show().animate({"left": "0px"},500);
		$("#marco-contenido").animate({"left": ancho+"px"},500);;
		$("#mostrar-menu").addClass("desplegado");
		if (cabAnclada) $("#cabecera-nivel2").animate({"left": ancho+"px"}, 500);
	}
	else
	{
		$("#menu-movil").animate({"left": "-"+ancho+"px"},500, function(){$(this).hide();});
		$("#marco-contenido").animate({"left": "0px"},500);
		$("#mostrar-menu").removeClass("desplegado");
		$("#cabecera-nivel2").animate({"left": "0px"}, 500);
	}
}

// Ajustar elementos al cambiar de modo de pantalla
function ajustar (modoAnt, modoNuevo)
{
	if (modoAnt == "mob") // salgo del modo mob
	{
		$("#menu li.desplegable").removeClass("desplegado").children("ul").show();
		menuMostrar(false);
		$(".bloque .blq-contenido").show();
		anclarCabecera(false);
		$("#buscar").append($("#form-buscar"));
		$("#form-buscar .ver-abierto").hide();
	}

	if (modoNuevo == "mob") // entro en el modo mob
	{
		$(".bloque .blq-contenido").hide();
      	$(".slider_horizontal .bloque .blq-contenido").css('display', 'block');
		$("#menu-movil div.mm-buscar").append($("#form-buscar"));
		$("#form-buscar .ver-abierto").show();
	}
}


// En modo movil, anclar la cabecera cuando se hace scroll
// Si se pasa un valor en anclar se fuerza el anclaje. Si no se autocalcula
var cabAnclada = 0;
function anclarCabecera (anclar)
{
	if (! $("body").hasClass("modo-mob")) return; // No estoy en el modo mob

	var wScroll = $(window).scrollTop();
	var cTop = $("#cabecera-nivel2").offset().top;

	if (anclar === true || (!cabAnclada && wScroll > cTop))
	{
		var lf = $("#cabecera-nivel2").offset().left;
		$("body").addClass("cab-anclada");
		$("#cabecera-nivel2").css("left", lf + "px");
		$("#cabecera-ua").css({"margin-bottom": $("#cabecera-nivel2").outerHeight() + "px"});
		cabAnclada = Math.round(cTop);
		return;
	}

	if (anclar === false || wScroll < cabAnclada-1)
	{
		$("#cabecera-ua").css({"margin-bottom": "0px"});
		$("body").removeClass("cab-anclada");
		cabAnclada = 0;
		return;
	}
}

function calculaAlturaMaximaHermanos(elm) {
	return Math.max.apply($(elm).height(), $(elm).siblings().map(function () {
    		return $(this).height();
		}).get());
}