/*--------------------------------*/
/* Random Quote Machine           */
/*--------------------------------*/
/* by Stephen Bau                 */
/*--------------------------------*/

var display = document.getElementById("display");
var buttons = document.getElementsByClassName("button");
var tweetButton = document.getElementById("tweet-quote");
var quoteButton = document.getElementById("new-quote");
var dataURL = "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json";
var quotesJSON = null;
var quotes = [];
var quote = {
  num: 1,
  text: null,
  author: null
};
var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];
var color = {
  id: 0,
  hex: colors[0]
};
var tweet = {
  root: "https://twitter.com/",
  path: "intent/tweet",
  query: {
    hashtags: "quotes",
    related: "freecodecamp",
    text: ""
  }
}
var tweetURL = "";
var displayText = document.getElementById("text");
var displayAuthor = document.getElementById("author");

var key = {id: null, name: null, code: null};

init();

function init() {
  getJSON(dataURL, getQuotes);
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.addEventListener("click", function( event ) {
      getInput(this, "click");
    });
  }
  keyboard();
}

function getQuotes(data) {
  quotesJSON = parseJSON(data);
  quotes = quotesJSON.quotes;
  getRandomQuote(quotes);
}

function getRandomQuote() {
  var num = randomNumber(quote.num, quotes.length);
  getCurrentQuote(num);
}

function getCurrentQuote(num) {
  quote.num = num;
  quote.text = quotes[num].quote;
  quote.author = quotes[num].author;
  displayCurrentQuote();
  changeBackground();
  setTweetQuoteURL();
}

function displayCurrentQuote() {
  displayText.innerText = quote.text;
  displayAuthor.innerText = "— " + quote.author;
}

function changeBackground() {
  color.id = randomNumber(color, colors.length);
  color.hex = colors[color.id];
  display.style.background = color.hex;
}

function setTweetQuoteURL() {
  var tweetTextURI = encodeURIComponent('"' + quote.text + '" — ' + quote.author);
  tweetURL = tweet.root
    + tweet.path
    + "?" + "hashtags=" + tweet.query.hashtags
    + "&" + "related=" + tweet.query.related
    + "&" + "text=" + tweetTextURI;
  tweetButton.setAttribute('href', tweetURL);
}

function openTweetURL() {
  window.open(tweetURL);
}

function getInput(button, eventType) {
  key.id = button.id;
  key.name = button.dataset.key;
  key.code = button.dataset.keycode;

  if (key.id == "new-quote") {
    getRandomQuote();
  }

  if (key.id == "tweet-quote" && eventType == "keyboard") {
    openTweetURL();
  }
}

function keyboard() {
  keyboardEvents("keydown");
  keyboardEvents("keyup");
}

function keyboardEvents(keyEvent) {
  document.addEventListener(keyEvent, function (event) {
    if (event.defaultPrevented) {
      return;
    }
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      if (button.dataset.key == event.key || button.dataset.keycode == event.keyCode) {
        if (keyEvent == "keydown") {
          button.classList.add("select");
          getInput(button, "keyboard");
        }
        if (keyEvent == "keyup") {
          button.classList.remove("select");
        }
      }
    }
  });
}

function getJSON(url, func) {
  loadFile(url, 2000, loadJSON, func);
}

function loadJSON(func) {
  var data = this.responseText;
  func(data);
}

function parseJSON(text) {
  if (text) {
    return JSON.parse(text);
  }
  return null;
}

function loadFile(url, timeout, callback) {
  var args = Array.prototype.slice.call(arguments, 3);
  var xhr = new XMLHttpRequest();
  xhr.ontimeout = function () {
    console.error("The request for " + url + " timed out.");
  };
  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback.apply(xhr, args);
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.timeout = timeout;
  xhr.send(null);
}

function randomNumber(current, num) {
  var num = Math.floor(Math.random() * num);
  if (current == num) {
    return randomNumber(current, num);
  } else {
    return num;
  }
}
