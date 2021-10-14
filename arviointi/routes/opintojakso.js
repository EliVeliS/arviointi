var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// näytä opiskelijasivu
router.get('/', function(req, res, next) {
      
    dbConn.query('select * from opintojakso order by idOpintojakso',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            res.render('opintojakso',{data:''});   
        } else {
            res.render('opintojakso',{data:rows});
        }
    });
});

router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opintojakso/add', {
        Nimi: '',
        Laajuus: '',
        Koodi: ''       
    })
})

// lisätään opiskelija
router.post('/add', function(req, res, next) {    

    let Nimi = req.body.Nimi;
    let Laajuus = req.body.Laajuus;
    let Koodi = req.body.Koodi
    let  errors = false;

    if(Nimi.length === 0 || Laajuus.length === 0|| Koodi.length === 0) {
        errors = true;

        // set flash message
        req.flash('virhe', "Anna kaikki tarvittavat tiedot");
        // render to add.ejs with flash message
        res.render('opintojakso/add', {
            idOpintojakso: req.params.idOpintojakso,
            Nimi: Nimi,
            Laajuus: Laajuus,
            Koodi: Koodi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Nimi: Nimi,
            Laajuus: Laajuus,
            Koodi: Koodi
        }
        
        // insert query
        dbConn.query('INSERT INTO opintojakso SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opintojakso/add', {
                    Nimi: form_data.Nimi,
                    Laajuus: form_data.Laajuus,
	    	    Koodi: form_data.Koodi                    
                })
            } else {                
                req.flash('Onnistui!', 'Opintojakson tiedot lisätty kantaan.');
                res.redirect('/opintojakso');
            }
        })
    }
})

// muokkaa opiskelija taulua
router.get('/edit/(:idOpintojakso)', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
   
    dbConn.query('SELECT * FROM opintojakso WHERE idOpintojakso = ' + idOpintojakso, function(err, rows, fields) {
        if(err) throw err
         
        // jos opiskelijaa ei löydy
        if (rows.length <= 0) {
            req.flash('error', 'Opintojaksoa ei loytynyt id:lla = ' + idOpintojakso)
            res.redirect('/opintojakso')
        }
        // jos oiskelija löytyi
        else {
            // render to edit.ejs
            res.render('opintojakso/edit', {
                title: 'Muokkaa opintojaksoa', 
                idOpintojakso: rows[0].idOpintojakso,
                Nimi: rows[0].Nimi,
                Laajuus: rows[0].Laajuus,
		idKoodi: rows[0].idKoodi
            })
        }
    })
})

// update book data
router.post('/update/:idOpintojakso', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
    let Nimi = req.body.Nimi;
    let Laajuus = req.body.Laajuus;
    let idKoodi = req.body.idKoodi;
    let errors = false;

if(Nimi.length === 0 || Laajuus.length === 0|| Koodi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('Virhe', "Anna kaikki tarvittavat tiedot");
        // render to add.ejs with flash message
        res.render('opintojakso/add', {
            Nimi: Nimi,
            Laajuus: Laajuus,
            Koodi: Koodi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Nimi: Nimi,
            Laajuus: Laajuus,
            Koodi: Koodi
        }
        // update query
        dbConn.query('UPDATE arviointi SET ? WHERE idOpintojakso = ' + idOpintojakso, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('virhe', err)
                // render to edit.ejs
            res.render('opintojakso/add', {
            idOpintojakso: req.params.Opintojakso,
            Nimi: Nimi,
            Laajuus: Laajuus,
            Koodi: Koodi
                })
            } else {
                req.flash('Onnistui!', 'Opintojakson tiedot lisatty kantaan');
                res.redirect('/opintojakso');
            }
        })
    }
})
   
// poista opiskelija
router.get('/delete/(:idOpintojakso)', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
     
    dbConn.query('DELETE FROM opintojakso WHERE idOpintojakso = ' + idOpintojakso, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('Virhe', err)
            // suuntaa uudelleen opiskelijoihin
            res.redirect('/opintojakso')
        } else {
            // set flash message
            req.flash('Onnistui!', 'Opintojakson tiedot poistettu ID = ' + idOpintojakso)
            res.redirect('/opintojakso')
        }
    })
})

module.exports = router;