var Foswig = require('foswig');
var fs = require("fs");
var util = require('util');


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


function main(num,dicio) {
  var chain = new Foswig(3);
  var palavras = [];
  chain.addWordsToChain(dicio);

  for (var cont = 0; cont < num;) {
    var pal = chain.generateWord(1, 15, false, 10000);
    console.log(pal);
    if (!contains.call(palavras, pal)) {
      palavras.push(pal);
      cont++;
    }

  }

  palavras = palavras.sort(function(a, b) {

    if (a.length === b.length) {
      return a.localeCompare(b);
    } else {
      return a.length - b.length;
    }
  });
  
  
  fs.writeFileSync('./' + 'quick' + '.json', util.inspect(palavras, false, null), 'utf-8');
}



var dicio = [
    "Warani",
    "Argoseilu",
    "Gaanderan",
    "Lavrakai",
    "Ustanar",
    "Donaris",
    "Pareidon",
    "Senastrex",
    "Vongria",
    "Iaparii",
    "Itheras",
    "Okunaido",
    "Deinorus",
    "Hytraxis",
    "Saikaru",
    "Havitus",
    "Murtaan",
    "Tyyni",
    "Planapeides",
    "Kotima",
    "Tuhkani",
    "Vauras",
    "Delturan",
    "Ellai",
    "Estral",
    "Myrkyll",
    "Taivas",
    "Vimatur",
    "Riiku",
    "Kullusik",
    "Vagev",
    "Sugav",
    "Vanteladus",
    "Lampiri",
    "Nkhalango",
    "Nyanja",
    "Sesvainn",
    "Vayoness",
    "Ufulu",
    "Altezedra",
    "Wolzeran",
    "Mombale",
    "Alkumar",
    "Mpira",
    "Chimwe",
    "Makampi",
    "Persuke",
    "Pikmusa",
    "Jalprapta",
    "Barkasa",
    "Bijipanka",
    "Brzantbis",
    "Atsema",
    "Tsesgri",
    "Shekvat",
    "Mtvare",
    "Almasi",
    "Artsvali",
    "Tsudin",
    "Gadobis",
    "Omrebi",
    "Taanam",
    "Sampoe",
    "Meqvari",
    "Kakuto",
    "Ksen",
    "Shukyo",
    "Yarugai",
    "Inuko",
    "Chori",
    "Damokran",
    "Ylesik",
    "Poreko",
    "Maaladu",
    "Segrani",
    "Khymargh",
    "Aptenon",
    "Mahjira",
    "Trazelor",
    "Garakko",
    "Asoris",
    "Kisako",
    "Kisama",
    "Omokun",
    "Tenseimo",
    "Shubosha",
    "Yongminu",
    "Pagoe",
    "Yolemi",
    "Gachu",
    "Imseung",
    "Deiyang",
    "Seomi",
    "Geoshan",
    "Jungsi",
    "Anquia",
    "Ulbashar",
    "Khaazen",
    "Biyeti",
    "Arokha",
    "Uungdel",
    "Orchelon",
    "Set",
    "Dengi",
    "Aznik",
    "Bistrii",
    "Jesto",
    "Nepriyat",
    "Eznen",
    "Bespredel",
    "Vigon",
    "Yedin",
    "Mirno",
    "Paren",
    "Skudni",
    "Bespol",
    "Ebsan",
    "Yarost",
    "Inoi",
    "Volsheb",
    "Kindush",
    "Talab",
    "Ushkamil",
    "Rii",
    "Alnaraq",
    "Albanas",
    "Muthamir",
    "Qahil"
  ];

main(300,dicio);