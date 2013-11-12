function Queue() {
  this.head = null;
  this.tail = null;
  this.size = 0;
}

// add to end
Queue.prototype.enqueue = function(value) {
  var node = new Node(value, null);

  if (this.tail != null) {
    this.tail.next = node;
  }
  else {
    this.head = node;
  }

  this.tail = node;
  this.size++;
}

// peek at front
Queue.prototype.peek = function() {
  if (this.head == null) {
    console.log("Queue::peek Error!");
  }
  else {
    return this.head.value;
  }
}

// remove from front
Queue.prototype.dequeue = function() {
  if (this.head == null) {
    console.log("Queue::dequeue Error!");
  }
  else {
    var value = this.head.value;
    this.head = this.head.next;
    this.size--;

    if (this.head == null) {
      this.tail = null;
    }

    return value;
  }
}

function Node(value, next) {
  this.value = value;
  this.next = next;
}

exports.Queue = Queue;

