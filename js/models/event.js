function Event(name,color,date,blocks,people) {
  this.name = name;
  this.color = color;
  this.date = date;
  this.blocks = blocks;
  this.people = people;
}

// class methods
Event.prototype.print = function() {
   console.log(this)
};
