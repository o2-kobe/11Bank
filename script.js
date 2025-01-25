'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// CREATING DOM ELEMENTS
function displayMovements(movements, sort = false) {
  // the html element we're adding to already has elements in it so we have to empty it first before adding new elements to it
  // we do this with the help of the .innerhtml method which is used to change the content of an html element
  containerMovements.innerHTML = ''; //the content here has been changed to an empty string

  // Implementing sorting
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov < 0 ? 'withdrawal' : 'deposit';
    // The html structure we want to add must always be stored in a variable for easier insertion in the .insertAdjacentHTML method
    const html = `
     <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
     </div>`;

    //  AT THIS POINT WE HAVE SUCCESSFULLY CREATED THE ELEMENT STRUCTURE WE WANT TO ADD TO THE MOVEMENTS DIV
    // WE USE THE .insertAdjacentHTML method to attach the html element to the movements div
    // the method accepts two arguments
    // 1.position where the insertion should take place(afterbegin, beforeend, afterend and beforebegin)after begin means the element should be added just before the the first child of that html elements, before end means just after the last child element
    // 2.the element we want to add
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}
displayMovements(account1.movements);

// COMPUTING THE TOTAL BALANCE
function calcDisplayBalance(account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
}

function calcDisplaySummary(account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = `${outcomes}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(dep => (dep * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
}

// COMPUTING THE USERNAMES
function createUsernames(accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(n => n.slice(0, 1))
      .join('');
  });
}
createUsernames(accounts);

function updateUI(acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
}
//EVENT HANDLER
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from  submitting
  e.preventDefault();
  // console.log('Login');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //we have to convert the pin to a number always lest it won't work because js sees it as a string
    // DISPLAY UI AND WELCOME MESSAGE
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear input fields
    // inputLoginPin.value = '';
    // inputLoginUsername.value = '';  can also be done this way
    inputLoginUsername.value = inputLoginPin.value = '';

    // Removing the focus on the input field
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  }
});

// IMPLEMENTING TRANSFERS
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recepientAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    recepientAcc &&
    amount < currentAccount.balance &&
    recepientAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recepientAcc.movements.push(amount);
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
});

// IMPLEMETING LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov > 0.1 * amount)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// IMPLEMENTING CLOSING THE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // DELETE ACCOUNT

    accounts.splice(index, 1);

    // HIDE UI
    containerApp.style.opacity = 0;

    // EMPTYING THE TRANSFERS BOX
    inputClosePin.value = inputCloseUsername.value = '';
    inputClosePin.blur();
    inputCloseUsername.blur();

    // CHANGING THE WELCOME MESSAGE
    labelWelcome.textContent = 'Log in to get started';
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/////////////////ARRAY METHODS////////////////////////
// /////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];

// //SLICE METHOD
// /*************/
// // Just like with strings the slice method accepts a start index, and an end index, and slices the array from the start index of the array the end index inputed
// // console.log(arr.slice(1)); //returns an array like ['b', 'c', 'd', 'e']
// // console.log(arr.slice(1, 4)); //returns an array like ['b', 'c', 'd'] index 4 element is not part of the new array because we are expecting (4-1)elemenets from the array
// // THE SLICE METHOD CAN BE USED TO CREATE A COPY OF AN ARRAY BY PASSING NO ARGUMENTS INTO IT
// // console.log(arr.slice()); //returns  ['a', 'b', 'c', 'd', 'e']

// // SPLICE METHOD
// /***************/
// // This method makes a change on the original array by cutting at the start and end number from the original array
// // THE FIRST PARAMETER IS THE START INDEX OF THE CUT AND THE END PARAMETER IS THE LENGTH OF THE CUT
// // console.log(arr.splice(2, 2)); //returns ["c", "d"]
// // console.log(arr); //returns ["a", "b", "e"]
// // console.log(arr.splice(1, 4)); //returns ["b", "e"]
// // console.log(arr); //returns ["a"]

// // MOST COMMON USED CASE IS TO REMOVE THE LAST ELEMENT OF ARRAYS
// // console.log(arr.splice(-1)); //returns ["e"]
// // console.log(arr); //returns ["a", "b", "c", "d"]

// // REVERSE METHOD ///
// ///***************///
// arr = ['a', 'b', 'c', 'd', 'e'];
// // const arr1 = ['j', 'i', 'h', 'g', 'f'];
// // console.log(arr1.reverse());
// // AS THE NAME GOES, THIS METHOD REVERSES THE WHOLE ARRAY TAKES THE IT LIKE A MORRORING MOVE
// // THE REVERSE METHOD MUTATE THE ORIGINAL ARRAY

// //
// // CONCAT METHOD ///
// ///***************///
// // THIS METHOD CREATES A NEW ARRAY AND IN IT ADDS ONE ARRAY TO ANOTHER
// // const alphabets = arr.concat(arr1);
// // console.log(alphabets); //returns ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
// // THE CONCAT METHOD DOES NOT MUTATE THE ORIGINAL ARRAY

// //
// // JOIN METHOD ///
// ///***************///
// // THIS TAKES AN ARRAY OF VALUES AND JOINS THEM INTO A STRING WITH THE PARAMETER THAT IS BEING PASSED IN THE METHOD
// // const strign = alphabets.join(' - ');
// // console.log(strign);

// // THE NEW AT METHOD //
// /*********************/
// // so the at method accepts a number parameter which is the index of the element in the array which we want to  fetch
// const ages = [34, 56, 78];
// // TRADITIONALLY WE WOULD DO THIS
// // console.log(ages[0]); //this would fetch us the first element of the array

// // USING THE AT METHOD
// // console.log(ages.at(0)); //returns 34

// // THE ADVANTAGE OF THE AT METHOD IS THAT WE CAN FETCH THE LAST ELEMENT USING -1
// // WITH THE TRADITIONAL WAY WE WOULD DO THIS
// // console.log(ages[ages.length - 1]); //or
// // console.log(ages.slice(-1)[0]);
// // WITH THE AT METHOD
// // console.log(ages.at(-1)); //returns 78 too

// // FOREACH METHOD
// /*****************/
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited $${movement}.00`);
//   } else console.log(`You withdrew $${Math.abs(movement)}.00`);
// }
// // THE MATH.ABS USED THERE RETURNS THE ABSOLUTE VALUE OF THE NUMBER THUS REMOVES THE NEGATIVE SIGN

// // USING THE FOREACH METHOD
// // The foreach always receives a function as a parameter then for every element in the array, the function is being executed on that element
// // within the bracket of the function we pass in the an appropriate name of the element so the function can recognize the element
// movements.forEach(function (movement, index) {
//   if (movement > 0) {
//     console.log(`Movement ${index + 1}: You deposited $${movement}.00`);
//   } else console.log(`Movement ${index + 1}: You withdrew $${Math.abs(movement)}.00`);
// });
// // result is it works the same as the one on top
// /************************************************ */
// // THE FUNCTION IN THE FOREACH METHOD WHEN USED WITH ARRAYS RECEIVES ARGUMENTS IN THIS ORDER
// //1. Element value
// //2.Index
// //3. Original array name

// //say we have an array of names
// const friends = ['Kwame', 'Ama', 'Yaa'];
// friends.forEach(function (name, index, array) {
//   console.log(`${index + 1}. ${name} can be found in the ${array} array `);
// });

// // WE DO NOT USUALLY PASS IN THE ARRAY PARAMETER
// // ONE CON OF THE FOR EACH IS THAT WE CANNOT DO BREAK AND CONTINUE
// console.log('--------------------------------------------------------');
// // the foreach method works with maps and sets

// // MAPS
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// // WHEN FOREACH IS USED WITH MAPS IT RECEIVES ARGUMENTS IN THIS ORDER
// // 1.VALUE
// // 2.KEY
// // 3.map

// currencies.forEach(function (value, key) {
//   console.log(`The abbreviation for ${value} is ${key}`);
// });

// // SETS
// const uniqueCurrencies = new Set(['GPD', 'USD', 'USD', 'GHA', 'EUR']);
// uniqueCurrencies.forEach(function (value1, value2, set) {
//   console.log(
//     `When using the foreach with Sets, the first parameter ${value1} is the same as the second parameter ${value2}`
//   );
// });

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀

function checkDogs(dogsJulia, dogsKate) {
  const removedCatJulia = dogsJulia.slice(1, -2);
  const allDogs = [...removedCatJulia, ...dogsKate];
  allDogs.forEach(function (dog, index) {
    console.log(
      `Dog number ${index + 1} is ${
        dog < 3 ? 'still a puppy🐶' : 'an adult'
      } and is ${dog} years old.`
    );
  });
}
*/

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log(`-----------------SECOND DATA--------------------`);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// OTHER USEFUL ARRAY METHODS
// MAP FILTER AND REDUCE
/**********************/
// MAP: Transforms each element in an array with a given function and returns a new array with the transformed values.

// FILTER: Creates a new array with all elements that pass a test defined by a provided function

// REDUCE:  Reduces an array to a single value by executing a function on each element, accumulating the result.

/************************************************ */
// THE MAP METHOD (IN DETAILS) //

// Converting the amount in cedis to EUR using the map method
// const cedis = [1, 2, 5, 10, 20, 50, 100, 200];
// const rate = 17.2;
// const EUR = cedis.map(cedi => cedi * rate);
// console.log(EUR);

// // THE MAP METHOD IS MOSTLY USED WITH ARROW FUNCTIONS
// // THE MAP DOES NOT ONLY TAKE ARROW FUNCTIONS BUR CAN TAKE FUNCTION DECLARATIONS AND ALSO FUNCTION EXPRESSIONS

// function square(num) {
//   return num * 1.1;
// } //WE COULD HAVE ALSO WRITTEN THE FUNCTION IN THE MAP ()
// const movementUSD = movements.map(square);
// console.log(movementUSD);

// // NOTE **********: THE DIFFERENCE BETWEEN THE MAP AND THE FOREACH IS THAT THE MAP RETURNS A NEW ARRYA CONTAINING THE TRANSFORMED ELEMENTS WHILST THE FOREACH DOES NOT DO THAT BUT ONLY WORKS ON THE ARRAY

// // JUST LIKE WITH THE FOREACH METHOD, THE MAP METHOD HAS ACCESS TO THE INDEX AND THE WHOLE ARRAY
// // WITHIN THE BRACKETS OF THE ARROW FUNCTION IN THE MAP METHOD WE CAN SPECIFY THE 1.VALUE, 2.INDEX, AND THE 3.ARRAY
// // say we have this array
// const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
// const evenAndOdd = numbers.map(
//   (num, index) =>
//     `${index + 1}. The number ${num} is an ${
//       num % 2 === 0 ? 'even' : 'odd'
//     } number`
// );
// console.log(evenAndOdd);

// THE FILTER METHOD
/********************/
// This also gets access to the current element the index and the entire array which we can pass into the function
// The resulting array is contains the elements that passed the test
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(num => num > 0);
const withdrawals = movements.filter(num => num < 0);
// console.log(deposits); //result is an array of the numbers that passed the test
// console.log(withdrawals);

// THE REDUCE METHOD
/********************/
// REDUCE:  Reduces an array to a single value by executing a function on each element, accumulating the result.
// The syntax of the reduce method
// const finalReduceArray = arrayName.reduce((accumulator, current value, index, array)){function here, accumulator start value}
const balance = movements.reduce((acc, mov) => acc + mov, 0);
// console.log(balance);

// USING REDUCE TO DETERMINE THE MAXIMUM VALUE
const max = movements.reduce(
  (acc, mov) => (acc > mov ? acc : mov),
  movements.at(0)
);
// console.log(max);

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀 

function calcAverageHumanAge(ages) {
  const humanAge = ages.map(dogAge =>
    dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4
  );
  const remove18 = humanAge.filter(dogAge => dogAge >= 18);
  const avgDogAges =
    remove18.reduce((acc, dogAge) => acc + dogAge, 0) / remove18.length;
  return avgDogAges;
}

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * 1.1)
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(depositsUSDBalance);

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀


function calcAverageHumanAge(ages) {
  const humanAge = ages
    .map(dogAge => (dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4))
    .filter(dogAge => dogAge >= 18)
    .reduce((acc, dogAge, i, arr) => (acc + dogAge) / arr.length, 0);
  return humanAge;
}

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// THE FIND METHOD
/*************************/
// Just like the other functions, the find method accepts a callback function but this time returns a single value
// it receives a condition and returns the first value that satisfies/ passes the condition or test

// for example, we are going to find the first adult from the array of ages
const ages = [2, 1, 3, 17, 19, 45, 6, 5];
const firstAdult = ages.find(age => age > 17);
// console.log(firstAdult); //retuns 19

// GREAT USE CASE IS WHEN WE WANT TO FIND A SPECIFIC OBJECT IN ARRAY AND THAT OBJECT HAS THIS ONE PROPERTY THAT IS DIFFERENT FROM THE REST

// THE FIND INDEX METHOD
// THE .findIndex method is used specifically to return the index of the first element that passes the test of the find method
// console.log(ages.findIndex(age => age > 17)); //returns 4  */

//

// SOME AND EVERY
// just to know: The includes method returns a boolean of depending on the presence or the absence of the element

// THE SOME METHOD IS USED TO CHECK IF AT LEAST ONE OF THE ELEMENTS OF AN ARRAY CAN PASS THE TEST/CONDTION WE PASS INTO ITS FUNCTION

// THE EVERY METHOD CHECKS IF EVERY METHOD OF THE ARRAY CAN PASS THE TEST WE GIVE TO IT
// BOTH OF THEM RETURN A BOOLEAN
// eg
const hasAnyDeposits = movements.some(mov => mov > 0);
// console.log(hasAnyDeposits); //returns true because there is a positive number within the array movements

// console.log(account4.movements.every(mov => mov > 0)); //returns true because that array contains only deposits

// FLAT AND FLATMAPS
/*************************/
// The flat method is used with nested arrays,it is used to spread the nesting into the bigger array so there will be no nesting
// the method takes a depth argument which by default is set to 1. this argument tells how deep you want to go to flatten the array
const picks = [1, 2, [3, 4], 5, [6, 7, [8]], 9, 10];
// console.log(picks.flat()); //returns [1, 2, 3,4, 5, 6, 7, [8], 9, 10]
// console.log(picks.flat(2)); //returns [1, 2,3, 4, 5, 6, 7, 8, 9, 10]   goes into the

// IN THE CASE WHERE WE WANTED TO CALCULATE ALL THE TRANSACTIONS OF THE 4 ACCOUNTS
const alltransac = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
// console.log(alltransac);

// THE FLATMAP METHOD WAS INTRODUCED TO REDUCE THE STRESS OF MAPPING AND FLATTENING
const all = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(all);

// SORTING ARRAYS
// WE USE THE JS IN BUILT SORT METHOD
// the sort method mutates the original array , thus whatever is the result of the sort becomes the original array
const names = ['Laud', 'Magaret', 'Bene', 'Audrina'];
const ns = names.sort();
// console.log(names);
// console.log(ns);

// SORTING NUMBERS
const agees = [2, 13, 31, 9, 4, 54, 6, 1];
// ACSENDING ORDER
// what i think happens here is that b is always the bigger number so if b is at the end of the function then the bigger numbers should be at the end of the function making it ascending
agees.sort((a, b) => a - b);
// console.log(agees);
// DESCENDING ORDER
// in this one, the bigger numbers should be on the left side and the smaller numbers should be at the end of the array
agees.sort((a, b) => b - a);
// console.log(agees);

// Note that sorting an array of numbers also mutates the array

//MORE WAYS OF CREATING AND FILLING ARRAYS
// we can create arrays using the "new Array" constructor function just as is done with the set and the map

// NOTE: If we pass a single number into the array constructor function, then that becomes the size of the array and the array gets filled with elements undefined
// but if we input more numbers then the result is an array of those numbers
const lives = new Array(2, 1, 4);
console.log(lives); //result is [2, 1, 4]

// IN THE CASE WHERE WE HAVE PASSED IN ONLY ONE ELEMENT INTO THE ARRAY CONSTRUCTOR FUNCTION, WE CAN ONLY PERFORM ONE METHOD ON THAT ARRAY AND THAT IS THE FILL METHOD
//THE FILL METHOD FILL THAT ARR CONTINUOUSLY WITH THAT NUMBER
// THE FILL METHOD TAKES PARAMETERS IN THIS ORDER 1.VALUE 2.START INDEX OF THE FILL 3.END INDEX OF THE FILL
const x = new Array(10);
x.fill(5);
console.log(x); //result is an array will all 10 elements to be 5

// THE FILL METHOD CAN BE USED TO MUTATE ALREADY DEFINED ARRAYS
agees.fill(1, 3, 5);
console.log(agees);

// ARRAY.FROM
// the Array.from() method takes three parameters: arrayLike: An array-like object or iterable. 2.mapFn (optional): A mapping function to be called on every element of the array-like object or iterable. 3.thisArg (optional): The value of this to be used when calling the mapFn
// we can use the array.from to also create what we created with the new array constructor and the fill method
const y = Array.from({ length: 10 }, () => 5);
console.log(y);

// printing numbers 1 to 10
// const one2ten = Array.from({ length: 10 }, (cur, i) => i + 1); //since we do not need the current element, we will put an underscore there
const one2ten = Array.from({ length: 10 }, (_, i) => i + 1);
console.log(one2ten);

const one2hundred = Array.from({ length: 100 }, (_, i) => i + 1);
console.log(one2hundred);

// REAL USE CASE OF THE ARRAY.FROM METHOD
//SAY WE WANTED TO FETCH THE MOVEMENTS OF A CERTAIN ACCOUNT STORED ON THE UI AND ADD IT ALL
// WE WANT IT TO EXECUTE WHEN WE CLICK ON SOMETHING
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

// so within the array.from method we can pass a map function that will mao every element to the func

//ARRAY METHODS IN PRACTICE
// 1.FIND THE SUM OF ALL THE DEPOSITS
const bankDepositSummary = accounts
  .map(acc => acc.movements.filter(mov => mov > 0))
  .flat()
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSummary);

// 2.FIND THE NUMBER OF DEPOSITS GREATER THAN OR EQUAL TO  1000
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(acc => acc >= 1000).length;
// console.log(numDeposits1000);

// CAN ALSO BE DONE IN THIS WAY
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0); //count + 1 can be written as ++count
console.log(numDeposits1000);

// 3.FIND THE SUM OF BOTH THE DEPOSITS AND THE WITHDRAWALS
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      cur > 0 ? (sum.depositss += cur) : (sum.withdrawalss += cur);
      return sum;
    },
    { depositss: 0, withdrawalss: 0 }
  );
// because we have the {}block of code there we woudl have to explicitly return the sum object
const { depositss, withdrawalss } = sums;
console.log(depositss, withdrawalss);

function covertTitleCase(str) {
  const exceptions = ['a', 'an', 'the', 'and', 'but', 'in', 'on', 'with'];
  const capitalize = str => str.replace(str[0], str[0].toUpperCase());
  const titlecase = str
    .toLowerCase()
    .split(' ')
    .map(word =>
      !exceptions.includes(word)
        ? word.replace(word[0], word[0].toUpperCase())
        : word
    )
    .join(' ');
  return capitalize(titlecase);
}

// console.log(covertTitleCase('This is a nice title'));
// console.log(covertTitleCase('this is a long title but not too long'));
// console.log(covertTitleCase('and here is another title with an example'));
// console.log(covertTitleCase('Laud will one day meet the family of Bonita'));

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA: */
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// // 1.
// dogs.forEach(function (dog) {
//   dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
// });

// // 2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(
//   `Sarah's dogs is eating too ${
//     dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
//   }`
// );

// // 3.
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .flatMap(dog => dog.owners);
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .flatMap(dog => dog.owners);

// // 4.
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little`);

// // 5.
// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// //6.
// console.log(
//   dogs.some(
//     dog =>
//       dog.curFood > dog.recommendedFood * 0.9 &&
//       dog.curFood < dog.recommendedFood * 1.1
//   )
// );

// // 7
// const okayDogs = dogs.filter(
//   dog =>
//     dog.curFood > dog.recommendedFood * 0.9 &&
//     dog.curFood < dog.recommendedFood * 1.1
// );
// console.log(okayDogs);
