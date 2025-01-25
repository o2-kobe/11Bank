'use strict';

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
const btnDeposit = document.querySelector('.form__btn--deposit');
const btnWithdraw = document.querySelector('.form__btn--withdraw');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputDepositAmount = document.querySelector(
  '.form__input--deposit-amount'
);
const inputWithdraw = document.querySelector('.form__input--withdraw-amount');

// CREATING DOM ELEMENTS
function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = '';

  // Implementing sorting
  const movs = sort ? [...movements].sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov < 0 ? 'withdrawal' : 'deposit';

    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
      </div>`;

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

// IMPLEMETING DEPOSIT
btnDeposit.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputDepositAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov > 0.1 * amount)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputDepositAmount.value = '';
  inputDepositAmount.blur();
});

// IMPLEMENTING CLOSING THE ACCOUNT
btnWithdraw.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputWithdraw.value);
  if (amount < currentAccount.balance) {
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
  }

  inputWithdraw.value = '';
  inputWithdraw.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
