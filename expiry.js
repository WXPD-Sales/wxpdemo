var moment = require('moment');

function calculateSeconds(startDate,endDate){
  console.log(startDate);
  console.log(endDate);
  var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
  var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss A');
  console.log(start_date);
  console.log(end_date);
  var duration = moment.duration(end_date.diff(start_date));
  var secs = duration.asSeconds();
  return secs;
};

module.exports = {calculateSeconds};
