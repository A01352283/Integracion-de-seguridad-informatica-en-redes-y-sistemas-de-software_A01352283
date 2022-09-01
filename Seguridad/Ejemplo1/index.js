const express = require("express")
const fs=require("fs")
const bodyParser=require("body-parser")
const multer =require("multer")
const crypto=require("crypto")
const {MongoClient}=require("mongodb")
const Binary=require("mongodb").Binary
const { resourceUsage } = require("process")


const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.set("view-engine", "ejs")
const uploads=multer({dest:".temp"})

let db;

function connectToDb(){
    let client = new MongoClient("mongodb://127.0.0.1:27017/casos")
    client.connect();
    console.log("Conectado a la base de datos")
    db=client.db();
}

app.get("/descargar", (req, res)=>{
    db.collection("carpeta").find({}).project({_id:0, nombre:1}).toArray((err,result)=>{
        if (err) throw err;
        res.render("descargar.ejs", {archivos:result})
    })

})

app.post("/descargar", (req, res)=>{
    db.collection("carpeta").findOne({nombre:req.body.documentos}, (err,result)=>{
        let temporalCifrado=__dirname+"/.temp/"+req.body.documentos;
        fs.writeFileSync(temporalCifrado, result.archivo.buffer)

        let temporalTextoPlano=__dirname+"/.temp/"+req.body.documentos+".pdf";
        let inputFS=fs.createReadStream(temporalCifrado)
        let outputFS=fs.createWriteStream(temporalTextoPlano)
    
        let key="abcabcabcabcabcabcabcabcabcabc12"
        let iv="abcabcabcabcabc1"
        let cipher=crypto.createCipheriv("aes-256-cbc", key, iv)
    
        inputFS.pipe(cipher).pipe(outputFS)
        outputFS.on("finish", ()=>{
            fs.unlinkSync(temporalCifrado);
            res.download(temporalTextoPlano, (err)=>{
                if (err) throw err;
                fs.unlinkSync(temporalTextoPlano)
            })
        })
    })
})

app.get("/cargar", (req, res)=>{
    res.render("cargar.ejs")
})

app.post("/cargar", uploads.single("archivo"), (req,res)=>{
    let rutaCifrado=__dirname+"/.temp/"+req.body.nombre
    let inputFS=fs.createReadStream(__dirname+"/.temp/"+req.file.filename)
    let outputFS=fs.createWriteStream(rutaCifrado)

    let key="abcabcabcabcabcabcabcabcabcabc12"
    let iv="abcabcabcabcabc1"
    let cipher=crypto.createCipheriv("aes-256-cbc", key, iv)

    inputFS.pipe(cipher).pipe(outputFS)
    outputFS.on("finish", ()=>{
        fs.unlinkSync(__dirname+"/.temp/"+req.file.filename)
        let archivoCargado=fs.readFileSync(rutaCifrado);

        let aInsertar={}
        aInsertar.nombre = req.body.nombre
        aInsertar.archivo = Binary(archivoCargado); //Convierte al formato binario de Mongo
        db.collection("carpeta").insertOne(aInsertar, (err, res)=>{
            if (err) throw err;
            console.log(res)
            fs.unlinkSync(rutaCifrado)
        })
    })

    res.render("cargar.ejs")
})

app.listen(1337, ()=>{
    connectToDb()
    console.log("Server started on port 3000....")
})