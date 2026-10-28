package com.bank.services.endpoint;

import com.bank.services.BankAccountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import org.w3c.dom.Element;

@Endpoint
public class BankEndpoint {

    private static final String NAMESPACE_URI = "http://bank.com/service";

    @Autowired
    private BankAccountService bankAccountService;

    // =========================
    // CREATE ACCOUNT
    // =========================

    @PayloadRoot(
            namespace = NAMESPACE_URI,
            localPart = "CreateAccountRequest"
    )
    @ResponsePayload
    public Element createAccount(@RequestPayload Element request) {

        String name =
                request.getElementsByTagNameNS(
                        NAMESPACE_URI,
                        "name"
                ).item(0).getTextContent();

        double initialBalance =
                Double.parseDouble(
                        request.getElementsByTagNameNS(
                                NAMESPACE_URI,
                                "initialBalance"
                        ).item(0).getTextContent()
                );

        String result =
                bankAccountService.createAccount(
                        name,
                        initialBalance
                );

        return createResponse(
                "CreateAccountResponse",
                "message",
                result
        );
    }


    // =========================
    // CHECK BALANCE
    // =========================

    @PayloadRoot(
            namespace = NAMESPACE_URI,
            localPart = "CheckBalanceRequest"
    )
    @ResponsePayload
    public Element checkBalance(@RequestPayload Element request) {

        String accountNumber =
                request.getElementsByTagNameNS(
                        NAMESPACE_URI,
                        "accountNumber"
                ).item(0).getTextContent();

        double result =
                bankAccountService.checkBalance(accountNumber);

        return createResponse(
                "CheckBalanceResponse",
                "balance",
                String.valueOf(result)
        );
    }


    // =========================
    // DEPOSIT
    // =========================

    @PayloadRoot(
            namespace = NAMESPACE_URI,
            localPart = "DepositRequest"
    )
    @ResponsePayload
    public Element deposit(@RequestPayload Element request) {

        String accountNumber =
                request.getElementsByTagNameNS(
                        NAMESPACE_URI,
                        "accountNumber"
                ).item(0).getTextContent();

        double amount =
                Double.parseDouble(
                        request.getElementsByTagNameNS(
                                NAMESPACE_URI,
                                "amount"
                        ).item(0).getTextContent()
                );

        String result =
                bankAccountService.deposit(
                        accountNumber,
                        amount
                );

        return createResponse(
                "DepositResponse",
                "message",
                result
        );
    }


    // =========================
    // WITHDRAW
    // =========================

    @PayloadRoot(
            namespace = NAMESPACE_URI,
            localPart = "WithdrawRequest"
    )
    @ResponsePayload
    public Element withdraw(@RequestPayload Element request) {

        String accountNumber =
                request.getElementsByTagNameNS(
                        NAMESPACE_URI,
                        "accountNumber"
                ).item(0).getTextContent();

        double amount =
                Double.parseDouble(
                        request.getElementsByTagNameNS(
                                NAMESPACE_URI,
                                "amount"
                        ).item(0).getTextContent()
                );

        String result =
                bankAccountService.withdraw(
                        accountNumber,
                        amount
                );

        return createResponse(
                "WithdrawResponse",
                "message",
                result
        );
    }


    // =========================
    // ACCOUNT DETAILS
    // =========================

    @PayloadRoot(
            namespace = NAMESPACE_URI,
            localPart = "GetAccountDetailsRequest"
    )
    @ResponsePayload
    public Element getAccountDetails(@RequestPayload Element request) {

        String accountNumber =
                request.getElementsByTagNameNS(
                        NAMESPACE_URI,
                        "accountNumber"
                ).item(0).getTextContent();

        String result =
                bankAccountService.getAccountDetails(
                        accountNumber
                );

        return createResponse(
                "GetAccountDetailsResponse",
                "details",
                result
        );
    }


    // =========================
    // CREATE XML RESPONSE
    // =========================

    private Element createResponse(
            String responseName,
            String elementName,
            String value) {

        try {

            org.w3c.dom.Document document =
                    javax.xml.parsers.DocumentBuilderFactory
                            .newInstance()
                            .newDocumentBuilder()
                            .newDocument();

            Element response =
                    document.createElementNS(
                            NAMESPACE_URI,
                            responseName
                    );

            Element result =
                    document.createElementNS(
                            NAMESPACE_URI,
                            elementName
                    );

            result.setTextContent(value);

            response.appendChild(result);

            document.appendChild(response);

            return response;

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
}