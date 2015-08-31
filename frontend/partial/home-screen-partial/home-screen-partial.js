angular.module('dentest').controller('HomeScreenPartialCtrl',function($scope){
    var self = this;

    self.interval = 7000;

    self.slides = [];

  self.slides.push({
    image: 'static/students_at_computer.jpg',
    title: 'Over 6000 questions.',
    text: 'Dentest contains a bank of over 6000 questions covering a wide range of Dentistry related topics.',
  });

  self.slides.push({
    image: 'static/dentists.jpg',
    title: 'Validated by experts.',
    text: 'All of our questions are validated by professional dentists and dentistry teachers to ensure accuracy and relevance.',
  });

  self.slides.push({
    image: 'static/students.jpg',
    title: 'Study on the move.',
    text: 'Dentest is perfect for revising and learning while on the move or when you only have a short break.'
  });

});
