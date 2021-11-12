"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

var _tonweb = _interopRequireWildcard(require("tonweb"));

var _helpers = require("./helpers");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let tnw = new _tonweb.default();

async function init() {
  const onTransaction = async shortTx => {
    console.log('TX ' + shortTx.account);
  };

  const storage = new _helpers.BlocksStorageImpl();
  let blcs = new _tonweb.BlockSubscribe(tnw.provider, storage, onTransaction);
  await blcs.start(); // let transactions = await 

  tnw.getTransactions("Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r").then(val => {
    console.log(val);
  });
}

init();