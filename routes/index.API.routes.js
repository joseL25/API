// import express from 'express';
const express = require('express');
const indexRouter = express.Router(); // este router es para los endpoints del home

indexRouter.get('/',(req,res)=>{
    res.send('vista del home');
});

module.exports = indexRouter;