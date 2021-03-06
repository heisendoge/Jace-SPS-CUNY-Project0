﻿//Web API Endpoints and Methods
//Check User URL: http://team3webapi.azurewebsites.net/api/checkuser  SUPPORT: POST & GET
//Create User Post:  http://team3webapi.azurewebsites.net/api/userlogin

//OnLoad Variables
//variables to store returned ContactGUID and Mortgage Account Number
var contactID, userName, contactObj, mortgageList,  paymentList, accountPage;

//Global Variables/ Objects
var signinFields = {
    UserName: false,
    Password: false,
    MortgageNumber: false
};
var result;

var passwordValidation = {
    length: false,
    chars: false,
    symbols: false,
    numbers: false
};

//Page Load Functions======================================================================================

//on Page load call checkSessionLoad()
//window.onload = checkSessionLoad;

function loadContactObj(username) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            contactObj = JSON.parse(this.responseText);
            loadMortgages();
        } else {
            contactObj = false;
            //loadAccountInfo();
        }
    };
    xmlHttp.open("GET", "http://team3webapi.azurewebsites.net/api/user/" + contactID, true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();
}
function loadMortgages() {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            mortgageList = JSON.parse(this.responseText);
            loadPayments();
        } else {
            mortgageList = false;
        }
    };
    xmlHttp.open("GET", "http://team3webapi.azurewebsites.net/api/mortgage/" + contactID, true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();
}

function loadPayments() {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            paymentList = JSON.parse(this.responseText);
            setSession();
        } else {
            paymentList = false;
        }
    };
    xmlHttp.open("GET", "http://team3webapi.azurewebsites.net/api/payment/" + contactID, true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();
}


function homePageHandler(value) {
    if (value !== "home") {
        document.getElementById("sign_in").classList.add("no_display");
        document.getElementById("account").classList.remove("no_display");
    } else {
        document.getElementById("sign_in").classList.remove("no_display");
        document.getElementById("account").classList.add("no_display");
    }
}

function accountPageHandler() {
    //var result = typeof contactObj;
    if (typeof contactObj === undefined) {
        document.getElementById("error").classList.remove("hidden");
        document.getElementById("error").innerHTML = "An Error has Occured Loading. Please Refresh the Page or Sign In again.";
    } else {
        document.getElementById("error").classList.add("hidden");
        document.getElementById("accountMenu").classList.remove("hidden");
        document.getElementById("hello").innerHTML = "Hello " + contactObj["firstname"];
        
        let container = document.getElementById("accountContainer");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        if (accountPage === false) {
            document.getElementById("mortgage").classList.add("nav_account_selected");
        } else {
            document.getElementById(accountPage).classList.add("nav_account_selected");
        }
        if (accountPage === "mortgage" || accountPage === false) {
            for (let i = 0; i < mortgageList.length; i++) {
                let element = document.createElement("DIV");
                element.classList.add("mortgage_account");
                element.classList.add("col-md-10");
                element.classList.add("mb-4");

                let name = document.createElement("h3");
                name.innerHTML = mortgageList[i].revfinal_name;
                name.classList.add("mortgage_name");

                let number = document.createElement("label");
                number.innerHTML = "Account Number: " + mortgageList[i].revfinal_mortgagenumber;
                number.classList.add("col-md-4");
                number.classList.add("mb-4");
                number.classList.add("mortgage_ele");

                let termYears = "";
                switch (mortgageList[i].revfinal_mortgageterm.Value) {
                    case 273250000:
                        termYears = "10 years";
                        break;
                    case 273250001:
                        termYears = "20 years";
                        break;
                    case 273250002:
                        termYears = "30 years";
                        break;
                    default:
                        termYears = "0";
                }
                let term = document.createElement("label");
                term.innerHTML = "Term: " + termYears;
                term.classList.add("col-md-4");
                term.classList.add("mb-4");
                term.classList.add("mortgage_ele");

                const numberWithCommas = (x) => {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                let balance = numberWithCommas(mortgageList[i].revfinal_mortgageamount.Value);
                let totalAmount = "Loan Amount: " + balance;

                let amount = document.createElement("label");
                amount.innerHTML = totalAmount;
                amount.classList.add("col-md-4");
                amount.classList.add("mb-4");
                amount.classList.add("mortgage_ele");

                element.appendChild(name);
                element.appendChild(number);
                element.appendChild(term);
                element.appendChild(amount);
                //let list = [];
                //for (var i = 0; i < paymentList.length; i++) {
                //    if (paymentList[i].revfinal_mortgagerequestid === mortgageList[i].revfinal_mortgagenumber) {
                //        list.push(paymentList[i]);
                //    }
                //}
                element.onclick = showMortgage.bind(this, true, i, termYears, balance);
                container.appendChild(element);
            }
        } else if (accountPage === "profile") {
            let element = document.createElement("DIV");
            element.classList.add("profile");
            element.classList.add("col-md-10");
            element.classList.add("mb-4");

            let fullName = document.createElement("div");
            fullName.classList.add("row");
            fullName.classList.add("mortgage_name");
            fullName.classList.add("mortgage_panel_ele");
            fullName.innerHTML = contactObj.firstname + " " + contactObj.lastname;
            //=============================================================
            let row1 = document.createElement("div");
            row1.classList.add("row");
            row1.classList.add("account_row");

            let emailLabel = document.createElement("div");
            emailLabel.classList.add("col-md-4");
            emailLabel.innerHTML = "Email:";

            let emailValue = document.createElement("div");
            emailValue.id = "profileEmail";
            emailValue.classList.add("col-md-8");
            emailValue.innerHTML = contactObj.emailaddress1;

            row1.appendChild(emailLabel);
            row1.appendChild(emailValue);
            //=============================================================
            let row2 = document.createElement("div");
            row2.classList.add("row");
            row2.classList.add("account_row");

            let mobileLabel = document.createElement("div");
            mobileLabel.classList.add("col-md-4");
            mobileLabel.innerHTML = "Mobile Phone:";

            let mobileValue = document.createElement("div");
            mobileValue.id = "profileMobile";
            mobileValue.classList.add("col-md-8");
            mobileValue.innerHTML = contactObj.mobilephone;

            row2.appendChild(mobileLabel);
            row2.appendChild(mobileValue);
            //=============================================================
            let row3 = document.createElement("div");
            row3.classList.add("row");
            row3.classList.add("account_row");

            let addressLabel = document.createElement("div");
            addressLabel.classList.add("col-md-4");
            addressLabel.innerHTML = "Address:";

            let addressValue = document.createElement("div");
            addressValue.id = "profileAddress";
            addressValue.classList.add("col-md-8");
            addressValue.innerHTML = contactObj.address1_line1 + " " + contactObj.address1_line2;

            row3.appendChild(addressLabel);
            row3.appendChild(addressValue);

            //=============================================================
            let row4 = document.createElement("div");
            row4.classList.add("row");
            row4.classList.add("account_row");

            let cityLabel = document.createElement("div");
            cityLabel.classList.add("col-md-3");
            cityLabel.innerHTML = "City:";

            let cityValue = document.createElement("div");
            cityValue.id = "profileCity";
            cityValue.classList.add("col-md-3");
            cityValue.innerHTML = contactObj.address1_city;

            let stateLabel = document.createElement("div");
            stateLabel.classList.add("col-md-3");
            stateLabel.innerHTML = "State:";

            let stateValue = document.createElement("div");
            stateValue.id = "profileState";
            stateValue.classList.add("col-md-3");
            stateValue.innerHTML = contactObj.address1_stateorprovince;

            row4.appendChild(cityLabel);
            row4.appendChild(cityValue);
            row4.appendChild(stateLabel);
            row4.appendChild(stateValue);

            //=============================================================
            let row5 = document.createElement("div");
            row5.classList.add("row");
            row5.classList.add("account_row");

            let countryLabel = document.createElement("div");
            countryLabel.classList.add("col-md-3");
            countryLabel.innerHTML = "Country:";

            let countryValue = document.createElement("div");
            countryValue.id = "profileCountry";
            countryValue.classList.add("col-md-3");
            countryValue.innerHTML = contactObj.address1_country;

            let postalLabel = document.createElement("div");
            postalLabel.classList.add("col-md-3");
            postalLabel.innerHTML = "Postal Code:";

            let postalValue = document.createElement("div");
            postalValue.id = "profilePostal";
            postalValue.classList.add("col-md-3");
            postalValue.innerHTML = contactObj.address1_postalcode;

            row5.appendChild(countryLabel);
            row5.appendChild(countryValue);
            row5.appendChild(postalLabel);
            row5.appendChild(postalValue);




            let row6 = document.createElement("div");
            row6.classList.add("flex-row-reverse");
            row6.classList.add("btn_row");

            let edit = document.createElement("button");
            edit.classList.add("btn");
            edit.classList.add("profile_btn");
            edit.classList.add("col-md-3");
            edit.innerHTML = "Edit";

            let save = document.createElement("button");
            save.classList.add("btn");
            save.classList.add("profile_btn");
            save.classList.add("col-md-3");
            save.innerHTML = "Save";


            row6.appendChild(edit);
            row6.appendChild(save);

            element.appendChild(fullName);
            element.appendChild(row1);
            element.appendChild(row2);
            element.appendChild(row3);
            element.appendChild(row4);
            element.appendChild(row5);
            element.appendChild(row6);
            //element.onclick = showMortgage.bind(this, true, i, termYears, balance);

            container.appendChild(element);
        } else if (accountPage === "payment") {
            for (let i = 0; i < paymentList.length; i++) {
                let element = document.createElement("DIV");
                element.classList.add("payment_account");
                element.classList.add("col-md-10");
                element.classList.add("mb-4");

                let name = "";
                for (var j = 0; j < mortgageList.length; j++) {
                    if (paymentList[i].revfinal_mortgagenumber.Value === mortgageList[j].revfinal_mortgagenumber) {
                        name = mortgageList[j].revfinal_name;
                    }
                }

                let nameLabel = document.createElement("h3");
                nameLabel.innerHTML = name;
                nameLabel.classList.add("mortgage_name");
                let status;
                switch (paymentList[i].revfinal_paymentstatus.Value) {
                    case 273250001:
                        status = "Paid";
                        break;
                    default:
                        status = "Awating Payment"
                }

                let statusLabel = document.createElement("label");
                statusLabel.innerHTML = "Status: " +  status;
                statusLabel.classList.add("col-md-4");
                statusLabel.classList.add("mb-4");
                statusLabel.classList.add("payment_ele");

                const numberWithCommas = (x) => {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };
                let balance = numberWithCommas(paymentList[i].revfinal_payment.Value);
                let totalAmount = "Balance: " + balance;

                let amount = document.createElement("label");
                amount.innerHTML = totalAmount;
                amount.classList.add("col-md-4");
                amount.classList.add("mb-4");
                amount.classList.add("payment_ele");

                let duedate = paymentList[i].revfinal_duedate;
                let month = duedate.substring(5, 7);
                let day = duedate.substring(8, 10);
                duedate = day + "/" + month;
                
                let duedateLabel = document.createElement("label");
                duedateLabel.innerHTML = "Due Date: " + duedate;
                duedateLabel.classList.add("col-md-4");
                duedateLabel.classList.add("mb-4");
                duedateLabel.classList.add("payment_ele");


                element.appendChild(nameLabel);
                element.appendChild(statusLabel);
                element.appendChild(amount);
                element.appendChild(duedateLabel);

                //let list = [];
                //for (var i = 0; i < paymentList.length; i++) {
                //    if (paymentList[i].revfinal_mortgagerequestid === mortgageList[i].revfinal_mortgagenumber) {
                //        list.push(paymentList[i]);
                //    }
                //}
                element.onclick = showPayment.bind(this, name, status, balance, duedate, i);
                container.appendChild(element);
            }
        }
    }

}
//Cookie Functions==============================================================

//Session Cookie Functions======================================================
function setSession() {
    let sesObj = {
        "GUID": contactID,
        "username": contactObj["firstname"],
        "contactObj": contactObj,
        "mortgageList": mortgageList,
        "paymentList": paymentList
    };
    document.cookie = "user=" + JSON.stringify(sesObj) + ";" + "path=/";

    //window.location.replace("/Pages/Account.html");
    document.location.reload(true);
}

function setAccountPage(value) {
    let result = (accountPage === false) ? "mortgage": accountPage;
    //switch (accountPage) {
    //    case "profile":
    //        result = "profile";
    //        break;
    //    case "payment"
    //        result = "payment";
    //        break;
    //    default:
    //        result = "mortgage";
    //}
    document.getElementById(result).classList.remove("nav_account_selected");
    document.cookie = "accountpage=" + value + ";" + "path=/";
    document.getElementById(value).classList.add("nav_account_selected");
    checkSession('account');
}

function getSession(cName) {
    cName = cName + "=";
    let cookieList = document.cookie.split(";");
    for (var i = 0; i < cookieList.length; i++) {
        let cookie = cookieList[i];
        cookie = cookie.trim();
        if (cookie === "") { continue; }
        while (cookie.charAt(0) === "") {
            cookie = cookie.substring(1);
        }
        let result = cookie.indexOf(cName);
        if (cookie.indexOf(cName) === 0) {
            let result = cookie.substring(cName.length, cookie.length);
            return result;
        }
    }
    return false;
}

function delSession(value) {
    document.cookie = value + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

function checkSession(currentPage) {
    let value = getSession("user");
    accountPage = getSession("accountpage");
    if (value !== false) {
        let userObj = JSON.parse(value);
        contactID = userObj["GUID"];
        contactObj = userObj.contactObj;
        mortgageList = userObj.mortgageList;
        paymentList = userObj.paymentList;
        switch (currentPage) {
            case "home":
                homePageHandler();
                break;
            case "account":
                accountPageHandler();
                break;
            default:
        }
    } else {
        //window.location.replace("/Pages/SignIn.html");
    }
}


//Sign In Functionality=========================================================

function selectformSignIn(value) {
    if (value) {
        document.getElementById("formSignIn").classList.remove("hidden");
        document.getElementById("formSelect").classList.add("fadeOutNext");
    } else {
        document.getElementById("formSignIn").classList.add("hidden");
        document.getElementById("formSelect").classList.remove("fadeOutNext");
    }
}

function formSignInSubmit(value) {

    let username, password;
    if (value == "signin") {
        username = document.getElementById("signInUserName").value,
        password = document.getElementById("signInPassword").value
    } else {
        username = document.getElementById("registerUserName").value,
        password = document.getElementById("registerPassword").value
    }
    let signInObj = {
        UserName: username,
        Password: password
    };
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "http://team3webapi.azurewebsites.net/api/checkuser", true);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(JSON.stringify(signInObj));
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            contactID = this.responseText.substring(1, this.responseText.length - 1);
            loadContactObj(signInObj.UserName);
        } else if (xmlHttp.readyState === 4 && xmlHttp.status === 400) {
            let result = JSON.parse(this.responseText);
            document.getElementById("signInSubmitValidate").innerHTML = result["Message"];
        }
    };
}

function signOut(){
    delSession("user");
    window.location.replace("/Pages/Home.html");
}

//Register Funcitonality=========================================================
function selectformRegister(value) {
    if (value) {
        document.getElementById("formRegister").classList.remove("hidden");
        document.getElementById("formSelect").classList.add("fadeOutNext");

    } else {
        document.getElementById("formSelect").classList.remove("fadeOutNext");
        document.getElementById("formRegister").classList.add("hidden");
    }
}

function validateUserName(element) {
    let results = false;
    let text = "";
    if (signinFields.UserName === false || signinFields.UserName !== element.value) {
        if (element.value.length !== 0) {
            if (!validateSymbolsCheck(element) && element.value.length > 4) {
                results = checkUserName(element);
                return;
            } else {
                results = false;
                text = "Please enter a User Name with no symbols and at least 5 characters";
                element.classList.add("is-invalid");
            }
        }
        signinFields["UserName"] = results;
        document.getElementById(element.id + "Validate").innerHTML = text;
    }
}

function checkUserName(element) {
    let userName = element.value;
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let reqResult = this.responseText;
            reqResult = reqResult.substring(1, reqResult.length - 1);
            let text = "";
            if (reqResult === "Success") {
                reqResult = userName;
                element.classList.remove("is-invalid");
            }
            signinFields["UserName"] = reqResult;
            document.getElementById(element.id + "Validate").innerHTML = text;
        } else if (this.readyState === 4 && this.status === 400) {
            let reqResult = JSON.parse(this.responseText)["Message"];
            //reqResult = reqResult.substring(1, reqResult.length - 1);
            let text = "";
            if (reqResult === "Contact Exist!") {
                reqResult = false;
                element.classList.add("is-invalid");
                text = "This User Name is taken.";
            } 
            signinFields["UserName"] = reqResult;
            document.getElementById(element.id + "Validate").innerHTML = text;
        }
    };
    xmlHttp.open("GET", "http://team3webapi.azurewebsites.net/api/checkuser/" + userName, true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();
}

    /*Password Requirements
     *> 8
     * > 1 Char
     * > 1 number
     * > 1 symbol

    */

function passwordFormat(element) {
    let length = validatePasswordLength(element.value);
    validateHelp("length", length);
    let chars = validatePasswordChars(element);
    validateHelp("chars", chars);
    let symbols = validateSymbolsCheck(element);
    validateHelp("symbols", symbols);
    let numbers = validateContainsNumber(element);
    validateHelp("numbers", numbers);
}

function showHelp() {
    document.getElementById("help").classList.remove("hidden");
}

function validateHelp(elementID, valid) {
    if (valid) {
        document.getElementById(elementID).classList.add("help_element_valid");
    } else {
        document.getElementById(elementID).classList.remove("help_element_valid");
    }
    passwordValidation[elementID] = valid;
}

function validatePassword(element, element2) {
    let results = false;
    let passwordResults = true;
    let text = "";

    let passwordFields = ["length", "symbols", "chars", "numbers"];
    for (var i = 0; i < passwordFields.length; i++) {
        if (passwordValidation[passwordFields[i]] === false) {
            passwordResults = false;
        }
    }
    if (element.value.length !== 0) {
        if (passwordResults) {
            if (element.value.length !== 0 && element2.value.length !== 0) {
                if (element.value === element2.value) {
                    element.classList.remove("is-invalid");
                    element2.classList.remove("is-invalid");
                    element.classList.add("is-valid");
                    element2.classList.add("is-valid");
                    text = "";
                    results = element.value;
                    document.getElementById(element2.id + "Validate").innerHTML = "";
                } else {
                    element.classList.add("is-invalid");
                    element2.classList.add("is-invalid");
                    element.classList.remove("is-valid");
                    element2.classList.remove("is-valid");
                    text = "The Passwords doesn't match.";
                    results = false;
                }
            } else {
                element.classList.remove("is-invalid");
                element2.classList.remove("is-invalid");
                element.classList.remove("is-valid");
                element2.classList.remove("is-valid");
                text = "";
                results = false;
                document.getElementById(element2.id + "Validate").innerHTML = "";
            }
        } else {
            document.getElementById("registerPassword").classList.add("is-invalid");
            results = false;
        }
    } else {
        element.classList.remove("is-invalid");
        element2.classList.remove("is-invalid");
        element.classList.remove("is-valid");
        element2.classList.remove("is-valid");            
    }
    signinFields['Password'] = results;
    document.getElementById(element.id + "Validate").innerHTML = text;
    document.getElementById("help").classList.add("hidden");
}

function validateMortgage(element) {
    let text = "";
    let results = false;
    if (validateNumbersCheck(element) && element.value.length === 12) {
        results = element.value;
        text = "";
        element.classList.remove("is-invalid");
    } else {
        results = false;
        text = "The Mortgage Number entered is invalid";
        element.classList.add("is-invalid");
    }
    signinFields["MortgageNumber"] = results;
    document.getElementById(element.id + "Validate").innerHTML = text;
}

function formRegisterSubmit() {
    let fields = ["UserName", "Password", "MortgageNumber"];

    validateUserName(document.getElementById("registerUserName"));
    validatePassword(document.getElementById("registerPassword"), document.getElementById("registerPassword2"));
    validateMortgage(document.getElementById("registerMortgageNumber"));

    let clearedValidation = true;
    for (var i = 0; i < fields.length; i++) {
        if (signinFields[fields[i]] === false) {
            clearedValidation = false;
            if (fields[i] === "Password") {
                let element = document.getElementById("registerPassword");
                element.classList.add("is-invalid");
                document.getElementById("registerPasswordValidate").innerHTML = "Password is not valid.";
            }
        }
    }
    if (clearedValidation) {
        //Ajax call
        document.getElementById("registerSubmitValidate").innerHTML = "";
        let registerObj = {};
        for (let i = 0; i < fields.length; i++) {
            registerObj[fields[i]] = signinFields[fields[i]];
        }
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", "http://team3webapi.azurewebsites.net/api/userlogin", true);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(JSON.stringify(registerObj));
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                formSignInSubmit("register");
            }
        };
    } else {
        document.getElementById("registerSubmitValidate").innerHTML = "There are errors on the form.";
    }
}

//Account Page=============================================================
function showMortgage(value, i, term, balance) {
    if (value) {

        document.getElementById("mortgageName").innerHTML = mortgageList[i].revfinal_name;
        document.getElementById("accountNumberTarget").innerHTML = mortgageList[i].revfinal_mortgagenumber;
        document.getElementById("termTarget").innerHTML = term;
        document.getElementById("loanTarget").innerHTML = balance;
        document.getElementById("balanceTarget").innerHTML = "N/A";
        document.getElementById("arpTarget").innerHTML = "N/A";
        let shadow = document.getElementById("accountShadow");
        shadow.classList.remove("no_display");
        let panel = document.getElementById("accountPanel");
        panel.classList.remove("no_display");
    } else {
        let shadow = document.getElementById("accountShadow");
        shadow.classList.add("no_display");
        let panel = document.getElementById("accountPanel");
        panel.classList.add("no_display");
    }
}
//element.onclick = showPayment.bind(this, name, status, balance, duedate);

function showPayment(name, status, balance, duedate, i) {
    if (name) {
        document.getElementById("paymentName").innerHTML = name;
        document.getElementById("paymentMortgageNumberTarget").innerHTML = paymentList[i].revfinal_mortgagenumber.Value;
        document.getElementById("paymentStatusTarget").innerHTML = status;
        document.getElementById("paymentDuedateTarget").innerHTML = duedate;
        document.getElementById("paymentBalanceTarget").innerHTML = balance;
        document.getElementById("paySubmit").onclick = paymentSubmit.bind(this, i);

        let shadow = document.getElementById("paymentShadow");
        shadow.classList.remove("no_display");
        let paymentPanel = document.getElementById("paymentPanel");
        paymentPanel.classList.remove("no_display");
    } else {
        document.getElementById("paymentLoading").classList.add("no_display");
        document.getElementById("paymentSuccess").classList.add("no_display");
        let shadow = document.getElementById("paymentShadow");
        shadow.classList.add("no_display");
        let paymentPanel = document.getElementById("paymentPanel");
        paymentPanel.classList.add("no_display");
    }
}

function paymentSubmit(i) {
    //let imgLoading = document.createElement("img");
    //imgLoading.classList.add("loading");
    //imgLoading.id = "loading";
    //imgLoading.src = "..\Pics\loading.gif";
    //imgLoading.alt = "loaidng";
    //document.getElementById("paymentFeedback").innerHTML = imgLoading;
    document.getElementById("paymentLoading").classList.remove("no_display");
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //let reqResult = this.responseText;
            document.getElementById("paymentLoading").classList.add("no_display");
            document.getElementById("paymentSuccess").classList.remove("no_display");
            loadPayments();

        } else if (this.readyState === 4 && this.status === 400) {
            document.getElementById("error").innerHTML = "Payment Failed.";
        }
    };
    xmlHttp.open("GET", "http://team3webapi.azurewebsites.net/api/pay/" + paymentList[i].id, true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();
}