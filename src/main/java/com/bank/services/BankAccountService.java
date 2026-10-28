package com.bank.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class BankAccountService {

    private final Map<String, BankAccount> accounts = new HashMap<>();

    // Automatically generated account numbers
    private int nextAccountNumber = 1001;

    // Create a new account
    public String createAccount(String name, double initialBalance) {

        if (initialBalance < 0) {
            return "Initial balance cannot be negative.";
        }

        String accountNumber = String.valueOf(nextAccountNumber++);

        BankAccount account =
                new BankAccount(accountNumber, name, initialBalance);

        accounts.put(accountNumber, account);

        return "Account created successfully. Account Number: "
                + accountNumber;
    }

    // Get account details
    public String getAccountDetails(String accountNumber) {

        BankAccount account = accounts.get(accountNumber);

        if (account == null) {
            return "Account not found.";
        }

        return "Account Number: " + account.getAccountNumber()
                + ", Name: " + account.getName()
                + ", Balance: ₹" + account.getBalance();
    }

    // Check balance
    public double checkBalance(String accountNumber) {

        BankAccount account = accounts.get(accountNumber);

        if (account == null) {
            return -1;
        }

        return account.getBalance();
    }

    // Deposit money
    public String deposit(String accountNumber, double amount) {

        BankAccount account = accounts.get(accountNumber);

        if (account == null) {
            return "Account not found.";
        }

        if (amount <= 0) {
            return "Deposit amount must be greater than zero.";
        }

        account.setBalance(account.getBalance() + amount);

        return "Deposit successful. New balance: ₹"
                + account.getBalance();
    }

    // Withdraw money
    public String withdraw(String accountNumber, double amount) {

        BankAccount account = accounts.get(accountNumber);

        if (account == null) {
            return "Account not found.";
        }

        if (amount <= 0) {
            return "Withdrawal amount must be greater than zero.";
        }

        if (amount > account.getBalance()) {
            return "Insufficient balance.";
        }

        account.setBalance(account.getBalance() - amount);

        return "Withdrawal successful. Remaining balance: ₹"
                + account.getBalance();
    }
}