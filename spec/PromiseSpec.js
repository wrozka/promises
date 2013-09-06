describe("Promise", function() {
  var expectNotToBeCalled, promise, callback, anotherCallback;

  function fake(name) {
    return jasmine.createSpy(name).andCallFake(function(value) {
      return value;
    });
  }

  beforeEach(function() {
    promise = new Promise();
    expectNotToBeCalled = jasmine.createSpy("should not be called");
    callback = fake("a callback");
    anotherCallback = fake("another callback");
  });

  afterEach(function() {
    expect(expectNotToBeCalled).not.toHaveBeenCalled();
  });

  it("runs the success callback when promise was resolved", function() {
    promise.then(callback, expectNotToBeCalled);

    promise.resolve("Hurray!");

    expect(callback).toHaveBeenCalledWith("Hurray!");
  });

  it("runs the error callback when promise was rejected", function() {
    promise.then(expectNotToBeCalled, callback);

    promise.reject("Oops!");

    expect(callback).toHaveBeenCalledWith("Oops!");
  });

  it("allows binding a callback to already resolved promise", function() {
    promise.resolve("Hurray!");

    promise.then(callback, expectNotToBeCalled)

    expect(callback).toHaveBeenCalledWith("Hurray!")
  });

  it("allows binding an errback to already rejected promise", function() {
    promise.reject("Oops!");

    promise.then(expectNotToBeCalled, callback);

    expect(callback).toHaveBeenCalledWith("Oops!")
  });

  it("runs all success callback when all promises were resolved", function() {
    promise.then(
      function(status) { return "resolved: " + status; },
      expectNotToBeCalled
    ).then(callback, expectNotToBeCalled);

    promise.resolve("Hurray!");

    expect(callback).toHaveBeenCalledWith("resolved: Hurray!");
  });

  it("propagates the failure", function() {
    promise.then(expectNotToBeCalled)
           .then(expectNotToBeCalled)
           .then(expectNotToBeCalled, callback);


    promise.reject("Oops!");

    expect(callback).toHaveBeenCalledWith("Oops!");
  });

  it("propagates the failure until error handler returns any value", function() {
    promise.then(expectNotToBeCalled)
           .then(expectNotToBeCalled, function(error) { return "saved " + error; })
           .then(callback, expectNotToBeCalled);

    promise.reject("Oops!");

    expect(callback).toHaveBeenCalledWith("saved Oops!");
  });

  it("propagates the success", function() {
    promise.then(callback)
           .then()
           .then(anotherCallback);


    promise.resolve("Hurray!");

    expect(callback).toHaveBeenCalledWith("Hurray!");
    expect(anotherCallback).toHaveBeenCalledWith("Hurray!");
  });
});
