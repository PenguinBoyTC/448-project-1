function Event(name, color, date, blocks, people) {
  this.bar = name;
  this.bar = color;
  this.bar = date;
  this.bar = blocks;
  this.bar = people;
}

// class methods
Event.prototype.print = function() {
   console.log(this)
};

// export the class
module.exports = Event;