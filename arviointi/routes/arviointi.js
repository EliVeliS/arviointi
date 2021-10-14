var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// näytä opiskelijasivu
router.get('/', function(req, res, next) {
      
    dbConn.query('select * from arviointi order by idArviointi',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            res.render('arviointi',{data:''});   
        } else {
            res.render('arviointi',{data:rows});
        }
    });
});

router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('arviointi/add', {
        Paivamaara: '',
        Arvosana: '',
        idOpiskelija: '',
        idOpintojakso: ''        
    })
})

// lisätään opiskelija
router.post('/add', function(req, res, next) {    

    let Paivamaara = req.body.Paivamaara;
    let Arvosana = req.body.Arvosana;
    let idOpiskelija = req.body.idOpiskelija;
    let idOpintojakso = req.body.idOpintojakso;
    let  errors = false;

    if(Paivamaara.length === 0 || Arvosana.length === 0|| idOpiskelija.length === 0|| idOpintojakso.length === 0) {
        errors = true;

        // set flash message
        req.flash('virhe', "Anna kaikki tarvittavat tiedot");
        // render to add.ejs with flash message
        res.render('arviointi/add', {
            idArviointi: req.params.idArviointi,
            Paivamaara: Paivamaara,
            Arvosana: Arvosana,
            idOpiskelija: idOpiskelija,
            idOpintojakso: idOpintojakso
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Paivamaara: Paivamaara,
            Arvosana: Arvosana,
            idOpiskelija: idOpiskelija,
            idOpintojakso: idOpintojakso
        }
        
        // insert query
        dbConn.query('INSERT INTO arviointi SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('arviointi/add', {
                    Paivamaara: form_data.Paivamaara,
                    Arvosana: form_data.Arvosana,
	    	    idOpiskelija: form_data.idOpiskelija,
	            idOpintojakso: form_data.idOpintojakso                    
                })
            } else {                
                req.flash('Onnistui!', 'Arvioinnin tiedot lisätty kantaan.');
                res.redirect('/arviointi');
            }
        })
    }
})

// muokkaa opiskelija taulua
router.get('/edit/(:idArviointi)', function(req, res, next) {

    let idArviointi = req.params.idArviointi;
   
    dbConn.query('SELECT * FROM arviointi WHERE idArviointi = ' + idArviointi, function(err, rows, fields) {
        if(err) throw err
         
        // jos opiskelijaa ei löydy
        if (rows.length <= 0) {
            req.flash('error', 'Arviointia ei loytynyt id:lla = ' + idArviointi)
            res.redirect('/arviointi')
        }
        // jos oiskelija löytyi
        else {
            // render to edit.ejs
            res.render('arviointi/edit', {
                title: 'Muokkaa arviointia', 
                idArviointi: rows[0].idArviointi,
                Paivamaara: rows[0].Paivamaara,
                Arvosana: rows[0].Arvosana,
		idOpiskelija: rows[0].idOpiskelija,
		idOpintojakso: rows[0].idOpintojakso,
            })
        }
    })
})

// update book data
router.post('/update/:idArviointi', function(req, res, next) {

    let idArviointi = req.params.idArviointi;
    let Paivamaara = req.body.Paivamaara;
    let Arvosana = req.body.Arvosana;
    let idOpiskelija = req.body.idOpiskelija;
    let idOpintojakso = req.body.idOpintojakso;
    let errors = false;

if(Paivamaara.length === 0 || Arvosana.length === 0|| idOpiskelija.length === 0|| idOpintojakso.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('Virhe', "Anna kaikki tarvittavat tiedot");
        // render to add.ejs with flash message
        res.render('arviointi/add', {
            Paivamaara: Paivamaara,
            Arvosana: Arvosana,
            idOpiskelija: idOpiskelija,
            idOpintojakso: idOpintojakso
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Paivamaara: Paivamaara,
            Arvosana: Arvosana,
            idOpiskelija: idOpiskelija,
            idOpintojakso: idOpintojakso
        }
        // update query
        dbConn.query('UPDATE arviointi SET ? WHERE idArviointi = ' + idArviointi, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('virhe', err)
                // render to edit.ejs
            res.render('arviointi/add', {
            idArviointi: req.params.idArviointi,
            Paivamaara: Paivamaara,
            Arvosana: Arvosana,
            idOpiskelija: idOpiskelija,
            idOpintojakso: idOpintojakso
                })
            } else {
                req.flash('Onnistui!', 'Opiskelijan tiedot lisatty kantaan');
                res.redirect('/arviointi');
            }
        })
    }
})
   
// poista opiskelija
router.get('/delete/(:idArviointi)', function(req, res, next) {

    let idArviointi = req.params.idArviointi;
     
    dbConn.query('DELETE FROM arviointi WHERE idArviointi = ' + idArviointi, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('Virhe', err)
            // suuntaa uudelleen opiskelijoihin
            res.redirect('/arviointi')
        } else {
            // set flash message
            req.flash('Onnistui!', 'Arvioinnin tiedot poistettu ID = ' + idArviointi)
            res.redirect('/arviointi')
        }
    })
})

module.exports = router;