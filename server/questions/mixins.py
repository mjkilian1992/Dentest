from rest_framework import permissions

from pagination import ClientControllablePagination
from serializers import QuestionSerializer

class QuestionApiMixin(object):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = QuestionSerializer
    pagination_class = ClientControllablePagination



