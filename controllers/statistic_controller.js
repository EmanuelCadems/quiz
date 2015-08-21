var models = require('../models/models.js');

exports.statistic = function(req, res) {
  var commented_quizes = 0;
  var no_commented     = 0;
  var average          = 0;

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

      if (results[0] !== 0) {
        average = results[1] / results[0]
      };

      res.render('statistics/statistic.ejs', {
          total_quizes: results[0],
          total_comments: results[1],
          average: average,
          commented_quizes: commented_quizes, //results[2].rows.length,
          no_commented: no_commented,
          errors: []});
    });
}
