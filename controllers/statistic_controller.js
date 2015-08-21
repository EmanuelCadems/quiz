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
  var commented_quizes = 0;
  var no_commented     = 0;
  Promise.all(
    [
      models.Quiz.count(),
      models.Comment.count(),
      models.Quiz.findAll({
        include: [
          {model: models.Comment}
        ]
      })
      // I have to use this because heroku through timeout with: models.Comment.findAndCountAll({ group: 'quizId', include: [{model: models.Quiz}] })
    ]
    ).then(function(results) {
      for (var i in results[2]) {
        if (results[2][i].comments.length) {
            commented_quizes++;
        } else {
            no_commented++;
        }
      };
      res.render('statistics/statistic.ejs', {
          total_quizes: results[0],
          total_comments: results[1],
          question_with_comments: commented_quizes, //results[2].rows.length,
          errors: []});
    });
}
