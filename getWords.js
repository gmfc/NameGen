var request = require("request");
var Foswig = require('foswig');
//var chain = new Foswig(4);

var url = "https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&format=json";

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
       doTheThing(body);
    }
});


function doTheThing(thingy){
  
  for(var i in thingy.query.pages){
    var text = thingy.query.pages[i].extract;
    
    text = text.replace(/<(?:.|\n)*?>/g, '');
    text = text.replace(/[^a-zA-Z' áàãâéêíîóôõúûçßüöä]/g, ' ');
    text = text.replace(/\s\s+/g,' ');
    
    var array1 = [];
     var palavras = [];
    array1 = text.split(" ");
    
    for(var ii = 0;ii<array1.length;ii++){
     
      if(array1[ii].length>1){
        palavras.push(array1[ii]);
      }
    }
    
    console.log("======================================================================");
    //console.log(text);
    var chain = new Foswig(2);
    //console.log(palavras[0]);
    console.log(palavras.length);
    chain.addWordsToChain(palavras);
    //console.log("primed");
    
    for(var count = 0;count<10;count++){
      
      var pal = chain.generateWord(5,15,false,100);
      console.log(pal);
      
    }
    
  }
  
   //console.log(thingy.query.pages) // Print the json response
   
  
}