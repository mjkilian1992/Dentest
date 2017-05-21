angular.module('dentest').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('auth/partial/email_confirmation_form/email_confirmation_form.html',
    "<div class=col-md-12 ng-controller=\"EmailConfirmationFormCtrl as emlCnfmCtrl\"><div ng-show=\"emlCnfmCtrl.non_field_errors.length <= 0\"><form name=email_confirm_form ng-submit=emlCnfmCtrl.confirm_email()><h4>Hit 'Confirm' to finish your email activation and start using Dentest!</h4><div class=form-group><input class=\"btn btn-success\" type=submit value=Confirm></div></form></div><div ng-show=\"emlCnfmCtrl.non_field_errors.length > 0\"><h4>Oops! A problem occurred...</h4><p ng-repeat=\"error in emlCnfmCtrl.non_field_errors\"><span class=text-danger>{{error}}</span></p><p>Your email may already be confirmed. Try logging in. If this does not work, please visit our support page.</p></div></div>"
  );


  $templateCache.put('auth/partial/login_form/login_form.html',
    "<form name=login_form ng-controller=\"LoginFormCtrl as loginctrl\" ng-submit=loginctrl.login()><div class=form-group><label for=login_form_username>Username or Email</label><input type=text id=login_form_username class=form-control name=login_username ng-model=loginctrl.login_details.username required placeholder=\"Username or email\"></div><div class=form-group><label for=login_form_password1>Password</label><input type=password id=login_form_password1 class=form-control name=login_password ng-model=loginctrl.login_details.password required placeholder=Password></div><div class=form-group><div class=errors><p ng-repeat=\"error in loginctrl.non_field_errors\"><span class=text-danger>{{error}}</span></p></div></div><div class=form-group><input class=\"btn btn-primary\" type=submit value=Login ng-disabled=\"login_form.$invalid\"></div><a href=/password_reset>Forgotten Password?</a></form>"
  );


  $templateCache.put('auth/partial/other/reg_and_login_tabbed_view.html',
    "<div class=container><div class=\"panel panel-primary\"><div class=panel-heading>Signup & Login</div><div class=panel-body><div id=login_and_registration_tabs><tabset justified=true><tab heading=\"Sign Up\"><div ng-include=\"'auth/partial/registration_form/registration_form.html'\" class=reg_and_login_tab></div></tab><tab heading=Login><div ng-include=\"'auth/partial/login_form/login_form.html'\" class=reg_and_login_tab></div></tab></tabset></div></div></div></div>"
  );


  $templateCache.put('auth/partial/other/registration_success.html',
    "<div class=col-md-12><div class=\"panel panel-success\"><div class=panel-heading><h3>Success</h3></div><div class=panel-body>Please check your inbox for a confirmation. Follow the instructions in this email to finish registration.</div></div></div>"
  );


  $templateCache.put('auth/partial/password_reset_confirm_form/password_reset_confirm_form.html',
    "<form name=password_reset_confirm_form ng-controller=\"PasswordResetConfirmFormCtrl as confirmCtrl\" ng-submit=confirmCtrl.password_reset_confirm()><div class=\"panel panel-default\"><div class=panel-heading>Create a new password</div><div class=panel-body><div class=\"panel panel-info\"><div class=panel-body>A password at least 8 characters long with at least one uppercase letter, one digit and one punctuation character.</div></div><div class=form-group><label for=password_reset_confirm_form_password1>New Password</label><input type=password id=password_reset_confirm_form_password1 class=form-control name=password_reset_confirm_password1 ng-model=confirmCtrl.reset_confirm_details.password1 required placeholder=Password><div class=errors><ul ng-repeat=\"error in confirmCtrl.password1_errors\"><span class=text-danger>{{error}}</span></ul></div></div><div class=form-group><label for=password_reset_confirm_form_password2>Confirm Password</label><input type=password id=password_reset_confirm_form_password2 class=form-control name=password_reset_confirm_password2 ng-model=confirmCtrl.reset_confirm_details.password2 required placeholder=\"Confirm Password\"><div class=errors><ul ng-repeat=\"error in confirmCtrl.password2_errors\"><span class=text-danger>{{error}}</span></ul></div></div><div class=errors><ul ng-repeat=\"error in confirmCtrl.non_field_errors\"><span class=text-danger>{{error}}</span></ul></div><div class=form-group><input class=\"btn btn-primary\" type=submit value=\"Reset Password\" ng-disabled=password_reset_confirm_form.$invalid></div></div></div></form>"
  );


  $templateCache.put('auth/partial/password_reset_form/password_reset_form.html',
    "<form name=password_reset_request_form ng-controller=\"PasswordResetFormCtrl as pswdRstRqstCtrl\" ng-submit=pswdRstRqstCtrl.password_reset()><div class=\"panel panel-primary\"><div class=panel-heading>Password Reset</div><div class=panel-body><div class=form-group><label for=password_reset_request_form_username>Username</label><input type=text id=password_reset_request_form_username class=form-control name=password_reset_request_username ng-model=pswdRstRqstCtrl.reset_details.username required placeholder=Username></div><div class=errors><ul ng-repeat=\"error in pswdRstRqstCtrl.non_field_errors\"><span class=text-danger>{{error}}</span></ul></div><input class=\"btn btn-primary\" type=submit value=\"Reset Password\" ng-disabled=\"password_reset_request_form.$invalid\"></div></div></form>"
  );


  $templateCache.put('auth/partial/password_reset_request_success/password_reset_request_success.html',
    "<div><h4 class=text-success>A password reset email has been sent to your email account.</h4><p>Please check your email and follow the instructions to continue resetting your password.</p></div>"
  );


  $templateCache.put('auth/partial/registration_form/registration_form.html',
    "<div><div><div class=\"panel panel-info\"><div class=panel-heading><h5>Please provide:</h5></div><div class=panel-body><ol><li>A username between 6 and 30 characters long.</li><li>A password at least 8 characters long with at least one uppercase letter, one digit and one piece of punctuation.</li><li>A valid email address (you will be asked to confirm this via email).</li><li>Your first and last name.</li></ol></div></div></div><div><form name=reg_form ng-controller=\"RegistrationFormCtrl as regctrl\" ng-submit=regctrl.register()><div class=form-group><label for=reg_form_username>Username</label><input type=text id=reg_form_username class=form-control name=reg_username ng-model=regctrl.registration_details.username required placeholder=Username><div class=errors><ol ng-repeat=\"error in regctrl.username_errors\"><span class=text-danger>{{error}}</span></ol></div></div><div class=form-group><label for=reg_form_email>Email</label><input type=email id=reg_form_email class=form-control name=reg_email ng-model=regctrl.registration_details.email required placeholder=example@youremail.com><div class=errors><ol><span class=text-danger ng-show=\"reg_form.reg_email.$invalid && reg_form.reg_email.$dirty\">Not a valid email address</span></ol><ol ng-repeat=\"error in regctrl.email_errors\"><span class=text-danger>{{error}}</span></ol></div></div><div class=form-group><label for=reg_form_password1>Password</label><input type=password id=reg_form_password1 class=form-control name=reg_form_password1 ng-model=regctrl.registration_details.password1 required placeholder=Password><div class=errors><ol ng-repeat=\"error in regctrl.password1_errors\"><span class=text-danger>{{error}}</span></ol></div></div><div class=form-group><label for=reg_form_password2>Confirm Password</label><input type=password id=reg_form_password2 class=form-control name=reg_form_password2 ng-model=regctrl.registration_details.password2 required placeholder=\"Confirm Password\"><div class=errors><ul ng-repeat=\"error in regctrl.password2_errors\"><li>{{error}}</li></ul></div></div><div class=form-group><label for=reg_form_first_name>First Name</label><input type=text id=reg_form_first_name class=form-control ng-model=regctrl.registration_details.first_name required placeholder=Joe><div class=errors><ul ng-repeat=\"error in regctrl.first_name_errors\"><span class=text-danger>{{error}}</span></ul></div></div><div class=form-group><label for=reg_form_last_name>Surname</label><input type=text id=reg_form_last_name class=form-control ng-model=regctrl.registration_details.last_name required placeholder=Bloggs><div class=errors><ul ng-repeat=\"error in regctrl.last_name_errors\"><span class=text-danger>{{error}}</span></ul></div></div><div class=form-group><div class=errors><ul ng-repeat=\"error in regctrl.non_field_errors\"><span class=text-danger>{{error}}</span></ul></div></div><div class=form-group><input class=\"btn btn-primary\" type=submit value=Register ng-disabled=\"reg_form.$invalid\"></div></form></div></div>"
  );


  $templateCache.put('auth/partial/update_profile/update_profile.html',
    "<form name=update_profile_form ng-controller=\"UpdateProfileFormCtrl as update_ctrl\" ng-submit=update_ctrl.update_profile()><div class=\"panel panel-primary\"><div class=panel-heading><h3 class=panel-title>{{update_ctrl.user_details.username}}</h3></div><div class=panel-body><div class=form-group><label for=update_profile_form_email>Email</label><input type=email id=update_profile_form_email class=form-control name=update_profile_email ng-model=update_ctrl.user_details.email required placeholder=example@youremail.com ng-disabled=\"update_ctrl.edit_mode === false\"><div class=errors><ul ng-repeat=\"error in update_ctrl.email_errors\"><li>{{error}}</li></ul></div></div><div class=form-group><label for=update_profile_form_first_name>First Name</label><input type=text id=update_profile_form_first_name class=form-control name=update_profile_first_name ng-model=update_ctrl.user_details.first_name required placeholder=Joe ng-disabled=\"update_ctrl.edit_mode === false\"><div class=errors><ul ng-repeat=\"error in update_ctrl.first_name_errors\"><li>{{error}}</li></ul></div></div><div class=form-group><label for=update_profile_form_last_name>Surname</label><input type=text id=update_profile_form_last_name class=form-control name=update_profile_form_last_name ng-model=update_ctrl.user_details.last_name required placeholder=Bloggs ng-disabled=\"update_ctrl.edit_mode === false\"><div class=errors><ul ng-repeat=\"error in update_ctrl.last_name_errors\"><li>{{error}}</li></ul></div></div><div class=form-group><div class=errors><ul ng-repeat=\"error in update_ctrl.non_field_errors\"><li>{{error}}</li></ul></div></div><div class=form-group><input class=\"btn btn-warning\" type=button value=Edit ng-click=update_ctrl.allow_editing() ng-hide=update_ctrl.edit_mode ng-disabled=\"update_ctrl.edit_mode\"> <input class=\"btn btn-success\" type=submit value=Save ng-disabled=\"update_profile_form.$invalid || !update_ctrl.edit_mode\" ng-hide=\"!update_ctrl.edit_mode\"></div></div></div></form>"
  );


  $templateCache.put('partial/footer/footer.html',
    "<div class=col-md-12><div class=\"centered_content footer_content\"><p class=text-muted>www.dentest.com</p></div></div>"
  );


  $templateCache.put('partial/home-screen-partial/home-screen-partial.html',
    "<div id='hompage-carousel' ]class=\"col-md-12\" ng-controller=\"HomeScreenPartialCtrl as hsCtrl\">\n" +
    "    <carousel interval=\"hsCtrl.interval\">\n" +
    "      <slide ng-repeat=\"slide in hsCtrl.slides\" active=\"slide.active\">\n" +
    "        <img ng-src=\"{{slide.image}}\" style=\"margin:auto;\">\n" +
    "        <div class=\"carousel-caption\">\n" +
    "          <h3>{{slide.title}}</h3>\n" +
    "          <h5>{{slide.text}}</h5>\n" +
    "        </div>\n" +
    "      </slide>\n" +
    "    </carousel>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partial/navbar/navbar.html',
    "<nav class=\"navbar navbar-default\" role=navigation ng-controller=\"NavbarCtrl as navctrl\"><div class=navbar-header><button type=button class=navbar-toggle ng-init=\"navCollapsed = true\" ng-click=\"navCollapsed = !navCollapsed\"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href=\"/\">Dentest</a></div><div class=\"collapse navbar-collapse\" ng-class=\"{'in':!navCollapsed}\"><ul class=\"nav navbar-nav\"><li><a href=/topic_choices>Questions</a></li><li><a href=/quiz/choose_content>Quiz</a></li><li><a href=#>About</a></li></ul><form class=\"navbar-form navbar-left\" role=search ng-submit=navctrl.question_search()><div class=form-group><input type=text class=form-control placeholder=Search ng-model=navctrl.search_string></div><button type=submit class=\"btn btn-default\">Submit</button></form><ul class=\"nav navbar-nav navbar-right\"><li class=active ng-hide=\"navctrl.is_logged_in() == true\"><a href=/signup>Sign Up</a></li><li uib-dropdown id=user-dropdown ng-show=\"navctrl.is_logged_in() == true\"><a href uib-dropdown-toggle>{{navctrl.get_username()}}<b class=caret></b></a><ul class=uib-dropdown-menu aria-labelledby=user-dropdown><li><a href=/update_profile>Manage my user details</a></li><li><a href=/password_reset>Change password</a></li><li><a href=/manage_subscription>Manage my subscription</a></li><li class=divider></li><li><a ng-click=navctrl.logout()>Logout</a></li></ul></li></ul></div></nav>"
  );


  $templateCache.put('questions/partial/main_question_viewer/main_question_viewer.html',
    "<div class=question-list ng-controller=\"MainQuestionViewerCtrl as qCtrl\"><div class=\"panel panel-primary\"><div class=panel-heading><h3>Questions</h3></div><div class=panel-body><div class=question-box ng-repeat=\"question in qCtrl.questions\"><div class=\"panel panel-default\" style=\"position:relative; margin:auto 10px auto 10px\"><div class=panel-heading><div><strong><a ng-href=/topic/{{question.subtopic.topic}}>{{question.subtopic.topic}}</a> -> <a ng-href=/subtopic/{{question.subtopic.topic}}/{{question.subtopic.name}}>{{question.subtopic.name}}</a></strong></div><div class=question-id-tag><strong>ID: <a ng-href=/question_no/{{question.id}}>{{question.id}}</a></strong></div></div><div class=panel-body><div class=question-text><p>{{question.question}}</p></div><div ng-init=\"isCollapsed = true\"><button type=button class=\"btn btn-primary btn-xs\" ng-click=\"isCollapsed = !isCollapsed\">Show Answer</button><hr><div collapse=isCollapsed><div class=\"well well-sm\"><div class=answer-text><p>{{question.answer}}</p></div></div></div></div></div></div></div><pagination class=question-paginator total-items=qCtrl.ui_total_items ng-model=qCtrl.ui_page_number max-size={{10}} items-per-page=qCtrl.ui_page_size class=pagination-sm boundary-links=true rotate=false ng-change=qCtrl.retrieve_questions()></pagination></div></div></div>"
  );


  $templateCache.put('questions/partial/question_by_id_view/question_by_id_view.html',
    "<div class=col-md-12 ng-controller=\"QuestionByIdViewCtrl as qCtrl\"><h4 ng-hide=\"qCtrl.question_not_found|| qCtrl.question_restricted\">Question {{qCtrl.question.id}}</h4><div class=question-box ng-hide=\"qCtrl.question_not_found|| qCtrl.question_restricted\"><div class=\"panel panel-default\" style=\"position:relative; margin:auto 10px auto 10px\"><div class=panel-heading><div><strong><a ng-href=/topic/{{qCtrl.question.subtopic.topic}}>{{qCtrl.question.subtopic.topic}}</a> -> <a href=/subtopic/{{qCtrl.question.subtopic.topic}}/{{qCtrl.question.subtopic.name}}>{{qCtrl.question.subtopic.name}}</a></strong></div><div class=question-id-tag><strong>ID: <a ng-href=/question_no/{{qCtrl.question.id}}>{{qCtrl.question.id}}</a></strong></div></div><div class=panel-body><div class=question-text><p>{{qCtrl.question.question}}</p></div><div ng-init=\"isCollapsed = true\"><button type=button class=\"btn btn-primary btn-xs\" ng-click=\"isCollapsed = !isCollapsed\">Show Answer</button><hr><div collapse=isCollapsed><div class=\"well well-sm\"><div class=answer-text><p>{{qCtrl.question.answer}}</p></div></div></div></div></div></div></div><div class=\"panel panel-danger\" ng-show=qCtrl.question_not_found><div class=panel-heading><h5>Question does not exist!</h5></div><div class=panel-body><p>We cant find a question with that ID number. Please try another.</p></div></div><div class=\"panel panel-danger\" ng-show=qCtrl.question_restricted><div class=panel-heading><h5>Sign up to our premium service</h5></div><div class=panel-body><p>This question is restricted to subscribed members. Please take out a Dentest subscription to view this question.</p></div></div></div>"
  );


  $templateCache.put('questions/partial/question_search/question_search.html',
    "<div class=question-list ng-controller=\"QuestionSearchCtrl as qCtrl\"><div ng-hide=qCtrl.error><div class=question-box ng-repeat=\"question in qCtrl.questions\"><div class=\"panel panel-default\" style=\"position:relative; margin:auto 10px auto 10px\"><div class=panel-heading><div><strong><a ng-href=/topic/{{question.subtopic.topic}}>{{question.subtopic.topic}}</a> -> <a ng-href=/subtopic/{{question.subtopic.topic}}/{{question.subtopic.name}}>{{question.subtopic.name}}</a></strong></div><div class=question-id-tag><strong>ID: <a ng-href=/question_no/{{question.id}}>{{question.id}}</a></strong></div></div><div class=panel-body><div class=question-text><p>{{question.question}}</p></div><div ng-init=\"isCollapsed = true\"><button type=button class=\"btn btn-primary btn-xs\" ng-click=\"isCollapsed = !isCollapsed\">Show Answer</button><hr><div collapse=isCollapsed><div class=\"well well-sm\"><div class=answer-text><p>{{question.answer}}</p></div></div></div></div></div></div></div><pagination class=question-paginator total-items=qCtrl.ui_total_items ng-model=qCtrl.ui_page_number max-size={{10}} items-per-page=qCtrl.ui_page_size class=pagination-sm boundary-links=true rotate=false ng-change=qCtrl.retrieve_questions()></pagination></div><div ng-show=qCtrl.error><div class=\"panel panel-danger\"><div class=panel-heading><h5>Could not find any available questions matching \"{{qCtrl.search_string}}\"</h5></div><div class=panel-body><p>Please try again.</p></div></div></div></div>"
  );


  $templateCache.put('questions/partial/subtopic_view/subtopic_view.html',
    "<div class=col-md-12 ng-controller=\"SubtopicViewCtrl as sCtrl\"><div class=subtopic-box ng-hide=sCtrl.subtopic_not_found><div class=\"panel panel-default\" style=\"position:relative; margin:auto 10px auto 10px\"><div class=panel-heading><div><strong><a ng-href=/topic/{{sCtrl.subtopic.topic}}>{{sCtrl.subtopic.topic}}</a> -> <a href=/subtopic/{{sCtrl.subtopic.topic}}/{{sCtrl.subtopic.name}}>{{sCtrl.subtopic.name}}</a></strong> <strong class=right_justified_header_content><a ng-href=/questions/{{sCtrl.subtopic.topic}}/{{sCtrl.subtopic.name}}>Show Questions</a></strong></div></div><div class=panel-body><div class=topic-text><p>{{sCtrl.subtopic.description}}</p></div></div></div></div><div class=\"panel panel-danger\" ng-show=sCtrl.subtopic_not_found><div class=panel-heading><h5>Subtopic does not exist!</h5></div><div class=panel-body><p>We cant find a subtopic with that name. If you are revisiting this weblink, the topic may have been removed or renamed.</p></div></div></div>"
  );


  $templateCache.put('questions/partial/topic_navigator/topic_navigator.html',
    "<div class=col-md-12 ng-controller=\"TopicNavigatorCtrl as ctrl\"><div id=topic_navigator_success ng-hide=ctrl.error><div class=\"panel panel-primary\"><div class=panel-heading><h3>Please choose a topic:</h3></div><div class=panel-body><uib-accordion close-others=false><uib-accordion-group ng-init=\"open=false\" class=topic_navigator_topic ng-repeat=\"topic in ctrl.topic_list\" is-open=open><uib-accordion-heading><div><strong>{{topic.topic}}</strong> <i class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-chevron-down': open, 'glyphicon-chevron-right': open}\"></i></div></uib-accordion-heading><div><a class=btn-s ng-href=/topic/{{topic.topic}}>View Info</a><br><a class=btn-s ng-href=/questions/{{topic.topic}}>Show all questions for {{topic.topic}}</a></div><div class=\"panel panel-default\" style=margin-top:20px><div class=panel-heading>Subtopics</div><div class=panel-body><table class=\"table table-striped table-hover\"><tr ng-repeat=\"subtopic in topic.subtopics\"><td><a ng-href=/subtopic/{{topic.topic}}/{{subtopic}}>{{subtopic}}</a></td><td><a ng-href=/questions/{{topic.topic}}/{{subtopic}}>Show Questions</a></td></tr></table></div></div></uib-accordion-group></uib-accordion></div><div id=topic_navigator_failure ng-show=ctrl.error><div class=\"panel panel-danger\"><div class=panel-heading><h3>Something went wrong!</h3></div><div class=panel-body><p>Dentest is having a problem fetching the list of topics. Please check your internet connection and try again.</p></div></div></div></div></div></div>"
  );


  $templateCache.put('questions/partial/topic_view/topic_view.html',
    "<div class=col-md-12 ng-controller=\"TopicViewCtrl as tCtrl\"><div class=topic-box ng-hide=tCtrl.topic_not_found><div class=\"panel panel-default\" style=\"position:relative; margin:auto 10px auto 10px\"><div class=panel-heading><div><strong><a ng-href=/topic/{{tCtrl.topic.name}}>{{tCtrl.topic.name}}</a></strong> <strong class=right_justified_header_content><a ng-href=/questions/{{tCtrl.topic.name}}>Show Questions</a></strong></div></div><div class=panel-body><div class=topic-text><p>{{tCtrl.topic.description}}</p></div></div></div></div><div class=\"panel panel-danger\" ng-show=tCtrl.topic_not_found><div class=panel-heading><h5>Topic does not exist!</h5></div><div class=panel-body><p>We cant find a topic with that name. If you are revisiting this weblink, the topic may have been removed or renamed.</p></div></div></div>"
  );


  $templateCache.put('quiz/partial/quiz_viewer/quiz_viewer.html',
    "<div class=col-md-12 ng-controller=\"QuizViewerCtrl as qCtrl\"><div class=\"panel panel-primary\"><div class=panel-heading><h3>Quiz</h3></div><div class=panel-body><div class=question-box ng-hide=qCtrl.error ng-repeat=\"question in qCtrl.questions\"><div class=\"panel panel-default\" style=\"position:relative; margin:auto 10px auto 10px\"><div class=panel-heading><div><strong><a ng-href=/topic/{{question.subtopic.topic}}>{{question.subtopic.topic}}</a> -> <a ng-href=/subtopic/{{question.subtopic.topic}}/{{question.subtopic.name}}>{{question.subtopic.name}}</a></strong></div><div class=question-id-tag><strong>ID: <a ng-href=/question_no/{{question.id}}>{{question.id}}</a></strong></div></div><div class=panel-body><div class=question-text><p>{{question.question}}</p></div><div ng-init=\"isCollapsed = true\"><button type=button class=\"btn btn-primary btn-xs\" ng-click=\"isCollapsed = !isCollapsed\">Show Answer</button><hr><div collapse=isCollapsed><div class=\"well well-sm\"><div class=answer-text><p>{{question.answer}}</p></div></div></div></div></div></div></div></div></div><div class=\"panel panel-danger\" ng-show=qCtrl.error><div class=panel-heading><h3>An error occurred.</h3></div><div class=panel-body><p>It may be that no topics were selected. Go to <a href=/quiz/choose_content>Quiz</a> and try again.</p></div></div></div>"
  );


  $templateCache.put('quiz/partial/select_content/select_content.html',
    "<div class=col-md-12 ng-controller=\"SelectContentCtrl as sCtrl\"><div class=\"panel panel-primary\"><div class=panel-heading><h3>Select Quiz Content</h3></div><div class=panel-body><div class=\"panel panel-info\"><div class=panel-body><p>Choose a set of topics and a maximum number of questions in your quiz. Dentest will do it's best to create a quiz containing a random set of questions distributed among the chosen topics. If the topics you select dont contain enough questions between them to satisfy the maximum questions you desire, Dentest will return all questions from the selected topics.</p></div></div><div style=font-size:larger><div ng-repeat=\"topic in sCtrl.topic_list\"><label>{{topic.topic}}</label><input type=checkbox ng-model=topic.include ng-change=\"sCtrl.selectSubtopicsOfTopic(topic.topic)\"><br><ul><li ng-repeat=\"subtopic in topic.subtopics\"><label>{{ subtopic.name }}</label><input type=checkbox ng-model=subtopic.include></li><br></ul></div></div><div><label>Max Questions</label><input type=number ng-value=sCtrl.maxQuestions min=10 max=100></div><br><btn class=\"btn btn-primary\" ng-click=sCtrl.generateNewQuiz()>Confirm</btn></div></div></div>"
  );


  $templateCache.put('subscriptions/directive/braintree_payment_form/braintree_payment_form.html',
    "<form><div id=payment-form></div><input class=\"btn btn-primary\" type=submit value=Submit></form>"
  );


  $templateCache.put('subscriptions/partial/cancel/cancel.html',
    "<span ng-controller=\"CancelCtrl as cancelCtrl\"><script type=text/ng-template id=cancel_modal.html><div class=\"modal-header\">\n" +
    "            <h3 class=\"modal-title\">Are you sure you want to cancel your subscription?</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <p>If you cancel you will not be charged at your next billing date and will still retain your\n" +
    "            premium access until this year's subscription would expire.</p>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-danger\" type=\"button\" ng-click=\"modalCtrl.cancel()\">Yes</button>\n" +
    "            <button class=\"btn btn-default\" type=\"button\" ng-click=\"modalCtrl.close()\">Cancel</button>\n" +
    "        </div></script><button type=button class=\"btn btn-danger\" ng-click=cancelCtrl.open()>Cancel Subscription</button></span>"
  );


  $templateCache.put('subscriptions/partial/change_payment_method/change_payment_method.html',
    "<div class=col-md-12 ng-controller=\"ChangePaymentMethodCtrl as changePaymentCtrl\"><braintree-payment-form new-subscription=false></braintree-payment-form></div>"
  );


  $templateCache.put('subscriptions/partial/change_payment_method_success/change_payment_method_success.html',
    "<div class=col-md-12><div class=\"panel panel-success\"><div class=panel-heading><h3>Payment Method Changed</h3></div><div class=panel-body>Your payment method has been changed successfully! At the next billing date, this payment method will be charged.</div></div></div>"
  );


  $templateCache.put('subscriptions/partial/subscribe/subscribe.html',
    "<div class=col-md-12 ng-controller=\"SubscribeCtrl as subscribeCtrl\"><h4>Subscribe to Dentest</h4><p>You will be charged {{subscribeCtrl.plan_info.price | currency:'£'}} every {{subscribeCtrl.plan_info.billing_frequency}} months until you cancel. You can cancel your subscription at any time via Dentest.</p><braintree-payment-form new-subscription=true></braintree-payment-form></div>"
  );


  $templateCache.put('subscriptions/partial/subscription_status/subscription_status.html',
    "<div class=col-md-12 class=ng-cloak ng-controller=\"SubscriptionStatusCtrl as subStatusCtrl\"><div ng-hide=\"subStatusCtrl.user_subscribed == null\"><div ng-hide=subStatusCtrl.user_subscribed><div class=\"panel panel-danger\"><div class=panel-heading><h3 class=panel-title>No Subscription</h3></div><div class=panel-body><p>You are not currently subscribed as a premium user. You can set up a subscription <a href=/subscribe>here</a>.</p></div></div></div><div ng-show=\"subStatusCtrl.user_subscribed && subStatusCtrl.subscription_data.status == 'Active'\"><div class=\"panel panel-primary\"><div class=panel-heading><h3 class=panel-title>{{subStatusCtrl.subscription_data.status}}</h3></div><div class=panel-body><table class=table><tr><th>Price</th><td>{{subStatusCtrl.subscription_data.price | currency : \"£\" : 2}}</td></tr><tr><th>Subscribed</th><td>{{subStatusCtrl.subscription_data.date_of_creation | date : \"longDate\" }}</td></tr><tr><th>Renewal Date</th><td>{{subStatusCtrl.subscription_data.renewal_or_cancel_date | date : \"longDate\"}}</td></tr><tr><th>First Billing Date</th><td>{{subStatusCtrl.subscription_data.first_billing_date | date : \"longDate\"}}</td></tr></table><p>Your subscription is active and will be renewed at the shown renewal date above. You can change the payment method used for your subscription or cancel your subscription using the buttons below.</p><div><a class=\"btn btn-primary\" href=\"\">Change Payment Method</a> <a class=\"btn btn-danger\" href=\"\">Cancel My Subscription</a></div></div></div></div><div ng-show=\"subStatusCtrl.user_subscribed && subStatusCtrl.subscription_data.status == 'Pending'\"><div class=\"panel panel-info\"><div class=panel-heading><h3 class=panel-title>{{subStatusCtrl.subscription_data.status}}</h3></div><div class=panel-body><table class=table><tr><th>Price</th><td>{{subStatusCtrl.subscription_data.price | currency : \"£\" : 2}}</td></tr><tr><th>Subscribed</th><td>{{subStatusCtrl.subscription_data.date_of_creation | date : \"longDate\" }}</td></tr></table><p>Your subscription is being processed and will be manageable as soon as your payment goes through.</p></div></div></div><div ng-show=\"subStatusCtrl.user_subscribed && subStatusCtrl.subscription_data.status == 'Problem collecting payment'\"><div class=\"panel panel-warning\"><div class=panel-heading><h3 class=panel-title>{{subStatusCtrl.subscription_data.status}}</h3></div><div class=panel-body><table class=table><tr><th>Price</th><td>{{subStatusCtrl.subscription_data.price | currency : \"£\" : 2}}</td></tr><tr><th>Subscribed</th><td>{{subStatusCtrl.subscription_data.date_of_creation | date : \"longDate\" }}</td></tr><tr><th>Renewal Date</th><td>{{subStatusCtrl.subscription_data.renewal_or_cancel_date | date : \"longDate\"}}</td></tr><tr><th>First Billing Date</th><td>{{subStatusCtrl.subscription_data.first_billing_date | date : \"longDate\"}}</td></tr></table><p>We are having difficulty collecting payment from the method you provided. As such your subscription has been suspended until payment is received. You can change your payment method or cancel you subscription below:</p><div><a class=\"btn btn-primary\" href=\"\">Change Payment Method</a> <a class=\"btn btn-danger\" href=\"\">Cancel My Subscription</a></div></div></div></div><div ng-show=\"subStatusCtrl.user_subscribed && subStatusCtrl.subscription_data.status == 'Pending Cancellation'\"><div class=\"panel panel-warning\"><div class=panel-heading><h3 class=panel-title>{{subStatusCtrl.subscription_data.status}}</h3></div><div class=panel-body><table class=table><tr><th>Price</th><td>{{subStatusCtrl.subscription_data.price | currency : \"£\" : 2}}</td></tr><tr><th>Subscribed</th><td>{{subStatusCtrl.subscription_data.date_of_creation | date : \"longDate\" }}</td></tr><tr><th>Subscription End Date</th><td>{{subStatusCtrl.subscription_data.renewal_or_cancel_date | date : \"longDate\"}}</td></tr><tr><th>First Billing Date</th><td>{{subStatusCtrl.subscription_data.first_billing_date | date : \"longDate\"}}</td></tr></table><p>You have cancelled your subscription, but will still have premium access until your subscription end date. You can undo this before your subscription ends by clicking renew below. You can also change your payment method before doing so. If you renew your subscription you wont be charged again until the end of your current subscription.</p><div><a class=\"btn btn-primary\" href=\"\">Change Payment Method</a> <a class=\"btn btn-success\" href=\"\">Renew My Subscription</a></div></div></div></div><div ng-show=\"subStatusCtrl.user_subscribed && subStatusCtrl.subscription_data.status == 'Cancelled'\"><div class=\"panel panel-warning\"><div class=panel-heading><h3 class=panel-title>{{subStatusCtrl.subscription_data.status}}</h3></div><div class=panel-body><table class=table><tr><th>Price</th><td>{{subStatusCtrl.subscription_data.price | currency : \"£\" : 2}}</td></tr><tr><th>Subscribed</th><td>{{subStatusCtrl.subscription_data.date_of_creation | date : \"longDate\" }}</td></tr><tr><th>Subscription End Date</th><td>{{subStatusCtrl.subscription_data.renewal_or_cancel_date | date : \"longDate\"}}</td></tr><tr><th>First Billing Date</th><td>{{subStatusCtrl.subscription_data.first_billing_date | date : \"longDate\"}}</td></tr></table><p>Your subscription has been cancelled. You can restart your subscription below:</p><div><a class=\"btn btn-success\" href=\"\">Renew My Subscription</a></div></div></div></div></div></div>"
  );


  $templateCache.put('subscriptions/partial/subscription_sucess/subscription_sucess.html',
    "<div class=col-md-12><div class=\"panel panel-success\"><div class=panel-heading><h3>Thank you for subscribing!</h3></div><div class=panel-body><p>As soon as your payment is taken you will be given access to all of Dentest's questions and features. This process normally takes a few moments. You can check the status of your subscription at any time in 'Manage My Subscription'.</p></div></div></div>"
  );


  $templateCache.put('subscriptions/test.html',
    "<!DOCTYPE html><html lang=en><head><meta http-equiv=content-type content=\"text/html; charset=utf-8\"><meta name=robots content=NONE,NOARCHIVE><title>AssertionError at /subscribe/</title><style>html * { padding:0; margin:0; }\n" +
    "    body * { padding:10px 20px; }\n" +
    "    body * * { padding:0; }\n" +
    "    body { font:small sans-serif; }\n" +
    "    body>div { border-bottom:1px solid #ddd; }\n" +
    "    h1 { font-weight:normal; }\n" +
    "    h2 { margin-bottom:.8em; }\n" +
    "    h2 span { font-size:80%; color:#666; font-weight:normal; }\n" +
    "    h3 { margin:1em 0 .5em 0; }\n" +
    "    h4 { margin:0 0 .5em 0; font-weight: normal; }\n" +
    "    code, pre { font-size: 100%; white-space: pre-wrap; }\n" +
    "    table { border:1px solid #ccc; border-collapse: collapse; width:100%; background:white; }\n" +
    "    tbody td, tbody th { vertical-align:top; padding:2px 3px; }\n" +
    "    thead th { padding:1px 6px 1px 3px; background:#fefefe; text-align:left; font-weight:normal; font-size:11px; border:1px solid #ddd; }\n" +
    "    tbody th { width:12em; text-align:right; color:#666; padding-right:.5em; }\n" +
    "    table.vars { margin:5px 0 2px 40px; }\n" +
    "    table.vars td, table.req td { font-family:monospace; }\n" +
    "    table td.code { width:100%; }\n" +
    "    table td.code pre { overflow:hidden; }\n" +
    "    table.source th { color:#666; }\n" +
    "    table.source td { font-family:monospace; white-space:pre; border-bottom:1px solid #eee; }\n" +
    "    ul.traceback { list-style-type:none; color: #222; }\n" +
    "    ul.traceback li.frame { padding-bottom:1em; color:#666; }\n" +
    "    ul.traceback li.user { background-color:#e0e0e0; color:#000 }\n" +
    "    div.context { padding:10px 0; overflow:hidden; }\n" +
    "    div.context ol { padding-left:30px; margin:0 10px; list-style-position: inside; }\n" +
    "    div.context ol li { font-family:monospace; white-space:pre; color:#777; cursor:pointer; }\n" +
    "    div.context ol li pre { display:inline; }\n" +
    "    div.context ol.context-line li { color:#505050; background-color:#dfdfdf; }\n" +
    "    div.context ol.context-line li span { position:absolute; right:32px; }\n" +
    "    .user div.context ol.context-line li { background-color:#bbb; color:#000; }\n" +
    "    .user div.context ol li { color:#666; }\n" +
    "    div.commands { margin-left: 40px; }\n" +
    "    div.commands a { color:#555; text-decoration:none; }\n" +
    "    .user div.commands a { color: black; }\n" +
    "    #summary { background: #ffc; }\n" +
    "    #summary h2 { font-weight: normal; color: #666; }\n" +
    "    #explanation { background:#eee; }\n" +
    "    #template, #template-not-exist { background:#f6f6f6; }\n" +
    "    #template-not-exist ul { margin: 0 0 0 20px; }\n" +
    "    #unicode-hint { background:#eee; }\n" +
    "    #traceback { background:#eee; }\n" +
    "    #requestinfo { background:#f6f6f6; padding-left:120px; }\n" +
    "    #summary table { border:none; background:transparent; }\n" +
    "    #requestinfo h2, #requestinfo h3 { position:relative; margin-left:-100px; }\n" +
    "    #requestinfo h3 { margin-bottom:-1em; }\n" +
    "    .error { background: #ffc; }\n" +
    "    .specific { color:#cc3300; font-weight:bold; }\n" +
    "    h2 span.commands { font-size:.7em;}\n" +
    "    span.commands a:link {color:#5E5694;}\n" +
    "    pre.exception_value { font-family: sans-serif; color: #666; font-size: 1.5em; margin: 10px 0 10px 0; }</style><script>//<!--\n" +
    "    function getElementsByClassName(oElm, strTagName, strClassName){\n" +
    "        // Written by Jonathan Snook, http://www.snook.ca/jon; Add-ons by Robert Nyman, http://www.robertnyman.com\n" +
    "        var arrElements = (strTagName == \"*\" && document.all)? document.all :\n" +
    "        oElm.getElementsByTagName(strTagName);\n" +
    "        var arrReturnElements = new Array();\n" +
    "        strClassName = strClassName.replace(/\\-/g, \"\\-\");\n" +
    "        var oRegExp = new RegExp(\"(^|\\s)\" + strClassName + \"(\\s|$)\");\n" +
    "        var oElement;\n" +
    "        for(var i=0; i<arrElements.length; i++){\n" +
    "            oElement = arrElements[i];\n" +
    "            if(oRegExp.test(oElement.className)){\n" +
    "                arrReturnElements.push(oElement);\n" +
    "            }\n" +
    "        }\n" +
    "        return (arrReturnElements)\n" +
    "    }\n" +
    "    function hideAll(elems) {\n" +
    "      for (var e = 0; e < elems.length; e++) {\n" +
    "        elems[e].style.display = 'none';\n" +
    "      }\n" +
    "    }\n" +
    "    window.onload = function() {\n" +
    "      hideAll(getElementsByClassName(document, 'table', 'vars'));\n" +
    "      hideAll(getElementsByClassName(document, 'ol', 'pre-context'));\n" +
    "      hideAll(getElementsByClassName(document, 'ol', 'post-context'));\n" +
    "      hideAll(getElementsByClassName(document, 'div', 'pastebin'));\n" +
    "    }\n" +
    "    function toggle() {\n" +
    "      for (var i = 0; i < arguments.length; i++) {\n" +
    "        var e = document.getElementById(arguments[i]);\n" +
    "        if (e) {\n" +
    "          e.style.display = e.style.display == 'none' ? 'block': 'none';\n" +
    "        }\n" +
    "      }\n" +
    "      return false;\n" +
    "    }\n" +
    "    function varToggle(link, id) {\n" +
    "      toggle('v' + id);\n" +
    "      var s = link.getElementsByTagName('span')[0];\n" +
    "      var uarr = String.fromCharCode(0x25b6);\n" +
    "      var darr = String.fromCharCode(0x25bc);\n" +
    "      s.innerHTML = s.innerHTML == uarr ? darr : uarr;\n" +
    "      return false;\n" +
    "    }\n" +
    "    function switchPastebinFriendly(link) {\n" +
    "      s1 = \"Switch to copy-and-paste view\";\n" +
    "      s2 = \"Switch back to interactive view\";\n" +
    "      link.innerHTML = link.innerHTML == s1 ? s2: s1;\n" +
    "      toggle('browserTraceback', 'pastebinTraceback');\n" +
    "      return false;\n" +
    "    }\n" +
    "    //--></script></head><body><div id=summary><h1>AssertionError at /subscribe/</h1><pre class=exception_value>Expected a `Response`, `HttpResponse` or `HttpStreamingResponse` to be returned from the view, but received a `&lt;type &#39;NoneType&#39;&gt;`</pre><table class=meta><tr><th>Request Method:</th><td>POST</td></tr><tr><th>Request URL:</th><td>http://127.0.0.1:8000/subscribe/</td></tr><tr><th>Django Version:</th><td>1.7.8</td></tr><tr><th>Exception Type:</th><td>AssertionError</td></tr><tr><th>Exception Value:</th><td><pre>Expected a `Response`, `HttpResponse` or `HttpStreamingResponse` to be returned from the view, but received a `&lt;type &#39;NoneType&#39;&gt;`</pre></td></tr><tr><th>Exception Location:</th><td>/usr/local/lib/python2.7/dist-packages/rest_framework/views.py in finalize_response, line 396</td></tr><tr><th>Python Executable:</th><td>/usr/bin/python</td></tr><tr><th>Python Version:</th><td>2.7.6</td></tr><tr><th>Python Path:</th><td><pre>[&#39;/home/michael/DentestRevised/server&#39;,\n" +
    " &#39;/usr/lib/python2.7&#39;,\n" +
    " &#39;/usr/lib/python2.7/plat-x86_64-linux-gnu&#39;,\n" +
    " &#39;/usr/lib/python2.7/lib-tk&#39;,\n" +
    " &#39;/usr/lib/python2.7/lib-old&#39;,\n" +
    " &#39;/usr/lib/python2.7/lib-dynload&#39;,\n" +
    " &#39;/usr/local/lib/python2.7/dist-packages&#39;,\n" +
    " &#39;/usr/lib/python2.7/dist-packages&#39;,\n" +
    " &#39;/usr/lib/python2.7/dist-packages/PILcompat&#39;,\n" +
    " &#39;/usr/lib/python2.7/dist-packages/gtk-2.0&#39;,\n" +
    " &#39;/usr/lib/python2.7/dist-packages/ubuntu-sso-client&#39;]</pre></td></tr><tr><th>Server time:</th><td>Sun, 19 Jun 2016 16:48:34 +0000</td></tr></table></div><div id=traceback><h2>Traceback <span class=commands><a href=# onclick=\"return switchPastebinFriendly(this)\">Switch to copy-and-paste view</a></span></h2><div id=browserTraceback><ul class=traceback><li class=\"frame django\"><code>/usr/local/lib/python2.7/dist-packages/django/core/handlers/base.py</code> in <code>get_response</code><div class=context id=c139731457308288><ol start=104 class=pre-context id=pre139731457308288><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                    response = middleware_method(request, callback, callback_args, callback_kwargs)</pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                    if response:</pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                        break</pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre></pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>            if response is None:</pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                wrapped_callback = self.make_view_atomic(callback)</pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                try:</pre></li></ol><ol start=111 class=context-line><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                    response = wrapped_callback(request, *callback_args, **callback_kwargs)</pre><span>...</span></li></ol><ol start=112 class=post-context id=post139731457308288><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                except Exception as e:</pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                    # If the view raised an exception, run it through exception</pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                    # middleware, and if the exception middleware returns a</pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                    # response, use that. Otherwise, reraise the exception.</pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                    for middleware_method in self._exception_middleware:</pre></li><li onclick=\"toggle('pre139731457308288', 'post139731457308288')\"><pre>                        response = middleware_method(request, e)</pre></li></ol></div><div class=commands><a href=# onclick=\"return varToggle(this, '139731457308288')\"><span>&#x25b6;</span> Local vars</a></div><table class=vars id=v139731457308288><thead><tr><th>Variable</th><th>Value</th></tr></thead><tbody><tr><td>e</td><td class=code><pre>AssertionError(u&quot;Expected a `Response`, `HttpResponse` or `HttpStreamingResponse` to be returned from the view, but received a `&lt;type &#39;NoneType&#39;&gt;`&quot;,)</pre></td></tr><tr><td>callback_args</td><td class=code><pre>()</pre></td></tr><tr><td>resolver_match</td><td class=code><pre>ResolverMatch(func=&lt;function SubscriptionCreationView at 0x7f15c84a2230&gt;, args=(), kwargs={}, url_name=&#39;subscriptions.views.SubscriptionCreationView&#39;, app_name=&#39;None&#39;, namespace=&#39;&#39;)</pre></td></tr><tr><td>middleware_method</td><td class=code><pre>&lt;bound method CsrfViewMiddleware.process_view of &lt;django.middleware.csrf.CsrfViewMiddleware object at 0x7f15c868ddd0&gt;&gt;</pre></td></tr><tr><td>self</td><td class=code><pre>&lt;django.core.handlers.wsgi.WSGIHandler object at 0x7f15c9ef0fd0&gt;</pre></td></tr><tr><td>request</td><td class=code><pre>&quot;&lt;WSGIRequest\\npath:/subscribe/,\\nGET:&lt;QueryDict: {}&gt;,\\nPOST:&lt;could not parse&gt;,\\nCOOKIES:{},\\nMETA:{&#39;COLORTERM&#39;: &#39;gnome-terminal&#39;,\\n &#39;CONTENT_LENGTH&#39;: &#39;63&#39;,\\n &#39;CONTENT_TYPE&#39;: &#39;application/json;charset=utf-8&#39;,\\n u&#39;CSRF_COOKIE&#39;: u&#39;mn5jQOWvDxlfZ9hcnoPnVhN2JYhfLpBI&#39;,\\n &#39;DBUS_SESSION_BUS_ADDRESS&#39;: &#39;unix:abstract=/tmp/dbus-1GA75EK8Fx,guid=444256c32486a0fb36564cd0574c2480&#39;,\\n &#39;DEFAULTS_PATH&#39;: &#39;/usr/share/gconf/default.default.path&#39;,\\n &#39;DESKTOP_SESSION&#39;: &#39;default&#39;,\\n &#39;DISPLAY&#39;: &#39;:0&#39;,\\n &#39;DJANGO_SETTINGS_MODULE&#39;: &#39;dentest.settings&#39;,\\n &#39;GATEWAY_INTERFACE&#39;: &#39;CGI/1.1&#39;,\\n &#39;GDMSESSION&#39;: &#39;default&#39;,\\n &#39;GDM_XSERVER_LOCATION&#39;: &#39;local&#39;,\\n &#39;GNOME_DESKTOP_SESSION_ID&#39;: &#39;this-is-deprecated&#39;,\\n &#39;GNOME_KEYRING_CONTROL&#39;: &#39;/run/user/1000/keyring-s7X8Ke&#39;,\\n &#39;GNOME_KEYRING_PID&#39;: &#39;1602&#39;,\\n &#39;GPG_AGENT_INFO&#39;: &#39;/run/user/1000/keyring-s7X8Ke/gpg:0:1&#39;,\\n &#39;HOME&#39;: &#39;/home/michael&#39;,\\n &#39;HTTP_ACCEPT&#39;: &#39;application/json, text/plain, */*&#39;,\\n &#39;HTTP_ACCEPT_ENCODING&#39;: &#39;gzip, deflate&#39;,\\n &#39;HTTP_ACCEPT_LANGUAGE&#39;: &#39;en-US,en;q=0.5&#39;,\\n &#39;HTTP_AUTHORIZATION&#39;: &#39;Token e89e037192e74fae91a90dbf5ef330dd0b4141dc&#39;,\\n &#39;HTTP_CACHE_CONTROL&#39;: &#39;no-cache&#39;,\\n &#39;HTTP_CONNECTION&#39;: &#39;keep-alive&#39;,\\n &#39;HTTP_HOST&#39;: &#39;127.0.0.1:8000&#39;,\\n &#39;HTTP_ORIGIN&#39;: &#39;http://localhost:9001&#39;,\\n &#39;HTTP_PRAGMA&#39;: &#39;no-cache&#39;,\\n &#39;HTTP_REFERER&#39;: &#39;http://localhost:9001/subscribe&#39;,\\n &#39;HTTP_USER_AGENT&#39;: &#39;Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0&#39;,\\n &#39;INSIDE_NEMO_PYTHON&#39;: &#39;&#39;,\\n &#39;LANG&#39;: &#39;en_GB.UTF-8&#39;,\\n &#39;LD_LIBRARY_PATH&#39;: &#39;.:&#39;,\\n &#39;LOGNAME&#39;: &#39;michael&#39;,\\n &#39;LS_COLORS&#39;: &#39;rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:&#39;,\\n &#39;MANDATORY_PATH&#39;: &#39;/usr/share/gconf/default.mandatory.path&#39;,\\n &#39;MANPATH&#39;: &#39;/home/michael/.npm-packages/share/man:/usr/local/man:/usr/local/share/man:/usr/share/man&#39;,\\n &#39;MDMSESSION&#39;: &#39;default&#39;,\\n &#39;MDM_LANG&#39;: &#39;en_GB.UTF-8&#39;,\\n &#39;MDM_XSERVER_LOCATION&#39;: &#39;local&#39;,\\n &#39;NODE_PATH&#39;: &#39;/home/michael/.npm-packages/lib/node_modules:/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript&#39;,\\n &#39;NPM_PACKAGES&#39;: &#39;/home/michael/.npm-packages&#39;,\\n &#39;OLDPWD&#39;: &#39;/home/michael/DentestRevised/frontend&#39;,\\n &#39;PATH&#39;: &#39;/home/michael/.npm-packages/bin:/home/michael/.npm-packages/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games&#39;,\\n &#39;PATH_INFO&#39;: u&#39;/subscribe/&#39;,\\n &#39;PWD&#39;: &#39;/home/michael/DentestRevised/server&#39;,\\n &#39;QUERY_STRING&#39;: &#39;&#39;,\\n &#39;REMOTE_ADDR&#39;: &#39;127.0.0.1&#39;,\\n &#39;REMOTE_HOST&#39;: &#39;&#39;,\\n &#39;REQUEST_METHOD&#39;: &#39;POST&#39;,\\n &#39;RUN_MAIN&#39;: &#39;true&#39;,\\n &#39;SCRIPT_NAME&#39;: u&#39;&#39;,\\n &#39;SERVER_NAME&#39;: &#39;localhost&#39;,\\n &#39;SERVER_PORT&#39;: &#39;8000&#39;,\\n &#39;SERVER_PROTOCOL&#39;: &#39;HTTP/1.1&#39;,\\n &#39;SERVER_SOFTWARE&#39;: &#39;WSGIServer/0.1 Python/2.7.6&#39;,\\n &#39;SESSION_MANAGER&#39;: &#39;local/michael-VirtualBox:@/tmp/.ICE-unix/1613,unix/michael-VirtualBox:/tmp/.ICE-unix/1613&#39;,\\n &#39;SHELL&#39;: &#39;/bin/bash&#39;,\\n &#39;SHLVL&#39;: &#39;2&#39;,\\n &#39;SSH_AGENT_PID&#39;: &#39;1781&#39;,\\n &#39;SSH_AUTH_SOCK&#39;: &#39;/run/user/1000/keyring-s7X8Ke/ssh&#39;,\\n &#39;TERM&#39;: &#39;xterm-256color&#39;,\\n &#39;TEXTDOMAIN&#39;: &#39;im-config&#39;,\\n &#39;TEXTDOMAINDIR&#39;: &#39;/usr/share/locale/&#39;,\\n &#39;TZ&#39;: &#39;UTC&#39;,\\n &#39;USER&#39;: &#39;michael&#39;,\\n &#39;USERNAME&#39;: &#39;michael&#39;,\\n &#39;VTE_VERSION&#39;: &#39;3409&#39;,\\n &#39;WINDOWID&#39;: &#39;54525960&#39;,\\n &#39;WINDOWPATH&#39;: &#39;8&#39;,\\n &#39;XAUTHORITY&#39;: &#39;/home/michael/.Xauthority&#39;,\\n &#39;XDG_CONFIG_DIRS&#39;: &#39;/etc/xdg/xdg-default:/etc/xdg&#39;,\\n &#39;XDG_CURRENT_DESKTOP&#39;: &#39;X-Cinnamon&#39;,\\n &#39;XDG_DATA_DIRS&#39;: &#39;/usr/share/default:/usr/share/gnome:/usr/local/share/:/usr/share/:/usr/share/mdm/&#39;,\\n &#39;XDG_RUNTIME_DIR&#39;: &#39;/run/user/1000&#39;,\\n &#39;XDG_SEAT&#39;: &#39;seat0&#39;,\\n &#39;XDG_SESSION_COOKIE&#39;: &#39;529b8b95667e7a234d5e038f55e47097-1464607871.966734-610995108&#39;,\\n &#39;XDG_SESSION_DESKTOP&#39;: &#39;default&#39;,\\n &#39;XDG_SESSION_ID&#39;: &#39;c1&#39;,\\n &#39;XDG_VTNR&#39;: &#39;8&#39;,\\n &#39;_&#39;: &#39;/usr/bin/python&#39;,\\n &#39;wsgi.errors&#39;: &lt;open file &#39;&lt;stderr&gt;&#39;, mode &#39;w&#39; at 0x7f15cd0b71e0&gt;,\\n &#39;wsgi.file_wrapper&#39;: &lt;class wsgiref.util.FileWrapper at 0x7f15c9830940&gt;,\\n &#39;wsgi.input&#39;: &lt;socket._fileobject object at 0x7f15c84bb7d0&gt;,\\n &#39;wsgi.multiprocess&#39;: False,\\n &#39;wsgi.multithread&#39;: True,\\n &#39;wsgi.run_once&#39;: False,\\n &#39;wsgi.url_scheme&#39;: &#39;http&#39;,\\n &#39;wsgi.version&#39;: (1, 0)}&gt;&quot;</pre></td></tr><tr><td>callback</td><td class=code><pre>&lt;function SubscriptionCreationView at 0x7f15c84a2230&gt;</pre></td></tr><tr><td>wrapped_callback</td><td class=code><pre>&lt;function SubscriptionCreationView at 0x7f15c84a2230&gt;</pre></td></tr><tr><td>resolver</td><td class=code><pre>&lt;RegexURLResolver &#39;dentest.urls&#39; (None:None) ^/&gt;</pre></td></tr><tr><td>callback_kwargs</td><td class=code><pre>{}</pre></td></tr><tr><td>response</td><td class=code><pre>None</pre></td></tr><tr><td>urlconf</td><td class=code><pre>&#39;dentest.urls&#39;</pre></td></tr></tbody></table></li><li class=\"frame django\"><code>/usr/local/lib/python2.7/dist-packages/django/views/decorators/csrf.py</code> in <code>wrapped_view</code><div class=context id=c139731457309656><ol start=50 class=pre-context id=pre139731457309656><li onclick=\"toggle('pre139731457309656', 'post139731457309656')\"><pre>    &quot;&quot;&quot;</pre></li><li onclick=\"toggle('pre139731457309656', 'post139731457309656')\"><pre>    Marks a view function as being exempt from the CSRF view protection.</pre></li><li onclick=\"toggle('pre139731457309656', 'post139731457309656')\"><pre>    &quot;&quot;&quot;</pre></li><li onclick=\"toggle('pre139731457309656', 'post139731457309656')\"><pre>    # We could just do view_func.csrf_exempt = True, but decorators</pre></li><li onclick=\"toggle('pre139731457309656', 'post139731457309656')\"><pre>    # are nicer if they don&#39;t have side-effects, so we return a new</pre></li><li onclick=\"toggle('pre139731457309656', 'post139731457309656')\"><pre>    # function.</pre></li><li onclick=\"toggle('pre139731457309656', 'post139731457309656')\"><pre>    def wrapped_view(*args, **kwargs):</pre></li></ol><ol start=57 class=context-line><li onclick=\"toggle('pre139731457309656', 'post139731457309656')\"><pre>        return view_func(*args, **kwargs)</pre><span>...</span></li></ol><ol start=58 class=post-context id=post139731457309656><li onclick=\"toggle('pre139731457309656', 'post139731457309656')\"><pre>    wrapped_view.csrf_exempt = True</pre></li><li onclick=\"toggle('pre139731457309656', 'post139731457309656')\"><pre>    return wraps(view_func, assigned=available_attrs(view_func))(wrapped_view)</pre></li></ol></div><div class=commands><a href=# onclick=\"return varToggle(this, '139731457309656')\"><span>&#x25b6;</span> Local vars</a></div><table class=vars id=v139731457309656><thead><tr><th>Variable</th><th>Value</th></tr></thead><tbody><tr><td>args</td><td class=code><pre>(&lt;WSGIRequest\n" +
    "path:/subscribe/,\n" +
    "GET:&lt;QueryDict: {}&gt;,\n" +
    "POST:&lt;could not parse&gt;,\n" +
    "COOKIES:{},\n" +
    "META:{&#39;COLORTERM&#39;: &#39;gnome-terminal&#39;,\n" +
    " &#39;CONTENT_LENGTH&#39;: &#39;63&#39;,\n" +
    " &#39;CONTENT_TYPE&#39;: &#39;application/json;charset=utf-8&#39;,\n" +
    " u&#39;CSRF_COOKIE&#39;: u&#39;mn5jQOWvDxlfZ9hcnoPnVhN2JYhfLpBI&#39;,\n" +
    " &#39;DBUS_SESSION_BUS_ADDRESS&#39;: &#39;unix:abstract=/tmp/dbus-1GA75EK8Fx,guid=444256c32486a0fb36564cd0574c2480&#39;,\n" +
    " &#39;DEFAULTS_PATH&#39;: &#39;/usr/share/gconf/default.default.path&#39;,\n" +
    " &#39;DESKTOP_SESSION&#39;: &#39;default&#39;,\n" +
    " &#39;DISPLAY&#39;: &#39;:0&#39;,\n" +
    " &#39;DJANGO_SETTINGS_MODULE&#39;: &#39;dentest.settings&#39;,\n" +
    " &#39;GATEWAY_INTERFACE&#39;: &#39;CGI/1.1&#39;,\n" +
    " &#39;GDMSESSION&#39;: &#39;default&#39;,\n" +
    " &#39;GDM_XSERVER_LOCATION&#39;: &#39;local&#39;,\n" +
    " &#39;GNOME_DESKTOP_SESSION_ID&#39;: &#39;this-is-deprecated&#39;,\n" +
    " &#39;GNOME_KEYRING_CONTROL&#39;: &#39;/run/user/1000/keyring-s7X8Ke&#39;,\n" +
    " &#39;GNOME_KEYRING_PID&#39;: &#39;1602&#39;,\n" +
    " &#39;GPG_AGENT_INFO&#39;: &#39;/run/user/1000/keyring-s7X8Ke/gpg:0:1&#39;,\n" +
    " &#39;HOME&#39;: &#39;/home/michael&#39;,\n" +
    " &#39;HTTP_ACCEPT&#39;: &#39;application/json, text/plain, */*&#39;,\n" +
    " &#39;HTTP_ACCEPT_ENCODING&#39;: &#39;gzip, deflate&#39;,\n" +
    " &#39;HTTP_ACCEPT_LANGUAGE&#39;: &#39;en-US,en;q=0.5&#39;,\n" +
    " &#39;HTTP_AUTHORIZATION&#39;: &#39;Token e89e037192e74fae91a90dbf5ef330dd0b4141dc&#39;,\n" +
    " &#39;HTTP_CACHE_CONTROL&#39;: &#39;no-cache&#39;,\n" +
    " &#39;HTTP_CONNECTION&#39;: &#39;keep-alive&#39;,\n" +
    " &#39;HTTP_HOST&#39;: &#39;127.0.0.1:8000&#39;,\n" +
    " &#39;HTTP_ORIGIN&#39;: &#39;http://localhost:9001&#39;,\n" +
    " &#39;HTTP_PRAGMA&#39;: &#39;no-cache&#39;,\n" +
    " &#39;HTTP_REFERER&#39;: &#39;http://localhost:9001/subscribe&#39;,\n" +
    " &#39;HTTP_USER_AGENT&#39;: &#39;Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0&#39;,\n" +
    " &#39;INSIDE_NEMO_PYTHON&#39;: &#39;&#39;,\n" +
    " &#39;LANG&#39;: &#39;en_GB.UTF-8&#39;,\n" +
    " &#39;LD_LIBRARY_PATH&#39;: &#39;.:&#39;,\n" +
    " &#39;LOGNAME&#39;: &#39;michael&#39;,\n" +
    " &#39;LS_COLORS&#39;: &#39;rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:&#39;,\n" +
    " &#39;MANDATORY_PATH&#39;: &#39;/usr/share/gconf/default.mandatory.path&#39;,\n" +
    " &#39;MANPATH&#39;: &#39;/home/michael/.npm-packages/share/man:/usr/local/man:/usr/local/share/man:/usr/share/man&#39;,\n" +
    " &#39;MDMSESSION&#39;: &#39;default&#39;,\n" +
    " &#39;MDM_LANG&#39;: &#39;en_GB.UTF-8&#39;,\n" +
    " &#39;MDM_XSERVER_LOCATION&#39;: &#39;local&#39;,\n" +
    " &#39;NODE_PATH&#39;: &#39;/home/michael/.npm-packages/lib/node_modules:/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript&#39;,\n" +
    " &#39;NPM_PACKAGES&#39;: &#39;/home/michael/.npm-packages&#39;,\n" +
    " &#39;OLDPWD&#39;: &#39;/home/michael/DentestRevised/frontend&#39;,\n" +
    " &#39;PATH&#39;: &#39;/home/michael/.npm-packages/bin:/home/michael/.npm-packages/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games&#39;,\n" +
    " &#39;PATH_INFO&#39;: u&#39;/subscribe/&#39;,\n" +
    " &#39;PWD&#39;: &#39;/home/michael/DentestRevised/server&#39;,\n" +
    " &#39;QUERY_STRING&#39;: &#39;&#39;,\n" +
    " &#39;REMOTE_ADDR&#39;: &#39;127.0.0.1&#39;,\n" +
    " &#39;REMOTE_HOST&#39;: &#39;&#39;,\n" +
    " &#39;REQUEST_METHOD&#39;: &#39;POST&#39;,\n" +
    " &#39;RUN_MAIN&#39;: &#39;true&#39;,\n" +
    " &#39;SCRIPT_NAME&#39;: u&#39;&#39;,\n" +
    " &#39;SERVER_NAME&#39;: &#39;localhost&#39;,\n" +
    " &#39;SERVER_PORT&#39;: &#39;8000&#39;,\n" +
    " &#39;SERVER_PROTOCOL&#39;: &#39;HTTP/1.1&#39;,\n" +
    " &#39;SERVER_SOFTWARE&#39;: &#39;WSGIServer/0.1 Python/2.7.6&#39;,\n" +
    " &#39;SESSION_MANAGER&#39;: &#39;local/michael-VirtualBox:@/tmp/.ICE-unix/1613,unix/michael-VirtualBox:/tmp/.ICE-unix/1613&#39;,\n" +
    " &#39;SHELL&#39;: &#39;/bin/bash&#39;,\n" +
    " &#39;SHLVL&#39;: &#39;2&#39;,\n" +
    " &#39;SSH_AGENT_PID&#39;: &#39;1781&#39;,\n" +
    " &#39;SSH_AUTH_SOCK&#39;: &#39;/run/user/1000/keyring-s7X8Ke/ssh&#39;,\n" +
    " &#39;TERM&#39;: &#39;xterm-256color&#39;,\n" +
    " &#39;TEXTDOMAIN&#39;: &#39;im-config&#39;,\n" +
    " &#39;TEXTDOMAINDIR&#39;: &#39;/usr/share/locale/&#39;,\n" +
    " &#39;TZ&#39;: &#39;UTC&#39;,\n" +
    " &#39;USER&#39;: &#39;michael&#39;,\n" +
    " &#39;USERNAME&#39;: &#39;michael&#39;,\n" +
    " &#39;VTE_VERSION&#39;: &#39;3409&#39;,\n" +
    " &#39;WINDOWID&#39;: &#39;54525960&#39;,\n" +
    " &#39;WINDOWPATH&#39;: &#39;8&#39;,\n" +
    " &#39;XAUTHORITY&#39;: &#39;/home/michael/.Xauthority&#39;,\n" +
    " &#39;XDG_CONFIG_DIRS&#39;: &#39;/etc/xdg/xdg-default:/etc/xdg&#39;,\n" +
    " &#39;XDG_CURRENT_DESKTOP&#39;: &#39;X-Cinnamon&#39;,\n" +
    " &#39;XDG_DATA_DIRS&#39;: &#39;/usr/share/default:/usr/share/gnome:/usr/local/share/:/usr/share/:/usr/share/mdm/&#39;,\n" +
    " &#39;XDG_RUNTIME_DIR&#39;: &#39;/run/user/1000&#39;,\n" +
    " &#39;XDG_SEAT&#39;: &#39;seat0&#39;,\n" +
    " &#39;XDG_SESSION_COOKIE&#39;: &#39;529b8b95667e7a234d5e038f55e47097-1464607871.966734-610995108&#39;,\n" +
    " &#39;XDG_SESSION_DESKTOP&#39;: &#39;default&#39;,\n" +
    " &#39;XDG_SESSION_ID&#39;: &#39;c1&#39;,\n" +
    " &#39;XDG_VTNR&#39;: &#39;8&#39;,\n" +
    " &#39;_&#39;: &#39;/usr/bin/python&#39;,\n" +
    " &#39;wsgi.errors&#39;: &lt;open file &#39;&lt;stderr&gt;&#39;, mode &#39;w&#39; at 0x7f15cd0b71e0&gt;,\n" +
    " &#39;wsgi.file_wrapper&#39;: &lt;class wsgiref.util.FileWrapper at 0x7f15c9830940&gt;,\n" +
    " &#39;wsgi.input&#39;: &lt;socket._fileobject object at 0x7f15c84bb7d0&gt;,\n" +
    " &#39;wsgi.multiprocess&#39;: False,\n" +
    " &#39;wsgi.multithread&#39;: True,\n" +
    " &#39;wsgi.run_once&#39;: False,\n" +
    " &#39;wsgi.url_scheme&#39;: &#39;http&#39;,\n" +
    " &#39;wsgi.version&#39;: (1, 0)}&gt;,)</pre></td></tr><tr><td>view_func</td><td class=code><pre>&lt;function SubscriptionCreationView at 0x7f15c84a21b8&gt;</pre></td></tr><tr><td>kwargs</td><td class=code><pre>{}</pre></td></tr></tbody></table></li><li class=\"frame django\"><code>/usr/local/lib/python2.7/dist-packages/django/views/generic/base.py</code> in <code>view</code><div class=context id=c139731414658800><ol start=62 class=pre-context id=pre139731414658800><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>        def view(request, *args, **kwargs):</pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>            self = cls(**initkwargs)</pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>            if hasattr(self, &#39;get&#39;) and not hasattr(self, &#39;head&#39;):</pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>                self.head = self.get</pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>            self.request = request</pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>            self.args = args</pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>            self.kwargs = kwargs</pre></li></ol><ol start=69 class=context-line><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>            return self.dispatch(request, *args, **kwargs)</pre><span>...</span></li></ol><ol start=70 class=post-context id=post139731414658800><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre></pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>        # take name and docstring from class</pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>        update_wrapper(view, cls, updated=())</pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre></pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>        # and possible attributes set by decorators</pre></li><li onclick=\"toggle('pre139731414658800', 'post139731414658800')\"><pre>        # like csrf_exempt from dispatch</pre></li></ol></div><div class=commands><a href=# onclick=\"return varToggle(this, '139731414658800')\"><span>&#x25b6;</span> Local vars</a></div><table class=vars id=v139731414658800><thead><tr><th>Variable</th><th>Value</th></tr></thead><tbody><tr><td>initkwargs</td><td class=code><pre>{}</pre></td></tr><tr><td>self</td><td class=code><pre>&lt;subscriptions.views.SubscriptionCreationView object at 0x7f15c3eaec50&gt;</pre></td></tr><tr><td>args</td><td class=code><pre>()</pre></td></tr><tr><td>request</td><td class=code><pre>&quot;&lt;WSGIRequest\\npath:/subscribe/,\\nGET:&lt;QueryDict: {}&gt;,\\nPOST:&lt;could not parse&gt;,\\nCOOKIES:{},\\nMETA:{&#39;COLORTERM&#39;: &#39;gnome-terminal&#39;,\\n &#39;CONTENT_LENGTH&#39;: &#39;63&#39;,\\n &#39;CONTENT_TYPE&#39;: &#39;application/json;charset=utf-8&#39;,\\n u&#39;CSRF_COOKIE&#39;: u&#39;mn5jQOWvDxlfZ9hcnoPnVhN2JYhfLpBI&#39;,\\n &#39;DBUS_SESSION_BUS_ADDRESS&#39;: &#39;unix:abstract=/tmp/dbus-1GA75EK8Fx,guid=444256c32486a0fb36564cd0574c2480&#39;,\\n &#39;DEFAULTS_PATH&#39;: &#39;/usr/share/gconf/default.default.path&#39;,\\n &#39;DESKTOP_SESSION&#39;: &#39;default&#39;,\\n &#39;DISPLAY&#39;: &#39;:0&#39;,\\n &#39;DJANGO_SETTINGS_MODULE&#39;: &#39;dentest.settings&#39;,\\n &#39;GATEWAY_INTERFACE&#39;: &#39;CGI/1.1&#39;,\\n &#39;GDMSESSION&#39;: &#39;default&#39;,\\n &#39;GDM_XSERVER_LOCATION&#39;: &#39;local&#39;,\\n &#39;GNOME_DESKTOP_SESSION_ID&#39;: &#39;this-is-deprecated&#39;,\\n &#39;GNOME_KEYRING_CONTROL&#39;: &#39;/run/user/1000/keyring-s7X8Ke&#39;,\\n &#39;GNOME_KEYRING_PID&#39;: &#39;1602&#39;,\\n &#39;GPG_AGENT_INFO&#39;: &#39;/run/user/1000/keyring-s7X8Ke/gpg:0:1&#39;,\\n &#39;HOME&#39;: &#39;/home/michael&#39;,\\n &#39;HTTP_ACCEPT&#39;: &#39;application/json, text/plain, */*&#39;,\\n &#39;HTTP_ACCEPT_ENCODING&#39;: &#39;gzip, deflate&#39;,\\n &#39;HTTP_ACCEPT_LANGUAGE&#39;: &#39;en-US,en;q=0.5&#39;,\\n &#39;HTTP_AUTHORIZATION&#39;: &#39;Token e89e037192e74fae91a90dbf5ef330dd0b4141dc&#39;,\\n &#39;HTTP_CACHE_CONTROL&#39;: &#39;no-cache&#39;,\\n &#39;HTTP_CONNECTION&#39;: &#39;keep-alive&#39;,\\n &#39;HTTP_HOST&#39;: &#39;127.0.0.1:8000&#39;,\\n &#39;HTTP_ORIGIN&#39;: &#39;http://localhost:9001&#39;,\\n &#39;HTTP_PRAGMA&#39;: &#39;no-cache&#39;,\\n &#39;HTTP_REFERER&#39;: &#39;http://localhost:9001/subscribe&#39;,\\n &#39;HTTP_USER_AGENT&#39;: &#39;Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0&#39;,\\n &#39;INSIDE_NEMO_PYTHON&#39;: &#39;&#39;,\\n &#39;LANG&#39;: &#39;en_GB.UTF-8&#39;,\\n &#39;LD_LIBRARY_PATH&#39;: &#39;.:&#39;,\\n &#39;LOGNAME&#39;: &#39;michael&#39;,\\n &#39;LS_COLORS&#39;: &#39;rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:&#39;,\\n &#39;MANDATORY_PATH&#39;: &#39;/usr/share/gconf/default.mandatory.path&#39;,\\n &#39;MANPATH&#39;: &#39;/home/michael/.npm-packages/share/man:/usr/local/man:/usr/local/share/man:/usr/share/man&#39;,\\n &#39;MDMSESSION&#39;: &#39;default&#39;,\\n &#39;MDM_LANG&#39;: &#39;en_GB.UTF-8&#39;,\\n &#39;MDM_XSERVER_LOCATION&#39;: &#39;local&#39;,\\n &#39;NODE_PATH&#39;: &#39;/home/michael/.npm-packages/lib/node_modules:/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript&#39;,\\n &#39;NPM_PACKAGES&#39;: &#39;/home/michael/.npm-packages&#39;,\\n &#39;OLDPWD&#39;: &#39;/home/michael/DentestRevised/frontend&#39;,\\n &#39;PATH&#39;: &#39;/home/michael/.npm-packages/bin:/home/michael/.npm-packages/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games&#39;,\\n &#39;PATH_INFO&#39;: u&#39;/subscribe/&#39;,\\n &#39;PWD&#39;: &#39;/home/michael/DentestRevised/server&#39;,\\n &#39;QUERY_STRING&#39;: &#39;&#39;,\\n &#39;REMOTE_ADDR&#39;: &#39;127.0.0.1&#39;,\\n &#39;REMOTE_HOST&#39;: &#39;&#39;,\\n &#39;REQUEST_METHOD&#39;: &#39;POST&#39;,\\n &#39;RUN_MAIN&#39;: &#39;true&#39;,\\n &#39;SCRIPT_NAME&#39;: u&#39;&#39;,\\n &#39;SERVER_NAME&#39;: &#39;localhost&#39;,\\n &#39;SERVER_PORT&#39;: &#39;8000&#39;,\\n &#39;SERVER_PROTOCOL&#39;: &#39;HTTP/1.1&#39;,\\n &#39;SERVER_SOFTWARE&#39;: &#39;WSGIServer/0.1 Python/2.7.6&#39;,\\n &#39;SESSION_MANAGER&#39;: &#39;local/michael-VirtualBox:@/tmp/.ICE-unix/1613,unix/michael-VirtualBox:/tmp/.ICE-unix/1613&#39;,\\n &#39;SHELL&#39;: &#39;/bin/bash&#39;,\\n &#39;SHLVL&#39;: &#39;2&#39;,\\n &#39;SSH_AGENT_PID&#39;: &#39;1781&#39;,\\n &#39;SSH_AUTH_SOCK&#39;: &#39;/run/user/1000/keyring-s7X8Ke/ssh&#39;,\\n &#39;TERM&#39;: &#39;xterm-256color&#39;,\\n &#39;TEXTDOMAIN&#39;: &#39;im-config&#39;,\\n &#39;TEXTDOMAINDIR&#39;: &#39;/usr/share/locale/&#39;,\\n &#39;TZ&#39;: &#39;UTC&#39;,\\n &#39;USER&#39;: &#39;michael&#39;,\\n &#39;USERNAME&#39;: &#39;michael&#39;,\\n &#39;VTE_VERSION&#39;: &#39;3409&#39;,\\n &#39;WINDOWID&#39;: &#39;54525960&#39;,\\n &#39;WINDOWPATH&#39;: &#39;8&#39;,\\n &#39;XAUTHORITY&#39;: &#39;/home/michael/.Xauthority&#39;,\\n &#39;XDG_CONFIG_DIRS&#39;: &#39;/etc/xdg/xdg-default:/etc/xdg&#39;,\\n &#39;XDG_CURRENT_DESKTOP&#39;: &#39;X-Cinnamon&#39;,\\n &#39;XDG_DATA_DIRS&#39;: &#39;/usr/share/default:/usr/share/gnome:/usr/local/share/:/usr/share/:/usr/share/mdm/&#39;,\\n &#39;XDG_RUNTIME_DIR&#39;: &#39;/run/user/1000&#39;,\\n &#39;XDG_SEAT&#39;: &#39;seat0&#39;,\\n &#39;XDG_SESSION_COOKIE&#39;: &#39;529b8b95667e7a234d5e038f55e47097-1464607871.966734-610995108&#39;,\\n &#39;XDG_SESSION_DESKTOP&#39;: &#39;default&#39;,\\n &#39;XDG_SESSION_ID&#39;: &#39;c1&#39;,\\n &#39;XDG_VTNR&#39;: &#39;8&#39;,\\n &#39;_&#39;: &#39;/usr/bin/python&#39;,\\n &#39;wsgi.errors&#39;: &lt;open file &#39;&lt;stderr&gt;&#39;, mode &#39;w&#39; at 0x7f15cd0b71e0&gt;,\\n &#39;wsgi.file_wrapper&#39;: &lt;class wsgiref.util.FileWrapper at 0x7f15c9830940&gt;,\\n &#39;wsgi.input&#39;: &lt;socket._fileobject object at 0x7f15c84bb7d0&gt;,\\n &#39;wsgi.multiprocess&#39;: False,\\n &#39;wsgi.multithread&#39;: True,\\n &#39;wsgi.run_once&#39;: False,\\n &#39;wsgi.url_scheme&#39;: &#39;http&#39;,\\n &#39;wsgi.version&#39;: (1, 0)}&gt;&quot;</pre></td></tr><tr><td>kwargs</td><td class=code><pre>{}</pre></td></tr><tr><td>cls</td><td class=code><pre>&lt;class &#39;subscriptions.views.SubscriptionCreationView&#39;&gt;</pre></td></tr></tbody></table></li><li class=\"frame user\"><code>/usr/local/lib/python2.7/dist-packages/rest_framework/views.py</code> in <code>dispatch</code><div class=context id=c139731457726296><ol start=461 class=pre-context id=pre139731457726296><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre>                handler = self.http_method_not_allowed</pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre></pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre>            response = handler(request, *args, **kwargs)</pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre></pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre>        except Exception as exc:</pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre>            response = self.handle_exception(exc)</pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre></pre></li></ol><ol start=468 class=context-line><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre>        self.response = self.finalize_response(request, response, *args, **kwargs)</pre><span>...</span></li></ol><ol start=469 class=post-context id=post139731457726296><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre>        return self.response</pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre></pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre>    def options(self, request, *args, **kwargs):</pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre>        &quot;&quot;&quot;</pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre>        Handler method for HTTP &#39;OPTIONS&#39; request.</pre></li><li onclick=\"toggle('pre139731457726296', 'post139731457726296')\"><pre>        &quot;&quot;&quot;</pre></li></ol></div><div class=commands><a href=# onclick=\"return varToggle(this, '139731457726296')\"><span>&#x25b6;</span> Local vars</a></div><table class=vars id=v139731457726296><thead><tr><th>Variable</th><th>Value</th></tr></thead><tbody><tr><td>self</td><td class=code><pre>&lt;subscriptions.views.SubscriptionCreationView object at 0x7f15c3eaec50&gt;</pre></td></tr><tr><td>args</td><td class=code><pre>()</pre></td></tr><tr><td>request</td><td class=code><pre>&lt;rest_framework.request.Request object at 0x7f15c3f067d0&gt;</pre></td></tr><tr><td>handler</td><td class=code><pre>&lt;bound method SubscriptionCreationView.post of &lt;subscriptions.views.SubscriptionCreationView object at 0x7f15c3eaec50&gt;&gt;</pre></td></tr><tr><td>kwargs</td><td class=code><pre>{}</pre></td></tr><tr><td>response</td><td class=code><pre>None</pre></td></tr></tbody></table></li><li class=\"frame user\"><code>/usr/local/lib/python2.7/dist-packages/rest_framework/views.py</code> in <code>finalize_response</code><div class=context id=c139731457728096><ol start=389 class=pre-context id=pre139731457728096><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>        &quot;&quot;&quot;</pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>        Returns the final response object.</pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>        &quot;&quot;&quot;</pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>        # Make the error obvious if a proper response is not returned</pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>        assert isinstance(response, HttpResponseBase), (</pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>            &#39;Expected a `Response`, `HttpResponse` or `HttpStreamingResponse` &#39;</pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>            &#39;to be returned from the view, but received a `%s`&#39;</pre></li></ol><ol start=396 class=context-line><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>            % type(response)</pre><span>...</span></li></ol><ol start=397 class=post-context id=post139731457728096><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>        )</pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre></pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>        if isinstance(response, Response):</pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>            if not getattr(request, &#39;accepted_renderer&#39;, None):</pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>                neg = self.perform_content_negotiation(request, force=True)</pre></li><li onclick=\"toggle('pre139731457728096', 'post139731457728096')\"><pre>                request.accepted_renderer, request.accepted_media_type = neg</pre></li></ol></div><div class=commands><a href=# onclick=\"return varToggle(this, '139731457728096')\"><span>&#x25b6;</span> Local vars</a></div><table class=vars id=v139731457728096><thead><tr><th>Variable</th><th>Value</th></tr></thead><tbody><tr><td>self</td><td class=code><pre>&lt;subscriptions.views.SubscriptionCreationView object at 0x7f15c3eaec50&gt;</pre></td></tr><tr><td>args</td><td class=code><pre>()</pre></td></tr><tr><td>request</td><td class=code><pre>&lt;rest_framework.request.Request object at 0x7f15c3f067d0&gt;</pre></td></tr><tr><td>response</td><td class=code><pre>None</pre></td></tr><tr><td>kwargs</td><td class=code><pre>{}</pre></td></tr></tbody></table></li></ul></div><form action=\"http://dpaste.com/\" name=pasteform id=pasteform method=post><div id=pastebinTraceback class=pastebin><input type=hidden name=language value=PythonConsole> <input type=hidden name=title value=\"AssertionError at /subscribe/\"> <input type=hidden name=source value=\"Django Dpaste Agent\"> <input type=hidden name=poster value=Django><textarea name=content id=traceback_area cols=140 rows=25>\n" +
    "Environment:\n" +
    "\n" +
    "\n" +
    "Request Method: POST\n" +
    "Request URL: http://127.0.0.1:8000/subscribe/\n" +
    "\n" +
    "Django Version: 1.7.8\n" +
    "Python Version: 2.7.6\n" +
    "Installed Applications:\n" +
    "(&#39;django.contrib.admin&#39;,\n" +
    " &#39;django.contrib.auth&#39;,\n" +
    " &#39;django.contrib.contenttypes&#39;,\n" +
    " &#39;django.contrib.sessions&#39;,\n" +
    " &#39;django.contrib.messages&#39;,\n" +
    " &#39;django.contrib.staticfiles&#39;,\n" +
    " &#39;django.contrib.sites&#39;,\n" +
    " &#39;corsheaders&#39;,\n" +
    " &#39;rest_framework&#39;,\n" +
    " &#39;rest_framework.authtoken&#39;,\n" +
    " &#39;djoser&#39;,\n" +
    " &#39;watson&#39;,\n" +
    " &#39;django_countries&#39;,\n" +
    " &#39;questions&#39;,\n" +
    " &#39;restful_auth&#39;,\n" +
    " &#39;subscriptions&#39;)\n" +
    "Installed Middleware:\n" +
    "(&#39;corsheaders.middleware.CorsMiddleware&#39;,\n" +
    " &#39;django.contrib.sessions.middleware.SessionMiddleware&#39;,\n" +
    " &#39;django.middleware.common.CommonMiddleware&#39;,\n" +
    " &#39;django.middleware.csrf.CsrfViewMiddleware&#39;,\n" +
    " &#39;django.contrib.auth.middleware.AuthenticationMiddleware&#39;,\n" +
    " &#39;django.contrib.messages.middleware.MessageMiddleware&#39;,\n" +
    " &#39;django.middleware.clickjacking.XFrameOptionsMiddleware&#39;)\n" +
    "\n" +
    "\n" +
    "Traceback:\n" +
    "File \"/usr/local/lib/python2.7/dist-packages/django/core/handlers/base.py\" in get_response\n" +
    "  111.                     response = wrapped_callback(request, *callback_args, **callback_kwargs)\n" +
    "File \"/usr/local/lib/python2.7/dist-packages/django/views/decorators/csrf.py\" in wrapped_view\n" +
    "  57.         return view_func(*args, **kwargs)\n" +
    "File \"/usr/local/lib/python2.7/dist-packages/django/views/generic/base.py\" in view\n" +
    "  69.             return self.dispatch(request, *args, **kwargs)\n" +
    "File \"/usr/local/lib/python2.7/dist-packages/rest_framework/views.py\" in dispatch\n" +
    "  468.         self.response = self.finalize_response(request, response, *args, **kwargs)\n" +
    "File \"/usr/local/lib/python2.7/dist-packages/rest_framework/views.py\" in finalize_response\n" +
    "  396.             % type(response)\n" +
    "\n" +
    "Exception Type: AssertionError at /subscribe/\n" +
    "Exception Value: Expected a `Response`, `HttpResponse` or `HttpStreamingResponse` to be returned from the view, but received a `&lt;type &#39;NoneType&#39;&gt;`\n" +
    "</textarea><br><br><input type=submit value=\"Share this traceback on a public Web site\"></div></form></div><div id=requestinfo><h2>Request information</h2><h3 id=get-info>GET</h3><p>No GET data</p><h3 id=post-info>POST</h3><p>No POST data</p><h3 id=files-info>FILES</h3><p>No FILES data</p><h3 id=cookie-info>COOKIES</h3><p>No cookie data</p><h3 id=meta-info>META</h3><table class=req><thead><tr><th>Variable</th><th>Value</th></tr></thead><tbody><tr><td>HTTP_AUTHORIZATION</td><td class=code><pre>&#39;Token e89e037192e74fae91a90dbf5ef330dd0b4141dc&#39;</pre></td></tr><tr><td>MDMSESSION</td><td class=code><pre>&#39;default&#39;</pre></td></tr><tr><td>RUN_MAIN</td><td class=code><pre>&#39;true&#39;</pre></td></tr><tr><td>HTTP_REFERER</td><td class=code><pre>&#39;http://localhost:9001/subscribe&#39;</pre></td></tr><tr><td>SERVER_SOFTWARE</td><td class=code><pre>&#39;WSGIServer/0.1 Python/2.7.6&#39;</pre></td></tr><tr><td>SCRIPT_NAME</td><td class=code><pre>u&#39;&#39;</pre></td></tr><tr><td>MDM_LANG</td><td class=code><pre>&#39;en_GB.UTF-8&#39;</pre></td></tr><tr><td>HTTP_ORIGIN</td><td class=code><pre>&#39;http://localhost:9001&#39;</pre></td></tr><tr><td>SERVER_PROTOCOL</td><td class=code><pre>&#39;HTTP/1.1&#39;</pre></td></tr><tr><td>CONTENT_LENGTH</td><td class=code><pre>&#39;63&#39;</pre></td></tr><tr><td>SHELL</td><td class=code><pre>&#39;/bin/bash&#39;</pre></td></tr><tr><td>XDG_DATA_DIRS</td><td class=code><pre>&#39;/usr/share/default:/usr/share/gnome:/usr/local/share/:/usr/share/:/usr/share/mdm/&#39;</pre></td></tr><tr><td>MANDATORY_PATH</td><td class=code><pre>&#39;/usr/share/gconf/default.mandatory.path&#39;</pre></td></tr><tr><td>TEXTDOMAIN</td><td class=code><pre>&#39;im-config&#39;</pre></td></tr><tr><td>MANPATH</td><td class=code><pre>&#39;/home/michael/.npm-packages/share/man:/usr/local/man:/usr/local/share/man:/usr/share/man&#39;</pre></td></tr><tr><td>HTTP_PRAGMA</td><td class=code><pre>&#39;no-cache&#39;</pre></td></tr><tr><td>XDG_RUNTIME_DIR</td><td class=code><pre>&#39;/run/user/1000&#39;</pre></td></tr><tr><td>HTTP_CACHE_CONTROL</td><td class=code><pre>&#39;no-cache&#39;</pre></td></tr><tr><td>XDG_SESSION_ID</td><td class=code><pre>&#39;c1&#39;</pre></td></tr><tr><td>DBUS_SESSION_BUS_ADDRESS</td><td class=code><pre>&#39;unix:abstract=/tmp/dbus-1GA75EK8Fx,guid=444256c32486a0fb36564cd0574c2480&#39;</pre></td></tr><tr><td>DEFAULTS_PATH</td><td class=code><pre>&#39;/usr/share/gconf/default.default.path&#39;</pre></td></tr><tr><td>HTTP_ACCEPT</td><td class=code><pre>&#39;application/json, text/plain, */*&#39;</pre></td></tr><tr><td>DESKTOP_SESSION</td><td class=code><pre>&#39;default&#39;</pre></td></tr><tr><td>wsgi.version</td><td class=code><pre>(1, 0)</pre></td></tr><tr><td>wsgi.multiprocess</td><td class=code><pre>False</pre></td></tr><tr><td>REQUEST_METHOD</td><td class=code><pre>&#39;POST&#39;</pre></td></tr><tr><td>LS_COLORS</td><td class=code><pre>&#39;rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:&#39;</pre></td></tr><tr><td>GNOME_DESKTOP_SESSION_ID</td><td class=code><pre>&#39;this-is-deprecated&#39;</pre></td></tr><tr><td>XDG_CURRENT_DESKTOP</td><td class=code><pre>&#39;X-Cinnamon&#39;</pre></td></tr><tr><td>USER</td><td class=code><pre>&#39;michael&#39;</pre></td></tr><tr><td>QUERY_STRING</td><td class=code><pre>&#39;&#39;</pre></td></tr><tr><td>HTTP_USER_AGENT</td><td class=code><pre>&#39;Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0&#39;</pre></td></tr><tr><td>HTTP_CONNECTION</td><td class=code><pre>&#39;keep-alive&#39;</pre></td></tr><tr><td>XAUTHORITY</td><td class=code><pre>&#39;/home/michael/.Xauthority&#39;</pre></td></tr><tr><td>SESSION_MANAGER</td><td class=code><pre>&#39;local/michael-VirtualBox:@/tmp/.ICE-unix/1613,unix/michael-VirtualBox:/tmp/.ICE-unix/1613&#39;</pre></td></tr><tr><td>SHLVL</td><td class=code><pre>&#39;2&#39;</pre></td></tr><tr><td>LD_LIBRARY_PATH</td><td class=code><pre>&#39;.:&#39;</pre></td></tr><tr><td>wsgi.url_scheme</td><td class=code><pre>&#39;http&#39;</pre></td></tr><tr><td>WINDOWID</td><td class=code><pre>&#39;54525960&#39;</pre></td></tr><tr><td>GPG_AGENT_INFO</td><td class=code><pre>&#39;/run/user/1000/keyring-s7X8Ke/gpg:0:1&#39;</pre></td></tr><tr><td>XDG_SESSION_DESKTOP</td><td class=code><pre>&#39;default&#39;</pre></td></tr><tr><td>INSIDE_NEMO_PYTHON</td><td class=code><pre>&#39;&#39;</pre></td></tr><tr><td>GDMSESSION</td><td class=code><pre>&#39;default&#39;</pre></td></tr><tr><td>wsgi.multithread</td><td class=code><pre>True</pre></td></tr><tr><td>_</td><td class=code><pre>&#39;/usr/bin/python&#39;</pre></td></tr><tr><td>XDG_CONFIG_DIRS</td><td class=code><pre>&#39;/etc/xdg/xdg-default:/etc/xdg&#39;</pre></td></tr><tr><td>DJANGO_SETTINGS_MODULE</td><td class=code><pre>&#39;dentest.settings&#39;</pre></td></tr><tr><td>COLORTERM</td><td class=code><pre>&#39;gnome-terminal&#39;</pre></td></tr><tr><td>wsgi.file_wrapper</td><td class=code><pre>&#39;&#39;</pre></td></tr><tr><td>REMOTE_HOST</td><td class=code><pre>&#39;&#39;</pre></td></tr><tr><td>HTTP_ACCEPT_ENCODING</td><td class=code><pre>&#39;gzip, deflate&#39;</pre></td></tr><tr><td>HOME</td><td class=code><pre>&#39;/home/michael&#39;</pre></td></tr><tr><td>DISPLAY</td><td class=code><pre>&#39;:0&#39;</pre></td></tr><tr><td>LANG</td><td class=code><pre>&#39;en_GB.UTF-8&#39;</pre></td></tr><tr><td>NPM_PACKAGES</td><td class=code><pre>&#39;/home/michael/.npm-packages&#39;</pre></td></tr><tr><td>SERVER_PORT</td><td class=code><pre>&#39;8000&#39;</pre></td></tr><tr><td>USERNAME</td><td class=code><pre>&#39;michael&#39;</pre></td></tr><tr><td>GDM_XSERVER_LOCATION</td><td class=code><pre>&#39;local&#39;</pre></td></tr><tr><td>VTE_VERSION</td><td class=code><pre>&#39;3409&#39;</pre></td></tr><tr><td>HTTP_HOST</td><td class=code><pre>&#39;127.0.0.1:8000&#39;</pre></td></tr><tr><td>GNOME_KEYRING_PID</td><td class=code><pre>&#39;1602&#39;</pre></td></tr><tr><td>wsgi.run_once</td><td class=code><pre>False</pre></td></tr><tr><td>wsgi.errors</td><td class=code><pre>&lt;open file &#39;&lt;stderr&gt;&#39;, mode &#39;w&#39; at 0x7f15cd0b71e0&gt;</pre></td></tr><tr><td>HTTP_ACCEPT_LANGUAGE</td><td class=code><pre>&#39;en-US,en;q=0.5&#39;</pre></td></tr><tr><td>MDM_XSERVER_LOCATION</td><td class=code><pre>&#39;local&#39;</pre></td></tr><tr><td>PATH_INFO</td><td class=code><pre>u&#39;/subscribe/&#39;</pre></td></tr><tr><td>XDG_VTNR</td><td class=code><pre>&#39;8&#39;</pre></td></tr><tr><td>LOGNAME</td><td class=code><pre>&#39;michael&#39;</pre></td></tr><tr><td>XDG_SEAT</td><td class=code><pre>&#39;seat0&#39;</pre></td></tr><tr><td>GNOME_KEYRING_CONTROL</td><td class=code><pre>&#39;/run/user/1000/keyring-s7X8Ke&#39;</pre></td></tr><tr><td>PATH</td><td class=code><pre>&#39;/home/michael/.npm-packages/bin:/home/michael/.npm-packages/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games&#39;</pre></td></tr><tr><td>SSH_AGENT_PID</td><td class=code><pre>&#39;1781&#39;</pre></td></tr><tr><td>TERM</td><td class=code><pre>&#39;xterm-256color&#39;</pre></td></tr><tr><td>TZ</td><td class=code><pre>&#39;UTC&#39;</pre></td></tr><tr><td>XDG_SESSION_COOKIE</td><td class=code><pre>&#39;529b8b95667e7a234d5e038f55e47097-1464607871.966734-610995108&#39;</pre></td></tr><tr><td>SERVER_NAME</td><td class=code><pre>&#39;localhost&#39;</pre></td></tr><tr><td>WINDOWPATH</td><td class=code><pre>&#39;8&#39;</pre></td></tr><tr><td>SSH_AUTH_SOCK</td><td class=code><pre>&#39;/run/user/1000/keyring-s7X8Ke/ssh&#39;</pre></td></tr><tr><td>wsgi.input</td><td class=code><pre>&lt;socket._fileobject object at 0x7f15c84bb7d0&gt;</pre></td></tr><tr><td>TEXTDOMAINDIR</td><td class=code><pre>&#39;/usr/share/locale/&#39;</pre></td></tr><tr><td>GATEWAY_INTERFACE</td><td class=code><pre>&#39;CGI/1.1&#39;</pre></td></tr><tr><td>CSRF_COOKIE</td><td class=code><pre>u&#39;mn5jQOWvDxlfZ9hcnoPnVhN2JYhfLpBI&#39;</pre></td></tr><tr><td>OLDPWD</td><td class=code><pre>&#39;/home/michael/DentestRevised/frontend&#39;</pre></td></tr><tr><td>REMOTE_ADDR</td><td class=code><pre>&#39;127.0.0.1&#39;</pre></td></tr><tr><td>NODE_PATH</td><td class=code><pre>&#39;/home/michael/.npm-packages/lib/node_modules:/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript&#39;</pre></td></tr><tr><td>PWD</td><td class=code><pre>&#39;/home/michael/DentestRevised/server&#39;</pre></td></tr><tr><td>CONTENT_TYPE</td><td class=code><pre>&#39;application/json;charset=utf-8&#39;</pre></td></tr></tbody></table><h3 id=settings-info>Settings</h3><h4>Using settings module <code>dentest.settings</code></h4><table class=req><thead><tr><th>Setting</th><th>Value</th></tr></thead><tbody><tr><td>USE_L10N</td><td class=code><pre>True</pre></td></tr><tr><td>FROM_EMAIL</td><td class=code><pre>&#39;dentest.reg@gmail.com&#39;</pre></td></tr><tr><td>CSRF_COOKIE_SECURE</td><td class=code><pre>False</pre></td></tr><tr><td>LANGUAGE_CODE</td><td class=code><pre>&#39;en-us&#39;</pre></td></tr><tr><td>ROOT_URLCONF</td><td class=code><pre>&#39;dentest.urls&#39;</pre></td></tr><tr><td>MANAGERS</td><td class=code><pre>()</pre></td></tr><tr><td>BASE_DIR</td><td class=code><pre>&#39;/home/michael/DentestRevised/server&#39;</pre></td></tr><tr><td>TEST_NON_SERIALIZED_APPS</td><td class=code><pre>[]</pre></td></tr><tr><td>DEFAULT_CHARSET</td><td class=code><pre>&#39;utf-8&#39;</pre></td></tr><tr><td>SESSION_SERIALIZER</td><td class=code><pre>&#39;django.contrib.sessions.serializers.JSONSerializer&#39;</pre></td></tr><tr><td>STATIC_ROOT</td><td class=code><pre>None</pre></td></tr><tr><td>USE_THOUSAND_SEPARATOR</td><td class=code><pre>False</pre></td></tr><tr><td>ALLOWED_HOSTS</td><td class=code><pre>[]</pre></td></tr><tr><td>MESSAGE_STORAGE</td><td class=code><pre>&#39;django.contrib.messages.storage.fallback.FallbackStorage&#39;</pre></td></tr><tr><td>EMAIL_SUBJECT_PREFIX</td><td class=code><pre>&#39;[Django] &#39;</pre></td></tr><tr><td>SEND_BROKEN_LINK_EMAILS</td><td class=code><pre>False</pre></td></tr><tr><td>PASSWORD_MIN_LENGTH</td><td class=code><pre>u&#39;********************&#39;</pre></td></tr><tr><td>STATICFILES_FINDERS</td><td class=code><pre>(&#39;django.contrib.staticfiles.finders.FileSystemFinder&#39;,\n" +
    " &#39;django.contrib.staticfiles.finders.AppDirectoriesFinder&#39;)</pre></td></tr><tr><td>SESSION_CACHE_ALIAS</td><td class=code><pre>&#39;default&#39;</pre></td></tr><tr><td>SESSION_COOKIE_DOMAIN</td><td class=code><pre>None</pre></td></tr><tr><td>SESSION_COOKIE_NAME</td><td class=code><pre>&#39;sessionid&#39;</pre></td></tr><tr><td>ADMIN_FOR</td><td class=code><pre>()</pre></td></tr><tr><td>TIME_INPUT_FORMATS</td><td class=code><pre>(&#39;%H:%M:%S&#39;, &#39;%H:%M:%S.%f&#39;, &#39;%H:%M&#39;)</pre></td></tr><tr><td>DATABASES</td><td class=code><pre>{&#39;default&#39;: {&#39;ATOMIC_REQUESTS&#39;: False,\n" +
    "             &#39;AUTOCOMMIT&#39;: True,\n" +
    "             &#39;CONN_MAX_AGE&#39;: 0,\n" +
    "             &#39;ENGINE&#39;: &#39;django.db.backends.sqlite3&#39;,\n" +
    "             &#39;HOST&#39;: &#39;&#39;,\n" +
    "             &#39;NAME&#39;: &#39;/home/michael/DentestRevised/server/db.sqlite3&#39;,\n" +
    "             &#39;OPTIONS&#39;: {},\n" +
    "             &#39;PASSWORD&#39;: u&#39;********************&#39;,\n" +
    "             &#39;PORT&#39;: &#39;&#39;,\n" +
    "             &#39;TEST&#39;: {&#39;CHARSET&#39;: None,\n" +
    "                      &#39;COLLATION&#39;: None,\n" +
    "                      &#39;MIRROR&#39;: None,\n" +
    "                      &#39;NAME&#39;: None},\n" +
    "             &#39;TIME_ZONE&#39;: &#39;UTC&#39;,\n" +
    "             &#39;USER&#39;: &#39;&#39;}}</pre></td></tr><tr><td>FILE_UPLOAD_DIRECTORY_PERMISSIONS</td><td class=code><pre>None</pre></td></tr><tr><td>PASSWORD_COMPLEXITY</td><td class=code><pre>u&#39;********************&#39;</pre></td></tr><tr><td>FILE_UPLOAD_PERMISSIONS</td><td class=code><pre>None</pre></td></tr><tr><td>FILE_UPLOAD_HANDLERS</td><td class=code><pre>(&#39;django.core.files.uploadhandler.MemoryFileUploadHandler&#39;,\n" +
    " &#39;django.core.files.uploadhandler.TemporaryFileUploadHandler&#39;)</pre></td></tr><tr><td>DEFAULT_CONTENT_TYPE</td><td class=code><pre>&#39;text/html&#39;</pre></td></tr><tr><td>PASSWORD_RESET_DAYS_VALID</td><td class=code><pre>u&#39;********************&#39;</pre></td></tr><tr><td>APPEND_SLASH</td><td class=code><pre>True</pre></td></tr><tr><td>LOCALE_PATHS</td><td class=code><pre>()</pre></td></tr><tr><td>DATABASE_ROUTERS</td><td class=code><pre>[]</pre></td></tr><tr><td>DEFAULT_TABLESPACE</td><td class=code><pre>&#39;&#39;</pre></td></tr><tr><td>YEAR_MONTH_FORMAT</td><td class=code><pre>&#39;F Y&#39;</pre></td></tr><tr><td>STATICFILES_STORAGE</td><td class=code><pre>&#39;django.contrib.staticfiles.storage.StaticFilesStorage&#39;</pre></td></tr><tr><td>CACHES</td><td class=code><pre>{&#39;default&#39;: {&#39;BACKEND&#39;: &#39;django.core.cache.backends.locmem.LocMemCache&#39;}}</pre></td></tr><tr><td>DOMAIN</td><td class=code><pre>&#39;localhost:9001&#39;</pre></td></tr><tr><td>PASSWORD_RESET_CONFIRM_URL</td><td class=code><pre>u&#39;********************&#39;</pre></td></tr><tr><td>SERVER_EMAIL</td><td class=code><pre>&#39;root@localhost&#39;</pre></td></tr><tr><td>SESSION_COOKIE_PATH</td><td class=code><pre>&#39;/&#39;</pre></td></tr><tr><td>SILENCED_SYSTEM_CHECKS</td><td class=code><pre>[]</pre></td></tr><tr><td>MIDDLEWARE_CLASSES</td><td class=code><pre>(&#39;corsheaders.middleware.CorsMiddleware&#39;,\n" +
    " &#39;django.contrib.sessions.middleware.SessionMiddleware&#39;,\n" +
    " &#39;django.middleware.common.CommonMiddleware&#39;,\n" +
    " &#39;django.middleware.csrf.CsrfViewMiddleware&#39;,\n" +
    " &#39;django.contrib.auth.middleware.AuthenticationMiddleware&#39;,\n" +
    " &#39;django.contrib.messages.middleware.MessageMiddleware&#39;,\n" +
    " &#39;django.middleware.clickjacking.XFrameOptionsMiddleware&#39;)</pre></td></tr><tr><td>USE_I18N</td><td class=code><pre>True</pre></td></tr><tr><td>THOUSAND_SEPARATOR</td><td class=code><pre>&#39;,&#39;</pre></td></tr><tr><td>DEFAULT_PROTOCOL</td><td class=code><pre>&#39;http&#39;</pre></td></tr><tr><td>LANGUAGE_COOKIE_NAME</td><td class=code><pre>&#39;django_language&#39;</pre></td></tr><tr><td>DEFAULT_INDEX_TABLESPACE</td><td class=code><pre>&#39;&#39;</pre></td></tr><tr><td>TRANSACTIONS_MANAGED</td><td class=code><pre>False</pre></td></tr><tr><td>LOGGING_CONFIG</td><td class=code><pre>&#39;logging.config.dictConfig&#39;</pre></td></tr><tr><td>TEMPLATE_LOADERS</td><td class=code><pre>(&#39;django.template.loaders.filesystem.Loader&#39;,\n" +
    " &#39;django.template.loaders.app_directories.Loader&#39;)</pre></td></tr><tr><td>FIRST_DAY_OF_WEEK</td><td class=code><pre>0</pre></td></tr><tr><td>WSGI_APPLICATION</td><td class=code><pre>&#39;dentest.wsgi.application&#39;</pre></td></tr><tr><td>TEMPLATE_DEBUG</td><td class=code><pre>True</pre></td></tr><tr><td>X_FRAME_OPTIONS</td><td class=code><pre>&#39;SAMEORIGIN&#39;</pre></td></tr><tr><td>CSRF_COOKIE_NAME</td><td class=code><pre>&#39;csrftoken&#39;</pre></td></tr><tr><td>FORCE_SCRIPT_NAME</td><td class=code><pre>None</pre></td></tr><tr><td>USE_X_FORWARDED_HOST</td><td class=code><pre>False</pre></td></tr><tr><td>SIGNING_BACKEND</td><td class=code><pre>&#39;django.core.signing.TimestampSigner&#39;</pre></td></tr><tr><td>SESSION_COOKIE_SECURE</td><td class=code><pre>False</pre></td></tr><tr><td>CSRF_COOKIE_DOMAIN</td><td class=code><pre>None</pre></td></tr><tr><td>FILE_CHARSET</td><td class=code><pre>&#39;utf-8&#39;</pre></td></tr><tr><td>DEBUG</td><td class=code><pre>True</pre></td></tr><tr><td>LANGUAGE_COOKIE_DOMAIN</td><td class=code><pre>None</pre></td></tr><tr><td>DEFAULT_FILE_STORAGE</td><td class=code><pre>&#39;django.core.files.storage.FileSystemStorage&#39;</pre></td></tr><tr><td>INSTALLED_APPS</td><td class=code><pre>(&#39;django.contrib.admin&#39;,\n" +
    " &#39;django.contrib.auth&#39;,\n" +
    " &#39;django.contrib.contenttypes&#39;,\n" +
    " &#39;django.contrib.sessions&#39;,\n" +
    " &#39;django.contrib.messages&#39;,\n" +
    " &#39;django.contrib.staticfiles&#39;,\n" +
    " &#39;django.contrib.sites&#39;,\n" +
    " &#39;corsheaders&#39;,\n" +
    " &#39;rest_framework&#39;,\n" +
    " &#39;rest_framework.authtoken&#39;,\n" +
    " &#39;djoser&#39;,\n" +
    " &#39;watson&#39;,\n" +
    " &#39;django_countries&#39;,\n" +
    " &#39;questions&#39;,\n" +
    " &#39;restful_auth&#39;,\n" +
    " &#39;subscriptions&#39;)</pre></td></tr><tr><td>LANGUAGES</td><td class=code><pre>((&#39;af&#39;, &#39;Afrikaans&#39;),\n" +
    " (&#39;ar&#39;, &#39;Arabic&#39;),\n" +
    " (&#39;ast&#39;, &#39;Asturian&#39;),\n" +
    " (&#39;az&#39;, &#39;Azerbaijani&#39;),\n" +
    " (&#39;bg&#39;, &#39;Bulgarian&#39;),\n" +
    " (&#39;be&#39;, &#39;Belarusian&#39;),\n" +
    " (&#39;bn&#39;, &#39;Bengali&#39;),\n" +
    " (&#39;br&#39;, &#39;Breton&#39;),\n" +
    " (&#39;bs&#39;, &#39;Bosnian&#39;),\n" +
    " (&#39;ca&#39;, &#39;Catalan&#39;),\n" +
    " (&#39;cs&#39;, &#39;Czech&#39;),\n" +
    " (&#39;cy&#39;, &#39;Welsh&#39;),\n" +
    " (&#39;da&#39;, &#39;Danish&#39;),\n" +
    " (&#39;de&#39;, &#39;German&#39;),\n" +
    " (&#39;el&#39;, &#39;Greek&#39;),\n" +
    " (&#39;en&#39;, &#39;English&#39;),\n" +
    " (&#39;en-au&#39;, &#39;Australian English&#39;),\n" +
    " (&#39;en-gb&#39;, &#39;British English&#39;),\n" +
    " (&#39;eo&#39;, &#39;Esperanto&#39;),\n" +
    " (&#39;es&#39;, &#39;Spanish&#39;),\n" +
    " (&#39;es-ar&#39;, &#39;Argentinian Spanish&#39;),\n" +
    " (&#39;es-mx&#39;, &#39;Mexican Spanish&#39;),\n" +
    " (&#39;es-ni&#39;, &#39;Nicaraguan Spanish&#39;),\n" +
    " (&#39;es-ve&#39;, &#39;Venezuelan Spanish&#39;),\n" +
    " (&#39;et&#39;, &#39;Estonian&#39;),\n" +
    " (&#39;eu&#39;, &#39;Basque&#39;),\n" +
    " (&#39;fa&#39;, &#39;Persian&#39;),\n" +
    " (&#39;fi&#39;, &#39;Finnish&#39;),\n" +
    " (&#39;fr&#39;, &#39;French&#39;),\n" +
    " (&#39;fy&#39;, &#39;Frisian&#39;),\n" +
    " (&#39;ga&#39;, &#39;Irish&#39;),\n" +
    " (&#39;gl&#39;, &#39;Galician&#39;),\n" +
    " (&#39;he&#39;, &#39;Hebrew&#39;),\n" +
    " (&#39;hi&#39;, &#39;Hindi&#39;),\n" +
    " (&#39;hr&#39;, &#39;Croatian&#39;),\n" +
    " (&#39;hu&#39;, &#39;Hungarian&#39;),\n" +
    " (&#39;ia&#39;, &#39;Interlingua&#39;),\n" +
    " (&#39;id&#39;, &#39;Indonesian&#39;),\n" +
    " (&#39;io&#39;, &#39;Ido&#39;),\n" +
    " (&#39;is&#39;, &#39;Icelandic&#39;),\n" +
    " (&#39;it&#39;, &#39;Italian&#39;),\n" +
    " (&#39;ja&#39;, &#39;Japanese&#39;),\n" +
    " (&#39;ka&#39;, &#39;Georgian&#39;),\n" +
    " (&#39;kk&#39;, &#39;Kazakh&#39;),\n" +
    " (&#39;km&#39;, &#39;Khmer&#39;),\n" +
    " (&#39;kn&#39;, &#39;Kannada&#39;),\n" +
    " (&#39;ko&#39;, &#39;Korean&#39;),\n" +
    " (&#39;lb&#39;, &#39;Luxembourgish&#39;),\n" +
    " (&#39;lt&#39;, &#39;Lithuanian&#39;),\n" +
    " (&#39;lv&#39;, &#39;Latvian&#39;),\n" +
    " (&#39;mk&#39;, &#39;Macedonian&#39;),\n" +
    " (&#39;ml&#39;, &#39;Malayalam&#39;),\n" +
    " (&#39;mn&#39;, &#39;Mongolian&#39;),\n" +
    " (&#39;mr&#39;, &#39;Marathi&#39;),\n" +
    " (&#39;my&#39;, &#39;Burmese&#39;),\n" +
    " (&#39;nb&#39;, &#39;Norwegian Bokmal&#39;),\n" +
    " (&#39;ne&#39;, &#39;Nepali&#39;),\n" +
    " (&#39;nl&#39;, &#39;Dutch&#39;),\n" +
    " (&#39;nn&#39;, &#39;Norwegian Nynorsk&#39;),\n" +
    " (&#39;os&#39;, &#39;Ossetic&#39;),\n" +
    " (&#39;pa&#39;, &#39;Punjabi&#39;),\n" +
    " (&#39;pl&#39;, &#39;Polish&#39;),\n" +
    " (&#39;pt&#39;, &#39;Portuguese&#39;),\n" +
    " (&#39;pt-br&#39;, &#39;Brazilian Portuguese&#39;),\n" +
    " (&#39;ro&#39;, &#39;Romanian&#39;),\n" +
    " (&#39;ru&#39;, &#39;Russian&#39;),\n" +
    " (&#39;sk&#39;, &#39;Slovak&#39;),\n" +
    " (&#39;sl&#39;, &#39;Slovenian&#39;),\n" +
    " (&#39;sq&#39;, &#39;Albanian&#39;),\n" +
    " (&#39;sr&#39;, &#39;Serbian&#39;),\n" +
    " (&#39;sr-latn&#39;, &#39;Serbian Latin&#39;),\n" +
    " (&#39;sv&#39;, &#39;Swedish&#39;),\n" +
    " (&#39;sw&#39;, &#39;Swahili&#39;),\n" +
    " (&#39;ta&#39;, &#39;Tamil&#39;),\n" +
    " (&#39;te&#39;, &#39;Telugu&#39;),\n" +
    " (&#39;th&#39;, &#39;Thai&#39;),\n" +
    " (&#39;tr&#39;, &#39;Turkish&#39;),\n" +
    " (&#39;tt&#39;, &#39;Tatar&#39;),\n" +
    " (&#39;udm&#39;, &#39;Udmurt&#39;),\n" +
    " (&#39;uk&#39;, &#39;Ukrainian&#39;),\n" +
    " (&#39;ur&#39;, &#39;Urdu&#39;),\n" +
    " (&#39;vi&#39;, &#39;Vietnamese&#39;),\n" +
    " (&#39;zh-cn&#39;, &#39;Simplified Chinese&#39;),\n" +
    " (&#39;zh-hans&#39;, &#39;Simplified Chinese&#39;),\n" +
    " (&#39;zh-hant&#39;, &#39;Traditional Chinese&#39;),\n" +
    " (&#39;zh-tw&#39;, &#39;Traditional Chinese&#39;))</pre></td></tr><tr><td>COMMENTS_ALLOW_PROFANITIES</td><td class=code><pre>False</pre></td></tr><tr><td>STATICFILES_DIRS</td><td class=code><pre>()</pre></td></tr><tr><td>PREPEND_WWW</td><td class=code><pre>False</pre></td></tr><tr><td>SECURE_PROXY_SSL_HEADER</td><td class=code><pre>None</pre></td></tr><tr><td>LANGUAGE_COOKIE_AGE</td><td class=code><pre>None</pre></td></tr><tr><td>SESSION_COOKIE_HTTPONLY</td><td class=code><pre>True</pre></td></tr><tr><td>DEBUG_PROPAGATE_EXCEPTIONS</td><td class=code><pre>False</pre></td></tr><tr><td>CSRF_COOKIE_AGE</td><td class=code><pre>31449600</pre></td></tr><tr><td>MONTH_DAY_FORMAT</td><td class=code><pre>&#39;F j&#39;</pre></td></tr><tr><td>LOGIN_URL</td><td class=code><pre>&#39;/accounts/login/&#39;</pre></td></tr><tr><td>SESSION_EXPIRE_AT_BROWSER_CLOSE</td><td class=code><pre>False</pre></td></tr><tr><td>TIME_FORMAT</td><td class=code><pre>&#39;P&#39;</pre></td></tr><tr><td>NUMBER_GROUPING</td><td class=code><pre>0</pre></td></tr><tr><td>AUTH_USER_MODEL</td><td class=code><pre>&#39;auth.User&#39;</pre></td></tr><tr><td>DATE_INPUT_FORMATS</td><td class=code><pre>(&#39;%Y-%m-%d&#39;,\n" +
    " &#39;%m/%d/%Y&#39;,\n" +
    " &#39;%m/%d/%y&#39;,\n" +
    " &#39;%b %d %Y&#39;,\n" +
    " &#39;%b %d, %Y&#39;,\n" +
    " &#39;%d %b %Y&#39;,\n" +
    " &#39;%d %b, %Y&#39;,\n" +
    " &#39;%B %d %Y&#39;,\n" +
    " &#39;%B %d, %Y&#39;,\n" +
    " &#39;%d %B %Y&#39;,\n" +
    " &#39;%d %B, %Y&#39;)</pre></td></tr><tr><td>AUTHENTICATION_BACKENDS</td><td class=code><pre>(&#39;django.contrib.auth.backends.ModelBackend&#39;,\n" +
    " &#39;restful_auth.backends.UsernameOrEmailBackend&#39;)</pre></td></tr><tr><td>EMAIL_HOST_PASSWORD</td><td class=code><pre>u&#39;********************&#39;</pre></td></tr><tr><td>PASSWORD_RESET_TIMEOUT_DAYS</td><td class=code><pre>u&#39;********************&#39;</pre></td></tr><tr><td>SESSION_FILE_PATH</td><td class=code><pre>None</pre></td></tr><tr><td>CACHE_MIDDLEWARE_ALIAS</td><td class=code><pre>&#39;default&#39;</pre></td></tr><tr><td>SESSION_SAVE_EVERY_REQUEST</td><td class=code><pre>False</pre></td></tr><tr><td>EMAIL_UNIQUE</td><td class=code><pre>True</pre></td></tr><tr><td>SESSION_ENGINE</td><td class=code><pre>&#39;django.contrib.sessions.backends.db&#39;</pre></td></tr><tr><td>CSRF_FAILURE_VIEW</td><td class=code><pre>&#39;django.views.csrf.csrf_failure&#39;</pre></td></tr><tr><td>CSRF_COOKIE_PATH</td><td class=code><pre>&#39;/&#39;</pre></td></tr><tr><td>LOGIN_REDIRECT_URL</td><td class=code><pre>&#39;/accounts/profile/&#39;</pre></td></tr><tr><td>DECIMAL_SEPARATOR</td><td class=code><pre>&#39;.&#39;</pre></td></tr><tr><td>IGNORABLE_404_URLS</td><td class=code><pre>()</pre></td></tr><tr><td>MIGRATION_MODULES</td><td class=code><pre>{}</pre></td></tr><tr><td>TEMPLATE_STRING_IF_INVALID</td><td class=code><pre>&#39;&#39;</pre></td></tr><tr><td>LOGOUT_URL</td><td class=code><pre>&#39;/accounts/logout/&#39;</pre></td></tr><tr><td>EMAIL_USE_TLS</td><td class=code><pre>False</pre></td></tr><tr><td>ACTIVATION_URL</td><td class=code><pre>&#39;email_activation/{username}/{token}&#39;</pre></td></tr><tr><td>FIXTURE_DIRS</td><td class=code><pre>()</pre></td></tr><tr><td>EMAIL_HOST</td><td class=code><pre>&#39;localhost&#39;</pre></td></tr><tr><td>DATE_FORMAT</td><td class=code><pre>&#39;N j, Y&#39;</pre></td></tr><tr><td>MEDIA_ROOT</td><td class=code><pre>&#39;&#39;</pre></td></tr><tr><td>DEFAULT_EXCEPTION_REPORTER_FILTER</td><td class=code><pre>&#39;django.views.debug.SafeExceptionReporterFilter&#39;</pre></td></tr><tr><td>ADMINS</td><td class=code><pre>()</pre></td></tr><tr><td>FORMAT_MODULE_PATH</td><td class=code><pre>None</pre></td></tr><tr><td>DEFAULT_FROM_EMAIL</td><td class=code><pre>&#39;webmaster@localhost&#39;</pre></td></tr><tr><td>REST_FRAMEWORK</td><td class=code><pre>{&#39;DEFAULT_AUTHENTICATION_CLASSES&#39;: (&#39;rest_framework.authentication.TokenAuthentication&#39;,\n" +
    "                                    &#39;rest_framework.authentication.SessionAuthentication&#39;)}</pre></td></tr><tr><td>MEDIA_URL</td><td class=code><pre>&#39;&#39;</pre></td></tr><tr><td>DATETIME_FORMAT</td><td class=code><pre>&#39;N j, Y, P&#39;</pre></td></tr><tr><td>TEMPLATE_DIRS</td><td class=code><pre>(&#39;/restful_auth/templates/&#39;,)</pre></td></tr><tr><td>EMAIL_CONFIRMATION_DAYS_VALID</td><td class=code><pre>3</pre></td></tr><tr><td>SITE_ID</td><td class=code><pre>1</pre></td></tr><tr><td>DISALLOWED_USER_AGENTS</td><td class=code><pre>()</pre></td></tr><tr><td>ALLOWED_INCLUDE_ROOTS</td><td class=code><pre>()</pre></td></tr><tr><td>LOGGING</td><td class=code><pre>{}</pre></td></tr><tr><td>SHORT_DATE_FORMAT</td><td class=code><pre>&#39;m/d/Y&#39;</pre></td></tr><tr><td>SECRET_KEY</td><td class=code><pre>u&#39;********************&#39;</pre></td></tr><tr><td>TEST_RUNNER</td><td class=code><pre>&#39;django.test.runner.DiscoverRunner&#39;</pre></td></tr><tr><td>CACHE_MIDDLEWARE_KEY_PREFIX</td><td class=code><pre>u&#39;********************&#39;</pre></td></tr><tr><td>TIME_ZONE</td><td class=code><pre>&#39;UTC&#39;</pre></td></tr><tr><td>CORS_ORIGIN_ALLOW_ALL</td><td class=code><pre>True</pre></td></tr><tr><td>FILE_UPLOAD_MAX_MEMORY_SIZE</td><td class=code><pre>2621440</pre></td></tr><tr><td>EMAIL_BACKEND</td><td class=code><pre>&#39;django.core.mail.backends.console.EmailBackend&#39;</pre></td></tr><tr><td>EMAIL_USE_SSL</td><td class=code><pre>False</pre></td></tr><tr><td>TEMPLATE_CONTEXT_PROCESSORS</td><td class=code><pre>(&#39;django.contrib.auth.context_processors.auth&#39;,\n" +
    " &#39;django.core.context_processors.debug&#39;,\n" +
    " &#39;django.core.context_processors.i18n&#39;,\n" +
    " &#39;django.core.context_processors.media&#39;,\n" +
    " &#39;django.core.context_processors.static&#39;,\n" +
    " &#39;django.core.context_processors.tz&#39;,\n" +
    " &#39;django.contrib.messages.context_processors.messages&#39;)</pre></td></tr><tr><td>SITE_NAME</td><td class=code><pre>&#39;Dentest&#39;</pre></td></tr><tr><td>SESSION_COOKIE_AGE</td><td class=code><pre>1209600</pre></td></tr><tr><td>SETTINGS_MODULE</td><td class=code><pre>&#39;dentest.settings&#39;</pre></td></tr><tr><td>USE_ETAGS</td><td class=code><pre>False</pre></td></tr><tr><td>LANGUAGES_BIDI</td><td class=code><pre>(&#39;he&#39;, &#39;ar&#39;, &#39;fa&#39;, &#39;ur&#39;)</pre></td></tr><tr><td>FILE_UPLOAD_TEMP_DIR</td><td class=code><pre>None</pre></td></tr><tr><td>INTERNAL_IPS</td><td class=code><pre>()</pre></td></tr><tr><td>STATIC_URL</td><td class=code><pre>&#39;/static/&#39;</pre></td></tr><tr><td>EMAIL_PORT</td><td class=code><pre>25</pre></td></tr><tr><td>USE_TZ</td><td class=code><pre>True</pre></td></tr><tr><td>SHORT_DATETIME_FORMAT</td><td class=code><pre>&#39;m/d/Y P&#39;</pre></td></tr><tr><td>PASSWORD_HASHERS</td><td class=code><pre>u&#39;********************&#39;</pre></td></tr><tr><td>ABSOLUTE_URL_OVERRIDES</td><td class=code><pre>{}</pre></td></tr><tr><td>LANGUAGE_COOKIE_PATH</td><td class=code><pre>&#39;/&#39;</pre></td></tr><tr><td>CACHE_MIDDLEWARE_SECONDS</td><td class=code><pre>600</pre></td></tr><tr><td>CSRF_COOKIE_HTTPONLY</td><td class=code><pre>False</pre></td></tr><tr><td>DATETIME_INPUT_FORMATS</td><td class=code><pre>(&#39;%Y-%m-%d %H:%M:%S&#39;,\n" +
    " &#39;%Y-%m-%d %H:%M:%S.%f&#39;,\n" +
    " &#39;%Y-%m-%d %H:%M&#39;,\n" +
    " &#39;%Y-%m-%d&#39;,\n" +
    " &#39;%m/%d/%Y %H:%M:%S&#39;,\n" +
    " &#39;%m/%d/%Y %H:%M:%S.%f&#39;,\n" +
    " &#39;%m/%d/%Y %H:%M&#39;,\n" +
    " &#39;%m/%d/%Y&#39;,\n" +
    " &#39;%m/%d/%y %H:%M:%S&#39;,\n" +
    " &#39;%m/%d/%y %H:%M:%S.%f&#39;,\n" +
    " &#39;%m/%d/%y %H:%M&#39;,\n" +
    " &#39;%m/%d/%y&#39;)</pre></td></tr><tr><td>EMAIL_HOST_USER</td><td class=code><pre>&#39;&#39;</pre></td></tr><tr><td>PROFANITIES_LIST</td><td class=code><pre>u&#39;********************&#39;</pre></td></tr></tbody></table></div><div id=explanation><p>You're seeing this error because you have <code>DEBUG = True</code> in your Django settings file. Change that to <code>False</code>, and Django will display a standard 500 page.</p></div></body></html>"
  );

}]);
