(function(){
  'use strict';
  /**
   * Calendar constructor
   * @constructor
   */
  function Calendar(elem){
    // Add calendar template
    this.calendar = document.createElement('div');
    this.calendar.classList.add('calendar');
    elem.appendChild(this.calendar);
    this.calendar.innerHTML = this._template();

    // Get date values
    this.year = new Date().getFullYear();
    this.currentYear = this.year;
    this.monthNumber = new Date().getMonth();
    this.currentMonth = this.monthNumber;
    this.monthName = this.monthNames[new Date().getMonth()];
    this.date = new Date().getDate();
    this.firstDay = new Date(this.year, this.monthNumber, 1).getDay();

    if(this.firstDay == 0){
      this.firstDay = 7;
    }

    // Add event listeners for buttons
    var prevBut = this.calendar.getElementsByClassName('l-btn')[0],
        nextBut = this.calendar.getElementsByClassName('r-btn')[0];

    prevBut.addEventListener('click', this.prevMonth.bind(this));
    nextBut.addEventListener('click', this.nextMonth.bind(this));

    this.renderGrid();
  }

  // MonthNames property
  Object.defineProperty(Calendar.prototype, 'monthNames', {
    value : ['January','February','March','April','May','June','July','August','September','October','November','December'],
    writable : false
  });

  // MonthDays property
  Object.defineProperty(Calendar.prototype, 'monthDays', {
    get : function(){
      if(this.year % 4 == 0 && this.year % 100 != 0 || this.year % 400 == 0){
        return [31,29,31,30,31,30,31,31,30,31,30,31];
      }else{
        return [31,28,31,30,31,30,31,31,30,31,30,31];
      }
    }
  });

  // Render calendar grid
  Calendar.prototype.renderGrid = function(){
    var gridBlock = this.calendar.getElementsByClassName('c-grid')[0],
        counter = 1;

    gridBlock.innerHTML = '';

    // Render grid
    for(var i=0; i<=42; i++){
      var elem = document.createElement('div');
      elem.classList.add('c-grid-wrap');

      var elem2 = document.createElement('div');
      elem.appendChild(elem2);

      // Add calendar cells
      if(i >= this.firstDay-1 && counter <= this.monthDays[this.monthNumber]){
        elem.classList.add('c-grid-block');
        elem.setAttribute('index', counter.toString());
        elem2.classList.add('inner');
        elem2.innerHTML = counter;

        counter++;
      }

      gridBlock.appendChild(elem);
    }

    this.setCurrentDate();

    // Add event listener for calendar cells
    var gridContainer = this.calendar.getElementsByClassName('c-grid')[0];
    gridContainer.addEventListener('click', this.setActiveDate.bind(this))
  };

  // Set current date
  Calendar.prototype.setCurrentDate = function(){
    this.calendar.getElementsByClassName('c-year')[0].innerHTML = this.year + ' ' + this.monthName;
    var elem = this.calendar.getElementsByClassName('c-grid-block');

    for(var i=0; i<elem.length; i++){
      if(elem[i].getAttribute('index') == this.date && this.monthNumber == this.currentMonth && this.year == this.currentYear){
        elem[i].classList.add('active');
      }
    }
  };

  // Get prev month
  Calendar.prototype.prevMonth = function(){
    if(this.year > 0){
      this.monthNumber--;

      if(this.monthNumber < 0){
        this.monthNumber = 11;
        this.year--;
      }

      this.changeDateValues();
    }
  };

  // Get next month
  Calendar.prototype.nextMonth = function(){
    this.monthNumber++;

    if(this.monthNumber > 11){
      this.monthNumber = 0;
      this.year++;
    }

    this.changeDateValues();
  };

  // Change date values after changing month
  Calendar.prototype.changeDateValues = function(){
    this.monthName = this.monthNames[this.monthNumber];
    this.firstDay = new Date(this.year, this.monthNumber, 1).getDay();

    if(this.firstDay == 0){
      this.firstDay = 7;
    }

    this.renderGrid();
  };

  // Set new active date
  Calendar.prototype.setActiveDate = function(event){
    var that = this;

    // Clear active class of current cell
    function clearActiveClass(){
      var elems = that.calendar.getElementsByClassName('c-grid-block');

      for(var i=0; i<elems.length; i++){
        elems[i].classList.remove('active');
      }
    }

    // Add active class for selected element
    if(event.target.classList.contains('c-grid-block')){
      clearActiveClass();

      event.target.classList.add('active');

      this.date = parseInt(event.target.getAttribute('index'));
      this.currentMonth = this.monthNumber;
    }else if(event.target.className === 'inner'){
      clearActiveClass();

      event.target.parentElement.classList.add('active');

      this.date = parseInt(event.target.innerHTML);
      this.currentMonth = this.monthNumber;
      this.currentYear = this.year;
    }
  };

  // Calendar template
  Calendar.prototype._template = function(){
    return  '<div class="c-header">' +
      '<div class="c-btn l-btn"><div>Prev</div></div>' +
      '<div class="c-year"></div>' +
      '<div class="c-btn r-btn"><div>Next</div></div>' +
      '</div>' +
      '<div class="c-days">' +
      '<div class="c-dayname"><div>Mon</div></div>' +
      '<div class="c-dayname"><div>Tue</div></div>' +
      '<div class="c-dayname"><div>Wed</div></div>' +
      '<div class="c-dayname"><div>Thu</div></div>' +
      '<div class="c-dayname"><div>Fri</div></div>' +
      '<div class="c-dayname"><div>Sat</div></div>' +
      '<div class="c-dayname"><div>Sun</div></div>' +
      '</div>' +
      '<div class="c-grid"></div>';
  };

  // Get elements by data-attribute
  function getElementsByData(){
    var matchingElements;

    if(typeof document.querySelectorAll !== 'undefined'){
      matchingElements = document.querySelectorAll('[data-calendar]');
    }else{
      var getAllElementsWithAttribute = function(attribute){
        var matchingElements = [],
          allElements = document.getElementsByTagName('*');

        for(var i = 0, n = allElements.length; i < n; i++){
          if(allElements[i].getAttribute(attribute) !== null){
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
          }
        }
      };

      matchingElements = getAllElementsWithAttribute('data-calendar');
    }

    return matchingElements;
  }

  // Create new Calendar for every element with data-attribute 'data-calendar'
  function factory(){
    var elements = getElementsByData();

    if(elements.length != 0){
      for(var i=0; i<elements.length; i++){
        new Calendar(elements[i]);
      }
    }
  }

  factory();
})();
