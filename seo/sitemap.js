const express    = require("express")
const path       = require("path")
const Recent     = require("../models/recent")

module.exports = Recent.find({}).then(async(found)=>{
      let xml =  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
      
      await found.forEach((data)=>{
           xml +=`
           <url>\n
               <loc>http://codebond.co${data.url}</loc>\n
               <priority>0.6</priority>\n
           </url>\n
           `
       })
       xml += `
       <url>\n
            <loc>http://codebond.co/</loc>\n
            <priority>0.5</priority>\n
       </url>\n
       <url>\n
       <loc>http://codebond.co/tutorial/javascript</loc>\n
       <priority>0.3</priority>\n
       </url>\n  
       <url>\n
       <loc>http://codebond.co/tutorial/nodejs</loc>\n
       <priority>0.3</priority>\n
       </url>\n  
       <url>\n
       <loc>http://codebond.co/tutorial/reactjs</loc>\n
       <priority>0.3</priority>\n
       </url>\n  
       <url>\n
       <loc>http://codebond.co/tutorial/npm</loc>\n
       <priority>0.3</priority>\n
       </url>\n  
       <url>\n
       <loc>http://codebond.co/tutorial/css</loc>\n
       <priority>0.3</priority>\n
       </url>\n  
       <url>\n
       <loc>http://codebond.co/tutorial/other</loc>\n
       <priority>0.3</priority>\n
       </url>\n  
       </urlset>
      ` 
      return xml
   })


