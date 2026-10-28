const SOAP_URL = "/ws/";

// =====================================================
// SEND SOAP REQUEST
// =====================================================

async function sendSOAPRequest(xml) {
    try {
        const response = await fetch(SOAP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=utf-8"
            },
            body: xml.trim()
        });

        const text = await response.text();

        console.log("SOAP HTTP Status:", response.status);
        console.log("SOAP Response:", text);

        if (!response.ok) {
            throw new Error(
                "Server returned HTTP " +
                response.status +
                "\n\n" +
                text
            );
        }

        return new DOMParser().parseFromString(text, "text/xml");

    } catch (error) {
        console.error("SOAP Request Error:", error);
        throw error;
    }
}


// =====================================================
// CREATE ACCOUNT
// =====================================================

async function createAccount() {

    const name = document
        .getElementById("name")
        .value
        .trim();

    const initialBalance = document
        .getElementById("initialBalance")
        .value
        .trim();

    const result = document
        .getElementById("createResult");

    if (!name || !initialBalance) {
        result.innerHTML =
            "Please enter name and initial balance.";
        return;
    }

    if (Number(initialBalance) < 0) {
        result.innerHTML =
            "Initial balance cannot be negative.";
        return;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:bank="http://bank.com/service">
    <soapenv:Header/>
    <soapenv:Body>
        <bank:CreateAccountRequest>
            <bank:name>${escapeXML(name)}</bank:name>
            <bank:initialBalance>${escapeXML(initialBalance)}</bank:initialBalance>
        </bank:CreateAccountRequest>
    </soapenv:Body>
</soapenv:Envelope>`;

    result.innerHTML = "Creating account...";

    try {

        const response =
            await sendSOAPRequest(xml);

        const message =
            getXMLValue(response, "message");

        if (message) {
            result.innerHTML =
                `<strong>${escapeHTML(message)}</strong>`;
        } else {
            result.innerHTML =
                "Account created, but no message was returned.";
        }

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "<strong>Unable to create account.</strong>" +
            "<br><br>" +
            "<small>" +
            escapeHTML(error.message) +
            "</small>";
    }
}


// =====================================================
// CHECK BALANCE
// =====================================================

async function checkBalance() {

    const accountNumber = document
        .getElementById("balanceAccountNumber")
        .value
        .trim();

    const result = document
        .getElementById("balanceResult");

    if (!accountNumber) {
        result.innerHTML =
            "Please enter account number.";
        return;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:bank="http://bank.com/service">
    <soapenv:Header/>
    <soapenv:Body>
        <bank:CheckBalanceRequest>
            <bank:accountNumber>${escapeXML(accountNumber)}</bank:accountNumber>
        </bank:CheckBalanceRequest>
    </soapenv:Body>
</soapenv:Envelope>`;

    result.innerHTML = "Checking balance...";

    try {

        const response =
            await sendSOAPRequest(xml);

        const balance =
            getXMLValue(response, "balance");

        if (balance === "-1") {
            result.innerHTML =
                "<strong>Account not found.</strong>";
        } else {
            result.innerHTML =
                `<strong>Current Balance: ₹${escapeHTML(balance)}</strong>`;
        }

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "<strong>Unable to check balance.</strong>" +
            "<br><br>" +
            "<small>" +
            escapeHTML(error.message) +
            "</small>";
    }
}


// =====================================================
// ACCOUNT DETAILS
// =====================================================

async function getAccountDetails() {

    const accountNumber = document
        .getElementById("detailsAccountNumber")
        .value
        .trim();

    const result = document
        .getElementById("detailsResult");

    if (!accountNumber) {
        result.innerHTML =
            "Please enter account number.";
        return;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:bank="http://bank.com/service">
    <soapenv:Header/>
    <soapenv:Body>
        <bank:GetAccountDetailsRequest>
            <bank:accountNumber>${escapeXML(accountNumber)}</bank:accountNumber>
        </bank:GetAccountDetailsRequest>
    </soapenv:Body>
</soapenv:Envelope>`;

    result.innerHTML = "Loading account details...";

    try {

        const response =
            await sendSOAPRequest(xml);

        const details =
            getXMLValue(response, "details");

        if (details) {
            result.innerHTML =
                `<strong>${escapeHTML(details)}</strong>`;
        } else {
            result.innerHTML =
                "Account details could not be found.";
        }

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "<strong>Unable to retrieve account details.</strong>" +
            "<br><br>" +
            "<small>" +
            escapeHTML(error.message) +
            "</small>";
    }
}


// =====================================================
// DEPOSIT
// =====================================================

async function depositMoney() {

    const accountNumber = document
        .getElementById("depositAccountNumber")
        .value
        .trim();

    const amount = document
        .getElementById("depositAmount")
        .value
        .trim();

    const result = document
        .getElementById("depositResult");

    if (!accountNumber || !amount) {
        result.innerHTML =
            "Please enter account number and amount.";
        return;
    }

    if (Number(amount) <= 0) {
        result.innerHTML =
            "Deposit amount must be greater than zero.";
        return;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:bank="http://bank.com/service">
    <soapenv:Header/>
    <soapenv:Body>
        <bank:DepositRequest>
            <bank:accountNumber>${escapeXML(accountNumber)}</bank:accountNumber>
            <bank:amount>${escapeXML(amount)}</bank:amount>
        </bank:DepositRequest>
    </soapenv:Body>
</soapenv:Envelope>`;

    result.innerHTML = "Processing deposit...";

    try {

        const response =
            await sendSOAPRequest(xml);

        const message =
            getXMLValue(response, "message");

        result.innerHTML =
            `<strong>${escapeHTML(message)}</strong>`;

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "<strong>Unable to deposit money.</strong>" +
            "<br><br>" +
            "<small>" +
            escapeHTML(error.message) +
            "</small>";
    }
}


// =====================================================
// WITHDRAW
// =====================================================

async function withdrawMoney() {

    const accountNumber = document
        .getElementById("withdrawAccountNumber")
        .value
        .trim();

    const amount = document
        .getElementById("withdrawAmount")
        .value
        .trim();

    const result = document
        .getElementById("withdrawResult");

    if (!accountNumber || !amount) {
        result.innerHTML =
            "Please enter account number and amount.";
        return;
    }

    if (Number(amount) <= 0) {
        result.innerHTML =
            "Withdrawal amount must be greater than zero.";
        return;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:bank="http://bank.com/service">
    <soapenv:Header/>
    <soapenv:Body>
        <bank:WithdrawRequest>
            <bank:accountNumber>${escapeXML(accountNumber)}</bank:accountNumber>
            <bank:amount>${escapeXML(amount)}</bank:amount>
        </bank:WithdrawRequest>
    </soapenv:Body>
</soapenv:Envelope>`;

    result.innerHTML = "Processing withdrawal...";

    try {

        const response =
            await sendSOAPRequest(xml);

        const message =
            getXMLValue(response, "message");

        result.innerHTML =
            `<strong>${escapeHTML(message)}</strong>`;

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "<strong>Unable to withdraw money.</strong>" +
            "<br><br>" +
            "<small>" +
            escapeHTML(error.message) +
            "</small>";
    }
}


// =====================================================
// READ VALUE FROM SOAP XML
// =====================================================

function getXMLValue(xml, tagName) {

    const element =
        xml.getElementsByTagNameNS(
            "http://bank.com/service",
            tagName
        )[0];

    if (!element) {

        console.error(
            "XML element not found:",
            tagName
        );

        return "";
    }

    return element.textContent.trim();
}


// =====================================================
// ESCAPE XML SPECIAL CHARACTERS
// =====================================================

function escapeXML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}