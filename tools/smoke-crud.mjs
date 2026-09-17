// CRUD boot smoke test (no DOM beyond stubs)
global.window = global;
global.document = {
  readyState: "complete",
  querySelector: function () {
    return null;
  },
  querySelectorAll: function () {
    return [];
  },
  addEventListener: function () {},
  dispatchEvent: function () {},
  createElement: function () {
    return {
      style: {},
      setAttribute: function () {},
      appendChild: function () {},
    };
  },
  getAttribute: function () {
    return null;
  },
  body: { appendChild: function () {} },
};
global.CustomEvent = function () {};
global.bootstrap = undefined;
await import("../js/dashboard-crud.js");
var ok = global.MR && global.MR.__crudReady;
console.log(
  ok
    ? "CRUD BOOT OK — modules: " + Object.keys(global.MR.__crudReady).join(", ")
    : "CRUD BOOT FAILED",
);
