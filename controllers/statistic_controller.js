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
  Promise.all(
    [
      models.Quiz.count(),
      models.Comment.count(),
      models.Comment.findAndCountAll({ group: 'quizId', include: [{model: models.Quiz}] })
    ]
    ).then(function(results) {
      res.render('statistics/statistic.ejs', {
          total_quizes: results[0],
          total_comments: results[1],
          question_with_comments: results[2].rows.length,
          errors: []});
    });
}
