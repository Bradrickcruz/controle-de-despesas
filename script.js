const transactionUL = document.querySelector('#transactions');
const balanceDisplay = document.querySelector('#balance');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#form #text');
const inputTransactionAmount = document.querySelector('#form #amount');

let idCounter;
let transactions;

const getTransactionList = () => {
  const transactionStorage = JSON.parse(
    localStorage.getItem('transactionList')
  );
  if (transactionStorage) {
    idCounter = transactionStorage.idCounter;
    transactions = transactionStorage.transactions;
    return transactionStorage;
  }

  const baseTransactionList = { idCounter: 0, transactions: [] };
  localStorage.setItem('transactionList', JSON.stringify(baseTransactionList));
  return getTransactionList();
};

const setTransactionList = () => {
  newTransactionList = { idCounter, transactions: transactions.flat() };
  localStorage.setItem('transactionList', JSON.stringify(newTransactionList));
};

const capitalizeString = (string) => string[0].toUpperCase() + string.slice(1);

const currencyFormatting = (value) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

const removeTransaction = (id) => {
  const transactionLI = document.getElementById('id' + id);

  transactionLI.remove();
  delete transactions[
    transactions.findIndex((t) => t.id === Number(id.replace('id', '')))
  ];
  updateBalanceValues();
  setTransactionList();
};

const addTransactionIntoDOM = (transaction) => {
  const [operator, CSSClass] =
    transaction.amount < 0 ? ['-', 'minus'] : ['', 'plus'];
  const amountAbsolute = operator
    ? transaction.amount * -1
    : transaction.amount;
  const currencyFormatedAmount = currencyFormatting(amountAbsolute);

  const li = document.createElement('li');
  li.classList.add(CSSClass);
  li.id = String(`id${transaction.id}`);
  li.innerHTML = `${transaction.name} <span>${
    operator + currencyFormatedAmount
  }</span>
  <button class="delete-btn" onClick="removeTransaction('${
    transaction.id
  }')">x</button>`;
  transactionUL.prepend(li);
};

const updateBalanceValues = () => {
  const transactionAmounts = transactions.map(
    (transaction) => transaction.amount
  );
  const balance = transactionAmounts.reduce(
    (acc, transactionAmount) => acc + transactionAmount,
    0
  );
  const expense = transactionAmounts.reduce(
    (acc, transactionAmount) =>
      transactionAmount < 0 ? acc + transactionAmount * -1 : acc,
    0
  );
  const income = transactionAmounts.reduce(
    (acc, transactionAmount) =>
      transactionAmount >= 0 ? acc + transactionAmount : acc,
    0
  );

  balanceDisplay.innerText = currencyFormatting(balance);
  incomeDisplay.innerText = currencyFormatting(income);
  expenseDisplay.innerText = currencyFormatting(expense);
};

const reInit = () => {
  transactions.flat();
  transactionUL.innerHTML = '';
  initialize();
};

const initialize = () => {
  getTransactionList();

  transactions.forEach((transaction) => addTransactionIntoDOM(transaction));
  updateBalanceValues();
};

const renderNewTransaction = () => {
  updateBalanceValues();
  addTransactionIntoDOM(transactions[transactions.length - 1]);
};

const addNewTransaction = (e) => {
  e.preventDefault();

  const transaction = {
    name: inputTransactionName.value.trim(),
    amount: Number(inputTransactionAmount.value.trim()),
  };

  if (!transaction.name || !transaction.amount) {
    alert('Preencha ambos os campos para cadastrar uma nova transação.');
    return;
  }
  transaction.id = ++idCounter;
  transaction.name = capitalizeString(transaction.name);
  transactions.push(transaction);
  renderNewTransaction();
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
  inputTransactionName.focus();
  setTransactionList();
};

form.addEventListener('submit', addNewTransaction);

initialize();
