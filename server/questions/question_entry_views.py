from django.shortcuts import render_to_response
from django.template import RequestContext
from forms import QuestionForm


def question_entry(request):
    '''Submit question/answer pairs'''
    args = {}
    args["added"] = False

    if request.method == 'POST':
        question_form = QuestionForm(request.POST)

        if question_form.is_valid():
            question_form.save()
            args["added"] = True
            args["prev_question"] = str(question_form.instance.question)
            args["prev_topic"] = str(question_form.instance.subtopic)
            # clear form so next question can be entered.
            question_form = QuestionForm()
    else:
        question_form = QuestionForm()

    args["question_form"] = question_form

    return render_to_response('questionEntry.html',
                              args,
                              context_instance=RequestContext(request), )