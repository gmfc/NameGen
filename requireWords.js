var request = require("request");
var Foswig = require('foswig');
var clc = require('cli-color');

var url = "https://sv.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&format=json";

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
      var title = paragraph.query.pages[i].title;

      // HTML
      text = text.replace(/<(?:.|\n)*?>/g, '');
      // caracteres validos
      text = text.replace(/[^a-zA-Z' áàãâéêíîóôõúûçßüöäАаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯя]/g, ' ');
      // espaços extras
      text = text.replace(/\s\s+/g, ' ');

      var palavras = [];

      palavras = text.split(" ");
      dicio.push(title);
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
      console.log(clc.green("Artigo aceito " + dicio.length + " Titulo: " + dicio[0]));
      callback(dicio);
    } else {
      console.log(clc.red("Artigo rejeitado " + dicio.length));
      getValidDicio(callback);
    }
  });
}

function getWords(quant) {

  getValidDicio(function(dicio) {
    var chain = new Foswig(3);
    dicio.splice(0, 1);
    chain.addWordsToChain(dicio);
    for (var cont = 0; cont < quant; cont++) {
      var pal = chain.generateWord(2, 15, false, 300);
      console.log(clc.cyan(pal));
      
      
    }
  });



}

getWords(25);