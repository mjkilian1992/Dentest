from rest_framework import permissions

from pagination import ClientControllablePagination
from serializers import QuestionSerializer


class QuestionApiMixin(object):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = QuestionSerializer
    pagination_class = ClientControllablePagination

    def privileged_user(self):
        '''
        Check a user can access restricted questions. True if the user
        is either a staff member or in group Silver or above
        '''
        if self.request.user.groups.filter(name="Premium") \
            or self.request.user.is_staff:
            return True
        return False
