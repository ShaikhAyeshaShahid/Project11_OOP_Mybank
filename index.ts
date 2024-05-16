import inquirer from "inquirer";

class BankAccount {
  private firstName: string;
  private lastName: string;
  private gender: string;
  private age: number;
  private mobileNumber: string;
  private balance: number;

  constructor(
    firstName: string,
    lastName: string,
    gender: string,
    age: number,
    mobileNumber: string,
    initialBalance: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.age = age;
    this.mobileNumber = mobileNumber;
    this.balance = initialBalance;
  }

  async debit(amount: number) {
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(
        `Debit successful $${amount}. Current balance: $${this.balance}`
      );
    } else {
      console.log("Transaction cancelled. Insufficient funds.");
      process.exit();
    }
  }

  async credit(amount: number) {
    this.balance += amount;
    console.log(
      `Credit successful. Credited amount: $${amount}. Current balance: $${this.balance}`
    );
  }

  async getBalance() {
    console.log(`Current balance: $${this.balance}`);
  }

  async myInfo() {
    console.log(`Your name: ${this.firstName} ${this.lastName}`);
    console.log(`Your age: ${this.age}`);
    console.log(`Your phone number: ${this.mobileNumber}`);
    console.log(`Your balance: $${this.balance} `);
  }
}

async function main() {
  const questions = [
    {
      type: "input",
      name: "firstName",
      message: "Enter your first name: ",
      validate: (input: string) => {
        return input.trim() !== "" ? true : "First name cannot be empty";
      },
    },
    {
      type: "input",
      name: "lastName",
      message: "Enter your last name: ",
      validate: (input: string) => {
        return input.trim() !== "" ? true : "Last name cannot be empty";
      },
    },
    {
      type: "list",
      name: "gender",
      message: "Enter your gender: ",
      choices: ["Male", "Female"],
    },
    { type: "input", name: "age", message: "Enter your age: " },
    {
      type: "input",
      name: "mobileNumber",
      message: "Enter your mobile number: ",
      validate: (input: string) => {
        return input.length <= 11 ? true : "Invalid phone number";
      },
    },
  ];

  const answers: any = await inquirer.prompt(questions);

  const initialBalance = 0; // Initial balance set to 0
  const bankAccount = new BankAccount(
    answers.firstName,
    answers.lastName,
    answers.gender,
    parseInt(answers.age),
    answers.mobileNumber,
    initialBalance
  );
  console.log("Bank account created successfully.");

  // Perform bank account operations
  await performOperations(bankAccount);
}

async function performOperations(bankAccount: BankAccount, isFirstTime: boolean = true) {
    if (isFirstTime) {
        console.log("Welcome to MyBank!");
    }

    const operations = [
        { name: "Debit", value: "debit" },
        { name: "Credit", value: "credit" },
        { name: "Check Balance", value: "balance" },
        { name: "User Information", value: "myInfo" },
        { name: "Exit", value: "exit" },
    ];

    const { operation } = await inquirer.prompt({
        type: "list",
        name: "operation",
        message: "Select an operation:",
        choices: operations,
    });

    switch (operation) {
        case "debit":
            const { debitAmount } = await inquirer.prompt({
                type: "number",
                name: "debitAmount",
                message: "Enter debit amount:",
            });
            await bankAccount.debit(debitAmount);
            break;
        case "credit":
            const { creditAmount } = await inquirer.prompt({
                type: "number",
                name: "creditAmount",
                message: "Enter credit amount:",
            });
            await bankAccount.credit(creditAmount);
            break;
        case "balance":
            await bankAccount.getBalance();
            break;
        case "myInfo":
            await bankAccount.myInfo();
            break;
        case "exit":
            console.log("Thank you for using MyBank. Goodbye!");
            process.exit();
        default:
            console.log("Invalid choice. Please try again.");
            break;
    }

    await performOperations(bankAccount, false); // Recursive call for next operation, isFirstTime set to false
}


main();
