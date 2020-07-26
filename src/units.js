const BN = require("bn.js");
const numberToBN = require("number-to-bn");
const negative1 = new BN(-1);
const zero = new BN(0);

const unitMap = {
  nozaran: "0",
  aran: "1",
  karan: "1000",
  maran: "1000000",
  garan: "1000000000",
  microzaran: "1000000000000",
  milizaran: "1000000000000000",
  zaran: "1000000000000000000",
  kzaran: "1000000000000000000000",
};

function getValueOfUnit(unitInput) {
  const unit = unitInput ? unitInput.toLowerCase() : "zaran";
  var unitValue = unitMap[unit]; // eslint-disable-line

  if (typeof unitValue !== "string") {
    throw new Error(
      `the unit provided ${unitInput} doesn't exists, please use the one of the following units ${JSON.stringify(
        unitMap,
        null,
        2
      )}`
    );
  }

  return new BN(unitValue, 10);
}

function numberToString(arg) {
  if (typeof arg === "string") {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error(
        `while converting number to string, invalid number value '${arg}', should be a number matching (^-?[0-9.]+).`
      );
    }
    return arg;
  } else if (typeof arg === "number") {
    return String(arg);
  } else if (
    typeof arg === "object" &&
    arg.toString &&
    (arg.toTwos || arg.dividedToIntegerBy)
  ) {
    if (arg.toPrecision) {
      return String(arg.toPrecision());
    } else {
      return arg.toString(10);
    }
  }
  throw new Error(
    `while converting number to string, invalid number value '${arg}' type ${typeof arg}.`
  );
}

function fromAran(araninput, unit, optionsInput) {
  var aran = numberToBN(araninput);
  var negative = aran.lt(zero);
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;
  const options = optionsInput || {};

  if (negative) {
    aran = aran.mul(negative1);
  }

  var fraction = aran.mod(base).toString(10);

  while (fraction.length < baseLength) {
    fraction = `0${fraction}`;
  }

  if (!options.pad) {
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  }

  var whole = aran.div(base).toString(10);

  if (options.commify) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var value = `${whole}${fraction == "0" ? "" : `.${fraction}`}`;

  if (negative) {
    value = `-${value}`;
  }

  return value;
}

function toAran(zaraninput, unit) {
  var zaran = numberToString(zaraninput); // eslint-disable-line
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;

  // Is it negative?
  var negative = zaran.substring(0, 1) === "-"; // eslint-disable-line
  if (negative) {
    zaran = zaran.substring(1);
  }

  if (zaran === ".") {
    throw new Error(
      `while converting number ${zaraninput} to aran, invalid value`
    );
  }

  // Split it into a whole and fractional part
  var comps = zaran.split("."); // eslint-disable-line
  if (comps.length > 2) {
    throw new Error(
      `while converting number ${zaraninput} to aran,  too many decimal points`
    );
  }

  var whole = comps[0],
    fraction = comps[1]; // eslint-disable-line

  if (!whole) {
    whole = "0";
  }
  if (!fraction) {
    fraction = "0";
  }
  if (fraction.length > baseLength) {
    throw new Error(
      `while converting number ${zaraninput} to aran, too many decimal places`
    );
  }

  while (fraction.length < baseLength) {
    fraction += "0";
  }

  whole = new BN(whole);
  fraction = new BN(fraction);
  var aran = whole.mul(base).add(fraction); // eslint-disable-line

  if (negative) {
    aran = aran.mul(negative1);
  }

  return new BN(aran.toString(10), 10);
}

export default {
  toAran,
  fromAran,
};
