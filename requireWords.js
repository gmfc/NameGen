var request = require("request");
var Foswig = require('foswig');
var clc = require('cli-color');
var util = require('util');
var fs = require("fs");

var lang = "fr";

var url = "https://"+lang+".wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&format=json";

var contains = function(needle) {
  // Per spec, the way to identify NaN is that it is not equal to itself
  var findNaN = needle !== needle;
  var indexOf;

  if (!findNaN && typeof Array.prototype.indexOf === 'function') {
    indexOf = Array.prototype.indexOf;
  } else {
    indexOf = function(needle) {
      var i = -1,
        index = -1;

      for (i = 0; i < this.length; i++) {
        var item = this[i];

        if ((findNaN && item !== item) || item === needle) {
          index = i;
          break;
        }
      }

      return index;
    };
  }

  return indexOf.call(this, needle) > -1;
};

function getParagraph(callback) {
  request({
    url: url,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(body);
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
    if (dicio.length > 2000) {
      console.log(clc.green("Artigo aceito " + dicio.length + " Titulo: " + dicio[0]));
      callback(dicio);
    } else {
      console.log(clc.red("Artigo rejeitado " + dicio.length + " Titulo: " + dicio[0]));
      getValidDicio(callback);
    }
  });
}

function getWords(quant) {
  getValidDicio(function(dicio) {
    var chain = new Foswig(3);
    var palavras = [];
    dicio.splice(0, 1);
    chain.addWordsToChain(dicio);
    for (var cont = 0; cont < quant;) {
      var pal = chain.generateWord(1, 15, false, 10000);
      if(!contains.call(palavras, pal)){
        palavras.push(pal);
        cont++;
      }
      if(cont % (quant/10) === 0)
        console.log(clc.cyan(cont));
    }
    palavras = palavras.sort(function(a,b){
      //var ret = 1;
      
      if(a.length===b.length){
        return a.localeCompare(b);
      } else {
        return a.length - b.length;
      }
    });
    fs.writeFileSync('./'+lang+'.json', util.inspect(palavras, false, null) , 'utf-8');
    //console.log("FIM");
    //fs.writeFileSync('./data.json', util.inspect(chain, false, null) , 'utf-8');
    //console.log(util.inspect(chain, false, null));
  });
}

getWords(10000);

/*
en - 4
de - 6
pt - 


*/