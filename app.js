//jshint esversion:6

//require modules
const express = require("express");
const bodyParser = require("body-parser");

const alpha = require("alphavantage")({ key: apikey });

const https = require("https");

const {JSDOM} = require("jsdom");
const {window} = new JSDOM();
const {document} = (new JSDOM('')).window;
global.document = document;
const $ = require("jquery")(window);

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));


//get requests
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/home", function (req, res) {
  res.render("home");
});
  
  app.get("/about", function (req, res) {
    res.render("about");
});
  
  app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/trading", function (req, res) {
  res.render("trading");
});

app.get("/stocks_shares", function (req, res) {
  res.render("stocks_shares");
});

app.get("/intro", function (req, res) {
  res.render("intro");
});

app.get("/market_exchange", function (req, res) {
  res.render("market_exchange");
});

app.get("/how_to_start", function (req, res) {
  res.render("how_to_start");
});

app.get("/fundamentals", function (req, res) {
  res.render("fundamentals");
});

app.get("/doanddont", function (req, res) {
  res.render("doanddont");
});

app.get("/graphs", function (req, res) {
  res.render("graphs");
});

app.get("/imp_concepts", function (req, res) {
  res.render("imp_concepts");
});


app.get("/bearbull",function(req,res){
  res.render("bearbull");
});

app.get("/marketcrashes",function(req,res){
  res.render("marketcrashes");
});



//post request contact page
app.post("/contact", function (req, res) {
    res.render("/contact");
});


// market stats
var openvalue;
var highvalue;
var lowvalue;
var closevalue;
var comp;

//get request : market page
app.get("/market", function (req, res) {
  res.render("market",{
    openValue:openvalue,
    closeValue:closevalue,
    lowValue:lowvalue,
    highValue:highvalue,
    comp:comp
    });
});

var fromCurrencyName;
var toCurrencyName;
var fromCurrencyCode;
var toCurrencyCode;
var exchangeRate;
var bidPrice;
var askPrice;

//get request : cyptocurrency page
app.get("/cryptocurrency",function(req,res){
  res.render("cryptocurrency",{
    fromName:fromCurrencyName,
    toName:toCurrencyName,
    fromCode:fromCurrencyCode,
    toCode:toCurrencyCode,
    rate:exchangeRate,
    bidPrice:bidPrice,
    askPrice:askPrice
  });
});


//post request : market page
app.post("/market", function (req, res) {

    const symbol = req.body.company;
    const inputdate=req.body.date;
    const interval = "5min";
    const apikey = process.env.api_key;
  
    const year=inputdate.slice(0,4);
    const month=inputdate.slice(5,7);
    const date=inputdate.slice(8,10);
    const finaldate=year+"-"+month+"-"+date;
  
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}.BSE&interval=${interval}&apikey=${apikey}`;
  
  
    https.get(url, function (response) {
      // console.log(response.statusCode);
      let stockData = "";
      response.on("data", function (data) {
        stockData += data;
      });
      response.on("end", function () {
        let stockinfo = JSON.parse(stockData);
        // console.log(stockinfo["Meta Data"]);
        // console.log(finaldate);
        openvalue=stockinfo["Time Series (Daily)"][finaldate]["1. open"];
        highvalue=stockinfo["Time Series (Daily)"][finaldate]["2. high"];
        lowvalue=stockinfo["Time Series (Daily)"][finaldate]["3. low"];
        closevalue=stockinfo["Time Series (Daily)"][finaldate]["4. close"];
        //console.log(stockinfo["Time Series (Daily)"][finaldate]["1. open"]);
  
        res.render("market",{
          openValue:openvalue,
          closeValue:closevalue,
          lowValue:lowvalue,
          highValue:highvalue,
          comp:symbol
        });
      
      });
  
    });
  
    // console.log(url);
  
});
  
  


//post request : cryptocurrency page
app.post("/cryptocurrency", function (req, res) {

  const from = req.body.fromCode;
  const to=req.body.toCode;
  const apikey = process.env.api_key;

  const url=`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${apikey}`;

  https.get(url, function (response) {
    // console.log(response.statusCode);
    let currencyData = "";
    response.on("data", function (data) {
      currencyData += data;
    });

    response.on("end", function () {
      let currencyinfo = JSON.parse(currencyData);
      console.log(currencyinfo["Realtime Currency Exchange Rate"]);
      
      fromCurrencyName=currencyinfo["Realtime Currency Exchange Rate"]["2. From_Currency Name"];
      toCurrencyName=currencyinfo["Realtime Currency Exchange Rate"]["4. To_Currency Name"];
      fromCurrencyCode=currencyinfo["Realtime Currency Exchange Rate"]["1. From_Currency Code"];
      toCurrencyCode=currencyinfo["Realtime Currency Exchange Rate"]["3. To_Currency Code"];
      exchangeRate=currencyinfo["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
      bidPrice=currencyinfo["Realtime Currency Exchange Rate"]["8. Bid Price"];
      askPrice=currencyinfo["Realtime Currency Exchange Rate"]["9. Ask Price"];
      
console.log(askPrice);
      res.render("cryptocurrency",{
        fromName:fromCurrencyName,
        toName:toCurrencyName,
        fromCode:fromCurrencyCode,
        toCode:toCurrencyCode,
        rate:exchangeRate,
        bidPrice:bidPrice,
        askPrice:askPrice
      });
    
    });

  });

  // console.log(url);

});








//end  
app.listen(port, function () {
    console.log("Server started at port " + port);
});
