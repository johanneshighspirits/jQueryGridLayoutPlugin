/*  =========================== jQuery Grid Layout plugin ========================== 
//  data-nav-image is a url for a thumbnail image

//  data-nav-headline is an optional text that will be shown on
//  top of the thumbnail image. If no data-nav-headline is provided,
//  the h3 text will be shown instead.

//  Example Html markup:
    <div id="uniqueId">
      <ul>
        <li data-nav-image="*.jpg" data-nav-headline="Short headline here">
          <h3>Headline</h3>
          <p>Content here</p>
        </li>
        <li data-nav-image="*.jpg">
          <h3>Headline</h3>
          <p>Content here</p>
        </li>
      <!-- ...add more <li>:s if needed -->
      </ul>
    </div>

//  Example: activate plugin and set up grid with 4 columns
  $(document).ready(function(e) {
    $("#uniqueId").gridLayout({columns:4});
  });
*/
(function($){
  $.fn.gridLayout = function(options) {
    var settings = $.extend({
      // Default settings
      columns: 3
    }, options );   

    var gridId = $(this).attr("id");
    $(this).addClass("grid");
    $("#" + gridId + " > ul").addClass("grid-content");

  // Setup grid
  var rows;
  var currentItem = 0;
  var openItemRowNr;

  function openGridItem(clickedLinkId){
    // Store active content height
    var openItemHeight = 0;
    openItemHeight = $("#" + gridId + " .grid-content-mask.active").height();

    // If already open, close grid item
    if($("#" + clickedLinkId + " a").hasClass("active")){
      // Deselect image
      $("#" + clickedLinkId + " a").removeClass("active");
      // Hide active content
      $("#" + gridId + " .grid-content-mask.active").css("height", "0px");
      $("#" + gridId + " .grid-content-mask.active").removeClass("active");
    }else{
      // Deselect image
      $("#" + gridId + " .grid-navigation li a.active").removeClass("active");
      // Empty container
      $("#" + gridId + " .grid-content-container").html("");
      // Select image
      $("#" + clickedLinkId + " a").addClass("active");
      // Hide active content
      $("#" + gridId + " .grid-content-mask.active").css("height", "0px");
      $("#" + gridId + " .grid-content-mask.active").removeClass("active");
      // Show clicked content
      var contentToShow = $("#" + clickedLinkId + " a").attr("href");
      var rowMaskId = $("#" + clickedLinkId + " a").attr("data-row-id");
      $(rowMaskId + " .grid-content-container").html($(contentToShow).html());
      var maskHeight = $(rowMaskId + " .grid-content-container").height() + 
      parseInt($("#" + gridId + " .grid-content-container").css("padding-top")) + 
      parseInt($("#" + gridId + " .grid-content-container").css("padding-bottom")) +
      parseInt($("#" + gridId + " .grid-content-container").css("margin-top")) + 
      parseInt($("#" + gridId + " .grid-content-container").css("margin-bottom"));
      $(rowMaskId).addClass("active").css("height", maskHeight);
      // Position pointer
      var pointerPosition = ($("#" + clickedLinkId).position().left + ($("#" + clickedLinkId).width() / 2) - 10 ) + "px";
      $("#" + gridId + " .itemPointer").css("left", pointerPosition);
    }
    var itemYPosition = $("#" + clickedLinkId).offset().top - 10;

    var rowId = $("#" + clickedLinkId + " a").attr("data-row-id");
    var rowNrIndex = rowId.lastIndexOf("-row-id-");
    var rowNr = parseInt(rowId.substring(rowNrIndex + 8));

    var correctPosition = itemYPosition;
    if (rowNr > openItemRowNr) {
      correctPosition = itemYPosition - openItemHeight;
    }
    $('body').animate({ scrollTop: correctPosition }, 300);

    // Set openItemRowNr
    openItemRowNr = rowNr;
  }

  // Calculate number of rows
  var numberOfItems = $("#" + gridId + " .grid-content > li").length;
  if(numberOfItems % settings.columns === 0){
    rows = numberOfItems / settings.columns;
  }else{
    var remainder = numberOfItems % settings.columns;
    rows = ((numberOfItems - remainder) / settings.columns) + 1;
  }
  var itemWidth = Math.floor((($("#" + gridId + ".grid").width() - (settings.columns * 2)) - ((settings.columns - 1) * 10)) / settings.columns);
  console.log("Grid navigation items width: " + itemWidth + "px.");
  var items = [];
  var currentRow = -1;
  $("#" + gridId + " .grid-content > li").each(function(index, element) {
    $(element).append('<div class="clearer"></div>');
    if(index % settings.columns === 0){
      currentRow++;
    }
    $(element).attr("id", gridId + "-grid-" + index);
    var directLink = $(element).hasClass('directLink') ? 'class="directLink" ' : '';
    var href = $(element).hasClass('directLink') ? 'href="' + $(element).find('a').attr("href") + '" ' : 'href="#' + gridId + '-grid-' + index + '" data-row-id="#' + gridId + '-grid-row-id-' + currentRow + '"';
    var navigationImageURL = $(element).attr("data-nav-image");
    var navigationHeadline = $(element).attr("data-nav-headline");
    var li = '<li id="' + gridId + '-grid-navigation-' + index + '" style="width: ' + itemWidth + 'px; margin-right:10px;"><a ' + directLink + href + '><img src="' + navigationImageURL + '"><div class="itemHeadline" style="width: ' + itemWidth + 'px;"><p>' + navigationHeadline + '</p></div></a></li>';
    if(navigationHeadline === undefined){
      if($(element).find("h3").html()){
        navigationHeadline = $(element).find("h3").html();
        li = '<li id="' + gridId + '-grid-navigation-' + index + '" style="width: ' + itemWidth + 'px; margin-right:10px;"><a ' + directLink + href + '><img src="' + navigationImageURL + '"><div class="itemHeadline" style="width: ' + itemWidth + 'px;"><p>' + navigationHeadline + '</p></div></a></li>';
      }else{
        li = '<li id="' + gridId + '-grid-navigation-' + index + '" style="width: ' + itemWidth + 'px; margin-right:10px;"><a ' + directLink + href + '><img src="' + navigationImageURL + '"></a></li>';
      }
    }
    items.push(li);
  });

    // Append elements to document
    for (var row = 0;  row < rows; row++) {
      // Print row
      $("#" + gridId).append('<ul id="' + gridId + '-grid-row-' + row + '" class="grid-navigation"></ul><div id="' + gridId + '-grid-row-id-' + row + '" class="grid-content-mask" style="height:0px;"><div class="itemPointer"></div><div class="grid-content-container"></div></div>');
      for(var column = 0; column < settings.columns; column++){
        // Print items
        $("#" + gridId + " #" + gridId + "-grid-row-" + row + ".grid-navigation").append(items[currentItem]);
        currentItem++;
      }
    }

    $("#" + gridId + " .grid-navigation > li").each(function(index, element){
      if((index + 1) % settings.columns === 0){
        $(element).css("margin-right", 0);
      }
    });

    $("#" + gridId + " .grid-content").hide();

    // Grid functions
    $("#" + gridId + " .grid-navigation > li a").click(function(e){
      if (!$(this).hasClass('directLink')) {
        e.preventDefault();
        openGridItem($(this).parent().attr("id"));
      }
    });

    // Open first grid item
    //openGridItem(gridId + " #" + gridId + "-grid-navigation-0");

    return this;
  };

}(jQuery));