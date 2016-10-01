from django.forms import ModelForm, CharField
from models import Question
from tinymce.widgets import TinyMCE


class QuestionForm(ModelForm):
    question = CharField(widget=TinyMCE(attrs={'cols': 80, 'rows': 10}))
    answer = CharField(widget=TinyMCE(attrs={'cols': 80, 'rows': 10}))

    class Meta:
        model = Question
        fields = '__all__'







