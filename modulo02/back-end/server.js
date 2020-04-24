const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const videos = require('./data')

server.use(express.static('public'))

server.set("view engine","njk")

nunjucks.configure("views", {
    express:server,
    autoescape: false,
    noCache: true
})

server.get('/', function(req,res){
    const about = {
        avatar_url: "https://avatars0.githubusercontent.com/u/37991230?s=460&u=8488f16045046b66a7940a3635108ff5b63b3c93&v=4",
        name: "Tony Amaral",
        role: "Desenvolvedor",
        description: 'Um cara bem legal que esta realmente interessado em aprender. <a href="#"> Bio </a>',
        links: [
            { name: "LinkedIn", url: "#" },
            { name: "Instagram", url: "#" }
        ]
    }

    return res.render("about", { about })
})

server.get('/portfolio', function(req,res){
    return res.render("portfolio",{ items: videos })
})

server.get('/video', function(req,res){
    const { id } = req.query;

    const video = videos.find( item => item.id === id);

    if(!video) return res.send("Video not Found");

    return res.render("video", { item: video })
})

server.listen(5000, function(){
    console.log('Server is Running');
})