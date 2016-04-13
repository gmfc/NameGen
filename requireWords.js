var request = require("request");
var Foswig = require('foswig');
var clc = require('cli-color');

var url = "https://pt.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&format=json";

function getParagraph(ret) {
  request({
    url: url,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      ret(body);
    }
  });
}


function getDicionary(callback) {
  getParagraph(function(paragraph) {
    var dicio = [];
    for (var i in paragraph.query.pages) {
      var text = paragraph.query.pages[i].extract;

      // HTML
      text = text.replace(/<(?:.|\n)*?>/g, '');
      // caracteres validos
      text = text.replace(/[^a-zA-Z' áàãâéêíîóôõúûçßüöäАаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯя]/g, ' ');
      // espaços extras
      text = text.replace(/\s\s+/g, ' ');

      var palavras = [];

      palavras = text.split(" ");

      for (var ii = 0; ii < palavras.length; ii++) {

        if (palavras[ii].length > 1) {
          dicio.push(palavras[ii]);
        }
      }

      // dicionario pronto

      callback(dicio);

    }
  });
}

function imprimeDicio() {
  getDicionary(function(dicio) {
    for (var i in dicio) {
      console.log(dicio[i]);
    }
    console.log(dicio.length);
  });
}

function getValidDicio(callback) {
  getDicionary(function(dicio) {
    if (dicio.length > 500) {
      callback(dicio);
    } else {
      getValidDicio(callback);
    }
  });
}

function getWords(quant) {

  getValidDicio(function(dicio) {
    var chain = new Foswig(5);
    chain.addWordsToChain(dicio);
    for (var cont = 0; cont < quant; cont++) {
      var pal = chain.generateWord(2, 15, false, 300);
      console.log(clc.cyan(pal));
      
      
    }
  });



}

getWords(25);