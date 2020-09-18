const readline = require("readline");

const UKMaskPrice = 65;
const GermanyMaskPrice = 100;
const UKGlovesPrice = 100;
const GermanyGlovesPrice = 150;
let UKGlovesCount = 100;
let UKMaskCount = 100;
let GermanyGlovesCount = 50;
let GermanyMaskCount = 100;
const transportCharges = 400;
const transportChargesDiscount = 320;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function prompt() {
  rl.question("Input : ", function (input) {
    let inputArr = input.split(':');
    let purchaseCountry = inputArr[0];
    let passport = (inputArr.length === 6) ? inputArr[1] : '';
    let gloves = inputArr[inputArr.indexOf('Gloves') + 1];
    let mask = inputArr[inputArr.indexOf('Mask') + 1];
    // minimizeSalePrice(purchaseCountry, passport, gloves, mask);
    minimizeSalePrice('UK', 'A', 125, 70);
    rl.question("Do you to continue? Type Y or N : ", function (ans) {
      if (ans === 'Y' || ans === 'y') {
        prompt();
      } else {
        rl.close();
      }
    });
  })
}
prompt();

rl.on("close", function () {
  process.exit(0);
});

function findCountry(passport) {
  if (passport.charAt(0) === 'A')
    return "Germany";
  else
    return "UK";
}

function calTransportCost(typeCount, country, passport) {
  let totalUnit = Math.ceil(typeCount / 10);
  return (passport && findCountry(passport) === country) ?
    totalUnit * transportChargesDiscount : totalUnit * transportCharges;
}

function min(a, b) {
  return a > b ? b : a;
}

function minimizeSalePrice(purchaseCountry, passport, gloves, mask) {
  let glovesCost = 0, maskCost = 0, remainingGloves = 0, remainingMask = 0;
  let UKGlovesCost = 0, GermanyGlovesCost = 0;

  if (gloves > UKGlovesCount + GermanyGlovesCount ||
    mask > UKMaskCount + GermanyMaskCount) {
    console.log(`OUT_OF_STOCK:100 100:100 50`);
  } else {
    if (gloves <= UKGlovesCount) {    //all gloves available in UK inventory
      if (purchaseCountry === 'Germany') {  //if placing order from germany cal trasnport cost
        if (gloves / 10 !== 0) {
          let count = parseInt(gloves / 10) * 10;
          UKGlovesCost = count * UKGlovesPrice;
          UKGlovesCost += calTransportCost(count, 'UK', passport);
          remainingGloves = gloves % 10;
          UKGlovesCost += remainingGloves * GermanyGlovesPrice;
        }
        else
          UKGlovesCost = calTransportCost(gloves, purchaseCountry, passport);
      }
      else {
        UKGlovesCost = gloves * UKGlovesPrice;   //purchase country is same no need of trasnport cost
      }
    } else {                             //Need to order from other country as inventory in sufficient
      remainingGloves = gloves - UKGlovesCount;
      UKGlovesCost = UKGlovesCount * UKGlovesPrice;
      UKGlovesCost += remainingGloves * GermanyGlovesPrice;
      UKGlovesCost += calTransportCost(remainingGloves, 'Germany', passport);
    }
    if (gloves <= GermanyGlovesCount) {  // all Gloves available Germany 
      GermanyGlovesCost = gloves * GermanyGlovesPrice;
    } else {
      remainingGloves = gloves - GermanyGlovesCount;
      GermanyGlovesCost = GermanyGlovesCount * GermanyGlovesPrice;
      GermanyGlovesCost += remainingGloves * GermanyGlovesPrice;
      GermanyGlovesCost += calTransportCost(remainingGloves, 'UK', passport);
    }
    glovesCost = min(UKGlovesCost, GermanyGlovesCost);

    if (mask <= UKMaskCount) {    // all mask available in UK inventory      
      if (purchaseCountry === 'Germany') {
        if (mask / 10 !== 0) {                //total count is not multiple of 10
          let count = parseInt(mask / 10) * 10;
          UKMaskCost = count * UKMaskPrice;
          UKMaskCost += calTransportCost(count, 'UK', passport);
          remainingMask = mask % 10;
          UKMaskCost += remainingMask * GermanyMaskPrice;
        }
        else
          UKMaskCost = calTransportCost(mask, purchaseCountry, passport);
      }
      else {
        UKMaskCost = mask * UKMaskPrice;
      }
    } else {
      remainingMask = mask - UKMaskCount;
      UKMaskCost = UKMaskCount * UKMaskPrice;
      UKMaskCost += remainingMask * GermanyMaskPrice;
      UKMaskCost += calTransportCost(remainingMask, 'Germany', passport);
    }
    if (mask <= GermanyMaskCount) {
      GermanyMaskCost = mask * GermanyMaskPrice;
    } else {
      remainingMask = mask - GermanyMaskCount;
      GermanyMaskCost = GermanyMaskCount * GermanyMaskPrice;
      GermanyMaskCost += remainingMask * GermanyMaskPrice;
      GermanyMaskCost += calTransportCost(remainingMask, 'UK', passport);
    }
    maskCost = min(UKMaskCost, GermanyMaskCost);
    console.log(`${maskCost + glovesCost}:${UKMaskCount}:${GermanyMaskCount}:${UKGlovesCount}:${GermanyGlovesCount}`);
  }
}
