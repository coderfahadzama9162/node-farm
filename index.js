const fs = require("fs");
const http = require('http');
const url = require('url');

// const readdata = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(readdata);
// const date = new Date();
// const writeData = `this is all we know about avocoado : ${readdata} \n this is written on ${date.toLocaleString()}`;
// console.log(writeData);
// fs.writeFileSync("./txt/output.txt", writeData);

// const filePath = "./txt/output.txt";

// fs.existsSync(filePath, function (exists) {
//   fs.exis;
//   if (exists) {
//     console.log("File exists. Deleting now ...");
//     fs.unlinkSync(filePath);
//   } else {
//     console.log("File not found, so not deleting.");
//   }
// });
// fs.writeFileSync("./txt/output.txt", writeData);



/////////  server

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dart = JSON.parse(data);
//console.log(dataObj);

const templateOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');

const productCard = fs.readFileSync('./templates/template-card.html', 'utf-8');

function replaceTemplate(temp, el) {
    let output = temp.replace(/{%PRODUCTNAME%}/g, el.productName);
    output = output.replace(/{%IMAGE%}/g, el.image);
    output = output.replace(/{%PRICE%}/g, el.price);
    output = output.replace(/{%QUANTITY%}/g, el.quantity);
    output = output.replace(/{%NUTRIENTS%}/g, el.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, el.description);
    output = output.replace(/{%FROM%}/g, el.from);
    output = output.replace(/{%ID%}/g, el.id);
    
    if (!el.organic) output=output.replace(/{%NOT_ORGANIC%}/,'not-organic')
    return output;
}



const server = http.createServer((req, res) => {

    // console.log(req);
    
  //  const url = req.url;


   
  const { query, pathname } = url.parse(req.url, true);

   // console.log(query);

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html',

            'my-own-header':'hello-world'
            

        })

        const newTemplate = dart.map(el => replaceTemplate(tempCard, el)).join('');

       const output= templateOverview.replace('{%PRODUCT_CARDS%}', newTemplate);

      
        console.log(output);
        

        res.end(output);

       


    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text',

            'my-own-header':'hello-world'
            

        })
        const productAtIndex = dart[query.id];



        const productHtml = replaceTemplate(productCard, productAtIndex);

      
       

        res.end(productHtml);

    } else if (pathname === '/api') {

        res.writeHead(200, {
            'Content-type': 'application/json',

            'my-own-header':'hello-world'
            

        })
        
        res.end(data);
    }
    
    else {
        

        res.writeHead(404, {
            'Content-type': 'text/html',

            'my-own-header':'hello-world'
            

        })
      

        res.end('<h1>Page not found</h1>');
    }

    
    
});


server.listen( 8000,'127.0.0.1', () => {
    console.log(`the port is runing `)
})