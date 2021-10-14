var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opiskelija ORDER BY idOpiskelija desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            res.render('opiskelija',{data:''});   
        } else {
            res.render('opiskelija',{data:rows});
        }
    });
});

router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opiskelija/add', {
        Etunimi: '',
        Sukunimi: '',
	Osoite: '',
	Luokkatunnus: ''        
    })
})

//lisätään opiskelija
router.post('/add', function(req, res, next) {    

    let Etunimi = req.body.Etunimi;
    let Sukunimi = req.body.Sukunimi;
    let Osoite = req.body.Osoite;
    let Luokkatunnus = req.body.Luokkatunnus;
    let errors = false;

    if(Etunimi.length === 0 || Sukunimi.length === 0 || Osoite.length === 0 || Luokkatunnus.lenght === 0) {
        errors = true;

        // set flash message
        req.flash('virhe', "Kirjoita kaikki tarvittavat tiedot oikein");
        // render to add.ejs with flash message
        res.render('opiskelija/add', {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Osoite: Osoite,
	    Luokkatunnus: Luokkatunnus
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Osoite: Osoite,
	    Luokkatunnus: Luokkatunnus
        }
        
        // insert query
        dbConn.query('INSERT INTO opiskelija SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opiskelija/add', {
                    Etunimi: form_data.Etunimi,
                    Sukunimi: form_data.Sukunimi,
		    Osoite: form_data.Osoite,
		    Luokkatunnus: form_data.Luokkatunnus                      
                })
            } else {                
                req.flash('Onnistui!', 'Opiskelijan tiedot lisätty kantaan.');
                res.redirect('/Opiskelija');
            }
        })
    }
})

// muokkaa opiskelija taulua
router.get('/edit/(:idOpiskelija)', function(req, res, next) {

    let idOpiskelija = req.params.idOpiskelija;
   
    dbConn.query('SELECT * FROM opiskelija WHERE idOpiskelija = ' + idOpiskelija, function(err, rows, fields) {
        if(err) throw err
         
        // jos opiskelijaa ei löydy
        if (rows.length <= 0) {
            req.flash('Virhe', 'Opiskelijaa ei löytynyt id:llä = ' + idOpiskelija)
            res.redirect('/opiskelija')
        }
        // jos opiskelija löytyi
        else {
            // render to edit.ejs
            res.render('opiskelija/edit', {
                title: 'Muokkaa opiskelijaa', 
                idOpiskelija: rows[0].idOpiskelija,
                Etunimi: rows[0].Etunimi,
                Sukunimi: rows[0].Sukunimi,
	        Osoite: rows[0].Osoite,
		Luokkatunnus: rows[0].Luokkatunnus
            })
        }
    })
})

// update book data
router.post('/update/:idOpiskelija', function(req, res, next) {

    let idOpiskelija = req.params.idOpiskelija;
    let Etunimi = req.body.Etunimi;
    let Sukunimi = req.body.Sukunimi;
    let Osoite = req.body.Osoite;
    let Luokkatunnus = req.body.Luokkatunnus;	
    let errors = false;

    if(Etunimi.length === 0 || Sukunimi.length === 0 || Osoite.length === 0 || Luokkatunnus.lenght === 0) {
        errors = true;
        
        // set flash message
        req.flash('Virhe', "Kirjoita kaikki tarvittavat tiedot oikein");
        // render to add.ejs with flash message
        res.render('opiskelija/edit', {
            idOpiskelija: req.params.idOpsikelija,            
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Osoite: Osoite,
	    Luokkatunnus: Luokkatunnus
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Osoite: Osoite,
	    Luokkatunnus: Luokkatunnus
        }
        // update query
        dbConn.query('UPDATE opiskelija SET ? WHERE idOpsikelija = ' + idOpiskelija, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('Virhe', err)
                // render to edit.ejs
                res.render('opiskelija/edit', {
                id: req.params.idOpsikelija,            
                Etunimi: Etunimi,
                Sukunimi: Sukunimi,
	        Osoite: Osoite,
	        Luokkatunnus: Luokkatunnus
                })
            } else {
                req.flash('Onnistui!', 'Opiskelijan tiedot lisätty kantaan');
                res.redirect('/opiskelija');
            }
        })
    }
})
   
// poista opiskelija
router.get('/delete/(:idOpiskelija)', function(req, res, next) {

    let idOpiskelija = req.params.idOpiskelija;
     
    dbConn.query('DELETE FROM opiskelija WHERE idOpiskelija = ' + idOpiskelija, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('Virhe', err)
            // suuntaa uudelleen opiskelijoihin
            res.redirect('/opiskelija')
        } else {
            // set flash message
            req.flash('Onnistui!', 'Opiskelijan tiedot poistettu kannasta idOpiskelija = ' + idOpiskelija)
            res.redirect('/opiskelija')
        }
    })
})

module.exports = router;