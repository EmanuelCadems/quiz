var models = require('../models/models.js');

// exports.get_totals = function(req, res, next) {
//   models.Quiz.count().then(function(quiz_count) {
//     console.log('======= quiz_count' + quiz_count.toString());
//     var total_quizes = quiz_count;
//     req.total_quizes = quiz;
//     next();
//   }).catch(function(error) {next(error);});
// };


exports.statistic = function(req, res) {
  var total_comments = 0;

  models.Quiz.count().then(function(quiz_count) {
    console.log('======= quiz_count' + quiz_count.toString());
    req.total_quizes = quiz_count;

    models.Comment.count().then(function(comment_count) {
      req.total_comments = comment_count;

      models.Comment.findAndCountAll({ group: 'quizId', include: [{model: models.Quiz}] }).then(function(question_with_comments) {
        console.log(JSON.stringify(question_with_comments, null, 4));
        req.question_with_comments = question_with_comments.rows.length;
        res.render('statistics/statistic.ejs', {
          total_quizes: req.total_quizes,
          total_comments: req.total_comments,
          question_with_comments: req.question_with_comments,
          errors: []});
      })
    });

  });


  // console.log('=======  antes del render === total_quizes' + req.total_quizes );


}
