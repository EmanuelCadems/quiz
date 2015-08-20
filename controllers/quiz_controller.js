var models = require('../models/models.js')

exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
    where: { id: Number(quizId) },
    include: [{ model: models.Comment }]
  }).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) {next(error);});
};


exports.index = function(req, res) {
  if (req.query.search) {
    models.Quiz.findAll({where: ["pregunta like ?", '%' + req.query.search + '%']}).then(
      function(quizes) {
        res.render('quizes/index.ejs', { quizes: quizes, errors: [] });
      }
      ).catch(function(error) { next(error); });
  } else {
    models.Quiz.findAll().then(
      function(quizes){
        res.render('quizes/index.ejs', { quizes: quizes, errors: []});
      }
    ).catch(function(error) { next(error);});
  };
};

exports.show = function(req, res) {
  console.log('====== req.quiz.comments' + req.quiz.comments);
  console.log(JSON.stringify(req.quiz.comments, null, 4));
  res.render('quizes/show', { quiz: req.quiz, errors: [] });
};

exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }

  res.render('quizes/answer',
    { respuesta: resultado,
      quiz: req.quiz,
      errors: []
    });
};

exports.new = function(req, res) {
  var quiz = models.Quiz.build({pregunta: 'Pregunta', respuesta: 'Respuesta', tema: 'Tema'});
  res.render('quizes/new', {quiz: quiz, errors: []})
}

var util = require('util');

// console.log(util.inspect(myObject, {showHidden: false, depth: null}));
// alternative shortcut
// console.log(util.inspect(myObject, false, null));
// console.log(JSON.stringify(myObject, null, 4));

exports.create = function(req, res) {

  // quiz
  // .validate()
  var quiz = models.Quiz.build(req.body.quiz);

  var errors = quiz.validate();
  console.log('====== errors: ' + errors);
  console.log(util.inspect(errors, false, null));
  console.log(JSON.stringify(errors, null, 4));

  if (errors) {
    res.render('quizes/new', {quiz: quiz, errors: errors});

  } else {
    quiz
    .save({fields: ["pregunta", "respuesta", "tema"]})
    .then(function(){ res.redirect('/quizes')})
  }
};

exports.edit = function(req, res) {
  var quiz = req.quiz;
  res.render('quizes/edit', {quiz: quiz, errors: []})
}

exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema      = req.body.quiz.tema;

  var errors = req.quiz.validate()

  if (errors) {
    res.render('quizes/edit', {quiz: res.quiz, errors: errors});
  } else {
    req.quiz.save( {fields: ['pregunta', 'respuesta', 'tema']})
    .then(function(){ res.redirect('/quizes');});
  }

}

exports.destroy = function(req, res) {
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
